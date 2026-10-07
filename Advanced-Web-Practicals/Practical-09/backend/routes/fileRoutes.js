const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploadSingle, uploadMultiple, uploadDir } = require('../middleware/upload');

const router = express.Router();

// File metadata persistent storage file
const METADATA_FILE = path.join(__dirname, '..', 'file_registry.json');

// Helper to read metadata registry
function getFileRegistry() {
  try {
    if (!fs.existsSync(METADATA_FILE)) {
      fs.writeFileSync(METADATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(METADATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Failed to read file registry:', err.message);
    return [];
  }
}

// Helper to write metadata registry
function saveFileRegistry(registry) {
  try {
    fs.writeFileSync(METADATA_FILE, JSON.stringify(registry, null, 2));
  } catch (err) {
    console.error('Failed to save file registry:', err.message);
  }
}

/**
 * GET /api/files/stats - File and storage statistics
 */
router.get('/stats', (req, res) => {
  const registry = getFileRegistry();
  const totalFiles = registry.length;
  const totalSizeBytes = registry.reduce((sum, f) => sum + (f.size || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  const categoryBreakdown = registry.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalFiles,
      totalSizeBytes,
      totalSizeMB: `${totalSizeMB} MB`,
      categoryBreakdown
    }
  });
});

/**
 * GET /api/files - List files with search, filter, and pagination
 */
router.get('/', (req, res) => {
  let registry = getFileRegistry();
  const { search, category, sort = 'newest', page = 1, limit = 10 } = req.query;

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    registry = registry.filter(f =>
      f.originalName.toLowerCase().includes(q) ||
      (f.description && f.description.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (category && category !== 'All') {
    registry = registry.filter(f => f.category.toLowerCase() === category.toLowerCase());
  }

  // Sorting
  if (sort === 'newest') {
    registry.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  } else if (sort === 'oldest') {
    registry.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  } else if (sort === 'size-desc') {
    registry.sort((a, b) => b.size - a.size);
  } else if (sort === 'size-asc') {
    registry.sort((a, b) => a.size - b.size);
  } else if (sort === 'name-asc') {
    registry.sort((a, b) => a.originalName.localeCompare(b.originalName));
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const totalCount = registry.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedFiles = registry.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    data: paginatedFiles,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
      limit: limitNum
    }
  });
});

/**
 * POST /api/files/upload - Upload a single file
 */
router.post('/upload', (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file received. Please provide a file in the "file" field.'
      });
    }

    const fileMeta = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      sizeFormatted: `${(req.file.size / 1024).toFixed(1)} KB`,
      category: req.body.category || 'General',
      description: req.body.description || '',
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${req.file.filename}`
    };

    const registry = getFileRegistry();
    registry.unshift(fileMeta);
    saveFileRegistry(registry);

    res.status(201).json({
      success: true,
      message: 'File successfully uploaded',
      file: fileMeta
    });
  });
});

/**
 * POST /api/files/upload-multiple - Upload multiple files (up to 5)
 */
router.post('/upload-multiple', (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) return next(err);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded. Provide files in the "files" form field.'
      });
    }

    const registry = getFileRegistry();
    const uploadedRecords = req.files.map((file) => {
      const meta = {
        id: uuidv4(),
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
        category: req.body.category || 'Batch Upload',
        description: req.body.description || '',
        uploadedAt: new Date().toISOString(),
        url: `/uploads/${file.filename}`
      };
      registry.unshift(meta);
      return meta;
    });

    saveFileRegistry(registry);

    res.status(201).json({
      success: true,
      message: `${uploadedRecords.length} files successfully uploaded`,
      files: uploadedRecords
    });
  });
});

/**
 * GET /api/files/:id - Get single file metadata
 */
router.get('/:id', (req, res) => {
  const registry = getFileRegistry();
  const file = registry.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({
      success: false,
      error: `File with ID '${req.params.id}' not found`
    });
  }

  res.json({
    success: true,
    file
  });
});

/**
 * GET /api/files/:id/download - Force download file as attachment
 */
router.get('/:id/download', (req, res) => {
  const registry = getFileRegistry();
  const file = registry.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  const filePath = path.join(uploadDir, file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Physical file not found on disk' });
  }

  res.download(filePath, file.originalName);
});

/**
 * GET /api/files/:id/view - Inline view/stream file
 */
router.get('/:id/view', (req, res) => {
  const registry = getFileRegistry();
  const file = registry.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  const filePath = path.join(uploadDir, file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Physical file not found on disk' });
  }

  res.setHeader('Content-Type', file.mimeType);
  res.sendFile(filePath);
});

/**
 * DELETE /api/files/:id - Delete file from disk & registry
 */
router.delete('/:id', (req, res) => {
  const registry = getFileRegistry();
  const fileIndex = registry.findIndex(f => f.id === req.params.id);

  if (fileIndex === -1) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  const file = registry[fileIndex];
  const filePath = path.join(uploadDir, file.filename);

  // Remove from filesystem if exists
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete physical file ${filePath}:`, err.message);
    }
  }

  registry.splice(fileIndex, 1);
  saveFileRegistry(registry);

  res.json({
    success: true,
    message: `File '${file.originalName}' successfully deleted`,
    deletedId: file.id
  });
});

module.exports = router;
