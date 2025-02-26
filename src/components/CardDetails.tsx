import { FunctionComponent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../interfaces/cards/Cards";
import { getCardById, likeCard } from "../services/cardsService";
import { errorMassage, successMassage } from "../services/feedbackService";
import { decodeToken } from "../services/tokenService";
import { DecodedToken } from "../interfaces/auth/DecodedToken";
import "../styles/cardDetails/MainContentAndInformation.css";
interface CardDetailsProps {}

const CardDetails: FunctionComponent<CardDetailsProps> = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [card, setCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        if (!id) {
            navigate("/");
            return;
        }

        // בדיקת פרטי המשתמש המחובר
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = decodeToken(token) as DecodedToken;
                setUserId(decodedToken._id);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        // טעינת פרטי הכרטיס
        getCardById(id)
            .then((res) => {
                setCard(res.data);
                
                // בדיקה אם הכרטיס מסומן כמועדף
                if (token) {
                    const decodedToken = decodeToken(token) as DecodedToken;
                    setIsLiked(res.data.likes?.includes(decodedToken._id) || false);
                }
                
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                errorMassage("Failed to load card details");
                navigate("/");
            });
    }, [id, navigate]);

    const handleLike = () => {
        if (!card || !card._id) return;
        
        const token = sessionStorage.getItem("token");
        if (!token) {
            errorMassage("You must be logged in to like cards");
            return;
        }

        // עדכון מצב הלייק מראש לחוויית משתמש טובה יותר
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        likeCard(card._id)
            .then(() => {
                // במקרה של הצלחה, עדכן את מערך הלייקים של הכרטיס
                if (newLikedState) {
                    // הוספת לייק - צריך להוסיף את ה-userId למערך
                    if (!card.likes) {
                        card.likes = [];
                    }
                    if (!card.likes.includes(userId)) {
                        card.likes.push(userId);
                    }
                } else {
                    // הסרת לייק - צריך להסיר את ה-userId מהמערך
                    if (card.likes) {
                        card.likes = card.likes.filter(id => id !== userId);
                    }
                }
                
                successMassage(newLikedState ? "Added to favorites" : "Removed from favorites");
            })
            .catch((err) => {
                // במקרה של כישלון - החזר את המצב הקודם
                setIsLiked(!newLikedState);
                console.error(err);
                errorMassage("Failed to update favorite status");
            });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="alert alert-danger text-center m-5">
                Card not found
            </div>
        );
    }

    // יצירת ה-URL למפת גוגל
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBQwdQMaA4QA9wPx4y7aMm7eSV9KOoFKyE&q=${encodeURIComponent(
        `${card.address.street}, ${card.address.city}, ${card.address.country}`
    )}`;

    // יצירת URL לשיתוף
    const shareUrl = window.location.href;

    return (
        <div className="card-details-page">
            <div className="card-details-container">
                {/* חלק עליון עם תמונה וכותרות */}
                <div className="card-header-section">
                    <img 
                        src={card.image?.url || "https://via.placeholder.com/1200x400?text=No+Image+Available"} 
                        alt={card.image?.alt || card.title} 
                        className="header-bg-image" 
                    />
                    <div className="header-content">
                        <h1 className="card-title">{card.title}</h1>
                        <h2 className="card-subtitle">{card.subtitle}</h2>
                    </div>
                    {userId && (
                        <button 
                            className="card-like-button"
                            onClick={handleLike}
                            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                        >
                            <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                        </button>
                    )}
                </div>
                
                {/* חלק אמצעי עם תיאור, פרטי קשר ומפה */}
                <div className="card-main-content">
                    {/* חלק שמאלי - תיאור ופרטי קשר */}
                    <div className="card-info-section">
                        <div className="card-description">
                            {card.description}
                        </div>
                        
                        <div className="contact-info-section">
                            <h3 className="section-title">Contact Information</h3>
                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="info-content">
                                    <strong>Phone:</strong><br />
                                    <a href={`tel:${card.phone}`}>{card.phone}</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fa-solid fa-envelope"></i>
                                </div>
                                <div className="info-content">
                                    <strong>Email:</strong><br />
                                    <a href={`mailto:${card.email}`}>{card.email}</a>
                                </div>
                            </div>
                            {card.wed && (
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fa-solid fa-globe"></i>
                                    </div>
                                    <div className="info-content">
                                        <strong>Website:</strong><br />
                                        <a href={card.wed} target="_blank" rel="noopener noreferrer">{card.wed}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="business-details-section">
                            <h3 className="section-title">Business Details</h3>
                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fa-solid fa-id-card"></i>
                                </div>
                                <div className="info-content">
                                    <strong>Business Number:</strong><br />
                                    {card.bizNumber}
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <i className="fa-solid fa-calendar"></i>
                                </div>
                                <div className="info-content">
                                    <strong>Created At:</strong><br />
                                    {new Date(card.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* חלק ימני - מיקום ושיתוף */}
                    <div>
                        <div className="location-section">
                            <div className="map-container">
                                <iframe
                                    title="Business Location"
                                    src={mapUrl}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <div className="location-details">
                                <h3 className="section-title">Location</h3>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${card.address.street}, ${card.address.city}, ${card.address.country}`)}`} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="btn btn-primary mb-3">
                                    📍 פתח בגוגל מפות
                                </a>
                                <div className="address-item">
                                    <i className="fa-solid fa-map-marker-alt"></i>
                                    {card.address.street}
                                </div>
                                <div className="address-item">
                                    <i className="fa-solid fa-city"></i>
                                    {card.address.city}, {card.address.state || ''} {card.address.zip}
                                </div>
                                <div className="address-item">
                                    <i className="fa-solid fa-globe"></i>
                                    {card.address.country}
                                </div>
                            </div>
                        </div>
                        
                        <div className="share-section mt-4">
                            <h3 className="share-title">Share This Business</h3>
                            <div className="share-buttons">
                                <button 
                                    className="share-button share-facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                >
                                    <i className="fa-brands fa-facebook-f"></i>
                                </button>
                                <button 
                                    className="share-button share-twitter"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                >
                                    <i className="fa-brands fa-twitter"></i>
                                </button>
                                <button 
                                    className="share-button share-whatsapp"
                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank')}
                                >
                                    <i className="fa-brands fa-whatsapp"></i>
                                </button>
                                <button 
                                    className="share-button share-email"
                                    onClick={() => window.open(`mailto:?subject=Check out this business&body=${encodeURIComponent(shareUrl)}`, '_self')}
                                >
                                    <i className="fa-solid fa-envelope"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* כפתור חזרה */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                </button>
            </div>
        </div>
    );
};

export default CardDetails;