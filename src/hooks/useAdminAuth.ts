import { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within a AdminAuthProvider');
  }
  
  return context;
};
