'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Drago from '@/public/drago.jpeg';
import Tiago from '@/public/tiago.png';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);

  // Fetch Messages from a specific thread
  const fetchMessages = async (id) => {
    console.log('chamando');
    const response = await fetch(`/api/messages/${id}`, {
      method: 'POST',
      body: JSON.stringify({ threadId: id }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log(data);
    setMessages(data.data || []);
  };

  // Send a message to the backend
  const sendMessageToBackend = async (messageContent) => {
    await fetch(`/api/messages`, {
      method: 'POST',
      body: JSON.stringify({ messageContent, threadId }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // Create a new thread when the component mounts
  useEffect(() => {
    const createThread = async () => {
      const response = await fetch('/api/thread', { method: 'POST' });
      const data = await response.json();
      setThreadId(data.id);
      fetchMessages(data.id);
    };

    createThread();
  }, []);

  // Send message and fetch latest messages including the assistant's response
  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input || !threadId) return;

    await sendMessageToBackend(input);
    setInput('');
    fetchMessages(threadId);
    setTimeout(async () => {
      // Fetch messages for the second time
      await fetchMessages(threadId);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-between h-auto min-h-[750px] my-20 max-w-4xl bg-white shadow-xl rounded-lg">
      <div className="flex items-center justify-between bg-blue-500 p-4 rounded-t-lg text-white">
        <h1 className="text-xl font-bold">Chat with Drago & Tiago</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Refresh
        </button>
      </div>

      <div className="messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end space-x-2 ${
              message.role === 'user' ? 'justify-end' : ''
            }`}
          >
            <div className={`${message.role === 'user' ? 'order-last' : ''}`}>
              <Image
                alt="messageSentBy"
                src={message.role === 'user' ? Drago : Tiago}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
              }`}
            >
              <p className="text-sm">{message.content[0].text.value}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        className="mt-auto flex space-x-2 bg-gray-100 p-4 rounded-b-lg"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded p-2 text-sm"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
