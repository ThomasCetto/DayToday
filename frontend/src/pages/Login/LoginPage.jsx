import GoogleSignInButton from "./GoogleSignInButton";
import "./Login.css";

export default function LoginPage() {
  return (
    <div className="loginPage">
      <h1>Login to access all the features</h1>
      <div className="googleButton">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
