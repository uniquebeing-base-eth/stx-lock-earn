
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Shield, Timer, Coins, Share2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import logo from '@/assets/logo.png';

const SITE_URL = 'https://stx-lock-earn.vercel.app';

const Home = () => {
  const { connected, connectWallet, connecting } = useWallet();

  const features = [
    {
      icon: Lock,
      title: 'Lock Your STX',
      desc: 'Commit funds to a smart contract as collateral for your goals.',
    },
    {
      icon: Timer,
      title: 'Set a Deadline',
      desc: 'Choose when your goal must be completed. No extensions.',
    },
    {
      icon: Coins,
      title: 'Earn It Back',
      desc: 'Complete your goal before the deadline and withdraw your STX.',
    },
    {
      icon: Shield,
      title: 'Pure Accountability',
      desc: 'Miss the deadline? Funds are locked forever. Real stakes, real discipline.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={logo}
              alt="Stack Lock"
              className="h-28 w-auto mx-auto mb-8"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Lock Your STX.{' '}
              <span className="text-gradient-primary">Complete Your Goal.</span>{' '}
              <span className="text-gradient-gold">Earn It Back.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Stack Lock is a self-accountability dApp on Stacks. Put real STX on the line, 
              complete your commitment, or lose it forever. No excuses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {connected ? (
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-primary transition-all"
                  >
                    <Lock size={20} />
                    Create Lock
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  disabled={connecting}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-primary transition-all disabled:opacity-50"
                >
                  <Lock size={20} />
                  {connecting ? 'Connecting...' : 'Connect Wallet to Start'}
                </motion.button>
              )}

              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg border border-border hover:border-primary/30 transition-all"
                >
                  View Dashboard
                </motion.button>
              </Link>
              <motion.a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('🔐 I just discovered Stack Lock — a self-accountability dApp on Stacks.\n\nLock your STX. Complete your goal. Earn it back.\n\nNo excuses. Pure discipline.\n\n' + SITE_URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm font-medium"
              >
                <Share2 size={16} />
                Share on 𝕏
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-gradient-card rounded-xl p-6 border-glow hover:border-glow-active transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-12">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <div className="flex flex-col gap-8">
            {[
              { step: '1', text: 'Connect your Leather or Xverse wallet' },
              { step: '2', text: 'Create a lock with your goal, STX amount & deadline' },
              { step: '3', text: 'Complete your goal and mark it done before the deadline' },
              { step: '4', text: 'Withdraw your STX — or lose it forever if you fail' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-5 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">{item.step}</span>
                </div>
                <p className="text-foreground text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
