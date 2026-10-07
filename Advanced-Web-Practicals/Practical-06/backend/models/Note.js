const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'study', 'other'],
    default: 'personal',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#6c63ff',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);
