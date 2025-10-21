import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import meService from "src/services/login/meService";
import logoutService from "src/services/login/logout";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===========================
  // 🧠 Recuperar sesión
  // ===========================
  const fetchSession = async () => {
    try {
      const res = await meService();
      if (res.loggedIn) setUser(res.user);
      else setUser(null);
    } catch (error) {
      console.warn("⚠️ No hay sesión activa:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // ===========================
  // 🚪 Cerrar sesión
  // ===========================
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err?.message || err);
    }
  };

  // ===========================
  // 🎯 Derivado: es administrador
  // ===========================
  const isAdmin = useMemo(() => {
    if (!user?.perfiles) return false;
    return user.perfiles.some(
      (p) => p.valor?.toLowerCase() === "administrador"
    );
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchSession,
        logout,
        isAdmin,
      }}
    >
      {!loading ? children : <div className="text-center mt-5">Cargando sesión...</div>}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de un UserProvider");
  return ctx;
};

export { UserContext };
