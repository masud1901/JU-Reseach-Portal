// Script to check if the SQL functions are working correctly
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFunctions() {
  console.log('Checking SQL functions...');
  console.log('=========================');
  
  try {
    // 1. Check if we can get a student
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, name')
      .limit(1);
    
    if (studentsError) throw studentsError;
    
    if (students && students.length > 0) {
      const studentId = students[0].id;
      console.log(`Found student: ${students[0].name} (${studentId})`);
      
      // 2. Check get_matching_professors_for_student function
      console.log('\nTesting get_matching_professors_for_student function...');
      const { data: matchingProfs, error: matchingProfsError } = await supabase
        .rpc('get_matching_professors_for_student', { student_id: studentId });
      
      if (matchingProfsError) {
        console.error('Error calling get_matching_professors_for_student:', matchingProfsError.message);
      } else {
        console.log(`Found ${matchingProfs.length} matching professors for student ${students[0].name}`);
        if (matchingProfs.length > 0) {
          console.log('Sample matching professor:');
          console.log(matchingProfs[0]);
        }
      }
    }
    
    // 3. Check if we can get a professor
    const { data: professors, error: professorsError } = await supabase
      .from('professors')
      .select('id, name')
      .limit(1);
    
    if (professorsError) throw professorsError;
    
    if (professors && professors.length > 0) {
      const professorId = professors[0].id;
      console.log(`\nFound professor: ${professors[0].name} (${professorId})`);
      
      // 4. Check get_matching_students_for_professor function
      console.log('\nTesting get_matching_students_for_professor function...');
      const { data: matchingStudents, error: matchingStudentsError } = await supabase
        .rpc('get_matching_students_for_professor', { professor_id: professorId });
      
      if (matchingStudentsError) {
        console.error('Error calling get_matching_students_for_professor:', matchingStudentsError.message);
      } else {
        console.log(`Found ${matchingStudents.length} matching students for professor ${professors[0].name}`);
        if (matchingStudents.length > 0) {
          console.log('Sample matching student:');
          console.log(matchingStudents[0]);
        }
      }
      
      // 5. Check get_professor_keywords function
      console.log('\nTesting get_professor_keywords function...');
      const { data: keywords, error: keywordsError } = await supabase
        .rpc('get_professor_keywords', { professor_id: professorId });
      
      if (keywordsError) {
        console.error('Error calling get_professor_keywords:', keywordsError.message);
      } else {
        console.log(`Found ${keywords.length} keywords for professor ${professors[0].name}`);
        if (keywords.length > 0) {
          console.log('Sample keywords:');
          console.log(keywords.slice(0, 3));
        }
      }
    }
    
    console.log('\nFunction check complete!');
    
  } catch (error) {
    console.error('Error checking functions:', error.message);
  }
}

checkFunctions(); 