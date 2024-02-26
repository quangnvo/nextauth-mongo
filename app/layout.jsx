import "@styles/globals.css"
import Provider from "@components/Provider"

export const metadata = {
	title: "Alatags",
	description: "Alatags is a tool to help you manage your tags",
}

const layout = ({ children }) => {
	return (
		<html lang="en">
			<body>
				<Provider>
					<main>
						{children}
					</main>
				</Provider>
			</body>
		</html>
	)
}

export default layout