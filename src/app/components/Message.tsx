"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCopyToClipboard } from "../../lib/hooks/use-copy-to-clipboard";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { CodeBlock } from "./ui/CodeBlock";
import { parseCodeBlocks } from "../../lib/utils";
import { useUser } from "@clerk/nextjs";
import { MessageProps } from "@/lib/types";

interface AgentDict {
	[key: string]: string;
}
const agents: AgentDict = {
	tutor: "AI Tutor",
	coder: "Coder",
	ada: "Ada",
	fed: "F.E.D.",
	jasmyn: "Jasmyn",
	sys_writer: "System Prompter",
	sys_writer_plus: "System Prompter+",
	dm_helper: "D&D: DM Helper",
	player_helper: "D&D: Player Helper",
};

export const Message: React.FC<MessageProps> = ({
	id,
	timestamp,
	sender,
	msg,
	agentId,
}) => {
	const { isCopied, copyToClipboard } = useCopyToClipboard({});
	const { user, isLoaded, isSignedIn } = useUser();
	let name: any = ''
	if (!isLoaded) {
        return null;
	}
	if (user && isSignedIn) {
		console.log(`user is signed in: ${user.fullName}`);
		name = user.firstName
		// console.log(`user object: ${JSON.stringify(user)}`);
	}
	// const [streamedText, setStreamedText] = useState<string>('');
	const currentUserName: string = name && name.length ? name : "AnonymousUser";

	const isUserMessage = msg.role === "user";
	const messageClass = isUserMessage
		? "bg-vista-blue text-gray"
		: "bg-jasmine text-black";
	const alignmentClass = isUserMessage ? "justify-end" : "justify-start";
	const parsedContent = parseCodeBlocks(msg.content);

	return (
		<div className={`flex ${alignmentClass} mb-4`}>
			<div
				className={`px-4 py-2 rounded-lg overflow-x-auto ${messageClass} shadow-md`}
				style={{ maxWidth: "80%" }}
			>
				{parsedContent.map((part, index) => (
					<React.Fragment key={index}>
						{part.type === "text" ? (
							<>
								<span className="block text-chocolate-cosmos text-md">
									{msg.role === "user"
										? currentUserName
										: agents[agentId]}
								</span>
								<div className="block text-sm">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{part.content}
									</ReactMarkdown>
								</div>
							</>
						) : (
							<CodeBlock
								language={part.language}
								value={part.content}
							/>
						)}
					</React.Fragment>
				))}
				<button
					className={`text-xs text-chocolate-cosmos hover:scale-1.1 focus:outline-none`}
					onClick={() => copyToClipboard(msg.content)}
				>
					{isCopied ? "Copied!" : <ClipboardIcon />}
				</button>
			</div>
		</div>
	);
};
