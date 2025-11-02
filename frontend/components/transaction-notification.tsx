'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2Icon, CopyIcon, XIcon, ExternalLinkIcon, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  txId: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function TransactionNotification({ 
  isOpen, 
  onClose, 
  txId, 
  message, 
  type = 'success' 
}: TransactionNotificationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🚨 TransactionNotification opened with txId:', txId);
      // Auto-close after 8 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, txId]);

  if (!isOpen) return null;

  const getThemeColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-900/90 to-teal-800/90',
          border: 'border-emerald-500/50',
          icon: 'text-emerald-400',
          accent: 'text-emerald-300',
          title: 'Transaction Submitted'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-900/90 to-rose-800/90',
          border: 'border-red-500/50',
          icon: 'text-red-400',
          accent: 'text-red-300',
          title: 'Transaction Error'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-900/80 to-amber-800/80',
          border: 'border-yellow-500/40',
          icon: 'text-yellow-300',
          accent: 'text-yellow-200',
          title: 'Warning'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-900/90 to-indigo-800/90',
          border: 'border-blue-500/50',
          icon: 'text-blue-400',
          accent: 'text-blue-300',
          title: 'Transaction'
        };
    }
  };

  const colors = getThemeColors();

  const renderIcon = () => {
    if (type === 'success') return <CheckCircle2Icon className={`w-6 h-6 ${colors.icon}`} />
    if (type === 'error') return <XCircle className={`w-6 h-6 ${colors.icon}`} />
    if (type === 'warning') return <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
    return <CheckCircle2Icon className={`w-6 h-6 ${colors.icon}`} />
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
      <div className={`max-w-md p-4 rounded-xl backdrop-blur-lg border ${colors.bg} ${colors.border} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {renderIcon()}
            <h3 className="text-white font-semibold">{colors.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Message */}
        <p className={`text-sm ${colors.accent}`}>
          {message}
        </p>
      </div>
    </div>
  );
}