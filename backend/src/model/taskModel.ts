import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically creates `createdAt` and `updatedAt`,
  versionKey: false
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
