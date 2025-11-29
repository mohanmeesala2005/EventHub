import express from 'express';
import uploads from '../middlewares/uploads.js';
import authMiddleware from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
import { createEvent, getAllEvents, deleteEvent, updateEvent, registerForEvent, getEventRegistrations, getUserRegistrations, getAllEventsWithStats, getAllRegistrations } from '../controllers/eventController.js';

const router = express.Router();

router.post('/create', authMiddleware, uploads.single('image'), createEvent);
router.post('/getevent', getAllEvents);
router.delete('/:id', authMiddleware, deleteEvent);
router.put("/:id", authMiddleware, uploads.single('image'), updateEvent);
router.post('/register', authMiddleware, registerForEvent); // Protected with auth
router.get('/registrations/:eventId', getEventRegistrations);
router.get('/registrations', authMiddleware, getUserRegistrations); // New route for user's registrations

// Admin routes
router.get('/admin/events-with-stats', adminAuth, getAllEventsWithStats); // Admin: Get all events with stats
router.get('/admin/all-registrations', adminAuth, getAllRegistrations); // Admin: Get all registrations

export default router;