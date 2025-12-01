import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronLeft, ChevronRight, 
  Zap, Package, Sparkles, ShoppingCart 
} from 'lucide-react';
import useGameStore from '../../store/gameStore';
import Card from '../GameBoard/Card';
import './CardSelector.scss';

const CardSelector = () => {
  const { 
    selectedCards, 
    selectCard, 
    removeCard, 
    clearSelection,
    quickSelect,
    purchaseCards,
    balance,
    currentGame 
  } = useGameStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTheme, setFilterTheme] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const cardsPerPage = viewMode === 'grid' ? 20 : 10;
  const totalPages = Math.ceil(400 / cardsPerPage);
  
  // Mock cards data - in real app, fetch from API
  const cards = Array.from({ length: 400 }, (_, i) => ({
    id: `CARD_${i + 1}`,
    numbers: generateCardNumbers(),
    theme: ['classic', 'ocean', 'space', 'neon'][i % 4],
    pattern: ['standard', 'corners', 'cross'][i % 3],
    price: 10
  }));
  
  // Filter and search cards
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterTheme === 'all' || card.theme === filterTheme;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterTheme]);
  
  // Paginate cards
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage, cardsPerPage]);
  
  // Calculate price with discounts
  const totalPrice = useMemo(() => {
    const count = selectedCards.length;
    if (count >= 10) return 75;
    if (count >= 5) return 40;
    if (count >= 3) return 27;
    return count * 10;
  }, [selectedCards.length]);
  
  const discount = useMemo(() => {
    const count = selectedCards.length;
    if (count >= 10) return 25;
    if (count >= 5) return 20;
    if (count >= 3) return 10;
    return 0;
  }, [selectedCards.length]);
  
  const handleQuickSelect = (count) => {
    quickSelect(count);
  };
  
  const handlePurchase = async () => {
    if (!currentGame) {
      toast.error('Please join a game first!');
      return;
    }
    
    const success = await purchaseCards(currentGame.id);
    if (success) {
      // Show confetti animation
    }
  };
  
  const bundleOptions = [
    { id: 'beginner', name: 'Beginner Pack', count: 3, price: 27, discount: 10 },
    { id: 'regular', name: 'Regular Pack', count: 5, price: 40, discount: 20 },
    { id: 'pro', name: 'Pro Pack', count: 10, price: 75, discount: 25 },
    { id: 'mega', name: 'Mega Pack', count: 20, price: 140, discount: 30 }
  ];
  
  return (
    <div className="card-selector">
      {/* Header */}
      <div className="selector-header">
        <div className="header-left">
          <h2>🎯 Select Your BINGO Cards</h2>
          <p className="subtitle">Choose 1-20 cards. More cards = better chances!</p>
        </div>
        
        <div className="header-right">
          <div className="balance-display">
            <Sparkles className="icon" />
            <span className="balance">{balance}</span>
            <span className="label">coins</span>
          </div>
        </div>
      </div>
      
      {/* Selection Summary */}
      <div className="selection-summary">
        <div className="summary-item">
          <span className="label">Selected:</span>
          <span className="value highlight">{selectedCards.length} cards</span>
        </div>
        
        <div className="summary-item">
          <span className="label">Price:</span>
          <span className="value">
            {totalPrice} coins
            {discount > 0 && (
              <span className="discount-badge">-{discount}%</span>
            )}
          </span>
        </div>
        
        <div className="summary-item">
          <span className="label">Balance:</span>
          <span className={`value ${balance < totalPrice ? 'danger' : 'success'}`}>
            {balance - totalPrice} coins
          </span>
        </div>
        
        <div className="summary-actions">
          <button 
            className="btn-clear"
            onClick={clearSelection}
            disabled={selectedCards.length === 0}
          >
            <X size={16} />
            Clear All
          </button>
          
          <button 
            className="btn-purchase"
            onClick={handlePurchase}
            disabled={selectedCards.length === 0 || balance < totalPrice}
          >
            <ShoppingCart size={16} />
            Purchase ({totalPrice} coins)
          </button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>⚡ Quick Select</h3>
        <div className="action-buttons">
          {[1, 3, 5].map(count => (
            <motion.button
              key={count}
              className="quick-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickSelect(count)}
            >
              <Zap size={18} />
              {count} Card{count > 1 ? 's' : ''}
              {count > 1 && (
                <span className="discount-tag">
                  {count === 3 ? '-10%' : count === 5 ? '-20%' : ''}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Bundle Offers */}
      <div className="bundle-section">
        <h3>🎁 Bundle Deals</h3>
        <div className="bundles-grid">
          {bundleOptions.map(bundle => (
            <motion.div
              key={bundle.id}
              className="bundle-card"
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              onClick={() => quickSelect(bundle.count)}
            >
              <div className="bundle-header">
                <Package size={24} />
                <h4>{bundle.name}</h4>
                <span className="discount-badge">-{bundle.discount}%</span>
              </div>
              <div className="bundle-body">
                <p>{bundle.count} Premium Cards</p>
                <div className="price">
                  <span className="old-price">{bundle.count * 10}</span>
                  <span className="new-price">{bundle.price} coins</span>
                </div>
                <p className="savings">Save {bundle.count * 10 - bundle.price} coins</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search cards by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <select 
            value={filterTheme} 
            onChange={(e) => setFilterTheme(e.target.value)}
            className="theme-select"
          >
            <option value="all">All Themes</option>
            <option value="classic">Classic</option>
            <option value="ocean">Ocean</option>
            <option value="space">Space</option>
            <option value="neon">Neon</option>
          </select>
          
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {/* Cards Display */}
      <div className="cards-container">
        <div className={`cards-display ${viewMode}`}>
          <AnimatePresence>
            {paginatedCards.map((card, index) => {
              const isSelected = selectedCards.some(c => c.id === card.id);
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  className={`card-wrapper ${isSelected ? 'selected' : ''}`}
                  onClick={() => isSelected ? removeCard(card.id) : selectCard(card)}
                >
                  <Card 
                    numbers={card.numbers}
                    theme={card.theme}
                    isSelected={isSelected}
                    onSelect={() => selectCard(card)}
                    onDeselect={() => removeCard(card.id)}
                  />
                  
                  <div className="card-info">
                    <span className="card-id">{card.id}</span>
                    <span className="card-theme">{card.theme}</span>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      className="selected-overlay"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <div className="checkmark">✓</div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="ellipsis">...</span>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Selected Cards Preview */}
      <AnimatePresence>
        {selectedCards.length > 0 && (
          <motion.div
            className="selected-preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h3>🛒 Selected Cards ({selectedCards.length})</h3>
            <div className="preview-cards">
              {selectedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="preview-card"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <div className="preview-content">
                    <span className="preview-id">{card.id}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeCard(card.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to generate BINGO card numbers
const generateCardNumbers = () => {
  const columns = {
    B: generateColumn(1, 15, 5),
    I: generateColumn(16, 30, 5),
    N: generateColumn(31, 45, 5),
    G: generateColumn(46, 60, 5),
    O: generateColumn(61, 75, 5)
  };
  
  // Create 5x5 grid
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push([
      columns.B[i],
      columns.I[i],
      columns.N[i],
      columns.G[i],
      columns.O[i]
    ]);
  }
  
  // Center is FREE
  grid[2][2] = 'FREE';
  
  return grid;
};

const generateColumn = (min, max, count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
};

export default CardSelector;
