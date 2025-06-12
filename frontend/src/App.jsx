import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Blogs from "./pages/Blogs/Blogs.jsx";
import About from "./pages/About/About.jsx";
import Feedback from "./pages/Feedback/Feedback.jsx";
import Creators from "./pages/Creators/Creators.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import { useAuth } from './context/AuthProvider.jsx';
import './App.css';
const App = () => {

    const location = useLocation();
    const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
        location.pathname
    );

    const {blogs} = useAuth();
    console.log(blogs);

    return (
        <div>
            {!hideNavbarFooter && <Navbar />}
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/blogs" element={<Blogs />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/feedback" element={<Feedback />} />
                <Route exact path="/creators" element={<Creators />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
            </Routes>

            {!hideNavbarFooter && <Footer />}
        </div>
    )
}

export default App
