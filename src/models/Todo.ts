import mongoose, { Document, Schema } from 'mongoose';

// Interface for Todo document
export interface ITodo extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Todo Schema
const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Removes __v field
  }
);

// Add indexes for better query performance
todoSchema.index({ completed: 1 });
todoSchema.index({ createdAt: -1 });

// Transform the output to match our API response format
todoSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

// Create and export the model
const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo; 