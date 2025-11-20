import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { WatchlistPage } from './pages/WatchlistPage';

const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route
          path="*"
          element={
            <p className="empty-state">
              Page not found. Use the navigation above to get back on track.
            </p>
          }
        />
      </Routes>
    </main>
    <footer className="footer">
      <p>
        Built for movie lovers. Data provided by TMDB. This demo is for
        educational purposes only.
      </p>
    </footer>
  </div>
);

export default App;
