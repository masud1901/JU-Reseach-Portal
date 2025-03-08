// Copy and paste this script into your browser console when your app is running
// It will use your existing Supabase client to check the database

(async function() {
  // Define Supabase URL and key directly from your .env file
  const supabaseUrl = 'https://zzciimqdmffilxwwadwj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y2lpbXFkbWZmaWx4d3dhZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzcwNjgsImV4cCI6MjA1Njk1MzA2OH0.kfmQt9bVZo0KLgzrTOdsSnBARDkhzbbcOGPiAgiVIos';
  
  // Check if supabase client is available in the global scope
  let supabaseClient;
  
  if (typeof supabase !== 'undefined') {
    console.log('Using existing Supabase client from global scope');
    supabaseClient = supabase;
  } else {
    console.log('Creating new Supabase client with provided credentials');
    // Try to load Supabase from CDN if not available
    if (typeof window.supabase === 'undefined') {
      console.log('Supabase JS not found, attempting to load from CDN...');
      try {
        // Create a script element to load Supabase from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        
        // Wait for the script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        console.log('Supabase JS loaded from CDN');
      } catch (error) {
        console.error('Failed to load Supabase JS from CDN:', error);
        return;
      }
    }
    
    // Create a new Supabase client
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  console.log('Checking Supabase Database...\n');

  try {
    // Get list of all tables
    const { data: tables, error: tablesError } = await supabaseClient
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
    tables.forEach(table => console.log(`- ${table.table_name}`));
    console.log('\n');

    // For each table, get sample data
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Sample data from ${tableName}:`);
      console.log('-'.repeat(tableName.length + 16));

      const { data: sampleData, error: sampleError } = await supabaseClient
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

      console.log(sampleData);
      console.log('\n');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
})(); 