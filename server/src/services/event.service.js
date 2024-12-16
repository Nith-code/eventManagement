import Event from '../database/model/event.js';
import mongoose from 'mongoose';
import Users from '../database/model/user.js';

/**
 * Service to create an event
 * @param {Object} eventData - The event data (title, date, location, image)
 * @returns {Promise<Object>} - The created event object
 */
export async function createEvent(eventData) {
    try {
        const newEvent = new Event(eventData); // Create a new Mongoose document
        await newEvent.save(); // Save to the database
        return newEvent;
    } catch (error) {
        console.error('Error creating event in database:', error);
        throw new Error(error.message); // Pass meaningful error messages to the controller
    }
}

export async function joinEvent(eventId, userId) {
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        if (event.participants.includes(userId)) {
            throw new Error("User already joined this event");
        }

        event.participants.push(userId);
        await event.save();

        return { success: true, message: "User successfully joined the event", eventId: event._id };
    } catch (error) {
        throw new Error(error.message);
    }
}



// Service: getAllEvents with image inclusion

export async function getAllEvents() {
    try {
        const events = await Event.find()
            .populate("organizer", "name email") // Populate 'organizer' with 'name' and 'email' fields from User
            .select("title date location participants organizer image"); // Select necessary fields including 'image'

        return events.map(event => ({
            _id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            participants: event.participants,
            organizer: event.organizer ? {
                id: event.organizer._id,
                name: event.organizer.name,
                email: event.organizer.email
            } : null,
            image: event.image // Include image field in the response
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}



export async function getEventById(eventId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            throw new Error("Invalid ID format");
        }

        const event = await Event.findById(eventId)
            .populate("organizizer", "name email")
            .populate("participant", "name email");

        if (!event) {
            throw new Error("Event not found");
        }

        return event;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function searchEventByName(name) {
    try {
        // Use a case-insensitive regex query to search by title
        const events = await Event.find({ title: { $regex: name, $options: "i" } })
            .populate("organizer", "name email") // Populate 'organizer' details
            .select("title date location participants organizer image"); // Select necessary fields including 'image'

        return events.map(event => ({
            _id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            participants: event.participants,
            organizer: event.organizer ? {
                id: event.organizer._id,
                name: event.organizer.name,
                email: event.organizer.email
            } : null,
            image: event.image // Include the image field in the response
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service: getEventsByOrganizer using logged-in user's ID

// services/eventService.js

export async function getEventsByOrganizer(organizerId) {
    try {
        const events = await Event.find({ organizer: organizerId })
            .populate("organizer", "name email") // Populate the organizer's name and email
            .populate("participants", "name email"); // Populate participant's name and email

        if (!events.length) {
            throw new Error("No events found for this organizer");
        }

        return events;
    } catch (error) {
        throw new Error(error.message);
    }
}



// services/eventService.js

export async function updateEventById(eventId, updateData) {
    try {
        // Validate the eventId format
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            throw new Error("Invalid Event ID format");
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
            new: true, // Ensure it returns the updated document
            runValidators: true // Ensure the data is validated according to the schema
        })
            .populate("organizer", "name email")  // Populate organizer details
            .select("title date location participants organizer image");  // Select necessary fields

        if (!updatedEvent) {
            throw new Error("Event not found");
        }

        // Return the updated event data
        return {
            _id: updatedEvent._id,
            title: updatedEvent.title,
            date: updatedEvent.date,
            location: updatedEvent.location,
            participants: updatedEvent.participants,
            organizer: updatedEvent.organizer ? {
                id: updatedEvent.organizer._id,
                name: updatedEvent.organizer.name,
                email: updatedEvent.organizer.email
            } : null,
            image: updatedEvent.image  // Return the updated image
        };
    } catch (error) {
        throw new Error(error.message);
    }
}



export async function deleteEventById(eventId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            throw new Error("Invalid Event ID format");
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            throw new Error("Event not found");
        }

        return deletedEvent;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getEventsByParticipant = async (participantId) => {
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
        throw new Error("Invalid ID format");
    }

    try {
        // Find events where the participant ID is in the participant array
        const events = await Event.find({ participants: participantId }) // Adjust based on your model field name
            .populate("organizer", "name email")  // Populate organizer info
            .select("title date location participants organizer image");  // Select necessary fields including 'image'

        return events.map(event => ({
            _id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            participants: event.participants,
            organizer: event.organizer ? {
                id: event.organizer._id,
                name: event.organizer.name,
                email: event.organizer.email
            } : null,
            image: event.image // Include image field in the response
        }));
    } catch (error) {
        throw new Error("Error fetching events by participant ID: " + error.message);
    }
};

export async function deleteAllEvents() {
    try {
        const deleteResult = await Event.deleteMany({});
        return deleteResult;
    } catch (error) {
        throw new Error(error.message);
    }
}