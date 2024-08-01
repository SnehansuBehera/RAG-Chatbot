'use client'
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else router.push('/login');
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Signup</button>
        </form>
    );
}
