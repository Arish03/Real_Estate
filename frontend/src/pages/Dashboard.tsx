import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { Home, Mail, Plus, Trash2 } from "lucide-react";
import { BACKEND_URL } from "../config/api";
import { fetchMyProperties, deleteProperty } from "../services/propertyService";
import { getEnquiries } from "../services/messageService";

interface Property {
  property_id: string;
  name: string;
  description: string;
  price: number;
  city: string;
  state: string;
  images?: string[];
}

interface Enquiry {
  id: string;
  status: string;
  senderName: string;
  senderEmail: string;
  propertyTitle: string;
  message: string;
  date: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "owner") return;

    const token = localStorage.getItem("token");

    // Fetch only user's own properties
    fetchMyProperties()
      .then((res: Property[]) => {
        console.log("📦 Fetched user properties:", res);
        setProperties(res);
      })
      .catch((err: Error) => console.error("Failed to fetch properties:", err));

    if (token) {
      getEnquiries(token)
        .then((res: Enquiry[]) => setEnquiries(res))
        .catch((err: Error) => console.error("Failed to fetch enquiries:", err));
    }
  }, [user]);

  // ✅ DELETE HANDLER
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const result = await deleteProperty(id);
      if (result) {
        alert("Property deleted successfully!");
        setProperties((prev) => prev.filter((p) => p.property_id !== id));
      } else {
        alert("Failed to delete property. Try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting property.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only property owners can access the dashboard.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // All properties from /me endpoint are already owned by the user
  const ownedProperties = properties;
  const unreadEnquiries = enquiries.filter((e) => e.status === "unread").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-blue-100">Welcome back, {user.fullName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{ownedProperties.length}</h3>
            <p className="text-gray-600">Properties Listed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{enquiries.length}</h3>
            <p className="text-gray-600">Total Enquiries</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{unreadEnquiries}</h3>
            <p className="text-gray-600">Unread Messages</p>
          </div>
        </div>

        {/* My Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
              <button
                onClick={() => navigate("/add-property")}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>

            <div className="p-6">
              {ownedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No properties listed yet</p>
                  <button
                    onClick={() => navigate("/add-property")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Your First Property
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownedProperties.map((property) => (
                    <div
                      key={property.property_id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={
                            property.images?.[0]
                              ? `${BACKEND_URL}${property.images[0]}`
                              : "/placeholder.png"
                          }
                          alt={property.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{property.name}</h3>
                          <p className="text-blue-600 font-semibold mb-2">
                            ₹{property.price?.toLocaleString("en-IN")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.city}, {property.state}
                          </p>
                          <div className="flex space-x-2 mt-3">
                            {/* ❌ Removed Edit functionality */}
                            <button
                              onClick={() => handleDelete(property.property_id)}
                              disabled={loading}
                              className={`flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{loading ? "Deleting..." : "Delete"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recent Enquiries</h2>
              <button
                onClick={() => navigate("/messages")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>

            <div className="p-6">
              {enquiries.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No enquiries yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.slice(0, 3).map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className={`border rounded-lg p-4 ${
                        enquiry.status === "unread"
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{enquiry.senderName}</h3>
                          <p className="text-sm text-gray-600">{enquiry.senderEmail}</p>
                        </div>
                        {enquiry.status === "unread" && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-2">
                        {enquiry.propertyTitle}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">{enquiry.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(enquiry.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
