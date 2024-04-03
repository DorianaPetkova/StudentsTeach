import Register from "./pages/Register";
import Login from "./pages/Login";
import "./style.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthC";
import BecomeBuddy from "./pages/BecomeBuddy";
import FindBuddy from "./pages/FindBuddy";
import ServerPopup from "./components/ServerPopup";
import Profile from "./components/Profile";



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
      <Route path="becomebuddy" element={<BecomeBuddy/>}/>
      <Route path="findbuddy" element={<FindBuddy/>}/>
      <Route path="serverpopup" element={<ServerPopup/>}/>
      <Route path="profile" element={<Profile/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
     
  );
}

export default App;
