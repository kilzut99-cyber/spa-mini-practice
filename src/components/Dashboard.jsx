import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';
import { runEngineeringSimulation } from '../utils/cartCalc'; // Импорт математических формул прочности

export default function Dashboard({ tasks }) {
  // Защита: Если реестр пуст — не рендерим графики-пустышки (Требование БАЗА)
  if (tasks.length === 0) {
    return <div className="empty-msg" style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>Журнал пуст. Запустите тесты для формирования графиков КЦ.</div>;
  }

  // 1. Построение массива результатов верификации (Успешно vs Дефект)
  const calculatedStatuses = tasks.map(t => runEngineeringSimulation(t.category, t.lod, t.title.length * 6).resultStatus);
  const passCount = calculatedStatuses.filter(s => s === 'success').length;
  const failCount = calculatedStatuses.filter(s => s === 'failed').length;

  const pieData = [
    { name: 'УспешноPassed', value: passCount },
    { name: 'Критический брак', value: failCount }
  ];

  // 2. Построение данных распределения нагрузок по дисциплинам CAE
  const disciplines = ['Механика', 'CFD', 'Тепло'];
  const barData = disciplines.map(disc => ({
    name: disc,
    'Всего расчетов': tasks.filter(t => t.category === disc).length,
    'Выявлено дефектов': tasks.filter(t => t.category === disc && runEngineeringSimulation(t.category, t.lod, t.title.length * 6).resultStatus === 'failed').length
  }));

  const CONFIG_COLORS = ['#4caf50', '#e53e3e']; // Зеленый — норма, Красный — брак

  return (
    <div className="dash-container">
      <div className="chart-item">
        <h4>Статус верификации изделий (ОТК)</h4>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} innerRadius={45} outerRadius={60} dataKey="value" paddingAngle={5}>
              {pieData.map((entry, index) => <Cell key={index} fill={CONFIG_COLORS[index]} />)}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-item">
        <h4>Нагрузка по дисциплинам CAE / Дефекты</h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Legend iconSize={10} />
            <Bar dataKey="Всего расчетов" fill="#0054a5" />
            <Bar dataKey="Выявлено дефектов" fill="#e53e3e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}