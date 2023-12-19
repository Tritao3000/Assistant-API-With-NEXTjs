'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Drago from '@/public/drago.jpeg';
import Tiago from '@/public/tiago.png';
import { IoMdRefresh } from 'react-icons/io';
import { FaArrowUp } from 'react-icons/fa6';

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
  };

  const sendMessageOnClick = async (content) => {
    if (!threadId) return;
    await sendMessageToBackend(content);
    fetchMessages(threadId);
  };

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-between h-[90vh] my-4 max-w-2xl bg-white/10 shadow-xl rounded-lg">
      <div className="flex items-center justify-between p-4 rounded-lg text-white ">
        <h1 className="text-xl font-bold">Chat with Mike Trillions</h1>
        <div
          title="New Chat"
          className="bg-white/10 w-[40px]  p-2 rounded-full cursor-pointer hover:scale-105 transform transition duration-300"
          onClick={refreshWindow}
        >
          <IoMdRefresh color="white" size={20} className="mx-auto " />
        </div>
      </div>
      <hr className="mx-4"></hr>

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
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg mt-4 ${
                    message.role === 'user'
                      ? 'bg-white/90 rounded-tr-none'
                      : 'bg-white rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content[0].text.value}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div
        className={`mx-auto flex flex-col space-y-2 w-full px-2 mb-4 ${
          messages.length == 0 ? `` : 'hidden'
        }`}
      >
        <div className="flex space-x-2 m-auto w-full">
          <div
            onClick={() =>
              sendMessageOnClick('O que achas das criptomoedas Guru?')
            }
            className="flex mx-auto w-full justify-between px-2 py-2 items-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <p className="text-white text-sm">
              O que achas das criptomoedas Guru?
            </p>
            <FaArrowUp className="" size={14} color="white" />
          </div>
          <div
            onClick={() => sendMessageOnClick('O que é um zombie Mike?')}
            className="flex mx-auto w-full justify-between px-2 py-2 items-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <p className="text-white text-sm">O que é um zombie Mike?</p>
            <FaArrowUp className="" size={14} color="white" />
          </div>
        </div>
        <div className="flex space-x-2 m-auto w-full">
          <div
            onClick={() => sendMessageOnClick('Quem é o Guru Mike Billions?')}
            className="flex mx-auto w-full justify-between px-2 py-2 items-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <p className="text-white text-sm">Quem é o Guru Mike Billions?</p>
            <FaArrowUp className="" size={14} color="white" />
          </div>
          <div
            onClick={() =>
              sendMessageOnClick('Oh Miguel, és mesmo meio burro?')
            }
            className="flex mx-auto w-full justify-between px-2 py-2 items-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <p className="text-white text-sm">
              Oh Miguel, és mesmo meio burro?
            </p>
            <FaArrowUp className="" size={14} color="white" />
          </div>
        </div>
      </div>
      <form
        className="mt-auto flex space-x-2  p-2 rounded-lg"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-full p-2 text-sm"
          placeholder="Type your message here..."
        />
        <button
          title="Send Message"
          type="submit"
          className="bg-white/20 hover:bg-white/30 text-white font-bold w-[40px] text-sm rounded-full"
        >
          <FaArrowUp size={16} className="m-auto" />
        </button>
      </form>
    </div>
  );
}
