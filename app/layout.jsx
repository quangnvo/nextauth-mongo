import "@styles/globals.css"
import Provider from "@components/Provider"
import './globals.css'

export const metadata = {
	title: "Alatags",
	description: "Alatags is a tool to help you manage your tags",
}

const layout = ({ children }) => {
	return (
		<html lang="en" data-theme="bumblebee">
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