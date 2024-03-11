"use client"

import { useState } from "react"
import Form from "@components/Form"
import Navbar from "@components/Navbar"

const CreateWork = () => {

	/*################
	# VARIABLES
	################*/
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
			/>
		</>
	)
}

export default CreateWork