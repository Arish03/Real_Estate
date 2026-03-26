import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { Enquiry } from '../types';
import axios from 'axios';

export const Messages: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Fetch messages from backend
  useEffect(() => {
    if (!user || user.role !== 'owner') return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Map backend messages to Enquiry type if needed
        const msgs = res.data.map((msg: any) => ({
          id: msg._id,
          senderName: msg.senderName,
          senderEmail: msg.senderEmail,
          message: msg.message,
          propertyTitle: msg.propertyTitle,
          status: msg.status,
          date: msg.date,
        }));
        setEnquiries(msgs);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [user, token]);

  if (!user || user.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only property owners can view messages.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (filter === 'all') return true;
    return enquiry.status === filter;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      // Update backend
      await axios.patch(`http://localhost:5000/api/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update frontend state
      setEnquiries(
        enquiries.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, status: 'read' as const } : enquiry
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Messages & Enquiries</h1>
          <p className="text-blue-100">
            {unreadCount > 0
              ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'message' : 'messages'}`
              : 'All messages are read'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({enquiries.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read ({enquiries.length - unreadCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No messages found</p>
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    enquiry.status === 'unread' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          enquiry.status === 'unread' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <Mail
                          className={`h-5 w-5 ${
                            enquiry.status === 'unread' ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900">{enquiry.senderName}</h3>
                          {enquiry.status === 'unread' && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{enquiry.senderEmail}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          Property: {enquiry.propertyTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(enquiry.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="ml-14">
                    <p className="text-gray-700 mb-4">{enquiry.message}</p>
                    <div className="flex space-x-3">
                      {enquiry.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(enquiry.id)}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
