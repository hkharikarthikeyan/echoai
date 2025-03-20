"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";



const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Hello! How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || !API_KEY) return;

        const userMessage = inputMessage.trim();
        setMessages((prev) => [
            ...prev,
            { text: userMessage, sender: "user", timestamp: new Date() },
        ]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a helpful assistant for our website. Please answer: ${userMessage}`,
                                },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";

            setMessages((prev) => [...prev, { text: botResponse, sender: "bot", timestamp: new Date() }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { text: "Something went wrong. Try again.", sender: "bot", timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-80 h-96 flex flex-col">
                        <div className="p-4 border-b bg-primary text-white flex justify-between items-center rounded-t-lg">
                            <h3 className="font-semibold">Chat Assistant</h3>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-primary/80">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === "user" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">Typing...</div>}
                        </div>

                        <div className="p-4 border-t dark:border-gray-700">
                            <div className="flex gap-2">
                                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white" />
                                <button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 disabled:opacity-50">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/80">
                <MessageSquare size={24} />
            </motion.button>
        </div>
    );
};

export default ChatBot;