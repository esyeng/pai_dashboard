import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { ChatProvider, useChat } from "../../app/components/ChatContext";
import * as api from "../../app/lib/api";

// Mock the API functions
jest.mock("../lib/api", () => ({
	queryModel: jest.fn(),
	queryResearchModel: jest.fn(),
	fetchThreads: jest.fn(),
	fetchAssistants: jest.fn(),
	fetchModels: jest.fn(),
	fetchUser: jest.fn(),
	saveNewThread: jest.fn(),
	updateThreadMessages: jest.fn(),
}));

// Mock the useAuth hook
jest.mock("@clerk/nextjs", () => ({
	useAuth: () => ({
		getToken: jest.fn(() => Promise.resolve("mock-token")),
	}),
}));

// Test component to use the useChat hook
const TestComponent = () => {
	const chat = useChat();
	return <div>{JSON.stringify(chat)}</div>;
};

describe("ChatProvider", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("initializes with default state", async () => {
		let renderedComponent;
		await act(async () => {
			renderedComponent = render(
				<ChatProvider>
					<TestComponent />
				</ChatProvider>
			);
		});

		const { getByText } = renderedComponent;

		await waitFor(() => {
			expect(getByText(/"threadState":/)).toBeInTheDocument();
			expect(getByText(/"agents":\[]/)).toBeInTheDocument();
			expect(getByText(/"models":\[]/)).toBeInTheDocument();
			expect(
				getByText(/"shouldQueryResearchModel":false/)
			).toBeInTheDocument();
			expect(getByText(/"agentId":"jasmyn"/)).toBeInTheDocument();
			expect(
				getByText(/"modelId":"claude-3-5-sonnet-20240620"/)
			).toBeInTheDocument();
		});
	});

	test("creates a new thread", async () => {
		api.saveNewThread.mockResolvedValue([
			{ thread_id: "new-thread-id", title: "New Thread" },
		]);

		let renderedComponent;
		await act(async () => {
			renderedComponent = render(
				<ChatProvider>
					<TestComponent />
				</ChatProvider>
			);
		});

		const { getByText } = renderedComponent;

		await act(async () => {
			const chat = JSON.parse(getByText(/{.*}/).textContent);
			await chat.createNewThread();
		});

		await waitFor(() => {
			expect(api.saveNewThread).toHaveBeenCalled();
			expect(getByText(/"new-thread-id":/)).toBeInTheDocument();
		});
	});

	test("switches thread", async () => {
		let renderedComponent;
		await act(async () => {
			renderedComponent = render(
				<ChatProvider>
					<TestComponent />
				</ChatProvider>
			);
		});

		const { getByText } = renderedComponent;

		await act(async () => {
			const chat = JSON.parse(getByText(/{.*}/).textContent);
			chat.switchThread("test-thread-id");
		});

		await waitFor(() => {
			expect(
				getByText(/"currentThreadId":"test-thread-id"/)
			).toBeInTheDocument();
		});
	});

	test("sends a chat message", async () => {
		api.queryModel.mockResolvedValue({ response: "Mock response" });

		let renderedComponent;
		await act(async () => {
			renderedComponent = render(
				<ChatProvider>
					<TestComponent />
				</ChatProvider>
			);
		});

		const { getByText } = renderedComponent;

		await act(async () => {
			const chat = JSON.parse(getByText(/{.*}/).textContent);
			await chat.sendChat(
				"Test message",
				"test-model",
				"test-agent",
				"test-thread-id"
			);
		});

		await waitFor(() => {
			expect(api.queryModel).toHaveBeenCalled();
			expect(getByText(/"content":"Test message"/)).toBeInTheDocument();
			expect(getByText(/"content":"Mock response"/)).toBeInTheDocument();
		});
	});

	test("useChat hook throws error when used outside ChatProvider", () => {
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		expect(() => render(<TestComponent />)).toThrow(
			"useChat must be used within a ChatProvider"
		);

		consoleErrorSpy.mockRestore();
	});
});
