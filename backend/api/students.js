const express = require('express');
const router = express.Router();
const dbService = require('../database/dbService');

// Get student by registration number
router.get('/:regdNo', async (req, res) => {
  try {
    const { regdNo } = req.params;
    const student = await dbService.getStudentByRegdNo(regdNo);
    
    if (student) {
      res.json({ success: true, data: student });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all students with pagination
router.get('/all/list', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const students = await dbService.getAllStudents(page, limit);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
