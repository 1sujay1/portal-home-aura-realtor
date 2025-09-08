'use client';

export default function LoadingSpinner({ size = 'md', color = 'primary', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)]',
    white: 'border-white/30 border-t-white',
    dark: 'border-gray-300 border-t-gray-700'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
}
