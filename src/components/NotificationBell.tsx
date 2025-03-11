import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { chatApi, Notification } from '../services/chatapi';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await chatApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await chatApi.markNotificationAsRead(notification.id);
      
      if (notification.type === 'message' && notification.related_conversation) {
        navigate(`/dashboard/messages/${notification.related_conversation}`);
      } else if (notification.type === 'hiring') {
        navigate('/dashboard/hiring');
      }
      
      handleClose();
      fetchNotifications();
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.is_read ? 'inherit' : 'action.hover',
                display: 'block',
                py: 1,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {notification.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </Typography>
            </MenuItem>
          ))
        )}
        {notifications.length > 0 && (
          <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography
              variant="body2"
              color="primary"
              align="center"
              sx={{ cursor: 'pointer' }}
              onClick={async () => {
                await chatApi.markAllNotificationsAsRead();
                fetchNotifications();
              }}
            >
              Mark all as read
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};
