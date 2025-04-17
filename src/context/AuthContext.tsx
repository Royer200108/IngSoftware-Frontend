import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  role: number | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: number | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  setUser: () => {},
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      try {
        const res = await fetch("http://localhost:3000/auth/verificarLogin");
        const data = await res.json();

        if (data.isAuthenticated) {
          setUser(data.user);

          const rolRes = await fetch("http://localhost:3000/auth/rol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uuid_guardia: data.user.id }),
          });

          const rolData = await rolRes.json();
          setRole(rolData[0]?.id_rol);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Error autenticando:", err);
      } finally {
        setIsLoading(false);
      }
    }

    verificarSesion();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isLoading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
