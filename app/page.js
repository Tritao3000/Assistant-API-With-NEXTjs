'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Drago from '@/public/drago.jpeg';
import Tiago from '@/public/tiago.png';
import { IoMdRefresh } from 'react-icons/io';

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
      await fetchMessages(threadId);
    }, 3000);
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-between h-[750px] my-20 max-w-4xl bg-white/10 shadow-xl rounded-lg">
      <div className="flex items-center justify-between p-4 rounded-lg text-white ">
        <h1 className="text-xl font-bold">Chat with Mike Trillions</h1>
        <div
          className="bg-white/10  p-2 rounded-full cursor-pointer hover:scale-110 transform transition duration-300"
          onClick={refreshWindow}
        >
          <IoMdRefresh color="white" />
        </div>
      </div>

      <div className="messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              <div
                className={`flex items-start ${
                  message.role === 'user'
                    ? 'flex-row-reverse space-x-reverse'
                    : 'space-x-2'
                }`}
              >
                <Image
                  alt="messageSentBy"
                  src={message.role === 'user' ? Drago : Tiago}
                  width={40}
                  height={40}
                  className={`rounded-full w-[40px] h-[40px] ${
                    message.role === 'user' ? 'ml-2' : ''
                  }`}
                />
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-white/90' : 'bg-white/80'
                  }`}
                >
                  <p className="text-sm">{message.content[0].text.value}</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <form
        className="mt-auto flex space-x-2 bg-white/20 p-2 rounded-lg"
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
