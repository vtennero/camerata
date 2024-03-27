// pages/_middleware.js
import { supabase } from "../utils/supabaseClient";

export async function middleware(req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // Check if the user is trying to access the cart page
  if (req.nextUrl.pathname.startsWith("/cart") && !user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    continue: true,
  };
}
