import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import { decodeToken } from "../services/tokenService";
import { User } from "../interfaces/users/User";
import { NavItem } from "../interfaces/NavItem";
import { Moon, Sun, Search } from "lucide-react";
import { DecodedToken } from "../interfaces/auth/DecodedToken";
import { ThemeMode } from "../interfaces/ThemeMode";

interface HeaderProps {
    theme: ThemeMode;
    onThemeToggle: () => void;
}

const Header: FunctionComponent<HeaderProps> = ({ theme, onThemeToggle }) => {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();
    
    const navItems: NavItem[] = [
        { path: "/about", label: "About" },
        { path: "/fav-cards", label: "Fav Cards", requireAuth: true },
        { path: "/my-cards", label: "My Cards", requireBusiness: true },
        { path: "/sandbox", label: "Sandbox", requireAdmin: true },
    ];

    // בדיקת סטטוס התחברות בכל רינדור וטעינה מחדש של הדף
    useEffect(() => {
        console.log("Header useEffect running");
        
        const checkUserStatus = () => {
            const token = sessionStorage.getItem("token");
            const savedUser = sessionStorage.getItem("user");
            
            console.log("Token exists:", !!token);
            console.log("Saved user exists:", !!savedUser);
            
            if (token) {
                if (savedUser) {
                    try {
                        // נסה לפרסר את המידע השמור
                        const parsedUser = JSON.parse(savedUser);
                        console.log("Parsed user:", parsedUser);
                        setUser(parsedUser);
                    } catch (error) {
                        console.error("Error parsing user data:", error);
                        sessionStorage.removeItem("user");
                        fetchUserData(token);
                    }
                } else {
                    // אם אין מידע שמור, הבא מהשרת
                    fetchUserData(token);
                }
            } else {
                // אם אין טוקן, נקה את המשתמש
                setUser(null);
                sessionStorage.removeItem("user");
            }
        };
        
        const fetchUserData = (token: string) => {
            try {
                const decodedToken = decodeToken(token) as DecodedToken;
                console.log("Decoded token in Header:", decodedToken);
                
                getUserById(decodedToken._id)
                    .then((res) => {
                        const userData = res.data;
                        console.log("User data from server in Header:", userData);
                        sessionStorage.setItem("user", JSON.stringify(userData));
                        setUser(userData);
                    })
                    .catch((err) => {
                        console.error("Error fetching user data in Header:", err);
                        sessionStorage.removeItem("token");
                        setUser(null);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
                sessionStorage.removeItem("token");
                setUser(null);
            }
        };
        
        checkUserStatus();
        
        // בדיקת שינויים ב-sessionStorage
        const handleStorageChange = () => {
            checkUserStatus();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    // חיפוש בזמן אמת - מתעדכן עם כל שינוי בשדה החיפוש
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // עדכון ה-URL ללא טעינה מחדש של הדף
        if (window.location.pathname === '/') {
            navigate(`/?search=${encodeURIComponent(value)}`, { replace: true });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    console.log("Current user state:", user);

    return (
        <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    BCard
                </Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                {(!item.requireAuth || user) &&
                                 (!item.requireBusiness || user?.isBusiness) &&
                                 (!item.requireAdmin || user?.isAdmin) && (
                                    <Link className="nav-link" to={item.path}>
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <form className="d-flex mx-3" onSubmit={handleSearch}>
                        <div className="input-group">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search cards..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-primary" type="submit">
                                <Search size={20} />
                            </button>
                        </div>
                    </form>

                    <button
                        className="btn btn-outline-primary mx-2"
                        onClick={onThemeToggle}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="d-flex align-items-center">
                            <span className="me-3">
                                Welcome {user.name?.first} {user.name?.last}
                            </span>
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="btn btn-outline-primary me-2">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;