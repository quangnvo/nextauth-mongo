import "@styles/globals.css"

export const metadata = {
	title: "Alatags",
	description: "Alatags is a tool to help you manage your tags",
}

const layout = ({ children }) => {
	return (
		<html lang="en">
			<body>
				<main>
					{children}
				</main>
			</body>
		</html>
	)
}

export default layout