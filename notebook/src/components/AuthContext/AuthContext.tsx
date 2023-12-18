import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface CurrentUserType {
  username: string;
  email: string;
  sessionToken: string;
  isVerified: boolean;
}

interface AuthContextType {
  currentUser: CurrentUserType | null;
  setCurrentUser: (user: CurrentUserType | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => 0,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);

  const contextValues = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext);
};
