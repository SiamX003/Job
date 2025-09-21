import jwt from "jsonwebtoken";

export const generatedRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

// If you want default export:
export default generatedRefreshToken;
