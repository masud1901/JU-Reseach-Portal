// Node.js script to check Supabase database
// Run with: node check-supabase-node.js

// Import required packages
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
      path.resolve(path.join(__dirname, '..')), // Parent directory
      path.resolve(path.join(__dirname, '..', '..')), // Grandparent directory
      process.cwd(), // Current working directory
      '/media/ayon1901/SERVER/JU-Reseach-Portal' // Absolute path to project
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

// Hardcoded values as fallback
const HARDCODED_URL = 'https://zzciimqdmffilxwwadwj.supabase.co';
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y2lpbXFkbWZmaWx4d3dhZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzcwNjgsImV4cCI6MjA1Njk1MzA2OH0.kfmQt9bVZo0KLgzrTOdsSnBARDkhzbbcOGPiAgiVIos';

// Get environment variables
const envVars = readEnvFile();

// Get Supabase URL and key from environment variables or command line arguments or hardcoded values
const supabaseUrl = process.argv[2] || envVars.VITE_SUPABASE_URL || HARDCODED_URL;
const supabaseKey = process.argv[3] || envVars.VITE_SUPABASE_ANON_KEY || HARDCODED_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and anon key not found. Please provide them as arguments:');
  console.error('node check-supabase-node.js YOUR_SUPABASE_URL YOUR_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Checking Supabase Database...\n');

  try {
    // List of tables we expect to exist based on the migration files
    const knownTables = [
      'users', 'admin_users', 'faculties', 'departments', 'professors', 
      'students', 'publications', 'research_keywords', 'professor_research_keywords',
      'connection_requests', 'publication_authors'
    ];
    
    console.log('Tables in your database:');
    console.log('=======================');
    
    const existingTables = [];
    
    // Check each known table
    for (const tableName of knownTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count', { count: 'exact', head: true });
        
      if (!error) {
        existingTables.push(tableName);
        console.log(`- ${tableName} (exists)`);
      }
    }
    
    if (existingTables.length === 0) {
      console.log('No tables found or no access to tables.');
      return;
    }
    
    console.log('\n');
    
    // For each existing table, get sample data
    for (const tableName of existingTables) {
      console.log(`Sample data from ${tableName}:`);
      console.log('-'.repeat(tableName.length + 16));

      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      if (sampleError) {
        console.log(`Error fetching data from ${tableName}: ${sampleError.message}\n`);
        continue;
      }

      if (!sampleData || sampleData.length === 0) {
        console.log(`No data found in ${tableName}\n`);
        continue;
      }

      console.log(JSON.stringify(sampleData, null, 2));
      console.log('\n');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkDatabase(); 