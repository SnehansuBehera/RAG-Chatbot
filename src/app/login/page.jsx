'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else {
            // toast.success('Logged in!');
            router.push('/')
        };
    };

    return (
        <div className='flex items-center justify-center h-[100vh]'>
            <form onSubmit={handleLogin} className='flex flex-col items-center justify-start gap-10 bg-slate-100 rounded-xl shadow-lg shadow-zinc-200 py-16 px-16 '>

                <p className='text-3xl font-extrabold'>Welcome Back!</p>

                <div className='flex flex-col items-center justify-start gap-6'>
                    <div className='flex flex-col gap-6 items-center justify-start'>
                        <input className='ring-2 ring-zinc-600 focus:ring-slate-500 px-4 py-2 rounded-lg text-lg text-zinc-700' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <input className='ring-2 ring-zinc-600 focus:ring-slate-500 px-4 py-2 rounded-lg text-lg text-zinc-700' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <button className='w-full bg-sky-400 rounded-lg ring-2 ring-sky-400 py-2 px-4 text-white text-lg font-bold' type="submit">Login</button>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-lg font-semibold'>Dont have account?</p>
                        <Link href="/signup"><p className='text-sky-500 text-lg font-semibold'>Register</p></Link>
                    </div>

                </div>
            </form>
        </div>
    );
}
export default Login;
