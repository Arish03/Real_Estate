import { v4 as uuidv4 } from "uuid";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { isPasswordValid } from "../../utils/users.js";

/**
 * Registers a new user.
 * @async
 * @param {import('fastify').FastifyRequest} req - The Fastify request object.
 * @param {import('fastify').FastifyReply<Response>} res - The Fastify response object.
 * @returns {Promise<import('fastify').FastifyReply<Response>>} A promise that resolves to the Fastify response object.
 */
export const register = async function (req, res) {
  const { fullName, email, password, role } = req.body;
  console.log("\n🔵🔵🔵 SIGNUP REQUEST:", { fullName, email, receivedRole: role, roleType: typeof role });
  
  if (fullName && email && password) {
    if(!isPasswordValid(password)) {
      return res.status(400).send({ message: "Error: password is not valid" })
    }
    try {
      const hashedPassword = await fastify.bcrypt.hash(password);
      const finalRole = role === 'owner' ? 'owner' : 'buyer';
      console.log("🔵 SETTING ROLE:", { inputRole: role, shouldBeOwner: role === 'owner', finalRole });
      
      const newUser = new User({
        user_id: uuidv4(),
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: finalRole,
      });
      
      const savedUser = await newUser.save();
      console.log("🟢 USER SAVED TO DB:", { user_id: savedUser.user_id, savedRole: savedUser.role, roleType: typeof savedUser.role });
      
      const accessToken = fastify.jwt.sign({ id: newUser.user_id });
      const responseBody = { user_id: savedUser.user_id, email: email.toLowerCase(), fullName, role: savedUser.role, accessToken };
      console.log("🟢 SIGNUP RESPONSE BODY:", responseBody);
      
      return res.status(201).send(responseBody);
    } catch (error) {
      console.error("🔴 SIGNUP ERROR:", error);
      return res.send(error);
    }
  }
  return res.status(400).send({ message: "Error: form is invalid" });
};
