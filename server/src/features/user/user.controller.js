import User from "./user.scheme.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    if (user.length == 0) {
      return res.json({
        message: "No user",
      });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SIGNUP user
export const signupUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check existing
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SIGNIN user
export const signinUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });

    // Create JWT
    const token = jwt.sign(user.toJSON(), process.env.PRIVATE_KEY, {
      expiresIn: "10m",
    });

    res
      .cookie("jwtToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "Success",
        msg: "User sign in successfully!",
        userId: user._id,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
