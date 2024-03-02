"use client"

import "@styles/Register.scss"
import { useState, useEffect } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const Register = () => {
	// The "useRouter" hook is used to access the router object
	const router = useRouter()


	/*#################
	# The follwing code is only for setup INITIAL VARIABLES
	#################*/
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		profileImage: null
	})

	const [isPasswordMatch, setIsPasswordMatch] = useState(true)
	/*#################
	# End of setup INITIAL VARIABLES
	#################*/



	/*#################
	# The follwing code is only for FUNCTIONS
	#################*/

	/*#################
	# FUNCTIONS --- useEffect
	#################*/
	useEffect(() => {
		// If the password and confirmPassword are not the same, we set isPasswordMatch to false
		setIsPasswordMatch(formData.password === formData.confirmPassword)
	}, [formData.password, formData.confirmPassword])
	/*#################
	# End of FUNCTIONS --- useEffect
	#################*/


	/*#################
	# FUNCTIONS --- handleChange
	#################*/
	// This function will be called when the user type something in the input fields, or when the user upload a profile image
	const handleChange = (e) => {
		e.preventDefault()
		const { name, value, files } = e.target
		setFormData({
			...formData,
			[name]: value,
			[name]: name === "profileImage" ? files[0] : value
		})
	}
	/*#################
	# End of FUNCTIONS --- handleChange
	#################*/

	console.log("formData ne: ", formData)

	/*#################
	# FUNCTIONS --- handleSubmit
	#################*/
	// This function will be called when the user click the "Register" button
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// We need to create a FormData object because we are sending a POST request with a file (the profile image)
			const registerForm = new FormData()
			// Then we append the data to the FormData object
			// "key" is the name of the input field like "username", "email", "password", "confirmPassword"
			// "formData[key]" is the value of the input field, like "John", "john@gmail", "123", "123"
			for (let key in formData) {
				registerForm.append(key, formData[key])
			}

			console.log("registerForm ne: ", registerForm)
			console.log("registerForm ne: ", registerForm.get("username"))

			const dummy = await fetch("https://dummyjson.com/products/1")
			console.log("dummy ne: ", dummy)

			// Then we send the POST request to the server to create a new user
			const response = await fetch("http://localhost:3000//api/register/", {
				method: "POST",
				body: registerForm
			})

			// If the user is created successfully, we redirect the user to home page
			if (response.ok) {
				router.push("/")
			}

		} catch (error) {
			console.log("Registration failed", error.message)
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

	/*#################
	# End of FUNCTIONS
	#################*/



	/*#################
	# The follwing code is only for RETURN FINAL UI
	#################*/
	return (
		<div className="register">
			<img src="/assets/register.jpg" alt="register" className="image_decor" />
			<div className="register_content">

				{/* The form with handleSubmit function to get the information from user to create new user and call API to add user data into the MongoDB */}
				<form
					className="register_content_form"
					onSubmit={handleSubmit}
				>

					{/* username */}
					<input
						type="text"
						placeholder="User name"
						name="username"
						required
						value={formData.username}
						onChange={handleChange}
					/>

					{/* email */}
					<input
						type="email"
						placeholder="Email"
						name="email"
						required
						value={formData.email}
						onChange={handleChange}
					/>

					{/* password */}
					<input
						type="password"
						placeholder="Password"
						name="password"
						required
						value={formData.password}
						onChange={handleChange}
					/>

					{/* confirm password */}
					<input
						type="password"
						placeholder="Confirm password"
						name="confirmPassword"
						required
						value={formData.confirmPassword}
						onChange={handleChange}
					/>

					{/* If the password and confirmPassword are not the same, we display a message to the user */}
					{!isPasswordMatch && (
						<p style={{ color: "red" }}>Password and Confirm Password are not the same</p>
					)}

					{/* profile image */}
					<input
						type="file"
						id="image"
						name="profileImage"
						accept="image/*"
						required
						style={{ display: "none" }}
						onChange={handleChange}
					/>

					{/* Icon Register */}
					<label htmlFor="image">
						<img src="/assets/addImage.png" alt="add profile" />
						<p>Upload profile photo</p>
					</label>

					{/* Render the profile image after user uploaded */}
					{formData.profileImage && (
						// The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter
						<img
							src={URL.createObjectURL(formData.profileImage)}
							alt="profile"
							style={{ maxWidth: "80px" }}
						/>
					)}

					{/* Button Register */}
					<button
						type="submit"
						// The button will be disabled if the password and confirmPassword are not the same
						disabled={!isPasswordMatch}
					>
						Register
					</button>
				</form>

				{/* Button login with Google */}
				<button
					type="button"
					className="google"
					// When the user click the button, we call the signIn function from next-auth/react to sign in with Google,
					// The "signIn" function will redirect the user to the Google login page
					// The "signIn" function we take from the api/auth/[...nextauth].js file
					// Because the register page need to login, so user need to go to the login page and login
					// But here, the user click on the login with google, so after login, the user can redirect to the home page
					onClick={loginWithGoogle}
				>
					<p>Login with Google</p>
					<FcGoogle />
				</button>

				<a href="/login">Already have an account? Login here</a>
			</div>
		</div>
	)
}
/*#################
# End of RETURN FINAL UI
#################*/

export default Register