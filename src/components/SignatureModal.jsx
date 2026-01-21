import { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const LegalText = () => (
    <div className="prose prose-invert prose-sm max-w-none text-neutral-300 space-y-4">
        <h3 className="text-lg font-bold text-white">Terms of Service for Bounty Programs</h3>
        <p>This Agreement ("Agreement") is a binding contract between you ("Host," "you," or "your") and CTFGuide ("Platform," "we," "us," or "our"). By creating a bug bounty program on our platform, you agree to these terms.</p>
        
        <h4 className="font-semibold text-neutral-200">1. Program Scope and Rewards</h4>
        <p>You are responsible for clearly defining the scope of your bounty program, including which assets are in-scope and out-of-scope. You must set reward amounts in good faith and are obligated to pay for all valid, unique, and in-scope vulnerability reports based on the severity levels you have defined.</p>

        <h4 className="font-semibold text-neutral-200">2. Responsible Disclosure and Communication</h4>
        <p>You agree to follow the principles of responsible disclosure. This includes responding to researcher submissions in a timely manner (e.g., acknowledging receipt within 2 business days, providing a first-pass analysis within 5 business days), and communicating openly about the validation and remediation process.</p>

        <h4 className="font-semibold text-neutral-200">3. Payouts</h4>
        <p>All rewards must be paid out to researchers within 14 days of a report being triaged and validated as a legitimate vulnerability. CTFGuide will facilitate these payments through its integrated payment processors. Disputes over payments will be mediated by CTFGuide, whose decision will be binding.</p>

        <h4 className="font-semibold text-neutral-200">4. Data Handling and Confidentiality</h4>
        <p>All submission details are confidential. You agree not to disclose any part of a submission or the researcher's identity to any third party without the express written consent of the researcher. You will handle all data in accordance with our Privacy Policy.</p>
        
        <h4 className="font-semibold text-neutral-200">5. Acknowledgment and Agreement</h4>
        <p>By signing this document, you acknowledge that you have read, understood, and agree to be bound by these terms. You confirm that you have the authority to represent your organization in this legally binding agreement. Failure to comply with these terms may result in the suspension or termination of your bounty program and your account on the CTFGuide platform.</p>
    </div>
);


export function SignatureModal({ isOpen, onClose, onSave }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on container
    const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 192; // h-48
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const getEventPosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        if (event.touches && event.touches.length > 0) {
            return {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };
        }
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        isDrawing.current = true;
        const { x, y } = getEventPosition(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing.current) return;
        e.preventDefault();
        const { x, y } = getEventPosition(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing.current) {
            isDrawing.current = false;
            setIsSigned(true);
        }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isOpen]);


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const saveSignature = () => {
    if (!isSigned) {
        alert("Please provide your signature.");
        return;
    }
    const signatureData = canvasRef.current.toDataURL('image/png');
    onSave(signatureData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-700/50 text-white w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-2xl font-bold text-white">Bounty Program Agreement</h2>
            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                <XMarkIcon className="h-7 w-7" />
            </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-6">
            <LegalText />

            <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                    Please sign in the box below to accept the terms:
                </label>
                <div className="bg-white rounded-lg h-48 w-full">
                    <canvas
                        ref={canvasRef}
                        className="rounded-lg"
                    />
                </div>
                 <button 
                    onClick={clearCanvas} 
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2"
                >
                    Clear Signature
                </button>
            </div>
        </div>

        <div className="flex justify-end items-center p-6 border-t border-neutral-800 bg-neutral-900/50">
            <button onClick={onClose} className="text-neutral-300 font-semibold py-2 px-4 mr-3">
                Cancel
            </button>
            <button 
                onClick={saveSignature} 
                disabled={!isSigned}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors ${!isSigned ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Agree & Sign
            </button>
        </div>
      </div>
    </div>
  );
} 