// IMPORTANT: Here we need "use client" because it use the browser capacity
"use client"

/*#################
# Create a Provider component for using NextAuth
#################*/

import { SessionProvider } from 'next-auth/react'

const Provider = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}

export default Provider