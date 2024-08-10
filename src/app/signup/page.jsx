'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.log(error.message);
        } else {
            setSuccess(true);
            router.push('/login')
        };
    };

    return (
        <div className='flex items-center justify-center h-[100vh]'>
            <form onSubmit={handleSignup} className='flex flex-col items-center justify-start gap-10 bg-slate-100 rounded-xl shadow-lg shadow-zinc-200 py-16 px-16 '>
                <div className='flex flex-col gap-2 items-center justify-start'>
                    <p className='text-3xl font-extrabold'>Create Account!</p>
                    <p className='text-lg font-semibold text-green-500'>Check your mail after signup</p>
                </div>


                <div className='flex flex-col items-center justify-start gap-6'>
                    <div className='flex flex-col gap-6 items-center justify-start'>
                        <input className='ring-2 ring-zinc-600 focus:ring-slate-500 px-4 py-2 rounded-lg text-lg text-zinc-700' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <input className='ring-2 ring-zinc-600 focus:ring-slate-500 px-4 py-2 rounded-lg text-lg text-zinc-700' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <button className='w-full bg-sky-400 rounded-lg ring-2 ring-sky-400 py-2 px-4 text-white text-lg font-bold' type="submit">Sign up</button>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg font-semibold'>Already have account?</p>
                        <Link href="/login"><p className='text-sky-500 text-lg font-semibold'>Login</p></Link>
                    </div>


                </div>

            </form>
        </div>
    );
}
