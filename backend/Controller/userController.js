import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'; 

export const createUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email, password});
        
        //checking if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        // hashing password before saving (you can use bcrypt or any other library)
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        console.log(newUser);

        // saving user to database
        await newUser.save();


        res.status(201).json({message: "User created successfully", user: newUser});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;   
        const user = await User.findById(userId).select('-password'); // Exclude password
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        if(updates.password){
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const updatedUser = await User
            .findByIdAndUpdate(userId, updates, {new: true})
            .select('-password');
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }   
        res.status(200).json({message: "User updated successfully", user: updatedUser});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};