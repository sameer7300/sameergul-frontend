import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Message as IMessage } from '../../services/chatapi';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: IMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {messages.length === 0 ? (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
          <Typography>No messages yet</Typography>
        </Box>
      ) : (
        messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.sender.id === user?.id ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                backgroundColor: message.sender.id === user?.id ? 'primary.main' : 'grey.100',
                color: message.sender.id === user?.id ? 'white' : 'text.primary',
                borderRadius: 2,
                p: 1.5,
                position: 'relative',
              }}
            >
              {message.sender.id !== user?.id && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                  {`${message.sender.first_name} ${message.sender.last_name}`.trim() || message.sender.username}
                </Typography>
              )}
              <Typography variant="body1">{message.content}</Typography>
            </Box>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </Typography>
          </Box>
        ))
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
