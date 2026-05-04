import React from 'react';

export default function RoleToolbar({ role, setRole }) {
  return (
    <div className="role-toolbar">
      <div>Текущий статус системы: <strong>РАБОТАЕТ</strong></div>
      <div>
        Роль доступа: <strong>{role}</strong> 
        <button 
          style={{ marginLeft: '15px' }}
          onClick={() => setRole(role === 'Consultant' ? 'Engineer' : 'Consultant')}
        >
          Сменить роль
        </button>
      </div>
    </div>
  );
}