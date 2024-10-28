// src/contexts/AmplifyClientContext.js
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { createContext, useContext, useEffect, useState } from "react";

type AmplifyClientType = ReturnType<typeof generateClient>;
type AmplifyClientContextType = {
  AmplifyClient: AmplifyClientType;
  userId: string;
};
export const AmplifyClientContext = createContext<AmplifyClientContextType | null>(
  null
);
export const AmplifyClientProvider = ({ children: children }: { children: React.ReactNode }) => {
  const AmplifyClient = generateClient({
    authMode: "userPool",
  });
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUserId(user.userId);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ローディング状態のUIを表示
  }

  return (
    <AmplifyClientContext.Provider value={{ AmplifyClient, userId }}>
      {children}
    </AmplifyClientContext.Provider>
  );
};

export const useAmplifyClient = () => {
  const context = useContext(AmplifyClientContext);
  if (!context) {
    throw new Error("useAmplifyClient must be used within a AmplifyClientProvider");
  }
  return context;
};
