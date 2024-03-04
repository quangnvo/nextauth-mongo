"use client"

/*################
# This Navbar will be used in the app/page.jsx file.
################*/

import "@styles/Navbar.scss"
import { Person, Search, Menu, ShoppingCart } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

const Navbar = () => {

	/*################
	# VARIABLES
	################*/
	// The useSession hook returns a session object, which contains the user object if the user is signed in. Then we can use the "user" object to get the user's information.
	const { data: session } = useSession()
	const user = session?.user

	console.log("user", user)

	const [dropDownMenu, setDropDownMenu] = useState(false)
	/*################
	# End of VARIABLES
	################*/


	/*################
	# RENDER UI
	################*/
	return (
		<div className="navbar">
			{/* Logo */}
			<a href="/">
				<img src="/assets/logo.png" alt="logo" />
			</a>

			{/* Search, at the middle */}
			<div className="navbar_search">
				<input type="text" placeholder="Search..." />
				<IconButton>
					<Search sx={{ color: "red" }} />
				</IconButton>
			</div>


			{/* On the right side of the navbar*/}
			<div className="navbar_right">
				{/* If user already login, then render the Cart icon at here*/}
				{user && (
					<a href="/cart" className="cart" >
						<ShoppingCart sx={{ color: "gray" }} />
						Cart <span>(2)</span>
					</a>
				)}

				<button
					className="navbar_right_account"
					onClick={() => setDropDownMenu(!dropDownMenu)}
				>
					<Menu sx={{ color: "gray" }} />
					{/* If user already login, then render image, otherwise render the icon Person */}
					{!user ? (
						<Person sx={{ color: "gray" }} />
					) : (
						<img src={user.profileImagePath} alt="profile" style={{ objectFit: "cover", borderRadius: "50%" }} />
					)}
				</button>

				{/* If user not login yet, then render the Login and Sign up dropdown*/}
				{dropDownMenu && !user && (
					<div className="navbar_right_accountmenu">
						<Link href="/login">Login</Link>
						<Link href="/register">Sign Up</Link>
					</div>
				)}

				{/* If user already login, then render the Profile and Logout dropdown*/}
				{dropDownMenu && user && (
					<div className="navbar_right_accountmenu">
						<Link href="/wishlist">Wishlist</Link>
						<Link href="/cart">Cart</Link>
						<Link href="/order">Order</Link>
						<Link href="/shop">Your shop</Link>
						<Link href="/create-work">Sell your work</Link>
						<a href="">Log out</a>
					</div>
				)}
			</div>

		</div>
	)
	/*################
	# End of RENDER UI
	################*/
}

export default Navbar