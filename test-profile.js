// Test script to check if we can directly access the Supabase database and retrieve a profile
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read .env file and extract variables
function readEnvFile() {
  try {
    // Try multiple possible locations for the .env file
    const possiblePaths = [
      path.resolve(__dirname),
      path.resolve(path.join(__dirname, '..')),
      process.cwd(),
      '/media/ayon1901/SERVER/JU-Reseach-Portal'
    ];
    
    let envContent = null;
    let envPath = null;
    
    // Try each path until we find the .env file
    for (const tryPath of possiblePaths) {
      const tryEnvPath = path.join(tryPath, '.env');
      console.log(`Trying to find .env at: ${tryEnvPath}`);
      
      if (fs.existsSync(tryEnvPath)) {
        envPath = tryEnvPath;
        envContent = fs.readFileSync(envPath, 'utf8');
        console.log(`Found .env file at: ${envPath}`);
        break;
      }
    }
    
    if (!envContent) {
      throw new Error('Could not find .env file in any of the expected locations');
    }
    
    // Parse the .env file
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        
        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.replace(/^"|"$/g, '');
        }
        
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

// Get environment variables
const envVars = readEnvFile();

// Get Supabase URL and key from environment variables
const supabaseUrl = envVars.VITE_SUPABASE_URL || '';
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl.substring(0, 8)}...`);
console.log('Supabase key is configured');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to fetch a professor profile
async function testFetchProfessor(id) {
  console.log(`Testing fetch professor with ID: ${id}`);
  
  try {
    // Try with departments join
    const { data, error } = await supabase
      .from('professors')
      .select('*, departments(name)')
      .eq('id', id)
      .single();
      
    console.log('Professor data with departments join:', { data, error });
    
    // Try without departments join
    const { data: basicData, error: basicError } = await supabase
      .from('professors')
      .select('*')
      .eq('id', id)
      .single();
      
    console.log('Professor data without departments join:', { data: basicData, error: basicError });
    
    // Try to get department separately if we have department_id
    if (basicData && basicData.department_id) {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('name')
        .eq('id', basicData.department_id)
        .single();
        
      console.log('Department data:', { data: deptData, error: deptError });
    }
    
    // Try to get research interests
    const { data: interestsData, error: interestsError } = await supabase
      .from('professor_research_keywords')
      .select('research_keywords(keyword)')
      .eq('professor_id', id);
      
    console.log('Research interests:', { data: interestsData, error: interestsError });
    
    // Try to get publications
    const { data: pubsData, error: pubsError } = await supabase
      .from('publications')
      .select('*')
      .eq('professor_id', id);
      
    console.log('Publications:', { data: pubsData, error: pubsError });
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Test function to fetch a student profile
async function testFetchStudent(id) {
  console.log(`Testing fetch student with ID: ${id}`);
  
  try {
    // Try with departments join
    const { data, error } = await supabase
      .from('students')
      .select('*, departments(name)')
      .eq('id', id)
      .single();
      
    console.log('Student data with departments join:', { data, error });
    
    // Try without departments join
    const { data: basicData, error: basicError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
      
    console.log('Student data without departments join:', { data: basicData, error: basicError });
    
    // Try to get department separately if we have department_id
    if (basicData && basicData.department_id) {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('name')
        .eq('id', basicData.department_id)
        .single();
        
      console.log('Department data:', { data: deptData, error: deptError });
    }
    
    // Try to get research interests
    const { data: interestsData, error: interestsError } = await supabase
      .from('student_research_keywords')
      .select('research_keywords(keyword)')
      .eq('student_id', id);
      
    console.log('Research interests:', { data: interestsData, error: interestsError });
    
    // Try to get publications
    const { data: pubsData, error: pubsError } = await supabase
      .from('publication_authors')
      .select('*, publications(*)')
      .eq('student_id', id);
      
    console.log('Publications:', { data: pubsData, error: pubsError });
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Run the tests
async function runTests() {
  // Test with a professor ID
  await testFetchProfessor('38f34f49-8c3c-4772-b3b7-729835201479');
  
  // Test with a student ID
  await testFetchStudent('327c6db6-f1ea-4f43-8d29-4abc4a99ddcd');
}

runTests(); 