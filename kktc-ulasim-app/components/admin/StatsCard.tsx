import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'red' | 'green' | 'purple';
  href?: string;
}

const colorStyles = {
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    iconColor: 'text-white',
    border: 'border-blue-100 dark:border-blue-900/30',
    shadow: 'shadow-blue-500/10',
  },
  red: {
    iconBg: 'bg-gradient-to-br from-red-500 to-pink-600',
    iconColor: 'text-white',
    border: 'border-red-100 dark:border-red-900/30',
    shadow: 'shadow-red-500/10',
  },
  green: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    shadow: 'shadow-emerald-500/10',
  },
  purple: {
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    iconColor: 'text-white',
    border: 'border-purple-100 dark:border-purple-900/30',
    shadow: 'shadow-purple-500/10',
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  href,
}: StatsCardProps) {
  const styles = colorStyles[color];

  const content = (
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl shadow-lg ${styles.iconBg} ${styles.iconColor} ring-4 ring-white/50 dark:ring-gray-800/50`}>
          <Icon className="w-6 h-6" />
        </div>
        {href && (
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );

  const cardClasses = `group relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border ${styles.border} p-6 transition-all duration-300 hover:shadow-xl ${styles.shadow} hover:-translate-y-1`;

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${styles.iconBg.replace('bg-gradient-to-br ', '')} blur-2xl group-hover:opacity-20 transition-opacity`} />
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${styles.iconBg.replace('bg-gradient-to-br ', '')} blur-2xl`} />
      {content}
    </div>
  );
}
