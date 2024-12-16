import { registerUser, loginUser, getById, getAll, deleteById, updateById } from '../services/user.service.js';
import upload from '../config/multerConfig.js';

export async function registerUserController(req, res) {
    try {
        // Handle file upload
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: 'Image upload failed', error: err.message });
            }

            // Log the request body and file for debugging
            console.log('Request Body:', req.body);
            console.log('Uploaded File:', req.file);

            // Extract user data from the request
            const { name, email, password, role = 'user' } = req.body; // Default to 'user' role if not provided
            const imagePath = req.file ? `/uploads/users/${req.file.filename}` : undefined;

            // Validate role
            const validRoles = ['user', 'admin', 'organizer'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const userData = {
                name,
                email,
                password,
                role,
                image: imagePath,
            };

            try {
                // Attempt to register the user
                const newUser = await registerUser(userData);

                // Return success response
                return res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        image: newUser.image,
                    },
                });
            } catch (error) {
                // Handle user already exists case
                if (error.message === 'User already exists') {
                    console.error('Duplicate registration attempt:', error);
                    return res.status(409).json({ message: 'User already exists' });
                }

                console.error('Error during user registration:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Unexpected error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json({ message: 'Login successful', token: result.token, user: result.user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export async function getAllUser(req, res) {
    try {
        const user = await getAll();
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error while fetching data', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getUserByIdController(req, res) {
    try {
        const id = req.params.id;
        console.log(id);

        const user = await getById(id);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching data', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateUserController(req, res) {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: 'Image upload failed', error: err.message });
            }

            const { name, email, role } = req.body;
            const imagePath = req.file ? `/uploads/users/${req.file.filename}` : undefined;

            const validRoles = ['user', 'admin', 'organizer'];
            if (role && !validRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const updateData = {
                name,
                email,
                role,
                image: imagePath,
            };

            try {
                const updatedUser = await updateById(req.params.id, updateData);

                return res.status(200).json({
                    message: 'User updated successfully',
                    updatedUser: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                        image: updatedUser.image,
                    },
                });
            } catch (error) {
                console.error('Error during user update:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Unexpected error during user update:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteUserController(req, res) {
    try {
        const id = req.params.id;
        console.log(id);

        const user = await deleteById(id);
        return res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export default {
    login,
};
