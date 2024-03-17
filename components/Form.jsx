/*###############
# This "Form" component will be used in the CreateWork and EditWork file.
###############*/

import { categories } from "../data"
import { IoIosImages } from "react-icons/io"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

import "@styles/Form.scss";


// The "Form" component is the child of the "CreateWork" component and "EditWork" component.
// So the "Form" component receive the "type", "work" and "setWork" as props from the "CreateWork" component and "EditWork" component.
// In the file data.js, we have a list of categories. We will use this list to display the categories in the "Form" component.
const Form = ({ type, work, setWork, handleSubmit }) => {

	/*###############
	# FUNCTIONS
	###############*/

	/*###############
	# FUNCTIONS --- handleUploadPhotos
	###############*/
	const handleUploadPhotos = (e) => {
		const newPhotos = e.target.files
		setWork((prevWork) => {
			return {
				...prevWork,
				photos: [...prevWork.photos, ...newPhotos]
			}
		})
	}
	/*###############
	# End of FUNCTIONS --- handleUploadPhotos
	###############*/


	/*###############
	# FUNCTIONS --- handleRemovePhoto
	###############*/
	const handleRemovePhoto = (indexToRemove) => {
		setWork((prevWork) => {
			return {
				...prevWork,
				photos: prevWork.photos.filter((_, index) => index !== indexToRemove)
			}
		})
	}
	/*###############
	# End of FUNCTIONS --- handleRemovePhoto
	###############*/


	/*###############
	# FUNCTIONS --- handleChange
	###############*/
	const handleChange = (e) => {
		const { name, value } = e.target;
		setWork((prevWork) => {
			return {
				...prevWork,
				[name]: value,
			};
		});
	};
	/*###############
	# End of FUNCTIONS --- handleChange
	###############*/

	/*###############
	# End of FUNCTIONS
	###############*/


	/*###############
	# RENDER
	###############*/

	/*###############
	# RENDER --- renderCategoryList
	###############*/
	const renderCategoryList = () => {
		return (
			<div className="category-list">
				{/* We use the "map" method to loop through the "categories" array and display the categories. */}
				{categories?.map((item, index) => (
					<p
						key={index}
						className={`${work.category === item ? "selected" : ""}`}
						onClick={() => {
							setWork({ ...work, category: item });
						}}
					>
						{item}
					</p>
				))}
			</div>
		)
	}
	/*###############
	# End of RENDER --- renderCategoryList
	###############*/

	/*###############
	# RENDER --- renderSectionForUploadPhotos
	###############*/
	const renderSectionForUploadPhotos = () => {
		// If the "photos" array is EMPTY, then we display the "Upload Photos" button.
		if (work.photos.length < 1) {
			return (
				<div className="photos">
					<input
						id="image"
						type="file"
						style={{ display: "none" }}
						accept="image/*"
						onChange={handleUploadPhotos}
						multiple
					/>
					<label htmlFor="image" className="alone">
						<div className="icon">
							<IoIosImages />
						</div>
						<p>Upload from your device</p>
					</label>
				</div>
			)
		}
	}
	/*###############
	# End of RENDER --- renderSectionForUploadPhotos
	###############*/


	/*###############
	# RENDER --- renderPhotos
	###############*/
	const renderPhotos = () => {
		if (work.photos.length > 0) {
			return (
				<div className="photos">
					{work?.photos?.map((photo, index) => (
						<div key={index} className="photo">
							{/* Why we need to have 2 cases here? */}
							{/* Because in the CreateWork page, user will upload the new photos from their devices, that's why we need to create the URL like this: URL.createObjectURL(photo) to show the image */}
							{/* But then, after we publish and then we store the work in the MongoDB, the "photo" now is already the URL, which means it's already a string, so we just use it directly like this: src={photo}, so we don't have to create the URL anymore */}
							{/* So at the beginning, if the "photo" is an instance of Object, then we use the URL.createObjectURL */}
							{photo instanceof Object ? (
								// So basically, this one is used for CreateWork page

								<img src={URL.createObjectURL(photo)} alt="work" />
							) : (
								<img src={photo} alt="work" />
							)}
							{/* Button Remove Photo */}
							{/* We use the "index" to remove the photo from the "photos" array. */}
							{/* The "index" is the index of the photo in the "photos" array. */}
							<button type="button" onClick={() => handleRemovePhoto(index)}>
								<BiTrash />
							</button>
						</div>
					))}
					<input
						id="image"
						type="file"
						style={{ display: "none" }}
						accept="image/*"
						onChange={handleUploadPhotos}
						multiple
					/>
					<label htmlFor="image" className="together">
						<div className="icon">
							<IoIosImages />
						</div>
						<p>Upload from your device</p>
					</label>
				</div>
			)
		}
	}
	/*###############
	# End of RENDER --- renderPhotos
	###############*/

	/*###############
	# RENDER --- renderWhatMakeYourWorkAttractive
	###############*/
	const renderWhatMakeYourWorkAttractive = () => {
		return (
			<div className="description">
				<p>Title</p>
				<input
					type="text"
					placeholder="Title"
					onChange={handleChange}
					name="title"
					value={work.title}
					required
				/>
				<p>Description</p>
				<textarea
					type="text"
					placeholder="Description"
					onChange={handleChange}
					name="description"
					value={work.description}
					required
				/>
				<p>Now, set your PRICE</p>
				<span>$</span>
				<input
					type="number"
					placeholder="Price"
					onChange={handleChange}
					name="price"
					value={work.price}
					required
					className="price"
				/>
			</div>
		)
	}

	/*###############
	# End of RENDER
	###############*/


	/*###############
	# The following code is only about the FINAL UI
	###############*/
	return (
		<div className="form">
			<h1>{type} Your Work</h1>
			{/* The handleSubmit is passed from the CreateWork */}
			<form onSubmit={handleSubmit}>

				<h3>Which of these categories best describes your work?</h3>
				{renderCategoryList()}

				<h3>Add some photos of your work</h3>
				{renderSectionForUploadPhotos()}
				{renderPhotos()}

				<h3>What make your Work attractive?</h3>
				{renderWhatMakeYourWorkAttractive()}

				{/* Button Publish Your Work */}
				<button className="submit_btn" type="submit">PUBLISH YOUR WORK</button>
			</form>
		</div>
	)
	/*###############
	# End of FINAL UI
	###############*/
}

export default Form