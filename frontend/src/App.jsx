import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Creators from './pages/Creators';
import Blogs from './pages/Blogs';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAuth } from './context/AuthProvider';

const App = () => {

  // Determine if the Navbar and Footer should be hidden based on the current route
  // We don't want to display the Navbar and Footer on certain pages like Dashboard, Login, and Register
  // This can be extended to include more routes as needed
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(location.pathname);

  const {blogs} = useAuth();
  console.log(blogs);

  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/creators' element={<Creators />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
     {!hideNavbarFooter && <Footer />}
    </div>

  );
};

export default App;
