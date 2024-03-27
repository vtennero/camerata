// contexts/SessionContext.js
"use client";
import supabase from "@/components/auth/supabaseClient";
import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    }).data?.unsubscribe;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
