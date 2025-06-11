import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CodeBracketIcon, PaperClipIcon, ArrowUpOnSquareIcon, SparklesIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import BountyLayout from '../../../components/layouts/BountyLayout';
import RecordingModal from '../../../components/modals/RecordingModal';

// This would be your editor component
const MockEditor = ({ value, onChange }) => (
    <textarea
        className="w-full h-64 bg-neutral-800 border border-neutral-700 p-4 text-white font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="## Vulnerability Details..."
    />
);

export default function SubmitBounty() {
    const router = useRouter();
    const { id: bountyId } = router.query;
    const [bounty, setBounty] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classification, setClassification] = useState('');
    const [otherClassification, setOtherClassification] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

    const classificationOptions = ['XSS', 'SQL Injection', 'RCE', 'IDOR', 'CSRF', 'Other'];

    useEffect(() => {
        if (bountyId) {
            // Fetch bounty details to display some info on the page
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties`)
                .then(res => res.json())
                .then(bounties => {
                    const currentBounty = bounties.find(b => b.id.toString() === bountyId);
                    setBounty(currentBounty);
                });
        }
    }, [bountyId]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...e.target.files]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setAttachments(prev => [...prev, ...e.dataTransfer.files]);
            e.dataTransfer.clearData();
        }
    };

    const handleSubmit = async (isDraft) => {
        if (!title || !description) {
            toast.error('Please fill out the title and description.');
            return;
        }

        // TODO: Replace with actual logged-in user ID
        const authorId = '0c613565-f48a-446b-a24a-76b185350361';

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties/${bountyId}/submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    isDraft,
                    authorId,
                    classification: classification === 'Other' ? otherClassification : classification,
                    // attachments would be handled by a separate upload endpoint
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit.');
            }

            toast.success(`Submission ${isDraft ? 'saved as draft' : 'submitted'} successfully!`);
            setTimeout(() => router.push(`/`), 2000);

        } catch (error) {
            toast.error(error.message || 'An error occurred.');
        }
    };
    
    if (!bounty) {
        return <div className="bg-neutral-900 text-white min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <BountyLayout bounty={bounty}>
            <div className="py-8">
                <ToastContainer theme="dark" position="bottom-right" />
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <p className="text-blue-400">{bounty.company}</p>
                        <h1 className="text-2xl text-white font-bold truncate">{bounty.title}</h1>
                        <h2 className="text-xl text-white font-semibold mt-4">New Submission</h2>

                        <div className="bg-purple-900/50 border border-purple-700/50 p-4 mt-4 ">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <SparklesIcon className="h-6 w-6 text-purple-300 flex-shrink-0" />
                                    <p className="text-md text-purple-200">
                                        We noticed you used a workspace.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-3 flex-shrink-0 sm:ml-4">
                                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4  text-sm transition-colors">
                                        <ArrowUpOnSquareIcon className="h-5 w-5" />
                                        <span>Attach Workspace</span>
                                    </button>
                                    <button 
                                        onClick={() => setIsRecordingModalOpen(true)}
                                        className="flex items-center gap-2 bg-purple-800/50 hover:bg-purple-800/90 border border-purple-700 text-purple-300 font-bold py-2 px-4  text-sm transition-colors"
                                    >
                                        <VideoCameraIcon className="h-5 w-5" />
                                        <span>Attach Recording</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-lg font-medium text-neutral-300 mb-2">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white"
                                placeholder="e.g., Cross-Site Scripting (XSS) in Profile Page"
                            />
                        </div>

                        <div>
                            <label htmlFor="classification" className="block text-lg font-medium text-neutral-300 mb-2">Classification</label>
                            <select
                                id="classification"
                                value={classification}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setClassification(value);
                                    setShowOtherInput(value === 'Other');
                                }}
                                className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white"
                            >
                                <option value="" disabled>Select a vulnerability type</option>
                                {classificationOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {showOtherInput && (
                             <div>
                                <label htmlFor="other-classification" className="block text-lg font-medium text-neutral-300 mb-2">Please Specify</label>
                                <input
                                    type="text"
                                    id="other-classification"
                                    value={otherClassification}
                                    onChange={(e) => setOtherClassification(e.target.value)}
                                    className="w-full bg-neutral-800 border border-neutral-700 p-3 text-white"
                                    placeholder="e.g., Business Logic Error"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="description" className="block text-lg font-medium text-neutral-300 mb-2">Vulnerability Report</label>
                            <MockEditor value={description} onChange={setDescription} />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-neutral-300 mb-2">Attachments (Optional)</label>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${isDragging ? 'border-blue-500 bg-neutral-800/50' : 'border-neutral-700'}`}
                            >
                                <div className="text-center">
                                    <PaperClipIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-neutral-800 font-semibold text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-blue-500"
                                        >
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF, MP4 up to 10MB</p>
                                </div>
                            </div>
                            {attachments.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-neutral-300">Selected files:</p>
                                    <ul className="list-disc list-inside">
                                        {attachments.map(file => <li key={file.name} className="text-sm text-neutral-400">{file.name}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleSubmit(true)}
                                className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSubmit(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center gap-2"
                            >
                                <ArrowUpOnSquareIcon className="h-5 w-5" />
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <RecordingModal 
                isOpen={isRecordingModalOpen} 
                onClose={() => setIsRecordingModalOpen(false)} 
            />
        </BountyLayout>
    );
} 