import jwt from "jsonwebtoken";

export const generatedAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "1h",
  });
};

// If you want default export:
export default generatedAccessToken;
