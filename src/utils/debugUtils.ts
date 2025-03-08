import { supabase } from "../../supabase/supabase";

/**
 * Utility function to check if a table exists in the database
 * @param tableName The name of the table to check
 * @returns Promise<boolean> True if the table exists, false otherwise
 */
export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Utility function to check if a column exists in a table
 * @param tableName The name of the table
 * @param columnName The name of the column to check
 * @returns Promise<boolean> True if the column exists, false otherwise
 */
export async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    // Query the information_schema to check if the column exists
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', tableName)
      .eq('column_name', columnName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
    return false;
  }
}

/**
 * Utility function to log table structure
 * @param tableName The name of the table to inspect
 */
export async function logTableStructure(tableName: string): Promise<void> {
  try {
    // Query the information_schema to get column information
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error getting structure for table ${tableName}:`, error);
      return;
    }
    
    console.log(`Structure for table ${tableName}:`, data);
  } catch (error) {
    console.error(`Error getting structure for table ${tableName}:`, error);
  }
}

/**
 * Utility function to log the first few rows of a table
 * @param tableName The name of the table to sample
 * @param limit The number of rows to retrieve (default: 5)
 */
export async function sampleTableData(tableName: string, limit: number = 5): Promise<void> {
  try {
    // Query the table to get a sample of data
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error(`Error sampling data from table ${tableName}:`, error);
      return;
    }
    
    console.log(`Sample data from table ${tableName}:`, data);
  } catch (error) {
    console.error(`Error sampling data from table ${tableName}:`, error);
  }
}

/**
 * Utility function to check database connection
 * @returns Promise<boolean> True if connected, false otherwise
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check if we can connect to the database
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);
    
    if (error) {
      console.error('Error connecting to database:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
} 