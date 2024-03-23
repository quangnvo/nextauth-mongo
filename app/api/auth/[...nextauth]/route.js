/* ################
- This file is for GOOGLE LOGIN, SESSION CALLBACK
- This file is followed the Route Handler of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app
################ */

import NextAuth from "next-auth"
// Import the User model from the MongoDB
import User from "@models/User";
import { connectToDB } from "@mongodb/database";
// Import the GoogleProvider
import GoogleProvider from "next-auth/providers/google";

// The format of handler is followed by ROUTE HANDLER of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app
// So in the following handler, we need to export two handlers, one for GET and one for POST
// Inside handler, we use providers to specify the authentication providers that we want to use
// In this case, we use GoogleProvider to specify that we want to use Google authentication provider
const handler = NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
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
	],
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
		// "account" and "profile" are already provided by NextAuth
		async signIn({ account, profile }) {
			// This check === "google" is to check if the user is signing in with Google, and in frontend, we also use signIn("google") to sign in with Google
			// The "profile" here is all the information that we get from the Google profile
			if (account.provider === 'google') {
				try {
					await connectToDB()
					// Check if the user exists in the database and if not, create a new user

					console.log("🧑 profile: ", profile)
					console.log("🧑 profile.email: ", profile.email)

					let user = await User.findOne({ email: profile.email })

					// This part is to create new user in the MongoDB based on the Google profile
					if (!user) {
						user = await User.create({
							email: profile.email,
							name: profile.name,
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
})

export { handler as GET, handler as POST }