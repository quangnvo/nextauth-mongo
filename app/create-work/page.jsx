"use client"

import { useState } from "react"
import Form from "@components/Form"
import Navbar from "@components/Navbar"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CreateWork = () => {

	/*################
	# VARIABLES
	################*/
	const { data: session } = useSession()
	const router = useRouter()

	const [work, setWork] = useState({
		creator: "",
		category: "",
		title: "",
		description: "",
		price: "",
		photos: [],
	})
	/*################
	# End of VARIABLES
	################*/

	/*################
	# FUNCTIONS
	################*/

	if (session) {
		work.creator = session?.user?._id
	}

	// This handleSubmit function will be passed to the "Form" component as a prop.
	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const newWorkForm = new FormData()

			for (var key in work) {
				newWorkForm.append(key, work[key])
			}

			work.photos.forEach((photo) => {
				newWorkForm.append("workPhotoPaths", photo)
			})

			const response = await fetch("/api/work/new", {
				method: "POST",
				body: newWorkForm
			})

			if (response.ok) {
				router.push(`/shop?id=${session?.user?._id}`)
			}
		} catch (err) {
			console.log("Publish Work failed", err.message)
		}
	}

	/*################
	# End of FUNCTIONS
	################*/


	return (
		<>
			<Navbar />
			<Form
				// The Form component is the child of the CreateWork component.
				// We pass the "type" as "Create" to the "Form" component.
				// At here we are passing the "work" and "setWork" as props to the "Form" component.
				// This is how we can access the "work" and "setWork" in the "Form" component.
				type="Create"
				work={work}
				setWork={setWork}
				// handleSubmit outside is the name, and handleSubmit inside is the function.
				handleSubmit={handleSubmit}
			/>
		</>
	)
}

export default CreateWork