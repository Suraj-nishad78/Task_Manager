import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;
    
    // If no token found
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized access. Please provide valid credentials."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    // Attach decoded user info to request object
    req.user = decoded;

    next(); // pass to next middleware/route
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized access. Please provide valid credentials."
    });
  }
};

export default authMiddleware;