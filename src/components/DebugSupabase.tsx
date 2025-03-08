import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";

export default function DebugSupabase() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseKey, setSupabaseKey] = useState<string>("");

  useEffect(() => {
    // Get Supabase configuration
    const url = import.meta.env.VITE_SUPABASE_URL || "Not set";
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "Not set";
    setSupabaseUrl(url);
    setSupabaseKey(key.substring(0, 5) + "..." + key.substring(key.length - 5));

    // Test connection
    testConnection();
  }, []);

  async function testConnection() {
    try {
      setLoading(true);
      setError(null);

      // Test 1: Check if we can connect to Supabase
      console.log("Testing Supabase connection...");
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .limit(1);

      if (tablesError) {
        throw new Error(`Connection error: ${tablesError.message}`);
      }

      // Test 2: Check if we can fetch faculties
      console.log("Testing faculties table...");
      const { data: facultiesData, error: facultiesError } = await supabase
        .from("faculties")
        .select("*")
        .limit(5);

      if (facultiesError) {
        throw new Error(`Faculties error: ${facultiesError.message}`);
      }

      // Test 3: Check if we can fetch departments
      console.log("Testing departments table...");
      const { data: departmentsData, error: departmentsError } = await supabase
        .from("departments")
        .select("*")
        .limit(5);

      if (departmentsError) {
        throw new Error(`Departments error: ${departmentsError.message}`);
      }

      // Test 4: Check if we can fetch professors
      console.log("Testing professors table...");
      const { data: professorsData, error: professorsError } = await supabase
        .from("professors")
        .select("*")
        .limit(5);

      if (professorsError) {
        throw new Error(`Professors error: ${professorsError.message}`);
      }

      // Test 5: Check if we can fetch students
      console.log("Testing students table...");
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .limit(5);

      if (studentsError) {
        throw new Error(`Students error: ${studentsError.message}`);
      }

      // Collect all data
      setData({
        faculties: facultiesData,
        departments: departmentsData,
        professors: professorsData,
        students: studentsData
      });

    } catch (err: any) {
      console.error("Debug error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Configuration</h2>
        <p><strong>Supabase URL:</strong> {supabaseUrl}</p>
        <p><strong>Supabase Key:</strong> {supabaseKey}</p>
      </div>

      <button 
        onClick={testConnection}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Test Connection Again
      </button>

      {loading ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-lg">Testing Supabase connection...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-100 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="mt-2 text-red-700">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Data Preview</h2>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Faculties ({data?.faculties?.length || 0})</h3>
            <pre className="bg-white p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data?.faculties, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Departments ({data?.departments?.length || 0})</h3>
            <pre className="bg-white p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data?.departments, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Professors ({data?.professors?.length || 0})</h3>
            <pre className="bg-white p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data?.professors, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Students ({data?.students?.length || 0})</h3>
            <pre className="bg-white p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data?.students, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 