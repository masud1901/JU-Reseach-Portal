// Script to check Supabase database structure and content
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Function to read .env file and extract variables
function readEnvFile(): Record<string, string> {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: Record<string, string> = {};
    
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
    console.error('Error reading .env file:', (error as Error).message);
    return {};
  }
}

// Get environment variables
const envVars = readEnvFile();

// Get Supabase URL and key from environment variables
const supabaseUrl = envVars.VITE_SUPABASE_URL || '';
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and anon key not found in .env file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface TableInfo {
  table_name: string;
}

async function checkDatabase() {
  console.log('Checking Supabase Database...\n');

  try {
    // Get list of all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError.message);
      return;
    }

    console.log('Tables in your database:');
    console.log('=======================');
    
    if (!tables || tables.length === 0) {
      console.log('No tables found in the public schema.');
      return;
    }

    // Print all table names
    (tables as TableInfo[]).forEach(table => console.log(`- ${table.table_name}`));
    console.log('\n');

    // For each table, get sample data
    for (const table of tables as TableInfo[]) {
      const tableName = table.table_name;
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