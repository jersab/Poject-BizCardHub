import { FunctionComponent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../interfaces/cards/Cards";
import { getCardById, likeCard } from "../services/cardsService";
import { errorMassage, successMassage } from "../services/feedbackService";
import { decodeToken } from "../services/tokenService";
import { DecodedToken } from "../interfaces/auth/DecodedToken";
import "../styles/CardDetails.css"; 

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

    // יצירת קישור למפת גוגל
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${card.address.street}, ${card.address.city}, ${card.address.country}`
    )}`;

    return (
        <div className="card-details-container">
            <h2 className="card-details-title">{card.title}</h2>
            
            <div className="card-details-content">
                {/* הצד השמאלי - כרטיס */}
                <div className="card-details-bcard-container">
                    <div className="card-details-bcard">
                        <img className="card-details-bcard-image" src={card.image.url} alt={card.image.alt} />
                        <div className="card-details-bcard-body">
                            <h5 className="card-details-bcard-title">{card.title}</h5>
                            <h6 className="card-details-bcard-subtitle">{card.subtitle}</h6>
                            <p className="card-details-bcard-text">{card.description}</p>
                        </div>
                        <ul className="card-details-bcard-list">
                            <li><span>Phone:</span> <span>{card.phone}</span></li>
                            <li><span>Address:</span> <span>{card.address.street}</span> <span>{card.address.city}</span></li>
                            <li><span>Card Number:</span> <span>{card.bizNumber}</span></li>
                            {card.createdAt && (
                                <li><span>Created At:</span> <span>{new Date(card.createdAt).toLocaleDateString()}</span></li>
                            )}
                        </ul>
                        <div className="card-details-bcard-footer">
                            <div className="card-details-bcard-icons">
                                <a href={`tel:${card.phone}`}>
                                    <i className="fa-solid fa-phone"></i>
                                </a>
                                {card.email && (
                                    <a href={`mailto:${card.email}`}>
                                        <i className="fa-solid fa-envelope"></i>
                                    </a>
                                )}
                                {card.wed && (
                                    <a href={card.wed} target="_blank" rel="noopener noreferrer">
                                        <i className="fa-solid fa-globe"></i>
                                    </a>
                                )}
                            </div>
                            {userId && (
                                <button 
                                    className="card-details-like-button"
                                    onClick={handleLike}
                                    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart ${isLiked ? 'heart-liked' : ''}`}></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* הצד הימני - מפה */}
                <div className="card-details-map-container">
                    <div className="card-details-map-card">
                        <div className="card-details-map-header">
                            <h3>
                                <i className="fa-solid fa-location-dot"></i>
                                Business Location
                            </h3>
                        </div>
                        <div className="card-details-map-body">
                            <div className="map-wrapper">
                                {/* מפה סטטית של Google */}
                                <img 
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                                        `${card.address.street}, ${card.address.city}, ${card.address.country}`
                                    )}&zoom=15&size=600x400&markers=color:red%7C${encodeURIComponent(
                                        `${card.address.street}, ${card.address.city}, ${card.address.country}`
                                    )}&key=AIzaSyDIJlZ5Nc-NPZ9Uy9BiXfhdUvkHsO-GJzg`} 
                                    alt="Business Location Map"
                                    className="map-image"
                                    onError={(e) => {
                                        // טיפול בשגיאת טעינת מפה
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = "https://via.placeholder.com/600x400?text=Map+not+available";
                                    }}
                                />
                                <div className="map-overlay">
                                    <a 
                                        href={googleMapsUrl} 
                                        className="map-button"
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fa-solid fa-external-link-alt"></i>
                                        Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-details-map-footer">
                            <h4>Address:</h4>
                            <address>
                                {card.address.street}<br />
                                {card.address.city}, {card.address.state ? card.address.state + ', ' : ''}
                                {card.address.zip}<br />
                                {card.address.country}
                            </address>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* כפתור חזרה במרכז למטה */}
            <div className="card-details-back-button-container">
                <button 
                    onClick={() => navigate(-1)} 
                    className="card-details-back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                </button>
            </div>
        </div>
    );
};

export default CardDetails;