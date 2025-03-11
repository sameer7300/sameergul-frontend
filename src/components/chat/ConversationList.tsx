import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Badge, Typography } from '@mui/material';
import { Conversation as IConversation } from '../../services/chatapi';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  onSelect: (conversation: IConversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelect,
}) => {
  return (
    <List sx={{ height: '100%', overflow: 'auto' }}>
      {conversations.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No conversations yet</Typography>
        </Box>
      ) : (
        conversations.map((conversation) => (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton
              selected={selectedConversation?.id === conversation.id}
              onClick={() => onSelect(conversation)}
            >
              <ListItemText
                primary={conversation.participants
                  .map((p) => `${p.first_name} ${p.last_name}`.trim() || p.username)
                  .join(', ')}
                secondary={
                  conversation.last_message
                    ? conversation.last_message.content
                    : 'No messages yet'
                }
                secondaryTypographyProps={{
                  noWrap: true,
                  sx: { color: 'text.secondary' },
                }}
              />
              {conversation.unread_count > 0 && (
                <Badge
                  badgeContent={conversation.unread_count}
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
              {conversation.last_message && (
                <Typography
                  variant="caption"
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                    addSuffix: true,
                  })}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default ConversationList;
