import { FunctionComponent, useEffect, useState } from "react";
import { Card } from "../interfaces/cards/Cards";
import { getAllCards } from "../services/cardsService";
import Bcard from "./cards/Bcard";
import { errorMassage } from "../services/feedbackService";
import { Link, useSearchParams } from "react-router-dom";

interface CardsProps {
    
}
 
const Cards: FunctionComponent<CardsProps> = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isBusiness, setIsBusiness] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        // בדיקה אם המשתמש הוא עסקי
        const userData = sessionStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setIsBusiness(user.isBusiness);
        }

        // טעינת כל הכרטיסים
        getAllCards().then((res) => {
            setCards(res.data);
            setFilteredCards(res.data);
            setIsLoading(false);
        }
        ).catch((err) => {
            console.log(err);
            errorMassage("Failed to load cards");
            setIsLoading(false);
        });
    }, []);

    // סינון כרטיסים לפי ערך החיפוש
    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = cards.filter(card => 
                card.title.toLowerCase().includes(lowerCaseQuery) ||
                card.subtitle.toLowerCase().includes(lowerCaseQuery) ||
                card.description.toLowerCase().includes(lowerCaseQuery) ||
                card.address.city.toLowerCase().includes(lowerCaseQuery) ||
                card.address.street.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredCards(filtered);
        } else {
            setFilteredCards(cards);
        }
    }, [searchQuery, cards]);

    return ( 
        <>
        {isLoading ? (
           <div className="d-flex justify-content-center my-5">
             <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Loading...</span>
             </div>
           </div> 
        ) : (
        <>
        <h2 className="display-2 text-center my-4">Business Cards</h2>
        
        <div className="row">
            {filteredCards.map((card: Card) => (
            <Bcard key={card._id} card={card} />
            ))}
            
            {filteredCards.length === 0 && (
              <div className="col-12 text-center my-5">
                <p className="text-muted">No cards found matching your search.</p>
              </div>
            )}
        </div>
        
        {/* כפתור הוספת כרטיס חדש - מופיע רק למשתמשים עסקיים */}
        {isBusiness && (
            <Link 
                to="/new-card" 
                className="btn btn-success position-fixed" 
                style={{ 
                    bottom: "30px", 
                    right: "30px",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 1000
                }}
            >
                <i className="fa-solid fa-plus me-2"></i>Add Card
            </Link>
        )}
        </>
        )}
    </>
    );
}
 
export default Cards;