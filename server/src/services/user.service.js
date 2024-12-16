import Users from '../database/model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


//Sign up

export async function registerUser(userData) {
    const { email, password } = userData;

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create new user with hashed password
    const newUser = new Users({
        ...userData,
        password: hashedPassword, // Store the hashed password
    });

    // Save user to the database
    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error saving user to database:', error);
        throw new Error('Database error: Unable to register user');
    }
}

//Login
export const loginUser = async (email, password) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log(JWT_SECRET);
    
    const user = await Users.findOne({ email });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
    console.log(user, token);
    return { token, user }; 
};

//Get all
export async function getAll() {
    return await Users.find()
}

//GetById
export async function getById(id) {
    try {
        const user = await Users.findById(id);
        if (!user){
            throw new Error("User not found")
        } return user;
    } catch (error) {
        throw new Error (error.message);
    }
    
}

//Update user
export async function updateById(id, updateData) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        if (updateData.profileImage) {
            updateData.profileImage = `/uploads/users/${updateData.profileImage}`;
        }

        const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
}

//DeleteUser
export async function deleteById(id) {
    try {
        const user = await Users.findByIdAndDelete(id)
        if (!user){
            throw new Error ("User not found")
        }
        return user;
    } catch(error){
        throw new Error (error.message)
    }
}