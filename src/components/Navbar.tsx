import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { motion } from 'framer-motion';
import { Lock, Wallet, LogOut } from 'lucide-react';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { connected, address, connecting, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Lock' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const truncateAddress = (addr?: string) => {
    if (!addr || addr.length < 10) return 'Unknown';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Go to home">
          <img src={logo} alt="Stack Lock" className="h-10 w-auto rounded-lg" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          {connected ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border-glow text-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-muted-foreground font-mono text-xs">
                  {truncateAddress(address ?? undefined)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
                aria-label="Disconnect wallet"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Disconnect</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
              aria-label="Connect wallet"
            >
              <Wallet size={16} />
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
