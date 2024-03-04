/* ################
Route Handler for NextAuth 
################ */
// This file is followed the Route Handler of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app

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
	# ROUTE HANDLER --- Providers
	#################*/
	providers: [
		/*#################
		# ROUTE HANDLER --- Providers --- GoogleProvider
		#################*/
		GoogleProvider({
			// The clientId and clientSecret are the credentials that we get from the Google Cloud Console at https://console.cloud.google.com/
			// We need to create a new project, then OAuth consent screen, then fill in the information, then at the API & Services, we create Credentials, then create OAuth client ID
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			// If we need access to the RefreshToken or AccessToken for a Google account and we are not using a database to persist user accounts, this may be something we need to do.
			// This one from documentation of NextAuth: https://next-auth.js.org/providers/google
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
		// This is the provider for the manual login
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

	// This is important
	secret: process.env.NEXTAUTH_SECRET,

	// ROUTE HANDLER --- Callbacks
	callbacks: {
		// ROUTE HANDLER --- Callbacks --- session
		// This callback is called whenever a session is checked, to know that the user is authenticated
		async session({ session }) {
			const sessionUser = await User.findOne({ email: session.user.email })
			session.user.id = sessionUser._id.toString()
			return session
		},

		// ROUTE HANDLER --- Callbacks --- signIn
		// This callback is called when a user signs in
		async signIn({ account, profile }) {
			// This check === "google" is to check if the user is signing in with Google, and in frontend, we also use signIn("google") to sign in with Google
			if (account.provider === 'google') {
				try {
					await connectToDatabase()

					console.log("da vao signIn function")
					console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)
					console.log("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET)
					console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL)
					console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET)


					// Check if the user exists in the database and if not, create a new user
					let user = await User.findOne({ email: profile.email })

					if (!user) {
						user = await User.create({
							email: profile.email,
							username: profile.name,
							// In the google profile, the "picture" is the profile image of the user. This call "picture" but not "image" because it is the name of the field in the Google profile
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
	}
})

export { handler as GET, handler as POST }

/* ################
End of Route Handler for NextAuth 
################ */