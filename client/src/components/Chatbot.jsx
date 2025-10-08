import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await API.post('/chatbot/ask', { message: input });
      setMessages((msgs) => [...msgs, { sender: 'bot', text: res.data.reply }]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I could not respond.' }]);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
          aria-label="Open Chatbot"
        >
          💬
        </button>
      )}

      {/* Chatbot Window */}
      {open && (
        <div className="fixed bottom-6 right-6 bg-white border rounded-xl shadow-2xl w-80 flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 rounded-t-xl">
            <span className="text-white font-semibold">EventHub AI Assistant</span>
            <button
              className="text-white text-xl hover:text-gray-200"
              onClick={() => setOpen(false)}
              aria-label="Close Chatbot"
            >
              &times;
            </button>
          </div>
          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-8">How can I help you today?</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow animate-pulse">
                  Bot is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form className="flex border-t bg-white rounded-b-xl" onSubmit={sendMessage}>
            <input
              className="flex-1 p-3 outline-none rounded-bl-xl"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button
              className="p-3 text-blue-600 font-bold hover:text-blue-800 transition disabled:opacity-50"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Chatbot;