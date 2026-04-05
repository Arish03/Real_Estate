import { ActivityType } from "../../enums/activity.js";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activitySigninDescription } from "../../utils/activity/index.js";

export const signIn = async function (req, res) {
  const { email, password } = req.body;
  console.log("\n🟢🟢🟢 LOGIN REQUEST:", { email });
  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      return res.status(400).send({
        // error: "Internal Server Error",
        message: "Error: Invalid Email or Password.",
        // message: "Error: We can't find a user with that e-mail address.",
      });
    }
    const validPassword = await fastify.bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Error: Invalid Email or Password." });
    }
    const { user_id } = foundUser;
    const userRole = foundUser.role || 'buyer';
    const accessToken = fastify.jwt.sign({ id: user_id });

    console.log("🟢 LOGIN - USER FOUND IN DB:", { 
      user_id, 
      email: foundUser.email,
      dbRole: foundUser.role, 
      dbRoleType: typeof foundUser.role,
      fallbackApplied: !foundUser.role,
      finalRole: userRole 
    });

    // We log as User activity
    addActivity(foundUser, {
      action: ActivityType.user.login,
      description: activitySigninDescription(foundUser),
      user_id,
    })
    await foundUser.save();

    const loginResponse = {
      data: {
        user_id: foundUser.user_id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        role: userRole,
        verified: foundUser.verified,
        about: foundUser.about,
        address: foundUser.address,
        properties: foundUser.properties,
        accessToken,
      },
    };
    console.log("🟢 LOGIN RESPONSE BODY:", { role: loginResponse.data.role, email: loginResponse.data.email });
    console.log("=== END LOGIN ===");

    return res.status(200).send(loginResponse);
  } catch (error) {
    return res.status(404).send({ message: "Error: Something went wrong." });
  }
};
