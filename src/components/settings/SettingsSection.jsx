import React from 'react';

function SettingsSection({ title, children }) {
  return (
    <div className="settings-section">
      <h2 className="settings-section-title">{title}</h2>
      <div className="settings-section-content">
        {children}
      </div>
    </div>
  );
}

export default SettingsSection;
