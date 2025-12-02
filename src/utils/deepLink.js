export const handleTelegramDeepLink = () => {
  // Check if URL has game ID
  const path = window.location.pathname;
  const gameMatch = path.match(/\/game\/(.+)/);
  
  if (gameMatch) {
    const gameId = gameMatch[1];
    localStorage.setItem('pending_game_id', gameId);
    
    // If in Telegram, auto-join game
    if (window.Telegram?.WebApp) {
      return gameId;
    }
  }
  
  return null;
};

// Generate invite link
export const generateInviteLink = (gameId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/game/${gameId}`;
};

// Share game invite
export const shareGameInvite = (gameId, gameName) => {
  const link = generateInviteLink(gameId);
  const text = `Join my BINGO game "${gameName}"! ${link}`;
  
  if (window.Telegram?.WebApp?.shareURL) {
    window.Telegram.WebApp.shareURL(link, text);
  } else if (navigator.share) {
    navigator.share({
      title: 'Join BINGO Game',
      text: text,
      url: link
    });
  } else {
    navigator.clipboard.writeText(link);
    alert('Game link copied to clipboard!');
  }
};
