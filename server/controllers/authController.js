import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const {username, name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({username});
    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
      });
      return res.status(200).json({ 
      token, 
      user: { 
        id: existingUser._id, 
        username: existingUser.username,
        name: existingUser.name, 
        email: existingUser.email, 
        role: existingUser.role 
      },
      message: 'User already exists, redirecting to home' 
      });
    }

    if(existingUsername) return res.status(400).json({message:"Username already exists"})

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({username, name, email, password: hashedPassword });
    await user.save();

    // Generate token for the new user (same as login)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Return the same structure as login
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        username:user.username,
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      message: 'User registered successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the username matches the user's username
    if (username && user.username !== username) {
      return res.status(400).json({ message: 'Username does not match the email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id,username:user.username, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const updateProfile = async(req,res) => {
  try{
    const {userName,name,password} = req.body;
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({message  :"User Not Found"});
  }
  user.name= name;
  user.userName = userName;
  user.password = password;
  await user.save();
  res.status(200).json({message:"Profile Updated!",user});
  }catch(err){
    res.status(500).json({message:"Something went wrong "});
  }
};