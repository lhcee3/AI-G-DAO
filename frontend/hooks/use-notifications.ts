'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletContext } from '@/hooks/use-wallet';
import { useClimateDAO } from '@/hooks/use-climate-dao';

export interface Notification {
  id: string;
  type: 'proposal_status' | 'voting_deadline' | 'transaction_success' | 'transaction_failed' | 'new_proposal';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  proposalId?: number;
  txId?: string;
  priority: 'low' | 'medium' | 'high';
}

export function useNotifications() {
  const { isConnected, address } = useWalletContext();
  const { getProposals } = useClimateDAO();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only latest 50
    setUnreadCount(prev => prev + 1);

    // Auto-dismiss low priority notifications after 5 seconds
    if (notification.priority === 'low') {
      setTimeout(() => {
        markAsRead(newNotification.id);
      }, 5000);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  // Remove notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notif => notif.id !== notificationId);
    });
  }, []);

  // Check for voting deadlines (every minute)
  useEffect(() => {
    if (!isConnected) return;

    const checkVotingDeadlines = async () => {
      try {
        const proposals = await getProposals();
        const now = Date.now() / 1000; // Unix timestamp
        
        proposals.forEach(proposal => {
          if (proposal.status === 'active') {
            const timeUntilDeadline = proposal.endTime - now;
            const hoursUntilDeadline = timeUntilDeadline / 3600;
            
            // Notify 24 hours before deadline
            if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 23) {
              addNotification({
                type: 'voting_deadline',
                title: 'Voting Deadline Approaching',
                message: `Proposal "${proposal.title}" voting ends in 24 hours`,
                proposalId: proposal.id,
                priority: 'medium'
              });
            }
            
            // Notify 1 hour before deadline
            if (hoursUntilDeadline <= 1 && hoursUntilDeadline > 0.5) {
              addNotification({
                type: 'voting_deadline',
                title: 'Urgent: Voting Deadline Soon',
                message: `Proposal "${proposal.title}" voting ends in 1 hour`,
                proposalId: proposal.id,
                priority: 'high'
              });
            }
          }
        });
      } catch (error) {
        console.error('Failed to check voting deadlines:', error);
      }
    };

    // Check immediately and then every minute
    checkVotingDeadlines();
    const interval = setInterval(checkVotingDeadlines, 60000);
    
    return () => clearInterval(interval);
  }, [isConnected, getProposals, addNotification]);

  // Check for proposal status changes (every 30 seconds)
  useEffect(() => {
    if (!isConnected) return;

    let lastProposalCount = 0;
    
    const checkProposalUpdates = async () => {
      try {
        const proposals = await getProposals();
        
        // Check for new proposals
        if (proposals.length > lastProposalCount && lastProposalCount > 0) {
          const newProposals = proposals.slice(0, proposals.length - lastProposalCount);
          newProposals.forEach(proposal => {
            addNotification({
              type: 'new_proposal',
              title: 'New Proposal Submitted',
              message: `"${proposal.title}" is now available for voting`,
              proposalId: proposal.id,
              priority: 'medium'
            });
          });
        }
        
        lastProposalCount = proposals.length;
        
        // Check for status changes (passed/rejected)
        proposals.forEach(proposal => {
          if (proposal.status === 'passed' || proposal.status === 'rejected') {
            // This would typically come from a webhook or blockchain event
            // For now, we'll simulate based on vote counts
            const totalVotes = proposal.voteYes + proposal.voteNo;
            if (totalVotes > 0) {
              const outcome = proposal.voteYes > proposal.voteNo ? 'passed' : 'rejected';
              
              // Only notify if we haven't already notified about this outcome
              const existingNotification = notifications.find(n => 
                n.proposalId === proposal.id && 
                n.type === 'proposal_status' &&
                n.message.includes(outcome)
              );
              
              if (!existingNotification) {
                addNotification({
                  type: 'proposal_status',
                  title: `Proposal ${outcome.charAt(0).toUpperCase() + outcome.slice(1)}`,
                  message: `Proposal "${proposal.title}" has ${outcome}`,
                  proposalId: proposal.id,
                  priority: 'medium'
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to check proposal updates:', error);
      }
    };

    const interval = setInterval(checkProposalUpdates, 30000);
    return () => clearInterval(interval);
  }, [isConnected, getProposals, addNotification, notifications]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Transaction success/failure notifications (called from other components)
  const notifyTransactionSuccess = useCallback((type: string, txId: string, details: string) => {
    addNotification({
      type: 'transaction_success',
      title: 'Transaction Successful',
      message: `${type} completed successfully: ${details}`,
      txId,
      priority: 'medium'
    });
  }, [addNotification]);

  const notifyTransactionFailure = useCallback((type: string, error: string) => {
    addNotification({
      type: 'transaction_failed',
      title: 'Transaction Failed',
      message: `${type} failed: ${error}`,
      priority: 'high'
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    notifyTransactionSuccess,
    notifyTransactionFailure
  };
}