import { GoogleLogin } from "@react-oauth/google";

export default function GoogleSignInButton() {
	return (
		<GoogleLogin
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
				console.log("Logged in:", data.user);
				console.log("ALl data: ", data)

				localStorage.setItem("token", data.token);  // Save JWT token if successful
				localStorage.setItem("username", data.user.username);
				window.location.reload()  // Reload so that the content of the pages updates for new user
			}}
			onError={() => {
				console.error("Google Login Failed");
			}}
		/>
	);
}