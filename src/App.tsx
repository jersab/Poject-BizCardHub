import { useState, useEffect } from 'react';
import Header from './components/Header';
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
import { ThemeMode } from './interfaces/ThemeMode';

// Protected Route Component
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
  // בדיקה אם המשתמש מחובר
  const token = sessionStorage.getItem("token");
  
  // אם אין טוקן, חזור לדף התחברות
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // אם נדרש סטטוס עסקי או אדמין, נבדוק את המשתמש
  if (requiredBusiness || requiredAdmin) {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      return <Navigate to="/login" replace />;
    }
    
    const user = JSON.parse(userData);
    
    // אם נדרש סטטוס עסקי והמשתמש לא עסקי
    if (requiredBusiness && !user.isBusiness) {
      return <Navigate to="/" replace />;
    }
    
    // אם נדרש סטטוס אדמין והמשתמש לא אדמין
    if (requiredAdmin && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  // אם הכל תקין, נציג את הקומפוננטה
  return <>{children}</>;
};

function App() {
    const [theme, setTheme] = useState<ThemeMode>('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    // עדכון ה-body בטעינה ראשונית
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <>
            <ToastContainer />
            <div className="app-container">
                <Router>
                    <Header theme={theme} onThemeToggle={toggleTheme} />
                    <div className="container mt-4">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Cards />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/card-details/:id" element={<CardDetails />} />
                            
                            {/* Protected Routes - User */}
                            <Route path="/fav-cards" element={
                                <ProtectedRoute>
                                    <FavoriteCards />
                                </ProtectedRoute>
                            } />
                            
                            {/* Protected Routes - Business User */}
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
                            
                            {/* Fallback - 404 */}
                            <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;