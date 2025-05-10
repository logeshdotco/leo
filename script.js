
const isProd = process.env.NODE_ENV === 'production';

// Modify your route handlers to account for Vercel's path handling
app.post('/api/register', async (req, res) => {
  try {
    // Add CORS headers for Vercel environment
    if (isProd) {
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    }
    
    const { id, Emp_name, salary, PF, DATE_OF_JOINING, MOBILE_NO, password } = req.body;
    
    // Rest of your existing code...
  } catch (error) {
    // Error handling...
  }
});

// Similarly update your verification endpoint
app.post('/api/verify', async (req, res) => {
  try {
    // Add CORS headers for Vercel environment
    if (isProd) {
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    }
    
    const { id, password } = req.body;
    
    // Rest of your existing code...
  } catch (error) {
    // Error handling...
  }
});

// Add an OPTIONS handler for CORS preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.status(200).end();
});// server.js - Node.js backend for Employee Database
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Supabase client
const supabaseUrl = 'https://igfcuqyaaevrbyzvdeys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZmN1cXlhYWV2cmJ5enZkZXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTIwNDAsImV4cCI6MjA2MjA2ODA0MH0.kJfjEi7b4nws3sZPayhr1EPAmANM7ks3jHevnYTA8sE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public','index.html')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for employee registration
app.post('/api/register', async (req, res) => {
  try {
    const { id, Emp_name, salary, PF, DATE_OF_JOINING, MOBILE_NO, password } = req.body;
    
    // Check if employee ID already exists
    const { data: existingEmployee } = await supabase
      .from('EMPLOYEE')
      .select('id')
      .eq('id', id)
      .single();
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }
    
    // Insert new employee into the database
    const { data, error } = await supabase
      .from('EMPLOYEE')
      .insert([
        { 
          id, 
          Emp_name, 
          salary, 
          PF, 
          DATE_OF_JOINING, 
          MOBILE_NO, 
          password 
        }
      ]);
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error registering employee',
        error: error.message
      });
    }
    
    return res.status(201).json({
      success: true,
      message: 'Employee registered successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// API endpoint for employee verification
app.post('/api/verify', async (req, res) => {
  try {
    const { id, password } = req.body;
    
    // Find employee by ID
    const { data: employee, error } = await supabase
      .from('EMPLOYEE')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Verify password
    if (employee.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Return employee details
    return res.status(200).json({
      success: true,
      message: 'Employee verified successfully',
      employee
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});