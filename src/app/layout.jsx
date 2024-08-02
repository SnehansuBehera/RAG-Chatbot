'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import "./globals.css";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

