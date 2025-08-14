import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useAuth } from './AuthContext';
import NotificationService from '../services/NotificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return;
    
    try {
      const fetchedNotifications = await NotificationService.getUserNotifications();
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [isAuthenticated, currentUser]);

  // Connect to WebSocket
  useEffect(() => {
    let client = null;
    
    const connectWebSocket = () => {
      if (!isAuthenticated || !currentUser) return;
      
      const socket = new SockJS('/api/ws');
      const stomp = Stomp.over(socket);
      
      stomp.connect(
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        () => {
          console.log('WebSocket connected');
          
          // Subscribe to user-specific notification channel
          stomp.subscribe(`/user/${currentUser.id}/notifications`, (message) => {
            const notification = JSON.parse(message.body);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prevCount => prevCount + 1);
          });
          
          // Subscribe to service request updates
          if (currentUser.roles.includes('ROLE_PROVIDER')) {
            stomp.subscribe('/topic/service-requests', (message) => {
              const data = JSON.parse(message.body);
              // Handle service provider specific messages
              console.log('Service request update:', data);
            });
          }
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          // Attempt to reconnect after delay
          setTimeout(connectWebSocket, 5000);
        }
      );
      
      setStompClient(stomp);
      return stomp;
    };
    
    if (isAuthenticated && currentUser) {
      client = connectWebSocket();
      fetchNotifications();
    }
    
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [isAuthenticated, currentUser, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      
      setNotifications(updatedNotifications);
      
      const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};