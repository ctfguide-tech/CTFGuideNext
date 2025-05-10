import React, { useState, useEffect } from 'react';

const MessageAttachment = ({ attachment }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Add debug logging when component receives props
  useEffect(() => {
    console.log('[MESSAGE_ATTACHMENT] Received attachment:', attachment);
  }, [attachment]);
  
  // Get appropriate icon for file type - with null check
  const getFileIcon = (type) => {
    if (!type) return 'fa-file'; // Return default icon if type is undefined
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
  
  // If no attachment provided, don't render anything
  if (!attachment) {
    console.log('[MESSAGE_ATTACHMENT] No attachment provided');
    return null;
  }
  
  // Extract the URL from various possible attachment formats
  let url = null;
  
  // Case 1: Direct url property
  if (attachment.url) {
    url = attachment.url;
    console.log('[MESSAGE_ATTACHMENT] Found URL in attachment.url:', url);
  } 
  // Case 2: Direct imageUrl property (from API response)
  else if (attachment.imageUrl) {
    url = attachment.imageUrl;
    console.log('[MESSAGE_ATTACHMENT] Found URL in attachment.imageUrl:', url);
  }
  // Case 3: String attachment
  else if (typeof attachment === 'string') {
    url = attachment;
    console.log('[MESSAGE_ATTACHMENT] Attachment is a string URL:', url);
  }
  // Case 4: Cloudflare variants array
  else if (attachment.variants && attachment.variants.length > 0) {
    url = attachment.variants[0];
    console.log('[MESSAGE_ATTACHMENT] Found URL in attachment.variants[0]:', url);
  }
  // Case 5: Nested structure with result from Cloudflare
  else if (attachment.result) {
    if (attachment.result.variants && attachment.result.variants.length > 0) {
      url = attachment.result.variants[0];
      console.log('[MESSAGE_ATTACHMENT] Found URL in attachment.result.variants[0]:', url);
    } else if (attachment.result.url) {
      url = attachment.result.url;
      console.log('[MESSAGE_ATTACHMENT] Found URL in attachment.result.url:', url);
    }
  }
  
  // Log the final URL we'll use
  console.log('[MESSAGE_ATTACHMENT] Final URL to display:', url);
  
  if (!url) {
    console.error('[MESSAGE_ATTACHMENT] No URL found in attachment:', attachment);
    return (
      <div className="p-2 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
        <i className="fas fa-exclamation-triangle mr-1"></i> 
        Error: Could not extract image URL
      </div>
    );
  }
  
  return (
    <div className="my-2 max-w-lg">
      <div className="relative">
        {isLoading && (
          <div className="w-full h-48 bg-neutral-800 rounded flex items-center justify-center">
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
          src={url}
          alt="Attachment"
          className={`rounded-md max-h-96 object-contain ${isLoading ? 'hidden' : 'block'}`}
          onLoad={() => {
            console.log('[MESSAGE_ATTACHMENT] Image loaded successfully:', url);
            setIsLoading(false);
          }}
          onError={() => {
            console.error('[MESSAGE_ATTACHMENT] Failed to load image:', url);
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
      
      {attachment.caption && (
        <div className="mt-1 text-sm text-gray-400">
          {attachment.caption}
        </div>
      )}
    </div>
  );
};

export default MessageAttachment; 