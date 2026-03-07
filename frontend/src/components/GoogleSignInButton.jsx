import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";

export default function GoogleSignInButton() {
	const navigate = useNavigate();

	return (
		<GoogleLogin
			type="standard"
			theme="filled_blue"
			size="large"
			shape="rectangle"
			text="signin"
			logo_alignment="left"
			width="199"
			


			onSuccess={async (credentialResponse) => {
				const idToken = credentialResponse.credential;

				const res = await fetch("/api/auth/google", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include",
					body: JSON.stringify({ idToken })
				});
				if (!res.ok) {
					console.error("Google login failed");
					return;
				}

				const data = await res.json();
				localStorage.setItem("token", data.token);  // Save JWT token if successful
				localStorage.setItem("username", data.user.username);
				navigate("/");
			}}
			onError={() => {
				console.error("Google Login Failed");
			}}
		/>
	);
}