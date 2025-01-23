import type React from "react"
import GameCard from "./GameCard"
import type { Game } from "../types"
import { motion } from "framer-motion"

interface GameListProps {
  games: Game[]
  onBuyTicket: (game: Game) => void
}

const GameList: React.FC<GameListProps> = ({ games, onBuyTicket }) => {
  return (
    <motion.div
      className="game-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GameCard game={game} onBuyTicket={onBuyTicket} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default GameList

