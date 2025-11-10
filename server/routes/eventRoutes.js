import express from 'express';
import uploads from '../middlewares/uploads.js';
import authMiddleware from '../middlewares/auth.js';
import { createEvent, getAllEvents, deleteEvent,updateEvent ,registerForEvent,getEventRegistrations} from '../controllers/eventController.js';

const router = express.Router();

router.post('/create', authMiddleware, uploads.single('image'), createEvent);
router.post('/getevent', getAllEvents);
router.delete('/:id', authMiddleware, deleteEvent);
router.put("/:id",authMiddleware,uploads.single('image'),updateEvent);
router.post('/register', registerForEvent);
router.get('/registrations/:eventId',getEventRegistrations);

export default router;