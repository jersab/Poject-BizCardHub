import { FunctionComponent, useEffect, useState } from "react";
import { Card } from "../interfaces/cards/Cards";
import { getAllCards } from "../services/cardsService";
import Bcard from "./cards/Bcard";
import { errorMassage } from "../services/feedbackService";
import { decodeToken } from "../services/tokenService";
import { DecodedToken } from "../interfaces/auth/DecodedToken";

interface FavoriteCardsProps {}
 
const FavoriteCards: FunctionComponent<FavoriteCardsProps> = () => {
    const [favoriteCards, setFavoriteCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchFavorites = () => {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        // קבל את מזהה המשתמש מהטוקן
        const decodedToken = decodeToken(token) as DecodedToken;
        const userId = decodedToken._id;

        getAllCards()
            .then((res) => {
                // סנן רק את הכרטיסים שהמשתמש סימן כמועדפים
                const favorites = res.data.filter((card: Card) => 
                    card.likes && card.likes.includes(userId)
                );
                console.log("Filtered favorites:", favorites);
                setFavoriteCards(favorites);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                errorMassage("Failed to load favorite cards");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="spinner-border text-danger" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <>
                    <h2 className="display-2 text-center my-4">My Favorite Cards</h2>
                    {favoriteCards.length === 0 ? (
                        <div className="alert alert-info text-center">
                            <p>You don't have any favorite cards yet.</p>
                            <p>Click the heart icon on any card to add it to your favorites!</p>
                        </div>
                    ) : (
                        <div className="row">
                            {favoriteCards.map((card: Card) => (
                                <Bcard 
                                    key={card._id} 
                                    card={card} 
                                    onLikeChange={fetchFavorites}
                                    onDelete={fetchFavorites} // תמיכה במחיקה
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
 
export default FavoriteCards;