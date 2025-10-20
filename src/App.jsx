import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CreateJustification from "./components/user/justification";
import MyJustifications from "./components/user/myJustifications";
import Home from "./components/user/home";
import Login from "./components/user/login";
import ChangePassword from "./components/user/changePassword";
import AdminJustifications from "./components/admin/justifications";

import { UserProvider } from "src/components/context/UserContext";
import ProtectedRoute from "src/components/auth/ProtectedRoute";

const basename = import.meta.env.VITE_BASENAME || "/";

const router = createBrowserRouter(
  [
    // Públicas
    { path: "/login", element: <Login /> },
    { path: "/changePassword", element: <ChangePassword /> },

    // Protegidas
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
    // Redirect raíz -> home (protegida)
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
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
