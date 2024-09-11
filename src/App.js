import React, { useEffect, useState } from "react";
import "./App.css";

// Define card colors
const baseCardColors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
];

// Generate cards with random colors
const generateCards = () => {
  const cardColors = [...baseCardColors, ...baseCardColors]
    .sort(() => Math.random() - 0.5);
  return cardColors.map((color, index) => ({
    id: index,
    color,
    matched: false
  }));
};

// Get a random color different from the current color
const getRandomColor = (currentColor) => {
  let newColor;
  do {
    newColor = baseCardColors[Math.floor(Math.random() * baseCardColors.length)];
  } while (newColor === currentColor);
  return newColor;
};

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [score, setScore] = useState(0);
  const [chances, setChances] = useState(5);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Shuffle cards on component mount and reset
  useEffect(() => {
    setCards(generateCards());
  }, []);

  // Handle card choice
  const handleChoice = (card) => {
    if (choiceOne && choiceOne.id === card.id) return; // Prevent selecting the same card
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare two selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.color === choiceTwo.color) {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.color === choiceOne.color) {
              return { ...card, matched: true, color: getRandomColor(card.color) }; // Change color after match
            } else {
              return card;
            }
          })
        );
        setScore((prevScore) => prevScore + 1); // Increase score by 1
        resetTurn();
      } else {
        setChances((prevChances) => prevChances - 1); // Decrease chances by 1
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Automatically start a new game when the score reaches 6
  useEffect(() => {
    if (score === 6) {
      alert("Congratulations! You've reached a score of 6. Starting a new game.");
      setCards(generateCards());
      setTurns(0);
      setScore(0);
      setChances(5); // Reset chances to 5
    }
  }, [score]);

  // Reset choices and increase turn count
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // End the game if chances reach 0
  useEffect(() => {
    if (chances === 0) {
      alert(`Game Over! Your score is ${score}. Try again.`);
      setCards(generateCards()); // Reset the game
      setTurns(0);
      setScore(0);
      setChances(10); // Reset chances to 5
    }
  }, [chances, score]);

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      <button onClick={() => setCards(generateCards())}>New Game</button>
      <div className="stats">
        <p>Turns: {turns}</p>
        <p>Score: {score}</p>
        <p>Chances Left: {chances}</p>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function SingleCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled && !flipped) {
      handleChoice(card);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        {/* Card front */}
        <div
          className="card-front"
          style={{ backgroundColor: flipped ? card.color : "black" }} // Show color only if flipped
        />
        {/* Card back */}
        <div className="card-back" />
      </div>
    </div>
  );
}

export default App;
