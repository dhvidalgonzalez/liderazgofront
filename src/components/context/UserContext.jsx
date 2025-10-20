import React, { createContext, useContext, useEffect, useState } from "react";
import meService from "src/services/login/meService";
import logoutService from "src/services/login/logout";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await meService();
      if (res.loggedIn) setUser(res.user);
      else setUser(null);
    } catch (error) {
      // 401 o backend caído => no hay sesión
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err?.message || err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchSession,
        logout,
      }}
    >
      {!loading ? children : <div>Cargando sesión...</div>}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de un UserProvider");
  return ctx;
};

export { UserContext };
