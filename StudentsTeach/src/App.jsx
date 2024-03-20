import Register from "./pages/Register";
import Login from "./pages/login";
import "./style.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthC";


function App() {
  const {currentUser} =useContext(AuthContext)
  const ProtectedRoute=({children})=>
  {
    if(!currentUser)
    {
      return <Navigate to="/login"/>
    }
    return children;
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
      <Route index element={<ProtectedRoute><Home/></ProtectedRoute>} />
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
