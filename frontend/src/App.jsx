import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Blogs from "./pages/Blogs/Blogs.jsx";
import Contact from './pages/Contact/Contact.jsx';
import Feedback from "./pages/Feedback/Feedback.jsx";
import Creators from "./pages/Creators/Creators.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import MyBlogs from './dashboard/MyBlogs/MyBlogs.jsx';
import CreateBlogs from './dashboard/CreateBlogs/CreateBlogs.jsx';
import MyProfile from './dashboard/MyProfile/MyProfile.jsx';
import UpdateBlog from './dashboard/UpdateBlog/UpdateBlog.jsx';
import DeleteBlogs from './dashboard/DeleteBlogs/DeleteBlogs.jsx';
import { useAuth } from './context/AuthProvider.jsx';
import './App.css';
const App = () => {

    const location = useLocation();
    const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
        location.pathname
    ) || location.pathname.startsWith("/dashboard");

    const { blogs } = useAuth();
    console.log(blogs);

    return (
        <div>
            {!hideNavbarFooter && <Navbar />}
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/blogs" element={<Blogs />} />
                <Route exact path="/contact" element={<Contact />} />
                <Route exact path="/feedback" element={<Feedback />} />
                <Route exact path="/creators" element={<Creators />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<MyBlogs />} /> {/* Default route for dashboard */}
                    <Route path="myblogs" element={<MyBlogs />} />
                    <Route path="createblog" element={<CreateBlogs />} />
                    <Route path="myprofile" element={<MyProfile />} />
                    <Route path="updateblog/:id" element={<UpdateBlog />} />
                    <Route path="deleteblog" element={<DeleteBlogs />} />
                </Route>
            </Routes>

            {!hideNavbarFooter && <Footer />}
        </div>
    )
}

export default App
