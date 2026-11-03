import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AUTH_EXPIRED } from './lib/api';

const AuthContext = createContext(null);

// const check = () => !!localStorage.getItem('ss_user');
const check = () => !!localStorage.getItem('token');

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(check);

  const refresh = useCallback(() => setIsAuthed(check()), []);
  const signOut = useCallback(() => {sessionStorage.removeItem("token"), sessionStorage.removeItem("user")}, []);

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED, signOut);
    return () => window.removeEventListener(AUTH_EXPIRED, signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ isAuthed, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);