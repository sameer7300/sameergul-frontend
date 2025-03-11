import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, Avatar, Tooltip, CircularProgress, Select, MenuItem, FormControl, InputLabel, Badge } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import { chatApi, Message, Conversation } from '../../services/chatapi';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AdminMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch conversations');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/chat/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const data = await chatApi.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation) return;

    setLoading(true);
    try {
      await chatApi.sendMessage(selectedConversation.id, newMessage, selectedFile || undefined);
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchMessages(selectedConversation.id);
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const conversation = await chatApi.createConversation(parseInt(selectedUser));
      await fetchConversations();
      setSelectedConversation(conversation);
      setSelectedUser('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileUrl: string) => {
    try {
      await chatApi.downloadFile(fileUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 64px)', 
        gap: 2, 
        p: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        {/* Left sidebar - Conversations list */}
        <Paper sx={{ 
          width: { xs: '100%', sm: 300 }, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          height: { xs: '40vh', sm: 'auto' }
        }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                label="Select User"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              onClick={handleStartConversation}
              disabled={!selectedUser || loading}
            >
              Start Conversation
            </Button>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {conversations.map((conversation) => (
              <Box
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: selectedConversation?.id === conversation.id ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2">
                  {conversation.participants
                    .filter((p) => p.id !== user?.id)
                    .map((p) => p.email)
                    .join(', ')}
                </Typography>
                {conversation.last_message && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {conversation.last_message.content || (conversation.last_message.file_url ? `📎 ${conversation.last_message.file_name}` : '')}
                  </Typography>
                )}
                {conversation.unread_count > 0 && (
                  <Badge badgeContent={conversation.unread_count} color="primary" />
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Right side - Messages */}
        <Paper sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          height: { xs: '60vh', sm: 'auto' }
        }}>
          {selectedConversation ? (
            <>
              {/* Messages container */}
              <Box 
                ref={messageContainerRef} 
                sx={{ 
                  flex: 1, 
                  overflow: 'auto', 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      flexDirection: message.sender.id === user?.id ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      mb: 2,
                      alignSelf: message.sender.id === user?.id ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    <Avatar sx={{ 
                      width: { xs: 24, sm: 32 }, 
                      height: { xs: 24, sm: 32 }, 
                      mr: message.sender.id === user?.id ? 0 : 1, 
                      ml: message.sender.id === user?.id ? 1 : 0 
                    }}>
                      {message.sender.email[0].toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        maxWidth: { xs: '80%', sm: '70%' },
                        bgcolor: message.sender.id === user?.id ? 'primary.main' : 'grey.100',
                        color: message.sender.id === user?.id ? 'white' : 'text.primary',
                        borderRadius: 2,
                        p: { xs: 1, sm: 2 },
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                      {message.file_url && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" display="block">
                            {message.file_name} ({(message.file_size! / 1024).toFixed(1)} KB)
                          </Typography>
                          <Button
                            startIcon={<DownloadIcon />}
                            size="small"
                            onClick={() => handleDownloadFile(message.file_url!)}
                            sx={{ color: message.sender.id === user?.id ? 'white' : 'primary.main' }}
                          >
                            Download
                          </Button>
                        </Box>
                      )}
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Message input */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <Tooltip title="Attach file">
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    size="small"
                  >
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                />
                {selectedFile && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      alignSelf: 'center',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={(!newMessage.trim() && !selectedFile) || loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{ 
                    minWidth: { xs: 40, sm: 80 },
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  {loading ? '' : <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Send</Box>}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AdminMessages;
