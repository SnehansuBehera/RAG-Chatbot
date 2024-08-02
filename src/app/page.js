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
    <div>
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>{chat.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
