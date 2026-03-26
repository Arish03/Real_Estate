import { Property } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Affordable Rental House',
    description: 'Comfortable 2-bedroom rental house perfect for families. Well-maintained property with modern amenities, spacious rooms, and a small garden.',
    price: 25000,
    location: {
      address: '321 Pine Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      lat: 19.0760,
      lng: 72.8777,
    },
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    ownerId: 'owner1',
    ownerName: 'Rajesh Kumar',
    ownerEmail: 'rajesh.kumar@example.com',
    type: 'rental-house',
    status: 'available',
  },
  {
    id: '2',
    title: 'Luxury Beachfront Villa',
    description: 'Stunning oceanfront villa with 5 bedrooms and private beach access. Features include infinity pool, home theater, and panoramic ocean views from every room.',
    price: 18500000,
    location: {
      address: '789 Beach Road',
      city: 'Goa',
      state: 'Goa',
      lat: 15.2993,
      lng: 74.1240,
    },
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    ownerId: 'owner1',
    ownerName: 'Rajesh Kumar',
    ownerEmail: 'rajesh.kumar@example.com',
    type: 'villa',
    status: 'available',
  },
];
