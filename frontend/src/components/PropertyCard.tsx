import React from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Backend URL
  const BACKEND_URL = "http://localhost:5000"; // replace with your deployed backend if hosted

  // Ensure location object always exists
  const location = property.location || { city: 'N/A', state: 'N/A', address: 'N/A' };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images?.[0] ? `${BACKEND_URL}${property.images[0]}` : '/placeholder.png'}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₹{property.price.toLocaleString('en-IN')}
        </div>
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium capitalize shadow-lg">
          {property.type === 'rental-house' ? 'Rental House' : property.type}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-blue-600" />
          <span className="text-sm">
            {location.city}, {location.state}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <Bed className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Square className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm font-medium">{property.sqft} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
