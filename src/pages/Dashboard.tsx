
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, AlertTriangle, Inbox } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useLocks } from '@/contexts/LocksContext';
import { getLockStatus } from '@/lib/locks';
import LockCard from '@/components/LockCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { connected, address, connectWallet, connecting } = useWallet();
  const { locks, completeLock, withdrawLock } = useLocks();

  const userLocks = useMemo(() =>
    locks.filter(l => l.owner === address),
    [locks, address]
  );

  const active = useMemo(() => userLocks.filter(l => getLockStatus(l) === 'active'), [userLocks]);
  const completed = useMemo(() => userLocks.filter(l => getLockStatus(l) === 'completed'), [userLocks]);
  const expired = useMemo(() => userLocks.filter(l => getLockStatus(l) === 'expired'), [userLocks]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 px-4">
        <div className="container mx-auto max-w-lg text-center py-20">
          <Lock size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8">Connect to view your locks.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            disabled={connecting}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    );
  }

  if (userLocks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 px-4">
        <div className="container mx-auto max-w-lg text-center py-20">
          <Inbox size={48} className="mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Locks Yet</h2>
          <p className="text-muted-foreground mb-8">Create your first lock and start holding yourself accountable.</p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary"
            >
              Create Your First Lock
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { title: 'Active Locks', icon: Lock, locks: active, color: 'text-primary' },
    { title: 'Completed', icon: CheckCircle2, locks: completed, color: 'text-accent' },
    { title: 'Expired', icon: AlertTriangle, locks: expired, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 px-4 pb-16">
      <div className="container mx-auto max-w-5xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">{userLocks.length} total lock{userLocks.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-primary"
            >
              <Lock size={16} />
              New Lock
            </motion.button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gradient-card rounded-xl p-4 border-glow text-center">
            <p className="text-2xl font-bold text-primary">{active.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="bg-gradient-card rounded-xl p-4 border-glow text-center">
            <p className="text-2xl font-bold text-accent">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-gradient-card rounded-xl p-4 border-glow text-center">
            <p className="text-2xl font-bold text-destructive">{expired.length}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>

        {sections.map(section => section.locks.length > 0 && (
          <div key={section.title} className="mb-10">
            <h2 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${section.color}`}>
              <section.icon size={18} />
              {section.title}
              <span className="text-sm text-muted-foreground font-normal">({section.locks.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.locks.map(lock => (
                <LockCard
                  key={lock.id}
                  lock={lock}
                  onComplete={completeLock}
                  onWithdraw={withdrawLock}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
