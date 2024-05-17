import { SignUp } from "@clerk/nextjs";
import "../../globals.css";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<SignUp
				appearance={{
					variables: {
						colorPrimary: "#000000",
						colorText: "#000000",
						colorBackground: "#c4f4c7ff",
					},
				}}
				path="/sign-up"
			/>
		</div>
	);
}
