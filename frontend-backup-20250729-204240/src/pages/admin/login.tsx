import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '@/components/admin/auth/LoginForm';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Head from 'next/head';

const LoginPage: React.FC = () => {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <>
      <Head>
        <title>Admin Giriş | Beyond2C</title>
        <meta name="description" content="Beyond2C Admin Panel Giriş Sayfası" />
      </Head>
      <LoginForm />
    </>
  );
};

export default LoginPage;
