import api from './api';

export interface Message {
  id: number;
  conversation: number;
  sender: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  content: string;
  file?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  created_at: string;
  is_read: boolean;
  read_at: string | null;
}

export interface Conversation {
  id: number;
  participants: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  }[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_message: Message | null;
  unread_count: number;
}

export interface Notification {
  id: number;
  recipient: number;
  type: 'message' | 'file' | 'hiring' | 'system';
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  read_at: string | null;
  related_conversation?: number;
  related_message?: number;
  extra_data?: {
    file_name?: string;
    [key: string]: any;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const chatApi = {
  // Get all conversations
  getConversations() {
    return api.get<Conversation[]>('/chat/conversations/').then(res => res.data);
  },

  // Get single conversation
  getConversation(id: number) {
    return api.get<Conversation>(`/chat/conversations/${id}/`).then(res => res.data);
  },

  // Create new conversation
  createConversation(participantId: number) {
    return api.post<Conversation>('/chat/conversations/', {
      participant_id: participantId
    }).then(res => res.data);
  },

  // Get messages for a conversation
  getMessages(conversationId: number) {
    return api.get<Message[]>(`/chat/conversations/${conversationId}/messages/`).then(res => res.data);
  },

  // Send a message with optional file
  sendMessage(conversationId: number, content: string, file?: File) {
    const formData = new FormData();
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    return api.post<Message>(
      `/chat/conversations/${conversationId}/send_message/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ).then(res => res.data);
  },

  // Download a file
  downloadFile: async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'download';
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation(id: number) {
    return api.delete(`/chat/conversations/${id}/`);
  },

  // Mark conversation as read
  markAsRead(conversationId: number) {
    return api.post(`/chat/conversations/${conversationId}/read/`).then(res => res.data);
  },

  // Get notifications
  getNotifications() {
    return api.get<Notification[]>('/chat/notifications/').then(res => res.data);
  },

  // Mark notification as read
  markNotificationAsRead(notificationId: number) {
    return api.post<Notification>(`/chat/notifications/${notificationId}/mark_as_read/`).then(res => res.data);
  },

  // Mark all notifications as read
  markAllNotificationsAsRead() {
    return api.post('/chat/notifications/mark_all_as_read/').then(res => res.data);
  },

  // Get available users for chat
  getAvailableUsers() {
    return api.get<User[]>('/chat/conversations/available_users/').then(res => res.data);
  },
};
