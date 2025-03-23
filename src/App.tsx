import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cards from './components/Cards';
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import NewCard from './components/NewCard';
import FavoriteCards from './components/FavoriteCards';
import MyCards from './components/MyCards';
import EditCard from './components/EditCard';
import About from './components/About';
import CardDetails from './components/CardDetails';
import { ThemeMode, UserType } from './interfaces/ThemeMode';
import Sandbox from './components/Sandbox';
import EditProfile from './components/EditProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredBusiness?: boolean;
  requiredAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredBusiness = false, 
  requiredAdmin = false 
}) => {
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredBusiness || requiredAdmin) {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      return <Navigate to="/login" replace />;
    }
    
    const user = JSON.parse(userData);
    
    if (requiredBusiness && !user.isBusiness) {
      return <Navigate to="/" replace />;
    }
    
    if (requiredAdmin && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

function App() {
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [userType, setUserType] = useState<UserType>('guest');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userData = sessionStorage.getItem("user");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                if (user.isAdmin) {
                    setUserType('admin');
                } else if (user.isBusiness) {
                    setUserType('business');
                } else {
                    setUserType('user');
                }
            } catch (error) {
                console.error("Error parsing user data", error);
                setUserType('guest');
            }
        } else {
            setUserType('guest');
        }

        document.body.className = theme;
    }, [theme]);

    return (
        <>
            <ToastContainer />
            <div className="app-container d-flex flex-column min-vh-100">
                <Router>
                    <Header theme={theme} onThemeToggle={toggleTheme} />
                    <div className="container mt-4 flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Cards />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/card-details/:id" element={<CardDetails />} />
                            
                            <Route path="/fav-cards" element={
                                <ProtectedRoute>
                                    <FavoriteCards />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/my-cards" element={
                                <ProtectedRoute requiredBusiness>
                                    <MyCards />
                                </ProtectedRoute>
                            } />
                            <Route path="/new-card" element={
                                <ProtectedRoute requiredBusiness>
                                    <NewCard />
                                </ProtectedRoute>
                            } />
                            <Route path="/edit-card/:id" element={
                                <ProtectedRoute requiredBusiness>
                                    <EditCard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/sandbox" element={
                                <ProtectedRoute requiredAdmin>
                                    <Sandbox />
                                </ProtectedRoute>
                            } />

                            <Route path="/edit-profile" element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
                        </Routes>
                    </div>
                    <Footer userType={userType} />
                </Router>
            </div>
        </>
    );
}

export default App;