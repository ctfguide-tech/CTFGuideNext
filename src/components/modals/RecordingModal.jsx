import { useState } from 'react';
import { XMarkIcon, EyeIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const mockRecordings = [
    { id: 1, name: 'Initial Reconnaissance', duration: '15:32', date: '2023-10-26', videoUrl: './terminalproof.mp4' },
    { id: 2, name: 'Exploiting XSS', duration: '08:45', date: '2023-10-26', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 3, name: 'Privilege Escalation Path', duration: '22:10', date: '2023-10-25', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 4, name: 'Data Exfiltration Test', duration: '05:00', date: '2023-10-24', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export default function RecordingModal({ isOpen, onClose }) {
    const [previewingId, setPreviewingId] = useState(null);

    if (!isOpen) return null;

    const togglePreview = (id) => {
        setPreviewingId(previewingId === id ? null : id);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-neutral-900 border border-neutral-700 text-white w-full max-w-2xl shadow-2xl p-8 rounded-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Attach Recording Session</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="h-7 w-7" />
                    </button>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {mockRecordings.map(rec => (
                        <div key={rec.id} className="bg-neutral-800/50 p-4 border border-neutral-700/50  transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{rec.name}</p>
                                    <p className="text-sm text-neutral-400">
                                        Duration: {rec.duration} | Recorded: {new Date(rec.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => togglePreview(rec.id)}
                                    className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 text-sm rounded-md transition-colors"
                                >
                                    {previewingId === rec.id ? <ChevronUpIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5" />}
                                    <span>{previewingId === rec.id ? 'Close' : 'Preview'}</span>
                                </button>
                            </div>
                            {previewingId === rec.id && (
                                <div className="mt-4 border-t border-neutral-700 pt-4">
                                    <video key={rec.id} className="w-full rounded-lg" controls autoPlay muted>
                                        <source src={rec.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="mt-4 flex justify-end">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm rounded-md transition-colors">
                                            Attach this recording
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 