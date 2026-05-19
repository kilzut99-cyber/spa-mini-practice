import React from 'react';

export default function RoleToolbar({ currentRole, onRoleChange }) {
  return (
    <div className="role-toolbar">
      <button 
        className={currentRole === 'Consultant' ? 'active' : ''} 
        onClick={() => onRoleChange('Consultant')} // Используем имя из пропсов
      >
        Консультант КЦ
      </button>
      <button 
        className={currentRole === 'Engineer' ? 'active' : ''} 
        onClick={() => onRoleChange('Engineer')} // Используем имя из пропсов
      >
        Инженер ИЦ
      </button>
    </div>
  );
}