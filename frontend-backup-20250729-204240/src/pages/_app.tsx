import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import { AdminAuthProvider } from '../context/AdminAuthContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ToastProvider } from '../context/ToastContext'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <ToastProvider>
          <LanguageProvider>
            <Component {...pageProps} />
          </LanguageProvider>
        </ToastProvider>
      </AdminAuthProvider>
    )
  }

  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default MyApp
