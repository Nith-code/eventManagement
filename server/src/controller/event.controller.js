import { createEvent,
    joinEvent, getAllEvents, 
    getEventById, 
    getEventsByOrganizer, 
    searchEventByName, 
    updateEventById, 
    deleteEventById, 
    getEventsByParticipant, 
    deleteAllEvents} from "../services/event.service.js";
import mongoose from "mongoose";
import upload from "../config/eventMulterConfig.js";

export async function createEventController(req, res) {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'Image upload failed', error: err.message });
        }

        console.log('Request Body:', req.body); // Log request body
        console.log('Uploaded File:', req.file); // Log uploaded file

        try {
            const organizer = req.user.id; // Extract organizer from authenticated user
            const { title, date, location, participants } = req.body;

            // Validate required fields
            if (!title || !date || !location) {
                return res.status(400).json({ message: 'Title, date, and location are required' });
            }

            const imagePath = req.file ? `/uploads/events/${req.file.filename}` : undefined;
            const eventData = { title, date, location, organizer, participants, image: imagePath };

            console.log('Event Data to Save:', eventData); // Debug event data

            const newEvent = await createEvent(eventData);

            return res.status(201).json({
                message: 'Event created successfully',
                event: newEvent,
            });
        } catch (error) {
            console.error('Error creating event:', error);
            return res.status(500).json({ message: error.message });
        }
    });
}

export async function joinEventController(req, res) {
    try {
        const userId = req.user.id; // Extract user ID from the authenticated session or token
        const { eventId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!eventId) {
            return res.status(400).json({ success: false, message: "Event ID is required" });
        }

        const result = await joinEvent(eventId, userId);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}



export async function getAllEventsController(req, res) {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getEventByIdController(req, res) {
    try {
        const { eventId } = req.params;

        const event = await getEventById(eventId);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export async function searchEventByNameController(req, res) {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: "Name query parameter is required" });
        }

        const events = await searchEventByName(name);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Controller: getEventsByOrganizerController using logged-in user's ID


export async function getEventsByOrganizerController(req, res) {
    try {
        const organizerId = req.user.id; // Retrieve organizer ID from authenticated user

        // Log the organizerId to check its value
        console.log('Organizer ID:', organizerId);

        // Validate the organizerId format
        if (!mongoose.Types.ObjectId.isValid(organizerId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const events = await getEventsByOrganizer(organizerId);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



export async function updateEventController(req, res) {
    const { eventId } = req.params;

    // Handle image upload separately (if applicable)
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Image upload failed', error: err.message });
        }

        try {
            if (!mongoose.Types.ObjectId.isValid(eventId)) {
                return res.status(400).json({ message: "Invalid Event ID format" });
            }

            const updateData = req.body;

            // If an image is uploaded, include the image field in the update data
            if (req.file) {
                updateData.image = `/uploads/events/${req.file.filename}`;
            }

            const updatedEvent = await updateEventById(eventId, updateData);

            // Return the updated event data, including the image and other fields
            res.status(200).json({
                success: true,
                message: "Event successfully updated",
                data: updatedEvent
            });
        } catch (error) {
            console.error("Error in updateEventController:", error.message);
            res.status(400).json({ message: error.message });
        }
    });
}


export async function deleteEventController(req, res) {
    try {
        const { eventId } = req.params;

        const deletedEvent = await deleteEventById(eventId);
        res.status(200).json({ message: "Event deleted successfully", deletedEvent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getEventsByParticipantIdController = async (req, res) => {
    try {
        const participantId = req.user.id; // Extract from the logged-in user

        if (!participantId) {
            return res.status(401).json({ message: "Unauthorized: Participant ID not found" });
        }

        const events = await getEventsByParticipant(participantId); // Get events by participant ID
        return res.status(200).json(events); // Return events including the image field
    } catch (error) {
        if (error.message === "Invalid ID format") {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        console.error("Error fetching events:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function deleteAllEventsController(req, res) {
    try {
        const deleteResult = await deleteAllEvents();
        return res.status(200).json({ success: true, message: "All events deleted successfully", data: deleteResult });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}