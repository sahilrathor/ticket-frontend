import React from 'react';
import { Game } from '../types';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: Game;
  onBuyTicket: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onBuyTicket }) => {

  const handleBuyTicket = () => {
    onBuyTicket(game);
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBuyTicket}
    >
      <img src={game.imageUrl || "/placeholder.svg"} alt={game.title} />
      <div className="game-card-content">
        <h2>{game.title}</h2>
        <p>{game.ticketType}</p>
        <p className="price">₹{game.price}</p>
        <button onClick={handleBuyTicket}>Buy Ticket</button>
      </div>
    </motion.div>
  );
};

export default GameCard;
