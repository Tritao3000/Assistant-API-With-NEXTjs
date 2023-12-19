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
    <div className=" container mx-auto p-4 h-screen flex flex-col justify-between max-w-4xl">
      <div className="messages overflow-y-auto mt-20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message flex space-x-4 items-start my-4 ${
              message.role === 'user' ? 'text-right' : ''
            }`}
          >
            <Image
              alt="messageSentBy"
              src={message.role === 'user' ? Drago : Tiago}
              width={50}
              height={50}
              className="rounded-full shadow-lg h-[50px]"
            />
            <p className="bg-gray-200 rounded-lg rounded-tl-none p-2 text-sm mt-2">
              {message.content[0].text.value}
            </p>
          </div>
        ))}
      </div>
      <form className="mt-auto flex space-x-2" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-2 border-gray-300 rounded p-2 w-full text-sm"
          placeholder="Type your message"
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
