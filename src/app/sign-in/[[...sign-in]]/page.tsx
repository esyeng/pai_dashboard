import { SignIn } from "@clerk/nextjs";
import "../../globals.css";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<SignIn
				appearance={{
					variables: {
						colorPrimary: "#000000",
						colorText: "#b473ee",
						colorBackground: "#321E48",
					},
				}}
				path="/sign-in"
			/>
		</div>
	);
}
