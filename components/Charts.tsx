
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { CurvePoint } from '../types';

interface ChartsProps {
  curve: CurvePoint[];
}

// Helper to calculate monthly returns from cumulative curve
const calculateMonthlyReturns = (curve: CurvePoint[]) => {
  if (!curve || !Array.isArray(curve) || curve.length === 0) return [];
  
  // 1. Aseguramos orden cronológico
  const sorted = [...curve].sort((a, b) => a.month.localeCompare(b.month));
  
  const returns = [];

  // 2. Si el primer punto no es 0, calculamos el retorno inicial respecto a 0
  if (Math.abs(sorted[0].cumPct) > 0.001) {
    returns.push({
      month: sorted[0].month,
      ret: sorted[0].cumPct // El primer salto es desde 0 hasta el valor actual
    });
  }

  // 3. Calculamos diferencias mes a mes
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].cumPct;
    const curr = sorted[i].cumPct;
    returns.push({
      month: sorted[i].month,
      ret: curr - prev
    });
  }

  return returns;
};

const TIME_RANGES = [
  { label: '3 meses', value: 3 },
  { label: '6 meses', value: 6 },
  { label: '12 meses', value: 12 },
  { label: 'Todo', value: 0 },
];

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  range: number;
  onRangeChange: (val: number) => void;
}> = ({ title, children, range, onRangeChange }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-[380px]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <select
        value={range}
        onChange={(e) => onRangeChange(Number(e.target.value))}
        className="px-2 py-1 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
      >
        {TIME_RANGES.map((r) => (
          <option key={r.label} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
    <div className="flex-1 min-h-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export const Charts: React.FC<ChartsProps> = ({ curve }) => {
  const [lineRange, setLineRange] = useState(12);
  const [barRange, setBarRange] = useState(12);

  const safeCurve = useMemo(() => {
    if (!Array.isArray(curve)) return [];
    const valid = curve.filter(c => c && c.month);
    return valid.sort((a, b) => a.month.localeCompare(b.month));
  }, [curve]);

  // Datos para el gráfico de línea (Rentabilidad Acumulada)
  const lineData = useMemo(() => {
    // Copia segura
    let data = [...safeCurve];

    // LÓGICA CLAVE: Insertar punto 0% al inicio si no existe
    if (data.length > 0) {
      const firstVal = data[0].cumPct;
      // Si el primer valor dista de 0, inventamos un mes previo en 0%
      if (Math.abs(firstVal) > 0.001) {
        const firstDate = new Date(data[0].month);
        // Restar 1 mes para el punto de inicio
        const prevDate = new Date(firstDate);
        prevDate.setMonth(prevDate.getMonth() - 1);
        
        const startLabel = isNaN(prevDate.getTime()) 
          ? 'Inicio' 
          : prevDate.toISOString();

        data.unshift({ month: startLabel, cumPct: 0 });
      }
    } else {
      // Si no hay datos, al menos mostrar punto 0
      data = [{ month: new Date().toISOString(), cumPct: 0 }];
    }
    
    // Filtrado por rango
    if (lineRange > 0 && data.length > lineRange) {
      // Tomamos slice, pero aseguramos que el primer punto visible se conecte visualmente
      // (Recharts ajustará la escala automáticamente)
      data = data.slice(- (lineRange + 1)); 
    }
    return data;
  }, [safeCurve, lineRange]);

  // Datos para el gráfico de barras (Rendimiento Mensual)
  // Usamos safeCurve original, el cálculo interno maneja el delta inicial
  const monthlyReturns = useMemo(() => calculateMonthlyReturns(safeCurve), [safeCurve]);
  
  const barData = useMemo(() => {
    if (barRange === 0) return monthlyReturns;
    return monthlyReturns.slice(-barRange);
  }, [monthlyReturns, barRange]);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Inicio') return 'Inicio';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.substring(0, 7);
    return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(d);
  };

  return (
    <div className="grid grid-rows-[auto_auto] gap-6 h-full">
      {/* Line Chart */}
      <ChartCard title="Rentabilidad acumulada (%)" range={lineRange} onRangeChange={setLineRange}>
        {lineData.length > 0 ? (
          <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatDate} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false}
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `${val}%`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Retorno']}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
            <Area 
              type="monotone" 
              dataKey="cumPct" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorCum)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            Sin datos suficientes para mostrar el gráfico.
          </div>
        )}
      </ChartCard>

      {/* Bar Chart */}
      <ChartCard title="Rendimiento mensual" range={barRange} onRangeChange={setBarRange}>
        {barData.length > 0 ? (
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatDate} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false}
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Mensual']}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" />
            <Bar dataKey="ret" radius={[3, 3, 3, 3]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.ret >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            Sin historial mensual disponible.
          </div>
        )}
      </ChartCard>
    </div>
  );
};
