'use client';
import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUploadCloud, FiFile, FiX, FiDownload, FiMoon, FiSun,
  FiMaximize2, FiTrash2, FiCheck, FiImage
} from 'react-icons/fi';
import { useTheme } from 'next-themes';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme, setTheme } = useTheme();
  const [preview, setPreview] = useState(null);
  const draggedFile = useRef(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Missing Cloudinary configuration');
      }

      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'file-uploads');

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
          }

          setProgress((prev) => Math.min(prev + (100 / acceptedFiles.length), 100));
          return data;
        } catch (err) {
          console.error('File upload error:', err);
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message);
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
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 right-4 btn btn-secondary"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>

      <div className="text-center mb-12">
        <h1 className="hero-title mb-4">Upload Files</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Drag & drop your files to upload
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div 
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? 'border-primary ring-4 ring-primary/20' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload-zone-content">
          <FiUploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-medium mb-2">
            {isDragActive ? 'Drop files here' : 'Drop files or click to upload'}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Support for images and PDF files
          </p>
        </div>
      </div>

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
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="file-item"
                draggable
                onDragStart={(e) => {
                  draggedFile.current = file;
                  e.dataTransfer.setData('text/plain', '');
                }}
              >
                <div className="file-preview">
                  {file.resource_type === 'image' ? (
                    <img
                      src={file.secure_url}
                      alt={file.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiFile className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="file-actions">
                    <button 
                      onClick={() => window.open(file.secure_url)}
                      className="icon-btn"
                      title="Download"
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPreview(file)}
                      className="icon-btn"
                      title="Preview"
                    >
                      <FiMaximize2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const confirmed = window.confirm('Delete this file?');
                        if (confirmed) setFiles(files.filter(f => f.public_id !== file.public_id));
                      }}
                      className="icon-btn bg-red-500/50 hover:bg-red-500/70"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="font-medium truncate">
                  {file.original_filename}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.bytes / 1024).toFixed(1)} KB
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploading && (
          <div className="progress-overlay">
            <div className="progress-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <FiUploadCloud className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Uploading files...</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we upload your files
                  </p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-right mt-2 text-sm font-medium">
                {progress}%
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <div 
            className="progress-overlay"
            onClick={() => setPreview(null)}
          >
            <div 
              className="progress-card max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {preview.resource_type === 'image' ? (
                <img
                  src={preview.secure_url}
                  alt={preview.original_filename}
                  className="w-full rounded-lg"
                />
              ) : (
                <iframe
                  src={preview.secure_url}
                  className="w-full h-[80vh] rounded-lg"
                  title={preview.original_filename}
                />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
