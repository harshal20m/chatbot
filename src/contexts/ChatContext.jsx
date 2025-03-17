import React, { createContext, useContext, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
	const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! How can I help you today?" }]);
	const [isLoading, setIsLoading] = useState(false);

	const sendMessage = async (message) => {
		try {
			setIsLoading(true);

			// Add user message to chat
			const newMessages = [...messages, { role: "user", content: message }];
			setMessages(newMessages);

			// Initialize Gemini API
			const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
			const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

			// Simple prompt without markdown
			const result = await model.generateContent(message);
			const response = await result.response;
			const text = response.text();

			// Add AI response to chat
			setMessages([
				...newMessages,
				{
					role: "assistant",
					content: text,
				},
			]);
		} catch (error) {
			console.error("Error:", error);
			setMessages([
				...messages,
				{ role: "assistant", content: "Sorry, I encountered an error. Please try again." },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const clearChat = () => {
		setMessages([{ role: "assistant", content: "Hello! How can I help you today?" }]);
	};

	return (
		<ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>{children}</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
