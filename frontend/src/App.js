import { Routes, Route } from "react-router-dom";
import SignupForm from "./components/Signup";
import { LoginForm } from "./components/Login";
import "./App.css";
import HomePage from "./components/HomePage";
import AdminPanel from "./components/AdminPanel";
import TodoDashboard from "./TodoDashboard/TodoDashboard";
import Navbar from "./navbar/Navbar";
import ProfilePage from "./userprofile/UserSetting";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/todopage" element={<TodoDashboard />} />
      <Route path="/update" element={<ProfilePage />} />

       
  
      {/* // admin routes */}

      <Route path="/" element={<Navbar />}>
      <Route path="/admin" element={<AdminPanel />} />

      </Route>
      
      
    </Routes>
 
  );
}

export default App;
