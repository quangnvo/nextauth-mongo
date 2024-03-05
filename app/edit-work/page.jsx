import { useState } from "react"
import Form from "@components/Form"
import Navbar from "@components/Navbar"

const EditWork = () => {

    /*################
    # VARIABLES
    ################*/

    /*################
    # End of VARIABLES
    ################*/

    return (
        <>
            <Navbar />
            <Form
                // The Form component is the child of the EditWork component.
                // We pass the "type" as "Edit" to the "Form" component.
                // At here we are passing the "work" and "setWork" as props to the "Form" component.
                // This is how we can access the "work" and "setWork" in the "Form" component.
                type="Edit"
                work={work}
                setWork={setWork}
            />
        </>
    )
}

export default EditWork