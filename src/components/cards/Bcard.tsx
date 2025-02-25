import { FunctionComponent, useState, useEffect } from "react";
import { Card } from "../../interfaces/cards/Cards";
import { likeCard } from "../../services/cardsService";
import { errorMassage, successMassage } from "../../services/feedbackService";
import { decodeToken } from "../../services/tokenService";
import { DecodedToken } from "../../interfaces/auth/DecodedToken";
import { Link } from "react-router-dom";

interface BcardProps {
    card: Card;
    onLikeChange?: () => void;
}
 
const Bcard: FunctionComponent<BcardProps> = ({ card, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");

    // בודק אם הכרטיס מסומן כמועדף
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = decodeToken(token) as DecodedToken;
                setUserId(decodedToken._id);
                setIsLiked(card.likes?.includes(decodedToken._id) || false);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [card.likes]);

    const handleLike = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            errorMassage("You must be logged in to like cards");
            return;
        }

        // עדכון מצב הלייק מראש לחוויית משתמש טובה יותר
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        likeCard(card._id as string)
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
                if (onLikeChange) onLikeChange();
            })
            .catch((err) => {
                // במקרה של כישלון - החזר את המצב הקודם
                setIsLiked(!newLikedState);
                console.error(err);
                errorMassage("Failed to update favorite status");
            });
    };

    return ( 
        <div className="card m-2" style={{width: "18rem"}}>
            <img className="card-img-top" src={card.image.url} alt={card.image.alt} />
            <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <h5 className="card-subtitle mb-2 text-muted">{card.subtitle}</h5>
                <p className="card-text text-truncate">{card.description}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item"><span>Phone:</span> <span>{card.phone}</span></li>
                <li className="list-group-item"><span>Address:</span> <span>{card.address.street}</span> <span>{card.address.city}</span></li>
                <li className="list-group-item"><span>Card Number:</span> <span>{card.bizNumber}</span></li>
            </ul>
            <div className="card-body d-flex justify-content-between">
                <div>
                    <a href={`tel: ${card.phone}`} className="card-link me-2">
                        <i className="fa-solid fa-phone"></i>
                    </a>
                    {/* כפתור מעבר לדף פרטים מלאים */}
                    <Link to={`/card-details/${card._id}`} className="card-link">
                        <i className="fa-solid fa-circle-info"></i>
                    </Link>
                </div>
                {userId && (
                    <button 
                        className="btn btn-link p-0"
                        onClick={handleLike}
                        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart ${isLiked ? 'text-danger' : ''}`}></i>
                    </button>
                )}
            </div>
        </div>
    );
}
 
export default Bcard;