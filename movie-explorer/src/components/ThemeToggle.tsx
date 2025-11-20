import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/**
 * Simple button that switches between dark/light themes.
 * We keep it intentionally tiny because the logic lives in ThemeContext.
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FiMoon /> : <FiSun />}
      <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
};
