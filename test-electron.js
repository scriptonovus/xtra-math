console.log('Testing electron import...');
try {
  const electron = require('electron');
  console.log('Electron loaded:', typeof electron);
  console.log('Electron keys:', Object.keys(electron));
} catch (error) {
  console.error('Error loading electron:', error);
}
