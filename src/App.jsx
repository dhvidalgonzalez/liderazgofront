// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CreateJustification from "./components/user/justification";
import MyJustifications from "./components/user/myJustifications";
import Home from "./components/user/home";
import Login from "./components/user/login";

// Recuperación (pública)
import ChangePassword from "./components/user/changePassword"; // solicitar código


import AdminJustifications from "./components/admin/justifications";

import { UserProvider } from "src/components/context/UserContext";
import ProtectedRoute from "src/components/auth/ProtectedRoute";
import EmployeeProfile from "./components/user/employeeProfile";
import ConfirmChangePassword from "./components/user/confirmChangePassword";

const basename = import.meta.env.VITE_BASENAME || "/";

const router = createBrowserRouter(
  [
    // ======= Públicas =======
    { path: "/login", element: <Login /> },

    // Recuperación de clave
    { path: "/changePassword", element: <ChangePassword /> },                  // solicita correo con código
    { path: "/changePassword/confirm", element: <ConfirmChangePassword /> },   // ⬅️ ruta corregida


    // ======= Protegidas =======
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/createJustification",
      element: (
        <ProtectedRoute>
          <CreateJustification />
        </ProtectedRoute>
      ),
    },
    {
      path: "/myJustifications",
      element: (
        <ProtectedRoute>
          <MyJustifications />
        </ProtectedRoute>
      ),
    },
    {
      path: "/adminJustifications",
      element: (
        <ProtectedRoute>
          <AdminJustifications />
        </ProtectedRoute>
      ),
    },
    {
      path: "/employeeProfiles",
      element: (
        <ProtectedRoute>
          <EmployeeProfile />
        </ProtectedRoute>
      ),
    },

    // Raíz -> home (protegida)
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },

    // (opcional) catch-all: manda a login si la ruta no existe
    // { path: "*", element: <Login /> },
  ],
  { basename }
);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
