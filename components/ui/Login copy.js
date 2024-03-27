export default function LoginAndOut() {
  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }

  function testSignIn() {
    console.log("helloworld");
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <p onClick={signInWithGithub} className="text-sm hover:cursor-pointer	">
      Login
    </p>
  );
}
