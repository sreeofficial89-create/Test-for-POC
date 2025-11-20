import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? 'active' : ''}`;

export const Navbar = () => (
  <header className="navbar">
    <div className="navbar__brand">
      <strong>Movie Explorer</strong>
    </div>

    <nav className="navbar__links">
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/watchlist" className={navLinkClass}>
        Watchlist
      </NavLink>
    </nav>

    <ThemeToggle />
  </header>
);
