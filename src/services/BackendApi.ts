// API service layer for backend communication
// Endpoints:
// - generateTicket: Creates new tickets
// - getTicketInfo: Retrieves ticket details
// - updateTicketCount: Updates usage count
// - getHistory: Fetches ticket history
// Base URL: https://ticket.rounak.site

const BASE_URL = 'https://ticket.rounak.site';

interface GenerateTicketRequest {
  base64Image: string;
  gameId: string;
  name: string;
  price: number;
}

interface GenerateTicketResponse {
  downloadUrl: string;
}

interface TicketInfo {
  ticketId: string;
  name: string;
  game_name: string;
  max_use: number;
  current_use: number;
  isMaxed: boolean;
  create_time: string;
  paid: number;
  user_base64: string;
}

export const BackendApi = {
  generateTicket: async (data: GenerateTicketRequest): Promise<GenerateTicketResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Image: data.base64Image,
          gameId: data.gameId,
          name: data.name,
          price: data.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ticket');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating ticket:', error);
      throw error;
    }
  },

  getTicketInfo: async (ticketId: string): Promise<TicketInfo> => {
    try {
      const response = await fetch(`${BASE_URL}/api/info/${ticketId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch ticket info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket info:', error);
      throw error;
    }
  },

  updateTicketCount: async (ticketId: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/updateCount/${ticketId}`);

      if (!response.ok) {
        throw new Error('Failed to update ticket count');
      }
    } catch (error) {
      console.error('Error updating ticket count:', error);
      throw error;
    }
  },

  getHistory: async (): Promise<{ count: number, tickets: TicketInfo[] }> => {
    try {
      const response = await fetch(`${BASE_URL}/api/history`);

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  }
}; 