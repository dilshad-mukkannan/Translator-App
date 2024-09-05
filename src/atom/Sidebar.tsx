import React from "react";
import { Link } from "react-router-dom";



interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-200 ease-in-out bg-white w-64 shadow-lg z-20`}
        >
            <div className="p-4">
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    
                </button>
                <nav className="mt-4 space-y-2">
                    <ul>
                        <li>
                            <Link
                                to="/pdf-viewer"
                                className="block p-2 rounded hover:bg-gray-200"
                                onClick={toggleSidebar}
                            >
                                PDF Viewer
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/chat"
                                className="block p-2 rounded hover:bg-gray-200"
                                onClick={toggleSidebar}
                            >
                                Chat
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/image-extractor"
                                className="block p-2 rounded hover:bg-gray-200"
                                onClick={toggleSidebar}
                            >
                                Image Extractor
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/translator"
                                className="block p-2 rounded hover:bg-gray-200"
                                onClick={toggleSidebar}
                            >
                                Translator
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
