import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  cost:Number,
  date: Date,
  createdBy: String,
  createdByName: String,
  createdByEmail: String,
  image: String, // image path or URL
});

export default mongoose.model('Event', eventSchema);