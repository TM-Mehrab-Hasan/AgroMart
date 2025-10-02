import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, setSessionStatus, clearAuth } from '@/store/slices/authSlice';
import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    sessionStatus,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setSessionStatus(status));
    
    if (status === 'authenticated' && session?.user) {
      dispatch(setUser(session.user as any));
    } else if (status === 'unauthenticated') {
      dispatch(clearAuth());
    }
  }, [session, status, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    error,
    sessionStatus,
    session,
  };
};