import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';

interface PropertyMapSelectorProps {
  properties?: Property[]; // all properties to show
  onLocationSelect: (lat: number, lng: number) => void; // for adding new property
  onViewDetails: (property: Property) => void; // open detail modal
  initialPosition?: { lat: number; lng: number };
}

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const PropertyMapSelector: React.FC<PropertyMapSelectorProps> = ({
  properties = [],
  onLocationSelect,
  onViewDetails,
  initialPosition,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(initialPosition || null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const center: [number, number] = initialPosition
    ? [initialPosition.lat, initialPosition.lng]
    : [20.5937, 78.9629]; // default to India

  // ✅ Backend base URL for images
  const BACKEND_URL = "http://localhost:5000";

  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationSelect={handleLocationSelect} />

        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={customIcon}
          />
        )}

        {/* ✅ Render markers for all properties */}
        {properties.map((property) => {
          // Fix for backend image URL
          const imageUrl =
            property.images?.[0]?.startsWith("/uploads/")
              ? `${BACKEND_URL}${property.images[0]}`
              : property.images?.[0] || "/placeholder.png";

          return (
            <Marker
              key={property._id || property.id}
              position={[
                property.location?.lat || 0,
                property.location?.lng || 0,
              ]}
              icon={customIcon}
            >
              <Popup className="max-w-xs">
                <div className="flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="w-48 h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-gray-800">{property.title}</h3>
                  <p className="text-gray-600 font-medium mb-2">
                    ₹{property.price?.toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => onViewDetails(property)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
