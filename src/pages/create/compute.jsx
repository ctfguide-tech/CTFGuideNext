import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import request from "@/utils/request";
import axios from 'axios';
import Cookies from 'js-cookie';
import { XCircleIcon, ServerIcon, CpuChipIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { PlusIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileEditorModal from '@/components/FileEditorModal';
import { Context } from '@/context';
import { useContext } from 'react';
// --- Add import for react-simple-maps ---
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import ConfigureContainerModal from '@/components/ConfigureContainerModal';

export default function DockerContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useContext(Context);
  const [formData, setFormData] = useState({
    name: generateCoolName(),
    image: 'ubuntu:latest',
    cpu: '1',
    memory: '512',
    ports: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    containerCount: 0,
    containerLimit: 5,
    memoryUsage: "0",
    memoryLimit: "4GB",
    cpuUsage: "0",
    cpuLimit: "4"
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState('dockerfile'); // dockerfile or archive
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [expandedImageId, setExpandedImageId] = useState(null); // Track expanded image by ID
  const [createContainerModalOpen, setCreateContainerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  const [templateContent, setTemplateContent] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [containerMode, setContainerMode] = useState('per-user'); // 'per-user' or 'single-instance'
  const [challengeId, setChallengeId] = useState('');
  const [challengeList, setChallengeList] = useState([]);
  const [buildLogs, setBuildLogs] = useState([]); // placeholder for buildLogs state
  const [isTestingDeploy, setIsTestingDeploy] = useState(false); // placeholder for isTestingDeploy state
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [hasDeployedThisSession, setHasDeployedThisSession] = useState(false);

  // --- IMAGE SEARCH, FILTER, PAGINATION STATE ---
  const [imageSearch, setImageSearch] = useState('');
  const [imageTagFilter, setImageTagFilter] = useState('');
  const [imagePage, setImagePage] = useState(1);
  const imagesPerPage = 6;

  // --- DERIVED FILTERED, SEARCHED, PAGINATED IMAGES ---
  const filteredImages = userImages.filter(img => {
    const name = (img.name || img.fullName || '').toLowerCase();
    const tag = (img.fullName || (img.RepoTags && img.RepoTags[0]) || '').toLowerCase();
    const searchMatch = name.includes(imageSearch.toLowerCase());
    const tagMatch = imageTagFilter ? tag.includes(imageTagFilter.toLowerCase()) : true;
    return searchMatch && tagMatch;
  });
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const paginatedImages = filteredImages.slice((imagePage-1)*imagesPerPage, imagePage*imagesPerPage);

  // --- CONTAINER FILTERING, SEARCH, PAGINATION STATE ---
  const [containerSearch, setContainerSearch] = useState('');
  const [containerPortFilter, setContainerPortFilter] = useState('');
  const [containerPage, setContainerPage] = useState(1);
  const containersPerPage = 10;

  // --- DERIVED FILTERED, SEARCHED, PAGINATED CONTAINERS ---
  const filteredContainers = containers.filter(c => {
    const subdomain = (c.subdomain || '').toLowerCase();
    const containerName = (c.containerName || '').toLowerCase();
    const imageName = (c.imageName || '').toLowerCase();
    const challengeId = (c.challengeId || '').toLowerCase();
    const port = (c.port || '').toString();
    const search = containerSearch.toLowerCase();
    const portMatch = containerPortFilter ? port === containerPortFilter : true;
    return (
      (subdomain.includes(search) || containerName.includes(search) || imageName.includes(search) || challengeId.includes(search)) &&
      portMatch
    );
  });
  const containerTotalPages = Math.ceil(filteredContainers.length / containersPerPage);
  const paginatedContainers = filteredContainers.slice((containerPage-1)*containersPerPage, containerPage*containersPerPage);

  useEffect(() => {
    fetchContainers();
    fetchStats();
    fetchUserImages();
    fetchChallenges();
  }, []);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      // Get the user's ID from localStorage or context
      const userId = localStorage.getItem('username');
      
      // Make request to docket service instead of node-api
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers?creatorId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error('This service is temporarily disabled.');
      }
      
      const data = await response.json();
      setContainers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
      console.error('This service is temporarily disabled', error);
      setError('Failed to load containers. Please try again later.');
        setLoading(false);
      }
    };

  const fetchStats = async () => {
    try {
      // Get the user's ID from localStorage or context
      const userId = localStorage.getItem('username');
      
      // Make request to docket service for container stats
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/stats?creatorId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch container stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch container stats:', error);
    }
  };

  const fetchUserImages = async () => {
    try {
      const userId = localStorage.getItem('username');
      // Use the new simple endpoint for user images
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/images/simple?creatorId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user images');
      }

      const data = await response.json();
      // Transform each image object to have "id", "name", and "description"
      const transformed = data.map(img => {
        const name = img.name || 'Unnamed Image';
        const description = img.fullName
          ? `Image: ${img.fullName}`
          : `Created: ${img.created}`;
        return {
          id: img.id,
          name,
          description,
          ...img
        };
      });

      setUserImages(transformed);
    } catch (error) {
      console.error('Failed to fetch user images:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      // Use /account/challenges to get all of the current user's challenges
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=all`, "GET", null);
      console.log('fetchChallenges raw response:', response);
      if (response && Array.isArray(response) && response.length > 0) {
        setChallengeList(response);
      } else {
        setChallengeList([]);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      setChallengeList([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enforce frontend container limit
    const MAX_CONTAINERS = 50;
    if (containers.length >= MAX_CONTAINERS) {
      toast.error(`You have reached the maximum of ${MAX_CONTAINERS} containers. Reach out to pranav@ctfguide.com if you need more.`);
      return;
    }
    try {
      const userId = localStorage.getItem('username');
      
      // Make request to docket service to create container
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        },
        body: JSON.stringify({
          ...formData,
          imageName: formData.image, // Ensure backend gets imageName
          containerMode,
          challengeId,
          creatorId: userId,
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create container');
      }
      
      const data = await response.json();
      
      setFormData({
        name: generateCoolName(),
        image: 'ubuntu:latest',
        cpu: '1',
        memory: '512',
        ports: [],
      });
      setShowForm(false);
      
      // Refresh the containers list and stats
      fetchContainers();
      fetchStats();
    } catch (error) {
      console.error('Failed to create container:', error);
      setError(error.message || 'Failed to create container. Please try again.');
    }
  };

  const startContainer = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to start container');
      }
      
      fetchContainers();
      fetchStats();
    } catch (error) {
      console.error('Failed to start container:', error);
      setError('Failed to start container. Please try again.');
    }
  };

  const stopContainer = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/${id}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to stop container');
      }
      
      fetchContainers();
      fetchStats();
    } catch (error) {
      console.error('Failed to stop container:', error);
      setError('Failed to stop container. Please try again.');
    }
  };

  const deleteContainer = async (id) => {
    if (window.confirm('Are you sure you want to delete this container?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete container');
        }
        
        fetchContainers();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete container:', error);
        setError('Failed to delete container. Please try again.');
      }
    }
  };

  const handleFileChange = (e) => {
    setUploadedFiles([...e.target.files]);
  };
  
  const createDockerfileFromTemplate = () => {
    // Create a new file from the template content
    const blob = new Blob([templateContent], {type: "text/plain"});
    const file = new File([blob], "Dockerfile", {type: "text/plain"});
    
    // Create an array with the Dockerfile as the first item
    const filesToUpload = [file];
    
    // Check which template is used and add necessary supporting files
    if (selectedTemplate === 'web') {
      // Create a simple HTML file for the web template
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>CTFGuide Challenge</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        h1 { color: #4A90E2; }
    </style>
</head>
<body>
    <h1>Hello from CTFGuide!</h1>
    <p>This is a sample web challenge container.</p>
</body>
</html>`;
      const htmlBlob = new Blob([htmlContent], {type: "text/html"});
      const htmlFile = new File([htmlBlob], "index.html", {type: "text/html"});
      filesToUpload.push(htmlFile);
    } 
    else if (selectedTemplate === 'ctf') {
      // Create a flag file for the CTF template
      const flagContent = `CTFGuide{sample_flag_replace_me_with_real_flag}`;
      const flagBlob = new Blob([flagContent], {type: "text/plain"});
      const flagFile = new File([flagBlob], "flag.txt", {type: "text/plain"});
      filesToUpload.push(flagFile);
      
      // Create a basic C challenge file
      const challengeContent = `#include <stdio.h>
#include <stdlib.h>

int main() {
    char buffer[64];
    printf("Welcome to the CTFGuide challenge!\n");
    printf("Enter the secret code: ");
    gets(buffer); // Intentionally vulnerable
    printf("You entered: %s\\n", buffer);
    return 0;
}`;
      const challengeBlob = new Blob([challengeContent], {type: "text/plain"});
      const challengeFile = new File([challengeBlob], "challenge", {type: "text/plain"});
      filesToUpload.push(challengeFile);
    }
    
    // Set all the files to be uploaded
    setUploadedFiles(filesToUpload);
    setEditingTemplate(false);
    toast.success('Template applied successfully! All required files have been generated.');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      setError(null);
      
      // Get the image name and sanitize it completely
      let imageName = e.target.name.value.trim().toLowerCase();
      
      // Strip all characters that aren't alphanumeric or hyphen (the safest approach)
      imageName = imageName.replace(/[^a-z0-9-]/g, '');
      
      // Ensure it starts with a letter or number
      if (!/^[a-z0-9]/.test(imageName)) {
        imageName = 'img-' + imageName;
      }
      
      // Ensure it doesn't end with a hyphen
      if (imageName.endsWith('-')) {
        imageName = imageName.slice(0, -1);
      }
      
      // If after sanitizing we have an empty string or it's too short, use a default
      if (imageName.length < 3) {
        imageName = 'image-' + Math.floor(Math.random() * 10000);
      }
      
      console.log("Original image name:", e.target.name.value);
      console.log("Sanitized image name:", imageName);
      
      if (uploadedFiles.length === 0) {
        setError('Please upload a Dockerfile or archive file.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      const userId = localStorage.getItem('username');
      
      // DO NOT add username namespace - let the backend handle that if needed
      // Just use the simple sanitized name
      formData.append('name', imageName);
      formData.append('description', e.target.description.value || 'Container image');
      formData.append('port', e.target.port.value || '80');
      formData.append('creatorId', userId);
      
      // Add files based on upload type
      if (uploadType === 'dockerfile') {
        // Check if we're using template-generated Dockerfile
        const hasDockerfile = Array.from(uploadedFiles).some(file => 
          file.name.toLowerCase() === 'dockerfile'
        );
        
        if (!hasDockerfile) {
          setError('A Dockerfile is required for Dockerfile upload type.');
          setUploading(false);
          return;
        }
        
        // Find the Dockerfile and add it
        let dockerfileFound = false;
        
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          if (file.name.toLowerCase() === 'dockerfile') {
            formData.append('dockerfile', file);
            dockerfileFound = true;
          } else {
            formData.append('files', file);
          }
        }
        
        if (!dockerfileFound) {
          formData.append('dockerfile', uploadedFiles[0]);
        }
      } else {
        // Archive upload
        formData.append('archive', uploadedFiles[0]);
      }
      
      // Log formData for debugging
      console.log("Uploading Docker image with the following parameters:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name + ' (' + value.size + ' bytes)' : value}`);
      }
      
      // Debug the actual request that will be sent
      console.log("Request URL:", `${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/upload`);
      console.log("Authorization Token (first 10 chars):", process.env.NEXT_PUBLIC_DOCKET_API_TOKEN.substring(0, 10) + '...');
      
      // Use fetch API for upload
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/upload`, 
        {
          method: 'POST',
          headers: {
            
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
          },
          body: formData
        }
      );
      
      // Get the response text
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.warn("Could not parse response as JSON:", e);
        responseData = { error: responseText };
      }
      
      if (response.ok) {
        // Success - update UI
        setUploading(false);
        setUploadProgress(0);
        setUploadedFiles([]);
        setShowUploadForm(false);
        
        // Refresh the user images list
        fetchUserImages();
        
        // Check push status
        const isLocalOnly = responseData.status === 'local-only';
        
        if (isLocalOnly) {
          toast.success(
            <div>
              <p><strong>Image built successfully!</strong></p>
              <p className="text-sm mt-1">The image was built but not pushed to the registry. You can still use it locally.</p>
              <p className="text-xs mt-2">Administrator: Check registry credentials in .env file.</p>
            </div>, 
            { autoClose: 5000 }
          );
        } else {
          toast.success(
            <div>
              <p><strong>Image uploaded successfully!</strong></p>
              <p className="text-sm mt-1">The image was built and pushed to the registry.</p>
            </div>
          );
        }
      } else {
        // Handle error
        setUploading(false);
        
        // Get error message from response
        const errorMessage = responseData.error || responseData.message || 
          `Failed to upload (HTTP ${response.status})`;
        
        // Set error state and show toast
        setError(errorMessage);
        toast.error(`Failed to upload: ${errorMessage}`);
        console.error('Upload failed:', errorMessage);
        
        // Show suggestions based on error type
        if (errorMessage.includes("invalid reference format")) {
          toast.error("Image name format issue. Please contact support with the console logs.");
          console.error("DOCKER IMAGE NAME ERROR - Debug Info:");
          console.error("Original name:", e.target.name.value);
          console.error("Sanitized name:", imageName);
        }
      }
    } catch (error) {
      setUploading(false);
      console.error('Upload error:', error);
      const errorMsg = error.message || 'Unexpected error during upload. Please try again.';
      setError(errorMsg);
      toast.error('Upload failed: ' + errorMsg);
    }
  };

  // Also update the progress tracking for fetch API
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            return prev;
          }
          return prev + 5;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [uploading]);

  const dockerTemplates = {
    basic: `FROM ubuntu:latest
WORKDIR /app
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip
COPY . .
EXPOSE 8080
CMD ["python3", "app.py"]`,
    web: `FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
    ctf: `FROM ubuntu:latest
WORKDIR /challenge
RUN apt-get update && apt-get install -y \
    gcc \
    socat \
    python3
COPY flag.txt /challenge/
COPY challenge /challenge/
RUN chmod +x /challenge/challenge
EXPOSE 9999
CMD ["socat", "TCP-LISTEN:9999,fork,reuseaddr", "EXEC:/challenge/challenge"]`
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateContent(dockerTemplates[template]);
  };

  function ExpandedImageCard({ image, onClose }) {
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); 
    const [fileContent, setFileContent] = useState(''); 
    const [fileLoading, setFileLoading] = useState(false); 
    const [fileError, setFileError] = useState(null); 

    useEffect(() => {
      if (!image) return;
      setLoading(true);
      setError(null);
      fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/${image.id}/files`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch files');
          return res.json();
        })
        .then(setFiles)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [image]);

    const handleFileClick = (file) => {
      setSelectedFile(file);
      setFileContent('');
      setFileError(null);
      setFileLoading(true);
      // Use RepoTags[0] as image name if available, else fallback to image.name
      const imageName = image.RepoTags && image.RepoTags.length > 0 ? image.RepoTags[0] : image.name;
      fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/dummy/file?path=${encodeURIComponent(file.path)}&image=${encodeURIComponent(imageName)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('You can view files on a container that is running.');
          return res.text();
        })
        .then(content => setFileContent(content))
        .catch(err => setFileError(err.message))
        .finally(() => setFileLoading(false));
    };

    return (
      <div className="mt-4 shadow-xl bg-neutral-900/50  p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <i className="fas fa-folder-open text-blue-400"></i>
            Associated Files
          </h4>
        </div>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading files...</div>
        ) : error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : files && files.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {files.map(file => (
              <li
                key={file.path}
                className={`py-2 flex items-center justify-between cursor-pointer hover:bg-neutral-800 rounded ${selectedFile && selectedFile.path === file.path ? 'bg-neutral-800' : ''}`}
                onClick={e => { e.stopPropagation(); handleFileClick(file); }}
              >
                <span className="text-gray-200 font-mono truncate max-w-[180px]" title={file.path}>{file.name}</span>
                <span className="text-xs text-gray-400">{file.size} bytes</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-sm">No files found for this image/container.</div>
        )}
        {selectedFile && (
          <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-300 font-mono text-sm">{selectedFile.name}</span>
              <button className="text-xs text-gray-400 hover:text-red-400" onClick={() => setSelectedFile(null)}>Close</button>
            </div>
            {fileLoading ? (
              <div className="text-gray-400 text-sm">Loading file...</div>
            ) : fileError ? (
              <div className="text-red-400 text-sm">{fileError}</div>
            ) : (
              <pre className="overflow-x-auto whitespace-pre-wrap text-gray-200 text-xs max-h-64" style={{fontFamily:'monospace'}}>{fileContent}</pre>
            )}
          </div>
        )}
      </div>
    );
  }

  const handleOpenDeployModal = (image) => {
    setSelectedImageId(image.fullName || image.name || image.repo || '');
    setFormData(prev => ({
      ...prev,
      image: image.fullName || image.name || image.repo || '',
    }));
    setCreateContainerModalOpen(true);
  };

  const handleStartTestDeploy = async () => {
    setIsTestingDeploy(true);
    setBuildLogs([]);
    try {
      // Collect relevant data for test deploy
      // You may want to use selected image, port, env, and command from state or UI
      const imageName = formData.image || 'ubuntu:latest';
      const port = formData.ports && formData.ports.length > 0 ? formData.ports[0] : '3010';
      const env = formData.env || {}; // Add UI for env if needed
      const command = formData.command || []; // Add UI for command if needed
      const containerName = formData.containerName || generateCoolName();
      let creatorId = username;


      // creator username aka id
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/test-deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`,
        },
        body: JSON.stringify({ imageName, port, env, command, creatorId, challengeId, containerName }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setBuildLogs(prev => [...prev, ...chunk.split(/\r?\n/).filter(line => line.trim())]);
        }
      }
    } catch (error) {
      setBuildLogs([`Error: ${error.message}`]);
    } finally {
      setIsTestingDeploy(false);
    }
  };

  const handleStartDeploy = async () => {
    setIsTestingDeploy(false);
    setBuildLogs([]);
    try {
      // Collect relevant data for test deploy
      // You may want to use selected image, port, env, and command from state or UI
      const imageName = formData.image || 'ubuntu:latest';
      const port = formData.ports && formData.ports.length > 0 ? formData.ports[0] : '3010';
      const env = formData.env || {}; // Add UI for env if needed
      const command = formData.command || []; // Add UI for command if needed
      const containerName = formData.containerName || generateCoolName();
      let creatorId = username;


      // creator username aka id
      const response = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`,
        },
        body: JSON.stringify({ imageName, port, env, command, creatorId, challengeId, containerName }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');
      let done = false;
      let foundDomain = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split(/\r?\n/).filter(line => line.trim());
          setBuildLogs(prev => [...prev, ...lines]);
          if (!foundDomain) {
            for (const line of lines) {
              // Look for [DOMAIN] https://... or discordapp.com in the line
              let match = line.match(/\[DOMAIN\]\s*(https?:\/\/\S+)/);
              if (match) {
                foundDomain = true;
                break;
              }
              match = line.match(/https?:\/\/[\w.-]*discordapp\.com\S*/);
              if (match) {
                foundDomain = true;
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      setBuildLogs([`Error: ${error.message}`]);
    } finally {
      setIsTestingDeploy(false);
    }
  };

  // --- Add state for file editing of uploadedFiles ---
  const [editingFile, setEditingFile] = useState(null); // { index, name, value }
  const [uploadedFilesState, setUploadedFilesState] = useState([]); // mirrors uploadedFiles content for editing

  useEffect(() => {
    // Sync uploadedFilesState with uploadedFiles when files are selected
    setUploadedFilesState(Array.from(uploadedFiles).map(f => ({ name: f.name, content: null })));
  }, [uploadedFiles]);

  const handleEditUploadedFile = (index, e) => {
    if (e) e.stopPropagation();
    const file = uploadedFiles[index];
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditingFile({ index, name: file.name, value: e.target.result });
    };
    reader.readAsText(file);
  };

  const handleSaveUploadedFile = (newContent) => {
    // Create a new File object with the updated content
    const oldFile = uploadedFiles[editingFile.index];
    const updatedFile = new File([newContent], oldFile.name, { type: oldFile.type });
    const newFiles = Array.from(uploadedFiles);
    newFiles[editingFile.index] = updatedFile;
    setUploadedFiles(newFiles);
    setEditingFile(null);
  };

  const handleCloseEditor = () => setEditingFile(null);

  useEffect(() => {
    if (createContainerModalOpen) {
      document.body.style.overflow = 'hidden';
      setHasDeployedThisSession(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [createContainerModalOpen]);

  // Utility to generate a cool random container name
  function generateCoolName() {
    const adjectives = [
      'cool', 'mystic', 'cosmic', 'lucky', 'fuzzy', 'frosty', 'stellar', 'electric', 'brave', 'silent', 'rapid', 'sneaky', 'hyper', 'vivid', 'crimson', 'midnight', 'neon', 'shadow', 'wild', 'zen'
    ];
    const nouns = [
      'otter', 'lynx', 'falcon', 'panther', 'tiger', 'dragon', 'phoenix', 'orca', 'wolf', 'viper', 'crab', 'eagle', 'panda', 'shark', 'gecko', 'raven', 'stingray', 'badger', 'owl', 'fox'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}-${noun}-${num}`;
  }

  // --- Challenge ID to Name Map ---
  const challengeIdToName = {};
  const challengeIdToSlug = {};
  challengeList.forEach(chal => {
    if (chal && chal.id) {
      challengeIdToName[chal.id] = chal.name || chal.title || chal.slug || chal.id;
      challengeIdToSlug[chal.id] = chal.slug || chal.id;
    }
  });

  // Handle drag-and-drop for file upload
  const handleDropFiles = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles([...e.dataTransfer.files]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // --- Deployment UI logic based on logs ---
  const isDeploySuccess = buildLogs.some(line => line.includes("Discordbot/2.0; +https://discordapp.com"));
  const deployedDomain = (() => {
    let d = "";
    buildLogs.forEach(line => {
      const m = line.match(/\[DOMAIN\]\s*(https?:\/\/\S+)/);
      if (m) d = m[1];
    });
    return d;
  })();

  return (
    <>
      <Head>
        <title>Docker Containers - CTFGuide</title>
      </Head>
      <StandardNav />
      <main className="min-h-screen bg-gradient-to-b from-neutral-900/50 via-neutral-900/30 to-neutral-800/20 backdrop-blur-xl">
        {/* Secondary Navigation */}
        <div className="border-b border-[#232323] bg-[#161616]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-16">
              <Link 
                href="/create"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-transparent text-neutral-400 hover:text-white hover:border-[#333333]"
              >
                Home
              </Link>
              <Link 
                href="/create/compute"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-blue-500 text-white"
              >
                <i className="fas fa-server mr-2"></i>
                Docker Containers <span className="text-xs text-blue-400 px-1 ml-2  rounded bg-blue-900 text-white ">BETA</span>
              </Link>
           <Link 
                href="/create/earnings"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-transparent text-neutral-400 hover:text-white hover:border-[#333333]"
              >
                <i className="fas fa-wallet mr-2"></i>
                Earnings
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* User Images Section */}
          <div className="bg-[#161616]/80 backdrop-blur-xl rounded-none border border-[#232323] shadow-2xl p-8 mb-8 transition-all duration-300 hover:border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <i className="fas fa-cubes mr-3 text-blue-500"></i>
              Your Container Images
            </h2>

            
            <div className="flex space-x-4">
                <button 
                  onClick={() => { setShowUploadForm(!showUploadForm); setShowForm(false); }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-none transition-all duration-200 flex items-center"
                >
                  <i className={`fas ${showUploadForm ? 'fa-minus' : 'fa-upload'} mr-2`}></i>
                  {showUploadForm ? 'Cancel' : 'Upload Image'}
                </button>
              </div>
              </div>


            <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-3 mb-8 w-full">
             
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Search by Name</label>
                <input
                  type="text"
                  placeholder="e.g. ubuntu"
                  className="bg-neutral-800 border border-neutral-700  px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                  value={imageSearch}
                  onChange={e => { setImageSearch(e.target.value); setImagePage(1); }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Filter by Tag</label>
                <input
                  type="text"
                  placeholder="e.g. latest"
                  className="bg-neutral-800 border border-neutral-700  px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                  value={imageTagFilter}
                  onChange={e => { setImageTagFilter(e.target.value); setImagePage(1); }}
                />
              </div>
            </div>

     
        {/* Image Upload Form */}
        {showUploadForm && (
              <div className="bg-[#1c1c1c]/90 rounded-none p-6 border border-[#2a2a2a] mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Upload Container Image</h3>
                
                {uploading ? (
                  <div className="mb-6">
                    <p className="text-white mb-2">Uploading... {uploadProgress}%</p>
                    <div className="w-full bg-neutral-800 rounded-none h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-none" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Template Options */}
                    {uploadType === 'dockerfile' && (
                      <div className="mb-6 bg-neutral-900 rounded-none p-4 border border-neutral-700">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id="useTemplate"
                            checked={useTemplate}
                            onChange={() => setUseTemplate(!useTemplate)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded-none"
                          />
                          <label htmlFor="useTemplate" className="ml-2 text-white font-medium">Use a Dockerfile template</label>
                        </div>
                        
                        {useTemplate && (
                          <div className="mt-3">
                            <div className="flex space-x-2 mb-3">
                              <button
                                type="button"
                                onClick={() => selectTemplate('basic')}
                                className={`px-3 py-1.5 rounded-none text-sm ${selectedTemplate === 'basic' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'}`}
                              >
                                Basic
                              </button>
                              <button
                                type="button"
                                onClick={() => selectTemplate('web')}
                                className={`px-3 py-1.5 rounded-none text-sm ${selectedTemplate === 'web' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'}`}
                              >
                                Web Server
                              </button>
                              <button
                                type="button"
                                onClick={() => selectTemplate('ctf')}
                                className={`px-3 py-1.5 rounded-none text-sm ${selectedTemplate === 'ctf' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'}`}
                              >
                                CTF Challenge
                              </button>
                            </div>
                            
                            {selectedTemplate && (
                              <div className="mt-3">
                                <div className="flex justify-between mb-2">
                                  <label className="block text-sm font-medium text-gray-400">Template Preview</label>
                                  <button
                                    type="button"
                                    onClick={() => setEditingTemplate(!editingTemplate)}
                                    className="text-sm text-blue-500 hover:text-blue-400"
                                  >
                                    {editingTemplate ? 'Preview' : 'Edit'}
                                  </button>
                                </div>
                                
                                {!editingTemplate ? (
                                  <pre className="w-full h-60 bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white font-mono text-sm overflow-auto">
                                    {templateContent}
                                  </pre>
                                ) : (
                                  <textarea
                                    value={templateContent}
                                    onChange={(e) => setTemplateContent(e.target.value)}
                                    className="w-full h-60 bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                )}
                                
                                <div className="mt-3 flex flex-col space-y-2">
                                  <div className="text-sm text-gray-400">
                                    <strong>Files to be included:</strong>
                                    <ul className="list-disc pl-5 mt-1">
                                      <li>Dockerfile</li>
                                      {selectedTemplate === 'web' && (
                                        <li>index.html (Sample web page)</li>
                                      )}
                                      {selectedTemplate === 'ctf' && (
                                        <>
                                          <li>flag.txt (Sample flag)</li>
                                          <li>challenge (Sample vulnerable C program)</li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={createDockerfileFromTemplate}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-none transition-all duration-200"
                                  >
                                    Use This Template
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <form onSubmit={handleUpload}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Image Name</label>
                          <input
                            type="text"
                            name="name"
                            className="disabled w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="my-web-challenge"
                            pattern="[a-z0-9][a-z0-9._-]*"
                            title="Image name must be lowercase and can only contain lowercase letters, numbers, dashes, underscores, and periods. It must start with a letter or number."
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">Use lowercase letters, numbers, dashes, underscores and periods only.</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Exposed Port</label>
                          <input
                            type="text"
                            name="port"
                            defaultValue="80"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="80"
                            disabled
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">At the moment, only port 80 is supported.</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                          <textarea
                            name="description"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="A brief description of your container"
                            rows="2"
                          ></textarea>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">Upload Type</label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="uploadType"
                                value="dockerfile"
                                checked={uploadType === 'dockerfile'}
                                onChange={() => setUploadType('dockerfile')}
                                className="form-radio text-blue-500"
                              />
                              <span className="text-gray-300">Dockerfile + Files</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer hidden">
                              <input
                                type="radio"
                                name="uploadType"
                                value="archive"
                                checked={uploadType === 'archive'}
                                onChange={() => setUploadType('archive')}
                                className="form-radio text-blue-500"
                              />
                              <span className="text-gray-300">Archive (.tar.gz)</span>
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            {uploadType === 'dockerfile' ? 'Upload Dockerfile and supporting files' : 'Upload archive'}
                          </label>
                          {!(useTemplate && uploadedFiles.length > 0 && uploadType === 'dockerfile') && (
                            <div className="flex items-center justify-center w-full"
                             onDrop={handleDropFiles}
                             onDragOver={handleDragOver}
                            >
                              <label className="flex flex-col w-full h-32 border-2 border-dashed border-neutral-600 hover:border-blue-500 rounded-none p-4 transition-all cursor-pointer">
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                  <i className="fas fa-cloud-upload-alt text-neutral-500 text-3xl mb-2"></i>
                                  <p className="text-neutral-500">
                                    {uploadedFiles.length > 0 
                                      ? `Selected ${uploadedFiles.length} file(s)` 
                                      : 'Click to browse or drag files here'}
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  multiple={uploadType === 'dockerfile'}
                                  required={uploadedFiles.length === 0 && !useTemplate}
                                />
                              </label>
                            </div>
                          )}
                          {uploadedFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-400 mb-2">Selected files:</p>
                              <div className="bg-neutral-900 rounded-none p-3 border border-neutral-700">
                                <ul className="text-sm text-gray-300 space-y-1">
                                  {Array.from(uploadedFiles).map((file, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <span className={file.name.toLowerCase() === 'dockerfile' ? 'text-blue-400' : 'text-green-400'}>
                                        <i className={`fas ${file.name.toLowerCase() === 'dockerfile' ? 'fa-file-code' : 'fa-file'} mr-2`}></i>
                                      </span>
                                      <span>{file.name}</span>
                                      <span className="ml-2 text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                                      <button
                                        type="button"
                                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                        onClick={e => handleEditUploadedFile(index, e)}
                                      >Edit</button>
                                    </li>
                                  ))}
                                </ul>
                                {selectedTemplate && uploadedFiles.some(file => file.name === 'Dockerfile') && (
                                  <p className="mt-3 text-xs text-blue-400 hidden">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    These files were generated from the {selectedTemplate} template.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-none transition-all duration-200"
                          disabled={uploadedFiles.length === 0}
                        >
                          <i className="fas fa-upload mr-2"></i>
                          Upload Image
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {paginatedImages.map((image, idx) => {
                const imageName = image.name || image.fullName || image.repo || '';
                const tag = image.fullName || (image.RepoTags && image.RepoTags[0]) || '';
                const uniqueKey = `${imageName}__${tag}` || idx;
                const expandedKey = uniqueKey;
                const created = image.created || (image.Created ? new Date(image.Created * 1000).toISOString() : null);
                const size = image.size || (image.Size ? (image.Size / (1024 * 1024)).toFixed(2) + ' MB' : null);
                return (
                  <div
                    key={uniqueKey}
                    className={`bg-neutral-700/20 hover:bg-neutral-800    shadow-lg p-5 transition-all hover:shadow-xl cursor-pointer   ${expandedImageId === expandedKey ? 'border-t-4 border-blue-500 bg-neutral-800' : ''}`}
                    onClick={() => setExpandedImageId(expandedImageId === expandedKey ? null : expandedKey)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 mb-2">
                        <i className="fas fa-cube text-blue-500"></i>
                        <h3 className="text-xl font-bold text-white truncate max-w-xs" title={imageName}>
                          {imageName}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-y-1 text-xs text-gray-400 mt-2">
                        <div><span className="font-semibold text-gray-300">Name:</span> <span className="break-all">{imageName}</span></div>
                        <div><span className="font-semibold text-gray-300">Tag:</span> <span className="break-all">{tag}</span></div>
                        <div><span className="font-semibold text-gray-300">Created:</span> {created ? new Date(created).toLocaleString() : 'N/A'}</div>
                        <div><span className="font-semibold text-gray-300">Size:</span> {size || 'N/A'}</div>
                        {image.fullName && <div><span className="font-semibold text-gray-300">Full Name:</span> {image.fullName}</div>}
                        {image.description && <div><span className="font-semibold text-gray-300">Description:</span> {image.description}</div>}
                        {image.RepoTags && image.RepoTags.length > 0 && (
                          <div><span className="font-semibold text-gray-300">Tags:</span> {image.RepoTags.join(', ')}</div>
                        )}
                        {image.Labels && (
                          <div><span className="font-semibold text-gray-300">Labels:</span> {Object.entries(image.Labels).map(([k, v]) => `${k}:${v}`).join(', ')}</div>
                        )}
                      </div>
                    </div>
                    
                    {expandedImageId === expandedKey && (
                      <>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenDeployModal(image);
                            }}
                            className="w-full px-5 py-2 border border-blue-600 hover:border-blue-700 text-blue-600 font-semibold shadow-md transition-all flex items-center justify-center "
                          >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Deploy as Container
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedImageId(expandedKey);
                              setDeleteImageModalOpen(true);
                            }}
                            className="w-full px-5 py-2 border border-red-600 hover:border-red-700 text-red-600 font-semibold shadow-md transition-all flex items-center justify-center "
                          >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Destroy Image
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {totalPages > 1 && (
              <div className="flex  justify-end  mt-10 items-center gap-4 mb-6">
                <button onClick={() => setImagePage(p => Math.max(1, p-1))} disabled={imagePage===1} className="px-4 py-2  bg-neutral-800 border border-neutral-700 text-white disabled:opacity-50 hover:bg-neutral-700">Prev</button>
                <span className="text-sm text-gray-300">Page <span className="font-semibold text-white">{imagePage}</span> of <span className="font-semibold text-white">{totalPages}</span></span>
                <button onClick={() => setImagePage(p => Math.min(totalPages, p+1))} disabled={imagePage===totalPages} className="px-4 py-2  bg-neutral-800 border border-neutral-700 text-white disabled:opacity-50 hover:bg-neutral-700">Next</button>
              </div>
            )}
          </div>


          {/* Container Overview */}
          <div className="bg-[#161616]/80 backdrop-blur-xl rounded-none border border-[#232323] shadow-2xl p-8 mb-8 transition-all duration-300 hover:border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <i className="fas fa-server mr-3 text-blue-500"></i>
                Docker Containers
            </h2>
            
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-none mb-6">
                <p>{error}</p>
              </div>
            )}

    
            {/* New Container Form */}
            {showForm && (
              <div className="bg-[#1c1c1c]/90 rounded-none p-6 border border-[#2a2a2a] mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Create New Container</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Container Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="my-web-challenge"
                        required
                      />
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                        onClick={() => setFormData(f => ({ ...f, name: generateCoolName() }))}
                        title="Generate random name"
                      >
                        Randomize
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>
                      <select
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="ubuntu:latest">Ubuntu (Latest)</option>
                        {userImages.map(image => (
                          <option key={image.fullName || image.id} value={image.fullName || image.name}>{image.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Memory (MB)</label>
                      <select
                        name="memory"
                        value={formData.memory}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="256">256 MB</option>
                        <option value="512">512 MB</option>
                        <option value="1024">1 GB</option>
                        <option value="2048">2 GB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">CPU Cores</label>
                      <select
                        name="cpu"
                        value={formData.cpu}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="0.5">0.5 Core</option>
                        <option value="1">1 Core</option>
                        <option value="2">2 Cores</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-none transition-all duration-200"
                    >
                      Create Container
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Container Filtering UI */}
            <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-3 mb-8 w-full">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Search Containers</label>
                <input
                  type="text"
                  placeholder="Subdomain, Container Name, Image Name, Challenge ID"
                  className="bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                  value={containerSearch}
                  onChange={e => { setContainerSearch(e.target.value); setContainerPage(1); }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">Filter by Port</label>
                <input
                  type="text"
                  placeholder="e.g. 5000"
                  className="bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                  value={containerPortFilter}
                  onChange={e => { setContainerPortFilter(e.target.value); setContainerPage(1); }}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : paginatedContainers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subdomain</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Port</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Container Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Challenge</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {paginatedContainers.map((container) => (
                      <tr key={container.id || container.subdomain} onClick={() => {
                        setSelectedContainer(container);
                        setConfigureModalOpen(true);
                      }} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          
                          <span
                            className="text-blue-400 hover:underline hover:text-blue-500 cursor-pointer flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open subdomain in new tab
                              window.open(`https://${container.subdomain}.ctfgui.de`, '_blank');
                            }}
                            title={`Open ${container.subdomain}.ctfgui.de`}
                          >
                                                        <i className="fa fa-globe"></i>
                                                        {container.subdomain}
                            </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{container.port}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{container.containerName || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{container.imageName || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {challengeIdToName[container.challengeId] ? (
                            <span
                              className="text-blue-400 hover:underline hover:text-blue-500 cursor-pointer flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Go to challenge detail page
                                window.open(`/challenges/${challengeIdToSlug[container.challengeId]}`, '_blank');
                              }}
                              title={`Open challenge: ${challengeIdToName[container.challengeId]}`}
                            >
                              {challengeIdToName[container.challengeId]}
                            </span>
                          ) : (
                            container.challengeId || '-'
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{container.createdAt ? new Date(container.createdAt).toLocaleString() : '-'}</td>
                        <td className="flex   gap-1 px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            className="hidden px-3 py-1 bg-blue-800 text-blue-200 rounded hover:bg-blue-700 hover:text-white flex items-center gap-2 w-full justify-center"
                            onClick={() => {
                              setSelectedContainer(container);
                              setConfigureModalOpen(true);
                            }}
                            title="Configure Container"
                          >
                            <i className="fa fa-cog"></i>
                            Configure
                          </button>
                          <button
                            className="px-3 py-1 bg-green-800 text-green-200 rounded hover:bg-green-700 hover:text-white flex items-center gap-2 w-full justify-center"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_DOCKET_URL}/api/challenge-containers/reboot`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOCKET_API_TOKEN}`
                                  },
                                  body: JSON.stringify({ id: container.containerId }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  toast.success('Container rebooted successfully!');
                                } else {
                                  toast.error(data.error || 'Failed to reboot container');
                                }
                              } catch (err) {
                                toast.error('Failed to reboot container');
                              }
                            }}
                            title="Reboot Container"
                          >
                            <i className="fa fa-sync"></i>
                            Reboot
                          </button>
                          <button
                            className="px-3 py-1 bg-red-800 text-red-200 rounded hover:bg-red-700 hover:text-white flex items-center gap-2 w-full justify-center"
                            onClick={(e) => {
                              e.stopPropagation();

                              const confirm = window.prompt("Are you sure you want to delete this container? This action cannot be undone. Type 'yes' to confirm.")
                              if (confirm === "yes") {
                                deleteContainer(container.containerId);
                                toast.success('Container deleted successfully!');
                              } else {
                                toast.warning('Container deletion cancelled.');
                              }
                            }}
                            title="Delete Container"
                          >
                            <i className="fa fa-trash"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
             
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-blue-500/10 rounded-full p-4 mb-4">
                  <i className="fas fa-server text-4xl text-blue-500"></i>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Containers Yet</h3>
                <p className="text-gray-400 max-w-md">
                  Create your first Docker container to host your CTF challenges. Containers provide isolated environments for your challenges.
                </p>
            </div>
            )}

<div className="flex justify-between items-center mt-4">
                  <div className="text-gray-400 text-xs">
                    Showing {(containerPage-1)*containersPerPage+1} - {Math.min(containerPage*containersPerPage, filteredContainers.length)} of {filteredContainers.length} containers
                  </div>
                  <div className="flex gap-2 justify-end items-center">
                    <button
                      className="px-3 py-1 bg-neutral-800 text-gray-300 rounded disabled:opacity-50"
                      onClick={() => setContainerPage(p => Math.max(1, p-1))}
                      disabled={containerPage === 1}
                    >Prev</button>
                    <span className="text-gray-400 text-xs">Page {containerPage} of {containerTotalPages || 1}</span>
                    <button
                      className="px-3 py-1 bg-neutral-800 text-gray-300 rounded disabled:opacity-50"
                      onClick={() => setContainerPage(p => Math.min(containerTotalPages, p+1))}
                      disabled={containerPage === containerTotalPages || containerTotalPages === 0}
                    >Next</button>
                  </div>
                </div>
          </div>

          
          
        </div>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
      
      {/* Deploy Container Modal */}
      {createContainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 mx-auto ">
          <div className="bg-neutral-900 rounded-lg shadow-xl px-8  pb-4 w-full max-w-7xl relative grid grid-cols-6 items-center">
            <div className="col-span-3">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
              onClick={() => setCreateContainerModalOpen(false)}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center pb-2">
              <ServerIcon className="w-6 h-6 mr-2 text-blue-500" />
              Deploy Container
            </h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Container Name <button type="button" className=" ml-1 w-1  hover:text-blue-500  text-white rounded text-xs  transition" onClick={() => setFormData(f => ({ ...f, name: generateCoolName() }))} title="Generate random name"><i className="fa fa-sync"></i></button></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 rounded-none"
                  required
                />

              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Image</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 rounded-none"
                  disabled
                  readOnly={!!selectedImageId}
                />
              </div>
              <div className="mb-4 hidden">
                <label className="block text-gray-300 text-sm mb-1">Container Mode</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    className="flex-1 relative"
                  >
                    <span className="absolute bottom-1/2 left-1/2 bg-neutral-800 bg-opacity-90 -translate-x-1/2 z-20 px-2 py-0.5 rounded text-md text-blue-500 font-semibold opacity-100 pointer-events-auto" style={{filter:'none'}}> Coming Soon </span>
                    <div className="opacity-50 cursor-not-allowed border rounded-lg p-4 flex flex-col items-center transition-all duration-150">
                      <div className="mb-2 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1112 21a9.003 9.003 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="font-semibold text-sm text-gray-200 text-center">Each user gets their own container</div>
                      <div className="text-xs mt-1 text-gray-400 text-center">Best for isolation and security</div>
                    </div>
                  </div>
                  <div
                    className={`flex-1 cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-all duration-150 ${containerMode === 'single-instance' ? 'border-blue-500 bg-blue-900/30 shadow-lg' : 'border-neutral-700 bg-neutral-900 hover:border-blue-700'}`}
                    onClick={() => setContainerMode('single-instance')}
                  >
                    <div className="mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="8" x="2" y="6" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 10h.01M6 14h.01M18 10h.01M18 14h.01"/></svg>
                    </div>
                    <div className="font-semibold text-sm text-gray-200 text-center">Single container (shared by all)</div>
                    <div className="text-xs mt-1 text-gray-400 text-center">Best for shared/static challenges</div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">Bind to Challenge (Optional)</label>
                <select
                  value={challengeId}
                  onChange={e => setChallengeId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 rounded-none"
                >
                  <option value="">Select a challenge...</option>
                  {challengeList && challengeList.length > 0 ? (
                    challengeList.map(chal => (
                      <option key={chal.id || chal._id || chal.slug} value={chal.id || chal._id || chal.slug}>
                        {chal.title || chal.name || chal.slug}
                      </option>
                    ))
                  ) : (
                    <option disabled value="">No challenges found</option>
                  )}
                </select>
              </div>
           
              {error && <div className="text-red-400 mb-3">{error}</div>}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button 
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-none shadow-md transition-all"
                  onClick={handleStartTestDeploy}
                >
                  Test Deployment
                </button>
                <button
                  className={`flex-1 py-2 px-4 bg-green-700  text-white font-semibold rounded-none shadow-md transition-all ${hasDeployedThisSession ? 'bg-green-900 cursor-not-allowed ' : 'hover:bg-green-800'} flex items-center justify-center gap-2`}
                  onClick={() => {
                    setHasDeployedThisSession(true);
                    handleStartDeploy();
                  }}
                  disabled={isLoading || hasDeployedThisSession}
                >
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Deploying...' : hasDeployedThisSession ? <i className="fas fa-check"></i> : 'Deploy Container'}
                </button>
              </div>
            </div>
          </div>
       
   
          <div id="deploysuccess" className="col-span-3 ml-4 mt-2 justify-center items-center">
            {isDeploySuccess ? (
              <div className="flex flex-col items-center justify-center h-full px-10">
      
                <div className="mb-4 w-[300px] h-[250px] rounded-xl">
                  <ComposableMap
                    projection="geoAlbersUsa"
                    width={300}
                    height={250}
                    projectionConfig={{ center: [0, 0], scale: 400, rotation: 0, }}
                    style={{ background: 'transparent' }}
                  >
                    <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
                      {({ geographies }) =>
                        geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#23272f"
                            stroke="#334155"
                            style={{ outline: 'none', filter: 'drop-shadow(0 2px 8px #0ea5e955)' }}
                          />
                        ))
                      }
                    </Geographies>
                    {/* State College, PA marker with pulse */}
                    <Marker coordinates={[-77.8600, 40.7934]}>
                      <circle r={8} fill="#34a3ff" stroke="#34a3ff" strokeWidth={0.05} style={{ filter: 'drop-shadow(0 0 10px #4adeffb3)' }} />
                    </Marker>                </ComposableMap>
                </div>
                {/* Region label */}
                <div className="text-blue-300 font-semibold text-sm mb-4">
                  US East (State College, PA)
                </div>
                {/* Domain box */}
                <div className="bg-neutral-800 rounded-lg p-4 w-full max-w-md text-center shadow border border-neutral-700 mb-4">
                  <div className="text-gray-400 text-xs mb-1">Autogenerated Domain</div>
                  <div className="text-md font-mono text-blue-400 break-all select-all">{deployedDomain}</div>
                </div>
                {/* Description */}
                <div className="text-gray-400 text-xs mt-2 text-center max-w-xs">
                  {isTestingDeploy
                    ? "This is a test deployment. It will automatically expire in 5 minutes. Use this environment for testing only."
                    : "Your container will be on our servers in State College, PA (US East). "}
                </div>
              </div>
            ) : (
              <div className="bg-black/80 h-[400px] text-white font-mono text-xs rounded p-4  overflow-y-auto border border-neutral-800" id="build-log-stream">
                {/* Build logs will be streamed here */}
                <p>Build logs will show here...</p>
                <br></br>
                {isTestingDeploy && (
                  <>
                    <p className="text-red-400">This test deployment will be active for 5 minutes.</p>
                    <br></br>
                  </>
                )}

                <pre className="text-yellow-400 text-xs">
                  {`
 dP\"\"b8 888888 888888  dP\"\"b8 88   88 88 8888b.  888888 
dP   \"\"   88   88__   dP   \"\" 88   88 88  8I  Yb 88__   
Yb        88   88\""   Yb  \"88 Y8   8P 88  8I  dY 88\""   
 YboodP   88   88      YboodP \`YbodP\' 88 8888Y"  888888 
`}
                </pre>
<br></br>
                <p>Note, sometimes we can't automatically detect when a container is ready. You can verify if your container is accessible by clicking on the generated domain.</p>
                <br></br>
                <p className="text-cyan-400">Log streaming is highly experimental and may not work for all containers.</p>
                <br></br>
                {buildLogs.map((line, idx) => {
                  // Remove leading "data: " if present
                  const cleanLine = line.replace(/^data: ?/, "");
                  // Regex to match URLs
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  // Split the line by URLs, keeping the URLs
                  const parts = cleanLine.split(urlRegex);
                  return (
                    <div key={idx}>
                      {parts.map((part, i) =>
                        urlRegex.test(part) ? (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-400 hover:text-blue-300 break-all"
                          >
                            {part}
                          </a>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>
        </div>


      )}

{editingFile && (
  <FileEditorModal
    fileName={editingFile.name}
    initialValue={editingFile.value}
    onSave={handleSaveUploadedFile}
    onClose={handleCloseEditor}
  />
)}
    <ConfigureContainerModal
      open={configureModalOpen}
      onClose={() => setConfigureModalOpen(false)}
      container={selectedContainer}
    />
    </>
   
  );
}