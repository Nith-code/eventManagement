import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Changed from 'User' to 'Users'
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Changed from 'User' to 'Users'
        image: { type: String },
    },
    { timestamps: true,
        strictPopulate : false
     },
    
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
