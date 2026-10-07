const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['backlog', 'in_progress', 'review', 'completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'backlog'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    budget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative']
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
projectSchema.index({ status: 1, priority: 1 });
projectSchema.index({ createdBy: 1, assignedTo: 1 });

module.exports = mongoose.model('Project', projectSchema);
