const express = require('express');
const router = express.Router();
const dbService = require('../database/dbService');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add authentication logic here
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'admin-token-placeholder'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all students with filters and pagination
router.get('/students', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      branch = '', 
      semester = '' 
    } = req.query;
    
    const students = await dbService.getAllStudents(page, limit, search, branch, semester);
    const total = await dbService.getStudentsCount(search, branch, semester);
    
    res.json({ 
      success: true, 
      data: {
        students: students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student
router.put('/students/:regdNo', async (req, res) => {
  try {
    const { regdNo } = req.params;
    const updateData = req.body;
    
    const result = await dbService.updateStudent(regdNo, updateData);
    
    if (result.success) {
      res.json({ success: true, message: 'Student updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
