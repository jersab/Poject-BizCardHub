import { FunctionComponent, useEffect, useState } from "react";
import { Card } from "../interfaces/cards/Cards";
import { getMyCards, deleteCard } from "../services/cardsService";
import { errorMassage, successMassage } from "../services/feedbackService";
import { Link, useNavigate } from "react-router-dom";

interface MyCardsProps {}

const MyCards: FunctionComponent<MyCardsProps> = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchMyCards = () => {
        setIsLoading(true);
        getMyCards()
            .then((res) => {
                setCards(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                errorMassage("Failed to load your cards");
                setIsLoading(false);
                
                if (err.response && err.response.status === 403) {
                    navigate("/");
                }
            });
    };

    useEffect(() => {
        fetchMyCards();
    }, []);

    const handleDelete = (cardId: string) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            deleteCard(cardId)
                .then(() => {
                    successMassage("Card deleted successfully");
                    setCards(cards.filter(card => card._id !== cardId));
                })
                .catch((err) => {
                    console.error(err);
                    errorMassage("Failed to delete card");
                });
        }
    };

    const handleEdit = (cardId: string) => {
        navigate(`/edit-card/${cardId}`);
    };

    return (
        <>
            <div className="container mt-4 position-relative" style={{ minHeight: "80vh" }}>
                <h1 className="display-4 mb-4">My Business Cards</h1>

                {isLoading ? (
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : cards.length === 0 ? (
                    <div className="alert alert-info">
                        <p className="mb-0">You haven't created any business cards yet.</p>
                        <p>Click the "Add Card" button to get started!</p>
                    </div>
                ) : (
                    <div className="row">
                        {cards.map(card => (
                            <div key={card._id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img className="card-img-top" src={card.image.url} alt={card.image.alt} />
                                    <div className="card-body">
                                        <h5 className="card-title">{card.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{card.subtitle}</h6>
                                        <p className="card-text">{card.description}</p>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Phone:</strong> {card.phone}</li>
                                        <li className="list-group-item"><strong>Email:</strong> {card.email}</li>
                                        <li className="list-group-item"><strong>Address:</strong> {card.address.street}, {card.address.city}</li>
                                    </ul>
                                    <div className="card-footer d-flex justify-content-between">
                                        <button 
                                            className="btn btn-sm btn-danger" 
                                            onClick={() => handleDelete(card._id as string)}
                                        >
                                            <i className="fa-solid fa-trash me-1"></i> Delete
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-primary" 
                                            onClick={() => handleEdit(card._id as string)}
                                        >
                                            <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <Link 
                    to="/new-card" 
                    className="btn btn-success position-fixed" 
                    style={{ 
                        bottom: "30px", 
                        right: "30px",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                    }}
                >
                    <i className="fa-solid fa-plus me-2"></i>Add Card
                </Link>
            </div>
        </>
    );
};

export default MyCards;