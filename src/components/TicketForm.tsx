import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Webcam from 'react-webcam';
import { BackendApi } from '../services/BackendApi';
import { Game } from '../types';

interface TicketFormProps {
  game: Game;
  onBack: () => void;
}

interface FormData {
  name: string;
  base64Image: string;
  price: number;
}

const TicketForm: React.FC<TicketFormProps> = ({ game, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    base64Image: '',
    price: game.price,
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFormData(prev => ({
        ...prev,
        base64Image: imageSrc
      }));
      setShowCamera(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.base64Image) {
      setError('Please capture a photo');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await BackendApi.generateTicket({
        base64Image: formData.base64Image,
        gameId: game.id.toString(),
        name: formData.name,
        price: formData.price
      });

      setDownloadUrl(response.downloadUrl);
    } catch (err) {
      setError('Failed to generate ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form">
      {!downloadUrl ? (
        <>
          <h2>Book Ticket for {game.title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group name-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  price: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                min="0"
                required
              />
            </div>
            <div className="form-group photo-field">
              <label>Photo</label>
              {showCamera ? (
                <div className="camera-container">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                    videoConstraints={{
                      facingMode,
                      width: 1280,
                      height: 720
                    }}
                  />
                  <div className="camera-controls">
                    <button 
                      type="button" 
                      onClick={toggleCamera}
                      className="switch-camera-button"
                    >
                      Switch Camera
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCapture}
                      className="capture-button"
                    >
                      Capture Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="photo-preview">
                  {formData.base64Image ? (
                    <>
                      <img 
                        src={formData.base64Image} 
                        alt="Captured" 
                        className="preview-image" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCamera(true)}
                        className="retake-button"
                      >
                        Retake Photo
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => setShowCamera(true)}
                      className="start-camera-button"
                    >
                      Start Camera
                    </button>
                  )}
                </div>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="button-group">
              <button type="button" onClick={onBack} className="back-button">
                Back
              </button>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Generating...' : 'Generate Ticket'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="qr-code-container">
          <h2>Your Ticket is Ready!</h2>
          <div className="qr-code">
            <QRCodeSVG value={downloadUrl} size={256} />
          </div>
          <p className="instructions">
            Scan this QR code to download your ticket
          </p>
          <button onClick={onBack} className="back-button">
            Book Another Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketForm;

