import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';

// Disable Next.js body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data with formidable
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB max file size
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Make sure we have a file
    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Unsupported file type. Only JPEG, PNG, GIF, and WebP are allowed' 
      });
    }

    // Generate a unique ID for the image
    const imageId = uuidv4();
    
    // Read the file content
    const fileBuffer = fs.readFileSync(file.filepath);

    // Create FormData for Cloudflare upload
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: file.originalFilename,
      contentType: file.mimetype,
    });
    formData.append('id', imageId);
    formData.append('metadata', JSON.stringify({
      source: 'ctfguide-chat',
      uploaded_by: req.headers['x-user-id'] || 'anonymous'
    }));

    // Upload to Cloudflare Images
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
          ...formData.getHeaders()
        },
        body: formData,
      }
    );

    if (!cloudflareResponse.ok) {
      const errorData = await cloudflareResponse.json();
      console.error('Cloudflare Images upload error:', errorData);
      return res.status(500).json({ error: 'Failed to upload image to Cloudflare' });
    }

    const responseData = await cloudflareResponse.json();
    
    if (!responseData.success) {
      console.error('Cloudflare Images upload failed:', responseData.errors);
      return res.status(500).json({ error: 'Failed to upload image to Cloudflare' });
    }

    // Return the image details
    return res.status(200).json({
      success: true,
      image: {
        id: responseData.result.id,
        url: responseData.result.variants[0],
        filename: file.originalFilename,
        size: file.size,
        type: file.mimetype
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
} 