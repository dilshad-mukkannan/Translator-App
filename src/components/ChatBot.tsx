import React, { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaBrain } from "react-icons/fa";
import Sidebar from "../atom/Sidebar";

const API_KEY = "AIzaSyC1ecYqWfsKLJgdnuucwQU5mZv_00Vd4WQ";
const ChatBot = () => {
    const [userResponse, setUserResponse] = useState("");
    const [modelResponse, setModelResponse] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const userResponseRef = useRef("");
    const buttonRef = useRef<HTMLButtonElement>(null);


    const handleResponse = async () => {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });

            const prompt = `Respond intelligently and sentimentally to user response: ${userResponse} like in chat`;
            const result = await model.generateContent([prompt]);

            if (result && result.response && typeof result.response.text === 'function') {
                const responseText = result.response.text();
                setModelResponse(responseText);
                setUserResponse("");
                userResponseRef.current = userResponse;
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            if (buttonRef.current) {buttonRef.current.click()}
        }
            
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between p-4 bg-white shadow-md">
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-900 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                    <div className="flex flex-row">
                    <FaBrain size={40}/><h1 className="text-xl font-semibold text-gray-700 pt-2 pl-1">
                        MyGPT Model
                    </h1>
                    </div>
                    <h2 className="font-semibold text-gray-500">
                        Version 1.0
                    </h2>
                </div>
                <main className="flex-1 p-4">
                    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200">
                            <div className="mb-2">
                                <div className="p-2 bg-green-200 rounded-lg text-right">
                                    { userResponse ? userResponse : userResponseRef.current}
                                </div>
                                <div className="p-2 bg-gray-200 rounded-lg mt-2">
                                    {modelResponse}
                                </div>
                            </div>
                        </div>
                        <div className="flex p-2 border-t border-gray-200">
                            <input
                                type="text"
                                value={userResponse}
                                onChange={(e) => setUserResponse(e.target.value)}
                                onKeyDown={handleKeydown}
                                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={handleResponse}
                                ref={buttonRef}
                                className="bg-[#00cc99] text-white p-2 rounded-r-lg hover:bg-blue-700 transition"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatBot;
