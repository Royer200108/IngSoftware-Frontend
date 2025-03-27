import "./App.css";

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

function App() {
  //
  useEffect(() => {
    console.log("Me estoy ejecutando");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage token={{}} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
