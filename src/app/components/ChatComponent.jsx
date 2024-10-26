'use client'
import React, { useEffect, useState } from 'react'
import { useChat } from 'ai/react';
import { FaUser } from "react-icons/fa";
import { SiGooglegemini } from "react-icons/si";
import { supabase } from '../../lib/supabaseClient';


const ChatComponent = ({ userId }) => {
    const { input, handleInputChange, handleSubmit, messages } = useChat();
    const [chatHistory, setChatHistory] = useState([]);


    useEffect(() => {
        const handleSendMessage = async () => {
            if (!userId) return;

            const { data, error } = await supabase
                .from('chat')
                .insert([{ message: messages, user_id: userId }])
                .select();

            if (error) {
                console.error('Error sending message:', error);
            } else {
                if (data && data.length > 0) {
                    setChatHistory([...chatHistory, data[0]]);
                    console.log(chatHistory);
                } else {
                    console.error('Unexpected response format:', data);
                }
            }
        };

        handleSendMessage();
    }, [messages])


    return (
        <div className='flex flex-col h-full'>
            {/* Messages Container */}
            <div className='flex-1 overflow-y-auto p-4'>
                {messages.map(m => (
                    <div key={m.id}>
                        {m.role === 'user' ?

                            <div className='flex justify-end items-start gap-5 mb-6'>
                                <div className='py-2 px-4 text-white font-medium bg-sky-500 rounded-lg text-sm w-fit'>
                                    {m.content}
                                </div>
                                <FaUser size={30} className='text-black' />
                            </div>
                            :
                            <div className='flex flex-row-reverse justify-end items-start gap-5 mb-6'>
                                <div className='py-2 px-4 text-black font-semibold bg-zinc-100 rounded-lg text-sm w-fit'>
                                    {m.content}
                                </div>
                                <SiGooglegemini size={30} className='text-black' />
                            </div>
                        }
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className='p-4 bg-white shadow-md flex items-center justify-start w-full gap-6'>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask Something"
                    className=' w-full py-3 rounded-lg bg-white ring-1 ring-zinc-300 shadow-xl shadow-zinc-300 px-6'
                />
                <button type='submit' className='px-5 py-3 shadow-xl shadow-sky-200 bg-sky-500 rounded-lg text-white font-semibold'>
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatComponent;