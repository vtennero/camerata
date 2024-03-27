import { useEffect, useState } from "react";
import supabase from "../auth/supabaseClient";

export default function LoginAndOut() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    // The session state will be updated by the onAuthStateChange listener
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // The session state will be updated by the onAuthStateChange listener
  };

  if (!session) {
    // Your custom Auth component or logic to handle logging in
    return (
      <div>
        <button className="text-sm" onClick={signInWithGithub}>
          Login
        </button>
      </div>
    );
  } else {
    // User is logged in
    return (
      <div>
        <button className="text-sm" onClick={signOut}>
          Logout
        </button>
      </div>
    );
  }
}
