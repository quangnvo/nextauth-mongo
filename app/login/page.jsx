"use client"

/*#################
# This login page link with the "Credential provider" in the nextauth, app/api/auth/[...nextauth]/routes.js
#################*/

import "@styles/Login.scss";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {

	const { email, setEmail } = useState('')
	const { password, setPassword } = useState('')

	return (
		<div className="login">
			<img
				src="/assets/login.jpg"
				alt="login"
				className="login_decor"
			/>
			<div className="login_content">
				{/* Form for login manually */}
				<form className="login_content_form">
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
					<button type="submit">Login</button>
				</form>

				{/* Button Login with Google */}
				<button className="google">
					<p>Login with Google</p>
					<FcGoogle />
				</button>

				<a href="/register">Don't have an account? Sign in here</a>
			</div>
		</div>
	)
}

export default Login