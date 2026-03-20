const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'student_results.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Create students table
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regd_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    cgpa REAL,
    sgpa REAL,
    semester INTEGER,
    branch TEXT,
    counsellor TEXT,
    total_tuition_fee REAL,
    scholarship_applied REAL,
    net_payable_amount REAL,
    amount_paid REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create detailed_marks table
  db.run(`CREATE TABLE IF NOT EXISTS detailed_marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    subject_name TEXT NOT NULL,
    grade TEXT,
    m1 REAL,
    pre_t1 REAL,
    t2 REAL,
    t3 REAL,
    t4 REAL,
    t5_1 REAL,
    t5_2 REAL,
    t5_3 REAL,
    t5_4 REAL,
    t5_avg REAL,
    final_total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  )`);
});

class DatabaseService {
  // Get student by registration number
  async getStudentByRegdNo(regdNo) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, 
               GROUP_CONCAT(dm.subject_name) as subjects,
               GROUP_CONCAT(dm.grade) as grades
        FROM students s
        LEFT JOIN detailed_marks dm ON s.id = dm.student_id
        WHERE UPPER(s.regd_no) = UPPER(?)
        GROUP BY s.id
      `;
      
      db.get(query, [regdNo], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Get all students with pagination and filters
  async getAllStudents(page = 1, limit = 20, search = '', branch = '', semester = '') {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM students WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (regd_no LIKE ? OR name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (branch) {
        query += ' AND branch = ?';
        params.push(branch);
      }

      if (semester) {
        query += ' AND semester = ?';
        params.push(semester);
      }

      query += ' ORDER BY regd_no LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get students count
  async getStudentsCount(search = '', branch = '', semester = '') {
    return new Promise((resolve, reject) => {
      let query = 'SELECT COUNT(*) as count FROM students WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (regd_no LIKE ? OR name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (branch) {
        query += ' AND branch = ?';
        params.push(branch);
      }

      if (semester) {
        query += ' AND semester = ?';
        params.push(semester);
      }

      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  // Update student
  async updateStudent(regdNo, updateData) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      
      if (fields.length === 0) {
        resolve({ success: false, message: 'No fields to update' });
        return;
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const query = `UPDATE students SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE UPPER(regd_no) = UPPER(?)`;
      values.push(regdNo);

      db.run(query, values, function(err) {
        if (err) reject(err);
        else resolve({ success: this.changes > 0 });
      });
    });
  }
}

module.exports = new DatabaseService();
