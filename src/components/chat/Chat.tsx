import * as React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { chatApi, Message as IMessage, Conversation as IConversation } from '../../services/chatapi';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = React.useState<IConversation | null>(null);

  // Fetch conversations with react-query
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'] as const,
    queryFn: () => chatApi.getConversations(),
    refetchInterval: 5000, // Poll every 5 seconds for new conversations
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversation?.id] as const,
    queryFn: () => selectedConversation ? chatApi.getMessages(selectedConversation.id) : Promise.resolve([]),
    refetchInterval: 3000, // Poll every 3 seconds for new messages
    enabled: !!selectedConversation,
  });

  // Set initial selected conversation from URL
  React.useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [conversationId, conversations]);

  const handleConversationSelect = (conversation: IConversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (content: string) => {
    if (selectedConversation && content.trim()) {
      try {
        const message = await chatApi.sendMessage(selectedConversation.id, content);
        // Optimistically update the messages list
        queryClient.setQueryData<IMessage[]>(['messages', selectedConversation.id], (old = []) => [...old, message]);
        // Invalidate queries to refetch latest data
        queryClient.invalidateQueries({
          queryKey: ['messages', selectedConversation.id]
        });
        queryClient.invalidateQueries({
          queryKey: ['conversations']
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            {conversationsLoading ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </Box>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelect={handleConversationSelect}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {messagesLoading ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </Box>
                ) : (
                  <MessageList messages={messages} />
                )}
                <MessageComposer onSend={handleSendMessage} />
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                Select a conversation to start messaging
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
