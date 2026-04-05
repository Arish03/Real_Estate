import { v4 as uuidv4 } from "uuid";
import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activityPropertyDescription } from "../../utils/activity/index.js";
import { sendTargetedNotification } from "../../websocket/index.js";
import { ActivityType } from "../../enums/activity.js";
import { SocketNotificationType } from "../../enums/notifications.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 * @returns
 */
export const createProperty = async function (req, res) {
  try {
    // Parse multipart form data
    const fields = {};
    const files = [];
    
    // Iterate through all parts of the multipart request
    for await (const part of req.parts()) {
      if (part.type === 'field') {
        // Store field values
        fields[part.fieldname] = part.value;
      } else if (part.type === 'file') {
        // Store file info
        files.push({
          fieldname: part.fieldname,
          filename: part.filename,
          encoding: part.encoding,
          mimetype: part.mimetype,
          file: part.file
        });
      }
    }
    
    // Extract form fields
    const title = fields.title;
    const address = fields.address;
    const type = fields.type;
    const transactionType = fields.transactionType || 'sale'; // Default to 'sale'
    const lat = parseFloat(fields.lat);
    const lng = parseFloat(fields.lng);
    const description = fields.description || '';
    const price = fields.price ? parseFloat(fields.price) : 0;
    const bedrooms = fields.bedrooms ? parseInt(fields.bedrooms) : 0;
    const bathrooms = fields.bathrooms ? parseInt(fields.bathrooms) : 0;
    const squareFeet = fields.squareFeet ? parseFloat(fields.squareFeet) : 0;
    const city = fields.city || '';
    const state = fields.state || '';
    
    // Validate required fields
    if (!title || !address || !type || isNaN(lat) || isNaN(lng) || !transactionType) {
      return res.status(400).send({ 
        message: "Error: Required fields (title, address, type, lat, lng, transactionType) are missing.",
        received: { title, address, type, lat, lng, transactionType }
      });
    }
    
    // Validate description length (minimum 10 characters)
    if (description.length < 10) {
      return res.status(400).send({ 
        message: "Error: Description must be at least 10 characters long.",
        received: { description, length: description.length }
      });
    }
    
    // Validate transactionType
    if (!['sale', 'rent'].includes(transactionType)) {
      return res.status(400).send({ 
        message: "Error: transactionType must be either 'sale' or 'rent'.",
        received: { transactionType }
      });
    }
    
    const user_id = req.user.id;

    // Build property object
    const propertyData = {
      property_id: uuidv4(),
      user_id,
      name: title,
      title: title,
      description,
      address,
      city,
      state,
      type,
      transactionType,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      position: {
        type: "Point",
        coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
      },
    };
    
    console.log("📝 Creating property with data:", propertyData);
    
    const newProperty = new Property(propertyData);
    const user = await User.findOne({ user_id });
    if(!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    
    // Log User activity
    const activity = addActivity(user, {
      action: ActivityType.property.new,
      description: activityPropertyDescription(
        ActivityType.property.new,
        newProperty
      ),
      property_id: newProperty.property_id,
    });
    user.properties.push(newProperty.property_id);
    await user.save();

    if (activity) {
      sendTargetedNotification(SocketNotificationType.activity, activity, user_id);
    }
    await newProperty.save();
    console.log("✅ Property created successfully:", newProperty.property_id);
    return res.status(201).send({ data: newProperty });
  } catch (error) {
    console.error("❌ Error creating property:", error);
    return res.status(500).send({ message: "Error: Failed to create property.", error: error.message });
  }
};
