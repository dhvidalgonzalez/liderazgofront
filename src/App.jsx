import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CreateJustification from "./components/user/justification";
import MyJustifications from "./components/user/myJustifications";
import Home from "./components/user/home";
import Login from "./components/user/login";

import { UserProvider } from "src/components/context/UserContext"; // 👈 importar tu contexto

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/createJustification",
    element: <CreateJustification />,
  },
  {
    path: "/myJustifications",
    element: <MyJustifications />,
  },
]);

// TODO: PONER SOLO A LAS RUTAS PROTEGIS EL CONTXTO DE USUARIO
function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
