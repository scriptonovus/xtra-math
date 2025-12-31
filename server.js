const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get list of files
app.get('/api/files', (req, res) => {
  const filesPath = path.join(__dirname, 'files');
  try {
    const files = fs.readdirSync(filesPath).map(file => {
      const filePath = path.join(filesPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modified: stats.mtime
      };
    });
    res.json(files);
  } catch (error) {
    console.error('Error reading files:', error);
    res.json([]);
  }
});

// Get file content
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'files', filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Download file
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'files', filename);
  
  try {
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
});
