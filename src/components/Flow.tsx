import React, { useState } from 'react';
import GameList from './GameList';
import TicketForm from './TicketForm';
import { Game } from '../types';
import '../App.css';

const games: Game[] = [
  { 
    id: 1, 
    title: 'Any 4', 
    ticketType: 'VIP Ticket', 
    price: 100, 
    imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/034/960/488/small/vip-icon-for-graphic-design-logo-website-social-media-mobile-app-ui-png.png' 
  },
  { 
    id: 2, 
    title: 'Ballon Game', 
    ticketType: 'Standard Ticket', 
    price: 30, 
    imageUrl: 'https://freepngimg.com/download/balloon/19-balloon-png-image.png' 
  },
  { 
    id: 3, 
    title: 'Ashphalt 9', 
    ticketType: 'Standard Ticket', 
    price: 50, 
    imageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/25570e191831175.Y3JvcCw5MjAsNzIwLDE4MCww.jpg'
  },
  { 
    id: 4, 
    title: 'Fruit Ninja', 
    ticketType: 'Standard Ticket', 
    price: 40, 
    imageUrl: 'https://play-lh.googleusercontent.com/eJ9OJnbRer1jjg5ZeNAnTXKcGd2B_NEqxCp2UsefcCABeFBaj_pNl_WKYBjup2GVGGc'
  },
  { 
    id: 6, 
    title: 'Subway Surfer', 
    ticketType: 'Standard Ticket', 
    price: 30, 
    imageUrl: 'https://play-lh.googleusercontent.com/q3fXz4jcMPIjLh2bICiRFRHHZTL3iSrA6jqynI6JNcCGnN7uA7l1-QepJjd63bm3k0Y'
  },
  { 
    id: 7, 
    title: 'Temple Run', 
    ticketType: 'Standard Ticket', 
    price: 30, 
    imageUrl: 'https://img.utdstc.com/icon/3eb/2f8/3eb2f80ae66ab0b0f5530f891648b4152acf6202fcef63f7a508de0ba4a288bc:200'
  },
  { 
    id: 8, 
    title: 'Miniclip KBC', 
    ticketType: 'Standard Ticket', 
    price: 20, 
    imageUrl: 'https://store-images.microsoft.com/image/apps.25890.9007199266391961.3ddc8319-e12b-49a6-b191-992f3eb40fa9.b8a3ef35-ca54-4dc5-8062-e5cfa040e97a?mode=scale&q=90&h=200&w=200&background=%2335176b'
  }
];

const Flow: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleBuyTicket = (game: Game) => {
    setSelectedGame(game);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Game Tickets</h1>
      </header>
      <main>
        {!selectedGame ? (
          <GameList games={games} onBuyTicket={handleBuyTicket} />
        ) : (
          <TicketForm game={selectedGame} onBack={() => setSelectedGame(null)} />
        )}
      </main>
    </div>
  );
};

export default Flow; 