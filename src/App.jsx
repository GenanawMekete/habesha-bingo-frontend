import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { handleTelegramDeepLink } from './utils/deepLinks';

function AppRouter() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for deep links
    const gameId = handleTelegramDeepLink();
    if (gameId) {
      navigate(`/game/${gameId}`);
    }
  }, [navigate]);
  
  return (
    <Routes>
      {/* Your routes */}
    </Routes>
  );
}
