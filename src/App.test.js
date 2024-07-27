

// Deck.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Deck from "./Deck";

// Mock axios to control its behavior in tests
jest.mock("axios");

describe("Deck Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders without crashing", async () => {
        axios.get.mockResolvedValueOnce({ data: { deck_id: "testdeck", shuffled: true } });
        
        render(<Deck />);

        expect(screen.getByText("Card Dealer")).toBeInTheDocument();

        // Wait for the deck to be loaded
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    test("draws a card", async () => {
        axios.get
            .mockResolvedValueOnce({ data: { deck_id: "testdeck", shuffled: true } }) // Deck load
            .mockResolvedValueOnce({ data: { cards: [{ code: "AS", suit: "SPADES", value: "ACE", image: "image_url" }], remaining: 51 } }); // Draw card

        render(<Deck />);

        // Wait for the deck to be loaded
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Draw a card
        fireEvent.click(screen.getByText("DRAW"));

        // Wait for the card to be drawn
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

        // Check if the card is displayed
        expect(screen.getByAltText("SPADES ACE")).toBeInTheDocument();
    });

    test("handles empty deck", async () => {
        axios.get
            .mockResolvedValueOnce({ data: { deck_id: "testdeck", shuffled: true } }) // Deck load
            .mockResolvedValueOnce({ data: { cards: [], remaining: 0 } }); // Draw card

        render(<Deck />);

        // Wait for the deck to be loaded
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Mock alert
        window.alert = jest.fn();

        // Draw a card
        fireEvent.click(screen.getByText("DRAW"));

        // Wait for the error to be thrown
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

        // Check if alert was called
        expect(window.alert).toHaveBeenCalledWith("The Deck is Empty!");
    });

    test("shuffles the deck", async () => {
        axios.get
            .mockResolvedValueOnce({ data: { deck_id: "testdeck", shuffled: true } }) // Deck load
            .mockResolvedValueOnce({ data: { shuffled: true } }); // Shuffle deck

        render(<Deck />);

        // Wait for the deck to be loaded
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Draw a card to set top card state
        axios.get.mockResolvedValueOnce({ data: { cards: [{ code: "AS", suit: "SPADES", value: "ACE", image: "image_url" }], remaining: 51 } });
        fireEvent.click(screen.getByText("DRAW"));
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
        expect(screen.getByAltText("SPADES ACE")).toBeInTheDocument();

        // Shuffle the deck
        fireEvent.click(screen.getByText("SHUFFLE DECK"));

        // Wait for the deck to be shuffled
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

        // Check if the top card is cleared
        expect(screen.queryByAltText("SPADES ACE")).not.toBeInTheDocument();
    });
});
