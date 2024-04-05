import Register from "./pages/Register";
import Login from "./pages/Login";
import "./style.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthC";
import BecomeBuddy from "./pages/BecomeBuddy";
import FindBuddy from "./pages/FindBuddy";
import ServerPopup from "./components/ServerPopup";
import Profile from "./components/Profile";
import FirstPage from "./pages/FirstPage";

function App() {
  

  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
  
    if (!currentUser) {
      // Redirect to login if there is no current user
      return <Navigate to="/login" />;
    } else {
      // Render the protected route content if there is a current user
      return children;
    }
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/becomebuddy" element={<BecomeBuddy />} />
        <Route path="/findbuddy" element={<FindBuddy />} />
        <Route path="/serverpopup" element={<ServerPopup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
