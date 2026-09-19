// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseClientConfigured } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseClientConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchUserProfile(initialSession.user.id);
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
            if (newSession?.user) {
              await fetchUserProfile(newSession.user.id);
            } else {
              setRole("user");
            }
          });

          return () => subscription?.unsubscribe();
        } catch (err) {
          console.error("Supabase auth init error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // Dev / Offline mode: check stored mock session
        const storedUser = localStorage.getItem("scamshield_mock_user");
        const storedToken = localStorage.getItem("scamshield_token");
        if (storedUser && storedToken) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setRole(parsed.role || "user");
            setSession({ access_token: storedToken });
          } catch {
            localStorage.removeItem("scamshield_mock_user");
            localStorage.removeItem("scamshield_token");
          }
        }
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  async function fetchUserProfile(userId) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, display_name, preferred_language")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setRole(data.role || "user");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }

  async function login(email, password) {
    if (isSupabaseClientConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    // Mock Login
    const isAdmin = email.toLowerCase().includes("admin");
    const mockUserData = {
      id: isAdmin ? "00000000-0000-0000-0000-000000000001" : "00000000-0000-0000-0000-000000000002",
      email,
      role: isAdmin ? "admin" : "user",
      user_metadata: { display_name: email.split("@")[0] },
    };
    const mockToken = isAdmin ? "mock-admin-token" : "mock-user-token-12345";

    localStorage.setItem("scamshield_mock_user", JSON.stringify(mockUserData));
    localStorage.setItem("scamshield_token", mockToken);

    setUser(mockUserData);
    setRole(mockUserData.role);
    setSession({ access_token: mockToken });
    return { user: mockUserData, session: { access_token: mockToken } };
  }

  async function signup(email, password, displayName = "") {
    if (isSupabaseClientConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split("@")[0] },
        },
      });
      if (error) throw error;
      return data;
    }

    // Mock Signup
    const mockUserData = {
      id: "00000000-0000-0000-0000-000000000002",
      email,
      role: "user",
      user_metadata: { display_name: displayName || email.split("@")[0] },
    };
    const mockToken = "mock-user-token-12345";

    localStorage.setItem("scamshield_mock_user", JSON.stringify(mockUserData));
    localStorage.setItem("scamshield_token", mockToken);

    setUser(mockUserData);
    setRole("user");
    setSession({ access_token: mockToken });
    return { user: mockUserData, session: { access_token: mockToken } };
  }

  async function logout() {
    if (isSupabaseClientConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("scamshield_mock_user");
    localStorage.removeItem("scamshield_token");
    setUser(null);
    setSession(null);
    setRole("user");
  }

  // Quick helper for dev switching
  function loginQuickDev(asAdmin = false) {
    if (asAdmin) {
      login("admin@scamshield.gov", "password123");
    } else {
      login("citizen@scamshield.org", "password123");
    }
  }

  const value = {
    user,
    session,
    role,
    loading,
    token: session?.access_token || localStorage.getItem("scamshield_token") || null,
    isAdmin: role === "admin",
    login,
    signup,
    logout,
    loginQuickDev,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
