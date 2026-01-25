import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        detail: errors.array()[0].msg 
      });
    }

    const { name, email, password, phoneNumber, childAge, region, problemDescription } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        detail: 'Email already registered' 
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      childAge,
      region,
      problemDescription,
      profileCompleted: true, 
    });

    if (user) {
      res.status(201).json({
        access_token: generateToken(user._id),
        token_type: 'bearer',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          profileCompleted: user.profileCompleted,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      detail: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        detail: errors.array()[0].msg 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        access_token: generateToken(user._id),
        token_type: 'bearer',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          profileCompleted: user.profileCompleted,
        },
      });
    } else {
      res.status(401).json({ 
        success: false,
        detail: 'Incorrect email or password' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      detail: error.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profileCompleted: user.profileCompleted,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      detail: error.message 
    });
  }
};
