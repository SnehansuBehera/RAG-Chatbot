'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ChatComponent from './components/ChatComponent';
import axios from 'axios';

export default function Home() {
  const [me, setMe] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

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

    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching chat history:', error);
      } else {
        setChatHistory(data);
      }
    };

    fetchUser();
    fetchChatHistory();
  }, [router]);
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login')
  }
  const handleSendMessage = async () => {
    if (!message.trim() || !userId) return;

    const { data, error } = await supabase
      .from('chat')
      .insert([{ message, user_id: userId }])
      .select();

    if (error) {
      console.error('Error sending message:', error);
    } else {
      if (data && data.length > 0) {
        setChatHistory([...chatHistory, data[0]]);
      } else {
        console.error('Unexpected response format:', data);
      }
      setMessage('');
    }
  };

  return (
    <div className='h-screen flex flex-col items-center'>
      <div className='flex flex-col h-full w-full lg:w-[1000px]'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 pt-4 pb-2 sm:py-4 bg-white'>
          <p className='text-lg sm:text-xl lg:text-2xl font-bold text-zinc-500'>
            {chatHistory.length === 0 ? 'Start Conversation' : 'Carry on Conversation'}
          </p>
          <button onClick={logout} className='ring-1 ring-zinc-700 rounded-lg py-1 px-3 sm:px-4 font-medium text-md sm:text-lg text-zinc-600'>
            Logout
          </button>
        </div>

        {/* Chat Component */}
        <div className='flex-1 overflow-y-auto my-2 sm:my-4 shadow-inner shadow-zinc-100 rounded-2xl'>
          <ChatComponent />
        </div>
      </div>
    </div>
  );

} 