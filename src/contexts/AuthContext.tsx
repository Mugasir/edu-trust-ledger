import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "institution" | "organization" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const parseAppRole = (value: unknown): AppRole | null => {
  return value === "institution" || value === "organization" || value === "admin" ? value : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  const fetchRole = useCallback(async (currentUser: User) => {
    const fallbackRole = parseAppRole(currentUser.user_metadata?.role);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (error) {
      return fallbackRole;
    }

    return parseAppRole(data?.role) ?? fallbackRole;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const applySession = async (nextSession: Session | null, stopLoading = false) => {
      if (!isMounted) return;

      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        const resolvedRole = await fetchRole(nextUser);
        if (!isMounted) return;
        setRole(resolvedRole);
      } else {
        setRole(null);
      }

      if (stopLoading && isMounted) {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession, true);
    });

    void supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      void applySession(nextSession, true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return <AuthContext.Provider value={{ user, session, loading, role, signOut }}>{children}</AuthContext.Provider>;
};
