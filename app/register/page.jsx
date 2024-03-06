/*#################
# REGISTER PAGE
#################*/

"use client"

import "@styles/Register.scss"
import { useState, useEffect } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Upload } from "lucide-react"



const Register = () => {
	/*#################
	# INITIAL VARIABLES
	#################*/
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		profileImage: null
	})
	const [isPasswordMatch, setIsPasswordMatch] = useState(true)
	const router = useRouter()
	/*#################
	# End of setup INITIAL VARIABLES
	#################*/



	/*#################
	# FUNCTIONS
	#################*/

	/*#################
	# FUNCTIONS --- useEffect
	#################*/
	useEffect(() => {
		// If the password and confirmPassword are not the same, we set "isPasswordMatch" to false
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
		console.log("📜 formData: ", formData)
	}
	/*#################
	# End of FUNCTIONS --- handleChange
	#################*/


	/*#################
	# FUNCTIONS --- handleSubmit
	#################*/
	// This function will be called when the user click the "Register" button
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// We need to create a FormData object because we are sending a POST request with a file (the profile image file)
			const registerForm = new FormData()
			// Then we append the data to the FormData object
			// "key" is the name of the input field like "username", "email", "password", "confirmPassword"
			// "formData[key]" is the value of the input field, like "John", "john@gmail"
			for (let key in formData) {
				registerForm.append(key, formData[key])
			}
			// Then we send the POST request to the server to create a new user
			// We can see the code for the register API at the "app/api/register/route.js" file
			const response = await fetch("http://localhost:3000//api/register/", {
				method: "POST",
				body: registerForm
			})
			// If the user is created successfully, we redirect the user to home page
			if (response.ok) {
				router.push("/login")
			}
		} catch (error) {
			console.log("Registration failed", error.message)
		}
	}
	/*#################
	# End of FUNCTIONS --- handleSubmit
	#################*/


	/*#################
	# FUNCTIONS --- signInWithGoogle
	#################*/
	const signInWithGoogle = () => {
	// The "signIn" is the callback function from next-auth/react to sign in with Google
		// The "callbackUrl" is the URL that the user will be redirected to after the login is successful. This is already have in the signIn function
		signIn("google", { callbackUrl: "/" })
	}
	/*#################
	# End of FUNCTIONS --- signInWithGoogle
	#################*/

	/*#################
	# End of FUNCTIONS
	#################*/



	/*#################
	# RETURN FINAL UI
	#################*/
	return (
		<div className="container flex justify-center items-center h-screen">
			<div className="max-w-96 flex flex-col gap-4">

				{/* The form with handleSubmit function to get the information from user to create new user and call API to add user data into the MongoDB */}
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit}
				>

					{/* username */}
					<Input
						type="text"
						placeholder="User name"
						name="username"
						required
						// Use the "formData" to store the user input
						// When the user type something in the input field, we call the handleChange function to update the formData
						value={formData.username}
						onChange={handleChange}
					/>

					{/* email */}
					<Input
						type="email"
						placeholder="Email"
						name="email"
						required
						value={formData.email}
						onChange={handleChange}
					/>

					{/* password */}
					<Input
						type="password"
						placeholder="Password"
						name="password"
						required
						value={formData.password}
						onChange={handleChange}
					/>

					{/* confirm password */}
					<Input
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
					<Input
						type="file"
						id="image123123"
						name="profileImage"
						// image/* means the user can upload any type of image
						accept="image/*"
						required
						style={{ display: "none" }}
						onChange={handleChange}
					/>
					{/* Icon upload file */}
					{/* This icon register is used for user click and upload the image, because we already hide the input type="file" above */}
					<label htmlFor="image123123">
						{/* This is the icon upload file */}
						<Button variant="outline">
							<Upload className="mr-2" /> Upload profile photo
						</Button>
					</label>

					{/* At here, we render the profile image after user uploaded*/}
					{formData.profileImage && (
						// The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter
						<img
							src={URL.createObjectURL(formData.profileImage)}
							alt="profile"
							style={{ maxWidth: "80px" }}
						/>
					)}

					{/* Button Register (manually register)*/}
					<Button
						className="btn btn-neutral"
						type="submit"
						// The button will be disabled if the password and confirmPassword are not the same
						disabled={!isPasswordMatch}
					>
						Register
					</Button>
				</form>

				{/* Button login with Google */}
				<Button
					// When the user click the button, we call the signIn function from next-auth/react to sign in with Google,
					// The "signIn" function will redirect the user to the Google login page
					// The "signIn" function we take from the api/auth/[...nextauth].js file
					// Because the register page need to login, so user need to go to the login page and login
					// But here, the user click on the login with google, so after login, the user can redirect to the home page
					onClick={signInWithGoogle}
					type="button"
				>
					<p className="mr-2">Login with Google</p>
					<FcGoogle />
				</Button>

				<a href="/login">Already have an account? Login here</a>
			</div>
		</div>
	)
}
/*#################
# End of RETURN FINAL UI
#################*/

export default Register