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

    // הוספת סקריפט Bootstrap באופן ישיר לדף
    useEffect(() => {
        // טעינת סקריפט Bootstrap עבור תפריט המבורגר
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
        script.integrity = 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz';
        script.crossOrigin = 'anonymous';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
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

    // בדיקה אם יש תמונת משתמש תקפה
    const hasValidImage = user?.image && user.image.url && user.image.url.trim().length > 0;

    // הצגת האות הראשונה של השם אם אין תמונה
    const userInitial = user?.name?.first?.charAt(0).toUpperCase() || "U";

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
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-3">
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

                    <div className="w-100 px-2 mb-3">
                        <form className="w-100" onSubmit={handleSearch}>
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
                                    <Search size={16} />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="w-100 px-2 d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={onThemeToggle}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            style={{ height: '38px', width: '38px' }}
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {user ? (
                            <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center me-2">
                                    {hasValidImage ? (
                                        <img 
                                            src={user.image.url} 
                                            alt={user.name?.first || "User"} 
                                            className="rounded-circle me-2" 
                                            style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                                            onError={(e) => {
                                                // אם תמונה נכשלת בטעינה, החלף אותה לאלמנט div עם האות הראשונה
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const div = document.createElement('div');
                                                    div.className = 'rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2';
                                                    div.style.width = '32px';
                                                    div.style.height = '32px';
                                                    div.style.fontSize = '16px';
                                                    div.textContent = userInitial;
                                                    parent.prepend(div);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div 
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                            style={{ width: '32px', height: '32px', fontSize: '16px' }}
                                        >
                                            {userInitial}
                                        </div>
                                    )}
                                    <span style={{ fontSize: '14px' }}>
                                        {user.name?.first} {user.name?.last}
                                    </span>
                                </div>

                                <div>
                                    <Link to="/edit-profile" className="btn btn-outline-primary btn-sm me-2" style={{ height: '38px' }}>
                                        <i className="fa-solid fa-user-pen me-1"></i> Profile
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={handleLogout}
                                        style={{ height: '38px' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="btn btn-outline-primary btn-sm me-2" style={{ height: '38px' }}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm" style={{ height: '38px' }}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;