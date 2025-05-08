import React, { useState } from 'react';

const MessageAttachment = ({ attachment }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'fa-image';
    if (type.startsWith('video/')) return 'fa-video';
    if (type.startsWith('audio/')) return 'fa-music';
    if (type === 'application/pdf') return 'fa-file-pdf';
    if (type.includes('document') || type.includes('word')) return 'fa-file-word';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'fa-file-excel';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'fa-file-powerpoint';
    if (type.includes('zip') || type.includes('archive')) return 'fa-file-archive';
    if (type.includes('text/')) return 'fa-file-alt';
    return 'fa-file';
  };
  
  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  // Determine if the attachment is an image
  const isImage = attachment.type?.startsWith('image/');
  
  return (
    <div className="my-2 max-w-lg">
      {isImage ? (
        <div className="relative">
          {isLoading && (
            <div className="w-full h-40 bg-neutral-800 rounded flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {hasError && (
            <div className="w-full p-4 bg-red-900/30 border border-red-700/50 rounded flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-400 mr-2"></i>
              <span className="text-red-300">Failed to load image</span>
            </div>
          )}
          
          <img 
            src={attachment.url} 
            alt={attachment.filename || 'Image attachment'}
            className={`rounded-md max-h-96 object-contain ${isLoading ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="bg-neutral-800 border border-neutral-700 rounded p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mr-3 flex-shrink-0">
              <i className={`fas ${getFileIcon(attachment.type)} text-blue-400`}></i>
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-white truncate">{attachment.filename || 'File attachment'}</div>
              <div className="text-xs text-gray-400">{formatFileSize(attachment.size || 0)}</div>
            </div>
            <a 
              href={attachment.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-auto text-blue-400 hover:text-blue-300 p-2"
              download={attachment.filename}
            >
              <i className="fas fa-download"></i>
            </a>
          </div>
        </div>
      )}
      
      {attachment.caption && (
        <div className="mt-1 text-sm text-gray-400">
          {attachment.caption}
        </div>
      )}
    </div>
  );
};

export default MessageAttachment; 