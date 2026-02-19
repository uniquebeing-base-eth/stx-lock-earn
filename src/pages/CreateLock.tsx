
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Calendar, Coins, FileText } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useLocks } from '@/contexts/LocksContext';
import CountdownTimer from '@/components/CountdownTimer';

const CreateLock = () => {
  const { connected, address, connectWallet, connecting } = useWallet();
  const { addLock } = useLocks();
  const navigate = useNavigate();

  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [createdLock, setCreatedLock] = useState<{ id: number; deadline: Date } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !address) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) return;

    setSubmitting(true);

    // In production, this would call the smart contract via @stacks/connect
    // For now, simulate the lock creation
    try {
      /*
      const { request } = await import('@stacks/connect');
      const { Cl } = await import('@stacks/transactions');
      const response = await request('stx_callContract', {
        contractAddress: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
        contractName: 'stack-lock',
        functionName: 'create-lock',
        functionArgs: [
          Cl.uint(amountNum * 1000000), // Convert to microSTX
          Cl.uint(Math.floor(deadlineDate.getTime() / 1000)),
        ],
      });
      console.log('Transaction ID:', response.txId);
      */

      const lock = addLock({
        owner: address,
        goal,
        amount: amountNum,
        deadline: deadlineDate,
      });

      setCreatedLock({ id: lock.id, deadline: deadlineDate });
    } catch (err) {
      console.error('Failed to create lock:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 px-4">
        <div className="container mx-auto max-w-lg text-center py-20">
          <Lock size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8">
            You need to connect a Stacks wallet to create a lock.
          </p>
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

  if (createdLock) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 px-4">
        <div className="container mx-auto max-w-lg text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-card rounded-2xl p-8 border-glow-active"
          >
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Lock Created!</h2>
            <p className="text-muted-foreground mb-6">Your STX is now locked. Complete your goal before the deadline.</p>
            
            <div className="bg-secondary/30 rounded-xl p-4 mb-6">
              <span className="text-xs text-muted-foreground">Lock ID</span>
              <p className="text-gradient-gold text-3xl font-bold font-mono">#{createdLock.id}</p>
            </div>

            <div className="mb-6">
              <span className="text-xs text-muted-foreground block mb-2">Countdown</span>
              <div className="flex justify-center">
                <CountdownTimer deadline={createdLock.deadline} />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Go to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 px-4">
      <div className="container mx-auto max-w-lg py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Create a Lock</h1>
          <p className="text-muted-foreground mb-8">Lock STX and commit to your goal.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FileText size={16} className="text-primary" />
                Goal Description
              </label>
              <textarea
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="What will you accomplish?"
                required
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Coins size={16} className="text-accent" />
                STX Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0.000001"
                step="any"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar size={16} className="text-primary" />
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !goal || !amount || !deadline}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Lock size={20} />
              {submitting ? 'Locking STX...' : 'Lock STX'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateLock;
