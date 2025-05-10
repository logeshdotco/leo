// Step 4: Create individual API endpoint files
// /api/register.js

const { createClient } = require('@supabase/supabase-js');

// Configure Supabase client
const supabaseUrl = 'https://igfcuqyaaevrbyzvdeys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZmN1cXlhYWV2cmJ5enZkZXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTIwNDAsImV4cCI6MjA2MjA2ODA0MH0.kJfjEi7b4nws3sZPayhr1EPAmANM7ks3jHevnYTA8sE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle POST request
  if (req.method === 'POST') {
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
  } else {
    // Return 405 for non-POST methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

