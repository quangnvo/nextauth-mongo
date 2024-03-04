"use client"

/*#################
# This login page links with the "Credential provider" in the nextauth, app/api/auth/[...nextauth]/routes.js
#################*/

import "@styles/Login.scss";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";


const Login = () => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const router = useRouter()


	/*#################
	# FUNCTIONS --- handleSubmit
	#################*/
	// This function is for the manual login, when the user enters the email and password and click the login button
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await signIn("credentials", {
				redirect: false,
				// Cannot use only "email" and "password", have to use "email: email" and "password: password"
				email: email,
				password: password
			})

			if (response.ok) {
				// If the login is successful, redirect to the home page or the dashboard
				router.push("/")
			}

			// If there is an error, display the error
			if (response.error) {
				setError("Invalid email or password. Please try again")
			}

		} catch (err) {
			console.log(err)
		}
	}
	/*#################
	# End of FUNCTIONS --- handleSubmit
	#################*/

	/*#################
	# FUNCTIONS --- loginWithGoogle
	#################*/
	const loginWithGoogle = async () => {
		// The "callbackUrl" is the URL that the user will be redirected to after the login is successful. This is already have in the signIn function
		signIn("google", { callbackUrl: "/" })
	}
	/*#################
	# End of FUNCTIONS --- loginWithGoogle
	#################*/

	return (
		<div className="login">
			<img
				src="/assets/login.jpg"
				alt="login"
				className="login_decor"
			/>
			<div className="login_content">
				{/* Form for login manually */}
				<form
					className="login_content_form"
					onSubmit={handleSubmit}
				>
					{/* Email */}
					<input
						type="text"
						name="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					{/* Password */}
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{/* Error */}
					{error && <p className="error">{error}</p>}
					<button type="submit">Login</button>
				</form>

				{/* Button Login with Google */}
				{/* This Login button here, we can go to the Register page and copy the function loginWithGoogle() to use here */}
				<button
					className="google"
					onClick={loginWithGoogle}
				>
					<p>Login with Google</p>
					<FcGoogle />
				</button>

				<a href="/register">Don't have an account? Sign in here</a>
			</div>
		</div>
	)
}

export default Login