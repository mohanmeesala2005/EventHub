import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: String,
  email: String,
  phone: String,
  cost:Number,
  // add more fields as needed
});

export default mongoose.model('EventRegistration', eventRegistrationSchema);