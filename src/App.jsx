import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1>🎯 Habesha BINGO</h1>
        <p className="subtitle">Play BINGO on Telegram and Win Prizes!</p>
        
        <div className="features">
          <div className="feature">
            <span>🎲</span>
            <h3>Multiple Cards</h3>
            <p>Select 1-20 cards per game</p>
          </div>
          <div className="feature">
            <span>💰</span>
            <h3>Smart Discounts</h3>
            <p>Bulk discounts up to 30%</p>
          </div>
          <div className="feature">
            <span>🏆</span>
            <h3>Win Prizes</h3>
            <p>Compete with other players</p>
          </div>
        </div>
        
        <div className="cta">
          <p>Open this link in Telegram to play:</p>
          <code>https://t.me/YOUR_BOT_USERNAME</code>
        </div>
      </div>
    </div>
  )
}

export default App
