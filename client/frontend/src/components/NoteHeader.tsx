import React from 'react';

const NoteHeader: React.FC = () => {
  return (
    <div className="note-header">
      <div className="note-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
        </svg>
      </div>
      <h1 className="note-title">Note App</h1>
    </div>
  );
};

export default NoteHeader;
