'use client'

import React from 'react'
import { useChat } from 'ai/react';
import { FaUser } from "react-icons/fa";

const ChatComponent = () => {
    const { input, handleInputChange, handleSubmit, messages } = useChat();
    console.log(messages);
    return (
        <div>
            {messages.map(m => (
                <div key={m.id}>
                    {m.role === 'user' ?

                        <div className='flex justify-end items-start gap-5 mb-10'>
                            <div className=' py-3 px-5 text-white font-bold bg-sky-500 rounded-lg text-xl  w-fit'>
                                {m.content}
                            </div>
                            <FaUser size={40} className='text-black' />
                        </div>
                        : <div className='flex flex-row-reverse justify-end items-start gap-5 mb-10'>
                            <div className=' py-3 px-5 text-white font-bold bg-zinc-500 rounded-lg text-xl  w-fit'>
                                {m.content}
                            </div>
                            <FaUser size={40} className='text-black' />
                        </div>
                    }

                </div>
            ))}

            <form onSubmit={handleSubmit} className='flex items-center justify-start w-[800px] mx-auto gap-6'>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me"
                    className='w-full py-3 rounded-lg bg-white ring-1 ring-zinc-300 shadow-lg shadow-zinc-200 px-6'
                />
                <button type='submit' className='px-4 py-3 shadow-lg shadow-sky-200 bg-sky-500 rounded-lg text-white font-semibold'>Send</button>

            </form>
        </div>
    )
}

export default ChatComponent
