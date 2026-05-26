import { motion } from 'framer-motion';
import { Lock as LockType, getLockStatus } from '@/lib/locks';
import CountdownTimer from './CountdownTimer';
import { Lock, CheckCircle2, AlertTriangle, ArrowDownToLine, Share2 } from 'lucide-react';

const SITE_URL = 'https://stx-lock-earn.vercel.app';

function getShareText(
  lock: { goal: string; amount: number; deadline: Date; completed: boolean },
  status: string
) {
  const safeDeadline = lock.deadline ? new Date(lock.deadline) : new Date();
  const deadlineStr = safeDeadline.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (status === 'completed') {
    return `✅ I locked ${lock.amount} STX on Stack Lock and actually completed my goal!\n\n"${lock.goal}"\n\nPure discipline. No excuses. Got my STX back. 💪\n\n${SITE_URL}`;
  }

  if (status === 'expired') {
    return `😤 I locked ${lock.amount} STX on Stack Lock and didn't finish in time.\n\n"${lock.goal}"\n\nFunds locked forever. Lesson learned. Next time I won't slip.\n\n${SITE_URL}`;
  }

  return `🔐 I just locked ${lock.amount} STX on Stack Lock as motivation to "${lock.goal}" by ${deadlineStr}.\n\nIf I don't finish, I lose it ALL. No excuses. Pure accountability.\n\nHold me to it 👀\n\n${SITE_URL}`;
}

interface LockCardProps {
  lock: LockType;
  onComplete: (id: number) => void;
  onWithdraw: (id: number) => void;
}

const statusConfig: Record<
  string,
  {
    label: string;
    icon: any;
    badgeClass: string;
    cardClass: string;
  }
> = {
  active: {
    label: 'Active',
    icon: Lock,
    badgeClass: 'bg-primary/15 text-primary border-primary/30',
    cardClass: 'border-glow-active',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    badgeClass: 'bg-accent/15 text-accent border-accent/30',
    cardClass: 'border-accent/20',
  },
  expired: {
    label: 'Expired',
    icon: AlertTriangle,
    badgeClass: 'bg-destructive/15 text-destructive border-destructive/30',
    cardClass: 'border-destructive/20 glow-danger',
  },
};

const LockCard = ({ lock, onComplete, onWithdraw }: LockCardProps) => {
  const status = getLockStatus(lock) || 'active';
  const config = statusConfig[status] || statusConfig.active;
  const StatusIcon = config.icon;

  const isActive = status === 'active' && !lock.completed;
  const isCompleted = status === 'completed' && !lock.withdrawn;
  const isExpired = status === 'expired' && !lock.completed;

  const shareText = getShareText(lock, status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-card rounded-xl p-5 ${config.cardClass} transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}
          aria-label={`Status: ${config.label}`}
        >
          <StatusIcon size={12} />
          {config.label}
        </div>

        <span className="text-xs text-muted-foreground font-mono">
          #{lock.id}
        </span>
      </div>

      <h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-2">
        {lock.goal}
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-gradient-gold text-2xl font-bold">
          {lock.amount}
        </span>
        <span className="text-muted-foreground text-sm">STX</span>
      </div>

      <div className="mb-4">
        <span className="text-xs text-muted-foreground block mb-1.5">
          Time Remaining
        </span>
        <CountdownTimer deadline={lock.deadline} compact />
      </div>

      {isActive && (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(lock.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            aria-label="Mark lock as complete"
          >
            <CheckCircle2 size={16} />
            Mark Complete
          </motion.button>
        </div>
      )}

      {isCompleted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onWithdraw(lock.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-accent"
          aria-label="Withdraw STX"
        >
          <ArrowDownToLine size={16} />
          Withdraw STX
        </motion.button>
      )}

      {lock.withdrawn && (
        <div className="text-center text-sm text-muted-foreground py-2">
          ✅ STX Withdrawn
        </div>
      )}

      {isExpired && (
        <div className="text-center text-sm text-destructive py-2 font-medium">
          🔒 Funds Locked Forever
        </div>
      )}

      <motion.a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-xs font-medium"
        aria-label="Share on X"
      >
        <Share2 size={14} />
        Share on 𝕏
      </motion.a>
    </motion.div>
  );
};

export default LockCard;
