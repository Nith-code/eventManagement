import { Router } from "express";
import { createEventController,
    deleteAllEventsController,
    deleteEventController,
    getAllEventsController,
    getEventByIdController, 
    getEventsByOrganizerController, 
    getEventsByParticipantIdController,
    joinEventController, searchEventByNameController,
    updateEventController } from "../controller/event.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";


const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/events'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

// Route to create an event
router.post('/create', authMiddleware,createEventController);

// Route to join an event
router.post('/joinEvent', authMiddleware,joinEventController);

// Route to get all events
router.get('/getAll/all', getAllEventsController);

// Route to get an event by ID
router.get('/:eventId', getEventByIdController);

// Search events by name
router.get("/search/searchByName", searchEventByNameController);

// Get events by organizer
router.get("/byOrganizer/all",authMiddleware, getEventsByOrganizerController);

// Update an event
router.put("/update/:eventId",  updateEventController);

// Delete an event
router.delete("/delete/:eventId", deleteEventController);

router.get('/MyEvent/getAll', authMiddleware, getEventsByParticipantIdController)

router.delete('/delete/event/all', deleteAllEventsController);

export default router;

