import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Filter } from "./pages/Filter/Search-Filter";
import Register  from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { UserProvider } from "./context/UserContext";
import Home  from "./pages/Home/Home";
import Navbar  from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Filter />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
        <Footer/>
      </Router>
    </UserProvider>
  );
}

export default App;
