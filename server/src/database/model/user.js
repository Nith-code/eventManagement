import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Corrected typo from `require` to `required`
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'organizer'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    registeredEvent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    image: {
        type: String, // URL or file path for the user's image
    },
});

// Export the model
const Users = mongoose.model('Users', userSchema);
export default Users;
