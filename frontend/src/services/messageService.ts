import axios from "axios";
import API_BASE_URL from "../config/api"; // points to http://localhost:5000/api

const API_URL = `${API_BASE_URL}/messages`;

// ✅ Send a new message
export const sendMessage = async (data: any, token: string) => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await axios.post(API_URL, data, config);
    return response.data;
  } catch (error: any) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch all messages for owner
export const getEnquiries = async (token: string) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch enquiries:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Mark a message as read
export const markMessageAsRead = async (id: string, token: string) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to mark message as read:", err.response?.data || err.message);
    throw err;
  }
};
