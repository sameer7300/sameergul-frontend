import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  useGetHiringRequestQuery,
  useGetRequestMessagesQuery,
  useAddRequestMessageMutation,
  useUpdateHiringRequestMutation,
} from '../../services/hiringApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { HiringRequest } from '../../features/hiring/types';

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const requestId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Only fetch if we have a valid request ID
  const { data: request, error: requestError, isLoading: requestLoading } = useGetHiringRequestQuery(
    requestId as number,
    { skip: !requestId || isNaN(requestId) }
  );
  
  const { data: messages, error: messagesError, isLoading: messagesLoading } = useGetRequestMessagesQuery(
    requestId as number,
    { skip: !requestId || isNaN(requestId) }
  );

  const [addMessage] = useAddRequestMessageMutation();
  const [updateRequest] = useUpdateHiringRequestMutation();

  if (!requestId || isNaN(requestId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm leading-5 font-medium text-red-800">
                Invalid Request ID
              </h3>
              <div className="mt-2 text-sm leading-5 text-red-700">
                <p>
                  The request ID is invalid. Please check the URL or go back to your requests.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/hiring/requests"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
                >
                  View All Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addMessage({
        requestId: requestId as number,
        message: newMessage.trim()
      }).unwrap();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // File upload will be implemented later
  };

  const handleStatusChange = async (newStatus: HiringRequest['status']) => {
    if (!request) return;
    try {
      setIsUpdating(true);
      await updateRequest({
        id: request.id,
        status: newStatus
      }).unwrap();
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (requestLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Request Not Found</h2>
          <p className="mt-4 text-lg text-gray-500">The request you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/hiring')}
            className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {request.title}
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Status: {request.status_display || request.status.replace('_', ' ').toUpperCase()}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Priority: {request.priority_display || request.priority.toUpperCase()}
              </div>
              {request.deadline && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  Deadline: {new Date(request.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Description
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>{request.description}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Messages
            </h3>
            <div className="mt-6 space-y-6">
              {messages?.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{message.sender_name}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {message.message}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* New Message Form */}
              <form onSubmit={handleSendMessage} className="mt-6">
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
