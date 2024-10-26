'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ChatComponent from './components/ChatComponent';
import { FaUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Home() {
  // const [me, setMe] = useState('');
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);  // Store the selected chat

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        router.push('/login');
        return;
      }
      if (session) {
        setUserId(session.user.id);
      } else {
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data: chats, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat history:', error);
      } else {
        setChatHistory(chats);
      }
    };

    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setDropdown(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const dropbar = () => {
    setDropdown(!dropdown);
  };

  const extractChatDetails = (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const content = parsedMessage[0]?.content.substring(0, 25) + "..." || "No content";
      const createdAt = new Date(parsedMessage[0]?.createdAt).toLocaleDateString(); // Format the date
      return { content, createdAt };
    } catch (error) {
      console.error('Error parsing message:', error);
      return { content: "Invalid message format", createdAt: "Unknown date" };
    }
  };

  return (
    <div className='h-screen flex flex-col items-center'>
      <div className='flex flex-col h-full w-full lg:w-[1000px]'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 pt-4 pb-2 sm:py-4 bg-white'>
          <div className='flex flex-row-reverse items-center justify-start gap-4'>
            <p className='hidden sm:block sm:text-2xl lg:text-3xl font-bold text-zinc-500'>
              Conversations
            </p>
            <div onClick={dropbar} className='px-2 py-1 flex items-center justify-evenly rounded-md bg-neutral-500 sm:px-3 sm:py-2 gap-1 sm:gap-1'>
              <FaUser size={20} className='text-white w-[0.8rem] sm:w-[2rem]' />
              <IoMdArrowDropdown size={25} className='text-white w-[1.4rem] sm:w-[2rem]' />
            </div>
            {dropdown && (
              <div className='bg-white w-auto absolute left-[1rem] top-[4rem] sm:left-[17.7rem] rounded-md z-50 shadow-lg shadow-gray-500 ring-1 ring-zinc-900'>
                {/* Chat History in Dropdown */}
                <ul>
                  {chatHistory.map((chat) => {
                    const { content, createdAt } = extractChatDetails(chat.message);
                    return (
                      <li
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className="cursor-pointer py-1 px-2 hover:bg-gray-200 rounded-md flex items-center justify-start gap-2"
                      >
                        <p className='text-xs text-gray-500'>{createdAt}</p>
                        <p className='text-sm text-gray-800 font-bold'>{content}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button onClick={logout} className='ring-1 ring-zinc-700 rounded-lg py-1 px-3 sm:px-4 font-medium text-md sm:text-lg text-zinc-600'>
            Logout
          </button>
        </div>

        {/* Chat Component */}
        <div className='flex-1 overflow-y-auto my-2 sm:my-4 shadow-inner shadow-zinc-100 rounded-2xl'>
          <ChatComponent userId={userId} />
        </div>
      </div>
    </div>
  );
}
