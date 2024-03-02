/* ################
Route Handler for NextAuth 
################ */
// This file is followed the Route Handler of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app

import User from "@models/User";
import { connectToDatabase } from "@mongodb/database";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

// The format of handler is followed by ROUTE HANDLER of NextAuth documentation at here: https://next-auth.js.org/configuration/initialization#route-handlers-app
// So in the following handler, we need to export two handlers, one for GET and one for POST
// Inside handler, we use providers to specify the authentication providers that we want to use
// In this case, we use GoogleProvider to specify that we want to use Google authentication provider
const handler = NextAuth({
	// ROUTE HANDLER --- Providers
	providers: [
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
	],

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
			if (account.provider === 'google') {
				try {
					await connectToDatabase()

					// Check if the user exists in the database and if not, create a new user
					let user = await User.findOne({ email: profile.email })

					if (!user) {
						user = await User.create({
							email: profile.email,
							username: profile.name,
							profileImagePath: profile.image,
							wishlist: [],
							cart: [],
							order: [],
							work: [],
						})
					}
					return user
				} catch (err) {
					console.log(err)
				}
			}
		},
	}
})

export { handler as GET, handler as POST }

/* ################
End of Route Handler for NextAuth 
################ */