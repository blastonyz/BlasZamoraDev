import localFont from 'next/font/local';

// Load Orbitron font
export const orbitron = localFont({
  src: '../../public/fonts/Orbitron-Black.ttf',
  variable: '--font-orbitron',
  display: 'swap',
});

// Color palette
export const colors = {
  cyan: '#11E7E7',
  mint: '#4AFFCC',
  green: '#00FF9D',
};

// Box shadows with green base
export const shadows = {
  sm: `0 0 4px ${colors.green}66`,
  md: `0 0 8px ${colors.green}66`,
  lg: `0 0 12px ${colors.green}66`,
  xl: `0 0 16px ${colors.green}66`,
  glow: `0 0 50px ${colors.green}33`,
};

// Gradient with specified percentages
export const gradientStyle = `linear-gradient(90deg, ${colors.cyan} 10%, ${colors.mint} 40%, ${colors.green} 70%)`;
