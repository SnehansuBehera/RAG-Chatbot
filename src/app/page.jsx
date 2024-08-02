'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Home() {
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
    await supabase.auth.signOut()
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
    <div className='h-[100vh] flex flex-col items-center justify-center'>
      <div className='flex flex-col justify-between gap-20 w-[800px]  mx-auto'>
        <div className='flex items-center justify-between'>
          <p className='text-2xl font-bold text-zinc-500 text-left'>{chatHistory.length === 0 ? 'Start Conversation' : 'Carry on Conversation'}</p>
          <button onClick={logout} className='ring-1 ring-zinc-700 rounded-lg  py-1 px-4 font-medium text-lg text-zinc-600'>Logout</button>
        </div>

        <div className='flex flex-col gap-2 items-end'>
          {chatHistory.map((chat, index) => (
            <p key={index} className='w-[120px] px-1 py-2 text-right bg-sky-600 rounded-lg text-white font-semibold '>{chat.message}</p>
          ))}
        </div>
        <div className='flex items-center justify-start w-[800px] mx-auto gap-6'>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className='w-full py-3 rounded-lg bg-white ring-1 ring-zinc-300 shadow-lg shadow-zinc-200 px-6'
          />
          <button onClick={handleSendMessage} className='px-4 py-3 shadow-lg shadow-sky-200 bg-sky-500 rounded-lg text-white font-semibold'>Send</button>

        </div>

      </div>


    </div>
  );
}
