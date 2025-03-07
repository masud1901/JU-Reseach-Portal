import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Success() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Get the user type from local storage
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Check Your Email
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-6"
        >
          We've sent you an email with a link to verify your account. Please
          check your inbox and click the link to complete the sign-up process.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <Link to="/login">
            <Button>Return to Login</Button>
          </Link>
          {userType === "professor" ? (
            <Link to="/create-professor-profile">
              <Button variant="outline">Create Professor Profile</Button>
            </Link>
          ) : (
            <Link to="/create-student-profile">
              <Button variant="outline">Create Student Profile</Button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
