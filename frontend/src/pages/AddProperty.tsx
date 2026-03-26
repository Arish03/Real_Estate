import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Bed, Bath, Square, Image as ImageIcon, X, Upload } from 'lucide-react';
import { PropertyMapSelector } from '../components/PropertyMapSelector';
import API_BASE_URL from '../config/api'; // Make sure this exports your backend URL

export const AddProperty: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    type: 'apartment',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setSelectedImages([...selectedImages, ...newImages]);

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'owner') {
      alert('Only property owners can add new properties.');
      return;
    }

    if (!mapPosition) {
      alert('Please select a property location on the map.');
      return;
    }

    try {
      setSubmitted(true);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('squareFeet', formData.sqft);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      // Fixed location sending: send as flat fields for backend to read properly
      data.append('lat', mapPosition.lat.toString());
      data.append('lng', mapPosition.lng.toString());
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);

      selectedImages.forEach((file) => {
        data.append('images', file);
      });

      const res = await fetch(`${API_BASE_URL}/properties/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to upload property');

      alert('✅ Property added successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Add Property Error:', error);
      alert('Error: ' + error.message);
      setSubmitted(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only property owners can add new properties.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Add New Property</h1>
          <p className="text-blue-100">List your property and reach potential buyers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Basic Info */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Property Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Modern Downtown Apartment"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Property Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="apartment">Day Booking</option>
                <option value="house">Sale</option>
                <option value="villa">Villa Stay</option>
                <option value="office">Office</option>
                <option value="Rental">Rental</option>
                

              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Describe your property in detail..."
                rows={4}
                required
              />
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
              <input
                type="number"
                placeholder="Square Feet"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
              <input
                type="number"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
              <input
                type="number"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
              <input
                type="text"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            {/* Map Selector */}
            <div>
              <button
                type="button"
                onClick={() => setShowMapSelector(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
              >
                {mapPosition ? 'Change Property Location' : 'Select Property Location on Map'}
              </button>
              {mapPosition && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Location selected: {mapPosition.lat.toFixed(4)}, {mapPosition.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" /> Property Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4" /> Upload Images
                </label>
                <p className="text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </div>

              {/* Image Preview */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt={`Preview ${i}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitted}
                className={`px-8 py-3 rounded-lg font-semibold text-white ${submitted ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitted ? 'Submitting...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showMapSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Select Property Location</h3>
              <button
                onClick={() => setShowMapSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <p className="text-gray-600 text-center mb-4">
                Click anywhere on the map to place a pin at your property location
              </p>
              <div className="h-full">
                <PropertyMapSelector
                  onLocationSelect={(lat, lng) => setMapPosition({ lat, lng })}
                  initialPosition={mapPosition || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
