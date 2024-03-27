// components/Login.js
import supabase from "../utils/supabaseClient";

const login = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
  } else {
    console.log("Logged in successfully:", user);
  }
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully");
  }
};

// Use these functions in your component
