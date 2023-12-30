import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ClientSideErrorScreen from "./screens/ClientSideErrorScreen";
import Login from "./auth/Login";
import Register from "./auth/Register";
import axios from "axios";
import AuthContext from "./context/AuthContext";
import SplashScreen from "./screens/SplashScreen";
import AddForms from "./screens/AddForms";
import FormTable from "./screens/FormTable";
import Navbar from "./layout/Navbar";

axios.defaults.withCredentials = true;
const App = () => {
  const { loggedIn } = useContext(AuthContext);

 
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        {loggedIn === false && (
          <>
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="*" element={<ClientSideErrorScreen />} />
          </>
        )}
        {loggedIn === true && (
          <>
            <Route path="/userData" Component={HomeScreen} />
            <Route path="/addforms" element={<AddForms />} />
            <Route path="/formtable" element={<FormTable />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
