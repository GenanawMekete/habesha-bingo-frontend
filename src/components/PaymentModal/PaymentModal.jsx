import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CreditCard, Coins, Zap, Sparkles, Shield, 
  Check, Lock, Gift, TrendingUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import './PaymentModal.scss';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      coins: 100,
      price: 4.99,
      bonus: 0,
      popular: false,
      features: ['100 basic coins', 'Instant delivery']
    },
    {
      id: 'regular',
      name: 'Regular Pack',
      coins: 250,
      price: 9.99,
      bonus: 25,
      popular: true,
      features: ['250 coins + 25 bonus', 'Best value', 'Instant delivery']
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      coins: 500,
      price: 17.99,
      bonus: 75,
      popular: false,
      features: ['500 coins + 75 bonus', 'Perfect for pros', 'Priority support']
    },
    {
      id: 'mega',
      name: 'Mega Pack',
      coins: 1000,
      price: 29.99,
      bonus: 200,
      popular: false,
      features: ['1000 coins + 200 bonus', 'Best discount', 'VIP status']
    }
  ];
  
  const paymentMethods = [
    { id: 'stripe', name: 'Credit Card', icon: CreditCard },
    { id: 'telegram', name: 'Telegram Stars', icon: Zap },
    { id: 'crypto', name: 'Cryptocurrency', icon: Coins }
  ];
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package!');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        `Successfully purchased ${selectedPackage.coins + selectedPackage.bonus} coins!`,
        {
          duration: 5000,
          icon: '🎉',
          style: {
            background: '#10b981',
            color: 'white',
          },
        }
      );
      
      onSuccess?.(selectedPackage.coins + selectedPackage.bonus);
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="payment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="payment-modal"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div className="header-left">
                <Coins size={28} className="coins-icon" />
                <h2>Buy Coins</h2>
              </div>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            {/* Packages */}
            <div className="packages-section">
              <h3>Choose Your Package</h3>
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${
                      pkg.popular ? 'popular' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {pkg.popular && (
                      <div className="popular-badge">
                        <TrendingUp size={14} />
                        Most Popular
                      </div>
                    )}
                    
                    <div className="package-header">
                      <h4>{pkg.name}</h4>
                      {pkg.bonus > 0 && (
                        <div className="bonus-badge">
                          +{pkg.bonus} bonus
                        </div>
                      )}
                    </div>
                    
                    <div className="package-content">
                      <div className="coins-display">
                        <Sparkles className="sparkle-icon" />
                        <span className="coins-amount">{pkg.coins + pkg.bonus}</span>
                        <span className="coins-label">coins</span>
                      </div>
                      
                      <div className="price">
                        <span className="currency">$</span>
                        <span className="amount">{pkg.price}</span>
                        <span className="period">one-time</span>
                      </div>
                      
                      <div className="value">
                        ${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(4)} per coin
                      </div>
                      
                      <ul className="features">
                        {pkg.features.map((feature, index) => (
                          <li key={index}>
                            <Check size={14} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="select-btn">
                      {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="payment-methods">
              <h3>Payment Method</h3>
              <div className="methods-grid">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <method.icon size={24} />
                    <span>{method.name}</span>
                    {paymentMethod === method.id && (
                      <div className="checkmark">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Security Note */}
            <div className="security-note">
              <Shield size={20} />
              <p>Your payment is secure and encrypted. We never store your card details.</p>
            </div>
            
            {/* Actions */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              
              <motion.button
                className="purchase-btn"
                onClick={handlePurchase}
                disabled={!selectedPackage || isProcessing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Buy Now - ${selectedPackage?.price || '0.00'}
                  </>
                )}
              </motion.button>
            </div>
            
            {/* Special Offer */}
            <div className="special-offer">
              <Gift size={18} />
              <p>
                <strong>Limited Time:</strong> Get 10% extra coins on your first purchase!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
