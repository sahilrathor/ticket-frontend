import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { BackendApi } from '../../services/BackendApi';
import '../../styles/Admin.css';

interface TicketInfo {
  name: string;
  game_name: string;
  max_use: number;
  current_use: number;
  isMaxed: boolean;
  create_time: string;
  paid: number;
  user_base64: string;
  ticketId: string;
}

const Admin: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TicketInfo[]>([]);
  const [totalHistory, setTotalHistory] = useState<number>(0);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanning = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          onScanError
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
      }
    };

    const stopScanning = async () => {
      if (html5QrCode?.isScanning) {
        try {
          await html5QrCode.stop();
        } catch (err) {
          console.error("Error stopping scanner:", err);
        }
      }
    };

    if (scanning) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [scanning]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const historyData = await BackendApi.getHistory();
      setHistory(historyData.tickets);
      setTotalHistory(historyData.count);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const onScanSuccess = async (ticketId: string) => {
    setScanning(false);
    setLoading(true);
    setError(null);
    
    try {
      const ticketInfo = await BackendApi.getTicketInfo(ticketId);
      setCurrentTicket({ ...ticketInfo, ticketId });
    } catch (error) {
      setError('Failed to fetch ticket information');
    } finally {
      setLoading(false);
    }
  };

  const onScanError = (error: any) => {
    console.warn('QR Scan Error:', error);
  };

  const handleUseTicket = async () => {
    if (!currentTicket) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await BackendApi.updateTicketCount(currentTicket.ticketId);
      const updatedTicket = await BackendApi.getTicketInfo(currentTicket.ticketId);
      setCurrentTicket(updatedTicket);
      fetchHistory();
    } catch (error) {
      setError('Failed to update ticket usage');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setCurrentTicket(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <Link to="/" className="back-link">← Back to Games</Link>
        <h1>Admin Dashboard</h1>
      </nav>

      <div className="admin-controls">
        <button 
          onClick={() => {
            if (currentTicket) {
              resetScan();
            } else {
              setScanning(!scanning);
            }
          }}
          className="scan-button"
        >
          {currentTicket ? 'New Scan' : scanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
      </div>

      {scanning && (
        <div className="camera-container">
          <div id="reader"></div>
        </div>
      )}

      {loading && <div className="loading">Loading ticket information...</div>}

      {currentTicket && (
        <div className="ticket-details">
          <div className="ticket-card">
            <div className="ticket-header">
              <div className="profile-image-container">
                <img 
                  src={currentTicket.user_base64}
                  alt="Ticket holder" 
                  className="profile-image"
                />
              </div>
              <h2>{currentTicket.name}</h2>
            </div>
            <div className="ticket-info">
              <div className="info-row">
                <span className="label">Game</span>
                <span className="value">{currentTicket.game_name}</span>
              </div>
              <div className="info-row">
                <span className="label">Price Paid</span>
                <span className="value">₹{currentTicket.paid}</span>
              </div>
              <div className="info-row">
                <span className="label">Uses</span>
                <span className="value">{currentTicket.current_use} / {currentTicket.max_use}</span>
              </div>
              <div className="info-row">
                <span className="label">Created</span>
                <span className="value">{new Date(currentTicket.create_time).toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="label">Status</span>
                <span className={`status-badge ${currentTicket.isMaxed ? 'used' : 'valid'}`}>
                  {currentTicket.isMaxed ? 'MAXED OUT' : 'VALID'}
                </span>
              </div>
            </div>
            <button 
              onClick={handleUseTicket}
              className="use-ticket-button"
              disabled={currentTicket.isMaxed}
            >
              {currentTicket.isMaxed ? 'Ticket Used' : 'Use Ticket'}
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="scan-history">
        <h2>Tickets history: ({totalHistory})</h2>
        <div className="history-list">
          {history.map((ticket) => (
            <div key={ticket.ticketId} className="history-item">
              <div className="history-profile">
                <img 
                  src={ticket.user_base64} 
                  alt={ticket.name}
                  className="history-image" 
                />
              </div>
              <div className="history-info">
                <h3>{ticket.name}</h3>
                <p>Game: {ticket.game_name}</p>
                <p className="history-uses">Uses: {ticket.current_use}/{ticket.max_use}</p>
                <p className="history-uses">Paid: ₹{ticket.paid}</p>
                <p className="history-uses">CreatedAt: {new Date(ticket.create_time).toLocaleString()}</p>
              </div>
              <span className={`history-status ${ticket.isMaxed ? 'used' : 'valid'}`}>
                {ticket.isMaxed ? 'MAXED' : 'VALID'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin; 