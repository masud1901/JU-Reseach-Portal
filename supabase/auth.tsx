import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, fullName: string, userType: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (password: string) => Promise<{ data: any; error: any }>;
  sendVerificationEmail: (email: string) => Promise<{ data: any; error: any }>;
  updateUserProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ data: any; error: any }>;
  isAdmin: boolean;
  isProfessor: boolean;
  isStudent: boolean;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      } else {
        // Reset role states when user signs out
        setIsAdmin(false);
        setIsProfessor(false);
        setIsStudent(false);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check user role (admin, professor, or student)
  const checkUserRole = async (userId: string) => {
    try {
      // Use the new get_user_role function
      const { data, error } = await supabase
        .rpc('get_user_role', { user_id: userId });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUserRole(data);
        setIsAdmin(data === 'admin');
        setIsProfessor(data === 'professor');
        setIsStudent(data === 'student');
        return;
      }

      // Fallback to direct table checks if the function fails
      // Check if user is an admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (adminData) {
        setIsAdmin(true);
        setIsProfessor(false);
        setIsStudent(false);
        setUserRole("admin");
        return;
      }

      // Check if user is a professor
      const { data: professorData } = await supabase
        .from("professors")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (professorData) {
        setIsAdmin(false);
        setIsProfessor(true);
        setIsStudent(false);
        setUserRole("professor");
        return;
      }

      // Check if user is a student
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (studentData) {
        setIsAdmin(false);
        setIsProfessor(false);
        setIsStudent(true);
        setUserRole("student");
        return;
      }

      // If no role is found, set to null
      setIsAdmin(false);
      setIsProfessor(false);
      setIsStudent(false);
      setUserRole(null);
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
      setIsProfessor(false);
      setIsStudent(false);
      setUserRole(null);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        },
      },
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    return { data, error };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    
    return { data, error };
  };

  const sendVerificationEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    return { data, error };
  };

  const updateUserProfile = async (userData: { full_name?: string; avatar_url?: string }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userData,
    });
    
    return { data, error };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        loading, 
        signIn, 
        signUp, 
        signOut, 
        resetPassword, 
        updatePassword, 
        sendVerificationEmail, 
        updateUserProfile,
        isAdmin,
        isProfessor,
        isStudent,
        userRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
