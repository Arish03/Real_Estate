import { Enquiry } from '../types';

export const mockEnquiries: Enquiry[] = [
  {
    id: '1',
    propertyId: '1',
    propertyTitle: 'Affordable Rental House',
    senderName: 'Priya Patel',
    senderEmail: 'priya.patel@example.com',
    message: 'I would like to know more about the rental terms and deposit amount. Can we schedule a call?',
    date: '2025-10-08',
    status: 'unread',
  },
  {
    id: '2',
    propertyId: '2',
    propertyTitle: 'Luxury Beachfront Villa',
    senderName: 'Amit Kumar',
    senderEmail: 'amit.kumar@example.com',
    message: 'Beautiful villa! Is the property still available? I am ready to make an offer.',
    date: '2025-10-07',
    status: 'read',
  },
];
