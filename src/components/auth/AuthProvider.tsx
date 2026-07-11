import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  username: string;
  // TMDB's API never returns an account's email address — this is always
  // "". Kept on the type so existing code that reads it doesn't break, but
  // display code should prefer `username`.
  email: string;
  name: string | null;
  avatar: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  // First argument accepts a TMDB username OR email — TMDB's login accepts
  // either in the same field.
  signIn: (usernameOrEmail: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
  signIn: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function initialize() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        if (!res.ok) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setUser(data.user ?? null);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    initialize();
    return () => {
      isMounted = false;
    };
  }, []);

  async function refresh() {
    const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
    if (!res.ok) {
      setUser(null);
      return;
    }
    const data = await res.json();
    setUser(data.user ?? null);
  }

  async function signIn(usernameOrEmail: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: usernameOrEmail, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Sign in failed");
      }

      const data = await res.json();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}