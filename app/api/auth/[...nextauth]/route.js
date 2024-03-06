/* ################
- This file is for GOOGLE LOGIN, CREDENTIALS LOGIN, and SESSION CALLBACK
- For MANUAL REGISTER, see the file at app/api/register/route.js
- This file is followed the Route Handler of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app
################ */

import User from "@models/User";
import { connectToDatabase } from "@mongodb/database";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// The format of handler is followed by ROUTE HANDLER of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app
// So in the following handler, we need to export two handlers, one for GET and one for POST
// Inside handler, we use providers to specify the authentication providers that we want to use
// In this case, we use GoogleProvider to specify that we want to use Google authentication provider
const handler = NextAuth({

	/*#################
	# ROUTE HANDLER --- Secret
	#################*/
	// This is IMPORTANT, must have in the production
	// Link: https://next-auth.js.org/configuration/options#secret
	secret: process.env.NEXTAUTH_SECRET,
	/*#################
	# End of ROUTE HANDLER --- Secret
	#################*/


	/*#################
	# ROUTE HANDLER --- Providers
	#################*/
	providers: [
		/*#################
		# ROUTE HANDLER --- Providers --- GoogleProvider
		#################*/
		GoogleProvider({
			// The "clientId" and "clientSecret" are the credentials that we get from the Google Cloud Console at https://console.cloud.google.com/
			// We need to create a new project, then OAuth consent screen, then fill in the information, then at the API & Services, we create Credentials, then create OAuth client ID
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			// This "authorization" from documentation of NextAuth: https://next-auth.js.org/providers/google
			// If we need access to the RefreshToken or AccessToken for a Google account and we are not using a database to persist user accounts, we use the "authorization" as the following
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			}
		}),
		/*#################
		# End of ROUTE HANDLER --- Providers --- GoogleProvider
		#################*/

		/*#################
		# ROUTE HANDLER --- Providers --- CredentialsProvider
		#################*/
		// This is the provider for the MANUAL LOGIN
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			async authorize(credentials, req) {
				await connectToDatabase()

				// Check if the user exists in the database
				const user = await User.findOne({ email: credentials.email })
				if (!user) {
					throw new Error("Invalid email or password")
				}

				// Check if the password is correct
				// "user.password" is the hashed password that we get from the database
				// "credentials.password" is the password that the user enters in the sign in form
				const isMatch = await compare(credentials.password, user.password)
				if (!isMatch) {
					throw new Error("Invalid email or password")
				}

				// If the user exists and the password is correct, return the user
				return user
			}
		}),
		/*#################
		# End of ROUTE HANDLER --- Providers --- CredentialsProvider
		#################*/

		/*#################
		# ROUTE HANDLER --- Providers
		#################*/
	],


	/*#################
	# ROUTE HANDLER --- Callbacks
	#################*/
	callbacks: {

		/*#################
		# ROUTE HANDLER --- Callbacks --- session
		#################*/
		// Choose how you want to save the user session.
		// Link: https://next-auth.js.org/configuration/options#session
		async session({ session }) {
			const sessionUser = await User.findOne({ email: session.user.email })
			session.user.id = sessionUser._id.toString()
			// This is important
			// The ...session.user is merge with the sessionUser._doc
			// The "session.user" is the user object that we get from the session NextAuth
			// The "sessionUser._doc" is the user object that we get from the MongoDB 
			// If don't have this line, then the "session.user" will not have the information of the user from the MongoDB, which mean we don't have the "profileImagePath", "wishlist", "cart", "orders", "work", etc.
			session.user = { ...session.user, ...sessionUser._doc }
			return session
		},
		/*#################
		# End of ROUTE HANDLER --- Callbacks --- session
		#################*/


		/*#################
		# ROUTE HANDLER --- Callbacks --- signIn
		#################*/
		// This callback is called when a user signs in
		async signIn({ account, profile }) {
			// This check === "google" is to check if the user is signing in with Google, and in frontend, we also use signIn("google") to sign in with Google
			// The "profile" here is all the information that we get from the Google profile
			if (account.provider === 'google') {
				try {
					await connectToDatabase()
					// Check if the user exists in the database and if not, create a new user
					let user = await User.findOne({ email: profile.email })

					// This part is to create new user in the MongoDB based on the Google profile
					if (!user) {
						user = await User.create({
							email: profile.email,
							username: profile.name,
							// In the Google profile, the "picture" is the profile image of the user. This call "picture" but not "image" because it is the name of the field in the Google profile
							profileImagePath: profile.picture,
							wishlist: [],
							cart: [],
							orders: [],
							work: [],
						})
					}
					return user
				} catch (err) {
					console.log(err)
				}
			}
			// This "return true" important, is to tell NextAuth that the user is authenticated
			return true
		},
		/*#################
		# End of ROUTE HANDLER --- Callbacks --- signIn
		#################*/
	},
	/*#################
	# End of ROUTE HANDLER --- Callbacks
	#################*/
})

export { handler as GET, handler as POST }

/* ################
End of Route Handler for NextAuth 
################ */