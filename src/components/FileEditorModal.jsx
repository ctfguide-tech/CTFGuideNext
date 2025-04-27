import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function FileEditorModal({ fileName, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 border-t-4 border-blue-500 shadow-lg p-4 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-white text-lg">Edit: <span className="bg-neutral-700 px-2   text-gray-300">{fileName}</span></div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">✕</button>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full h-64 font-mono bg-neutral-900 text-white rounded p-2 border border-neutral-700"
            value={value}
            onChange={e => setValue(e.target.value)}
            spellCheck={false}
            style={{ minHeight: 250 }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white = hover:bg-blue-700"
            onClick={() => onSave(value)}
          >Save</button>
          <button
            className="px-4 py-2 bg-neutral-700 text-white = hover:bg-neutral-800"
            onClick={onClose}
          >Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
