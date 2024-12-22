'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiDownload, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme, setTheme } = useTheme();

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // ... existing upload logic ...
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    }
  });

  return (
    <div className="container-custom">
      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 right-4 btn"
      >
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-2">Upload Files</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Drop your files here to upload
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? 'upload-zone-active' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">
          {isDragActive ? 'Drop here' : 'Drag & drop files, or click to select'}
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="file-grid"
          >
            {files.map((file) => (
              <motion.div
                key={file.public_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="file-item"
              >
                {/* File Preview */}
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {file.resource_type === 'image' ? (
                    <img
                      src={file.secure_url}
                      alt={file.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiFile className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="mt-2">
                  <p className="font-medium truncate">{file.original_filename}</p>
                  <button 
                    onClick={() => window.open(file.secure_url)}
                    className="btn btn-primary mt-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="progress-bar"
          >
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm">{progress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
