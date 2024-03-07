/*#################
# REGISTER PAGE
#################*/

"use client"

import "@styles/Register.scss"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { Button } from "@components/ui/button"


const Register = () => {
	const signInWithGoogle = () => {
		signIn("google", { callbackUrl: "/" })
	}

	/*#################
	# RETURN FINAL UI
	#################*/
	return (
		<div className="container flex justify-center items-center h-screen">
			<div className="max-w-96 flex flex-col gap-4">
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

			</div>
		</div>
	)
}
/*#################
# End of RETURN FINAL UI
#################*/

export default Register