/*###############
# This "Form" component will be used in the CreateWork and EditWork file.
###############*/

import { categories } from "../data"
import { IoIosImages } from "react-icons/io"

// The "Form" component is the child of the "CreateWork" component and "EditWork" component.
// So the "Form" component receive the "type", "work" and "setWork" as props from the "CreateWork" component and "EditWork" component.
// In the file data.js, we have a list of categories. We will use this list to display the categories in the "Form" component.
const Form = ({ type, work, setWork }) => {

	const handleUploadPhotos = (e) => {
		const newPhotos = e.target.files

		setWork((prevWork) => {
			return {
				...prevWork,
				photos: [...prevWork.photos, ...newPhotos]
			}
		})
	}


	return (
		<div className="form">
			<h1>{type} Your Work</h1>
			<form>
				<h3>
					Which of these categories best describes your work?
				</h3>
				{/* We use the "map" method to loop through the "categories" array and display the categories. */}
				{categories.map((categoryName, index) => (
					<p key={index}>{categoryName}</p>
				))}

				<h3>Add some photos of your work</h3>
				{work.photos.length < 1 && (
					<>
						<input
							id="upload-photos"
							type="file"
							style={{ display: "none" }}
							// image/* is used to accept all image types.
							accept="image/*"
							onChange={handleUploadPhotos}
							multiple
						/>
						<label htmlFor="upload-photos">
							<div>
								<IoIosImages />
								<div>Upload Photos</div>
							</div>
						</label>
					</>
				)}
			</form>
		</div>
	)
}

export default Form