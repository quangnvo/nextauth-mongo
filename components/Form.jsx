/*###############
# This "Form" component will be used in the CreateWork file.
###############*/


// The "Form" component is the child of the "CreateWork" component and "EditWork" component.
// So the "Form" component receive the "type", "work" and "setWork" as props from the "CreateWork" component and "EditWork" component.
const Form = ({ type, work, setWork }) => {
	return (
		<div className="form">
			<h1>{type} Your Work</h1>
			<form>
				<h3>
					Which of these categories best describes your work?
				</h3>
			</form>
		</div>
	)
}

export default Form