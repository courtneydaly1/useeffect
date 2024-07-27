import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from 'axios';

const BASE_API_URL = "https://deckofcardsapi.com/api/deck";

function Deck (){
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [shuffling, isShuffling] = useState(false);

    useEffect(function loadingDeck(){
        async function fetch(){
            const deckData = await axios.get(`${BASE_API_URL}/new/shuffle/`);
            setDeck(deckData.data);
        }
        fetch();
    }, []);
    
}


export default Deck;

