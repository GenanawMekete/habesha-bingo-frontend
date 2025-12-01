import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

const useGameStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      balance: 100,
      selectedCards: [],
      currentGame: null,
      games: [],
      cart: [],
      isLoading: false,
      error: null,
      
      // Actions
      initializeGame: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await api.get('/auth/profile');
            set({ user: response.data, isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to initialize game', isLoading: false });
        }
      },
      
      selectCard: (card) => {
        const { selectedCards, cart } = get();
        
        // Check if card already selected
        if (selectedCards.some(c => c.id === card.id)) {
          toast.error('Card already selected!');
          return;
        }
        
        // Max 20 cards
        if (selectedCards.length >= 20) {
          toast.error('Maximum 20 cards allowed!');
          return;
        }
        
        const newSelected = [...selectedCards, card];
        const price = calculatePrice(newSelected.length);
        
        set({
          selectedCards: newSelected,
          cart: [...cart, { ...card, price }]
        });
        
        toast.success('Card added!', {
          icon: '🎯',
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
      },
      
      removeCard: (cardId) => {
        const { selectedCards, cart } = get();
        
        set({
          selectedCards: selectedCards.filter(c => c.id !== cardId),
          cart: cart.filter(item => item.id !== cardId)
        });
        
        toast('Card removed', { icon: '🗑️' });
      },
      
      clearSelection: () => {
        set({ selectedCards: [], cart: [] });
        toast('Selection cleared!', { icon: '🔄' });
      },
      
      purchaseCards: async (gameId) => {
        const { selectedCards, balance } = get();
        
        if (selectedCards.length === 0) {
          toast.error('No cards selected!');
          return false;
        }
        
        const price = calculatePrice(selectedCards.length);
        
        if (balance < price) {
          toast.error('Insufficient balance!');
          return false;
        }
        
        try {
          set({ isLoading: true });
          
          const response = await api.post('/games/purchase', {
            gameId,
            cardIds: selectedCards.map(c => c.id)
          });
          
          // Update balance
          const newBalance = balance - price;
          set({ 
            balance: newBalance,
            selectedCards: [],
            cart: [],
            isLoading: false 
          });
          
          toast.success(`Purchased ${selectedCards.length} cards!`, {
            duration: 5000,
            icon: '🎉',
            style: {
              background: '#8b5cf6',
              color: 'white',
            },
          });
          
          // Play success sound
          playSound('purchase');
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error('Purchase failed!');
          return false;
        }
      },
      
      quickSelect: async (count) => {
        try {
          set({ isLoading: true });
          
          const response = await api.post('/games/quick-select', {
            count,
            gameId: get().currentGame?.id
          });
          
          // Add cards to selection
          response.data.data.cards.forEach(card => {
            get().selectCard(card);
          });
          
          set({ isLoading: false });
          
          toast.success(`${count} random cards selected!`, {
            icon: '🎲',
          });
          
        } catch (error) {
          set({ isLoading: false });
          toast.error('Quick select failed!');
        }
      },
      
      updateBalance: (amount) => {
        set(state => ({ 
          balance: state.balance + amount 
        }));
      },
      
      setCurrentGame: (game) => {
        set({ currentGame: game });
      },
      
      addToGames: (game) => {
        set(state => ({
          games: [...state.games, game]
        }));
      }
    }),
    {
      name: 'bingo-game-storage',
      partialize: (state) => ({
        user: state.user,
        balance: state.balance,
        selectedCards: state.selectedCards,
        games: state.games
      })
    }
  )
);

// Helper functions
const calculatePrice = (cardCount) => {
  if (cardCount >= 10) return 75; // 25% discount
  if (cardCount >= 5) return 40;  // 20% discount
  if (cardCount >= 3) return 27;  // 10% discount
  return cardCount * 10;
};

const playSound = (soundName) => {
  // Implementation for playing sounds
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.volume = 0.3;
  audio.play().catch(console.log);
};

export default useGameStore;
