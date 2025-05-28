// client/src/components/Dashboard/Chatbot/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './Chatbot.css';
import { INTERNSHIP_PROJECTS } from '../../../utils/constants'; // Get project details

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! I am your AI Intern Helper. Ask me about projects like "Explain Project 1" or "Details for project2".' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const getBotReply = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        let reply = "I'm still learning! Try asking for details about a specific project, like 'Tell me about Project 1'.";

        const projectKeywords = {
            'project 1': INTERNSHIP_PROJECTS[0],
            'project1': INTERNSHIP_PROJECTS[0],
            'project 2': INTERNSHIP_PROJECTS[1],
            'project2': INTERNSHIP_PROJECTS[1],
            'project 3': INTERNSHIP_PROJECTS[2],
            'project3': INTERNSHIP_PROJECTS[2],
        };

        for (const keyword in projectKeywords) {
            if (lowerInput.includes(keyword)) {
                const project = projectKeywords[keyword];
                reply = `Ah, ${project.title}! ${project.description} Let me know if you need more specific help!`;
                return reply;
            }
        }

        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            reply = "Hello! How can I assist you with your internship projects today?";
        } else if (lowerInput.includes('thank')) {
            reply = "You're welcome! Happy to help.";
        } else if (lowerInput.includes('certificate')) {
            reply = "You can check your certificate status on the 'Certificate' page in your dashboard once all projects are approved.";
        } else if (lowerInput.includes('submission')) {
            reply = "To submit a project, navigate to the project on your dashboard and click 'Start/Submit'. You can upload a file or provide a link.";
        }

        return reply;
    };


    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        const botReplyText = getBotReply(input);
        const botMessage = { sender: 'bot', text: botReplyText };

        setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
        setInput('');
    };

    return (
        <>
            <button className="chatbot-toggler-btn" onClick={toggleChat} aria-label="Toggle AI Helper Chat">
                {isOpen ? <FaTimes /> : <FaComments />}
                {!isOpen && <span className="toggler-text">AI Helper</span>}
            </button>
            {isOpen && (
                <div className="chatbot-window-container">
                    <div className="chatbot-header-bar">
                        <span>AI Intern Helper</span>
                        <button onClick={toggleChat} className="chatbot-close-icon" aria-label="Close chat">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="chatbot-messages-area">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input-bar">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about projects..."
                            className="chatbot-input-field"
                        />
                        <button onClick={handleSend} className="chatbot-send-btn" aria-label="Send message">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;