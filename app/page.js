'use client';
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const fetchMessages = async () => {
    // Replace with your threadId and the correct endpoint
    const response = await fetch('/api/messages?threadId=YOUR_THREAD_ID');
    const data = await response.json();
    setMessages(data.messages);
  };

  const sendMessageToBackend = async (messageContent) => {
    // Replace with your threadId and the correct endpoint
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        threadId: 'YOUR_THREAD_ID',
        content: messageContent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input) return;

    await sendMessageToBackend(input);
    setMessages([...messages, { content: input, role: 'user' }]);
    setInput('');

    // Optionally fetch messages again to include the assistant's response
    fetchMessages();
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col justify-between">
      <div className="messages overflow-auto">
        {/*messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'text-right' : ''}`}
          >
            <p className="bg-gray-200 rounded p-2 my-2">{message.content}</p>
          </div>
        ))*/}
      </div>
      <form className="mt-auto" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-2 border-gray-300 rounded p-2 w-full"
          placeholder="Type your message"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
