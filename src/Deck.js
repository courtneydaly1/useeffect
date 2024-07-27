import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_API_URL = "https://deckofcardsapi.com/api/deck/";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [topCard, setTopCard] = useState(null);
    const [shuffling, setShuffling] = useState(false);

    useEffect(function loadingDeck() {
        async function fetch() {
            const deckData = await axios.get(`${BASE_API_URL}/new/shuffle/`);
            setDeck(deckData.data);
        }
        fetch();
    }, []);

    // Drawing Cards:
    async function drawing() {
        try {
            const res = await axios.get(`${BASE_API_URL}/${deck.deck_id}/draw/`);
            if (res.data.remaining === 0) throw new Error("The Deck is Empty!");

            const card = res.data.cards[0];

            setTopCard({
                id: card.code,
                name: card.suit + " " + card.value,
                image: card.image,
            });
        } catch (e) {
            alert(e);
        }
    }

    // Shuffle
    async function isShuffling() {
        setShuffling(true);
        try {
            await axios.get(`${BASE_API_URL}/${deck.deck_id}/shuffle/`);
            setTopCard(null); // Reset the top card when shuffling
        } catch (e) {
            alert(e);
        } finally {
            setShuffling(false);
        }
    }

    // Return draw button but disable if shuffling
    function renderBtn() {
        if (!deck) return null;

        return (
            <button
                className="DeckBtn"
                onClick={drawing}
                disabled={shuffling}>
                DRAW
            </button>
        );
    }

    // Return shuffle button (disabled if already is)
    function renderShuffleBtn() {
        if (!deck) return null;
        return (
            <button
                className="Deck-gimme"
                onClick={isShuffling}
                disabled={shuffling}>
                SHUFFLE DECK
            </button>
        );
    }

    return (
        <div>
            <h1>Card Dealer</h1>
            {renderBtn()}
            {renderShuffleBtn()}
            <div className="Deck-cards">
                {topCard && <Card key={topCard.id} name={topCard.name} image={topCard.image} />}
            </div>
        </div>
    );
}

export default Deck;

