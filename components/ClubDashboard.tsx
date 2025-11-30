
import React from 'react';
import { DashboardData } from '../types';
import Header from './Header';
import KPIs from './KPIs';
import { Charts } from './Charts';
import RadarSection from './RadarSection';
import ClubStyle from './ClubStyle';
import { PortfolioTable, HistoryTable } from './Tables';

interface Props {
  data: DashboardData;
  onBack: () => void;
}

const ClubDashboard: React.FC<Props> = ({ data, onBack }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Header data={data} onBack={onBack} />
      
      <div className="mb-8">
        <KPIs radar={data.radar} summary={data.summary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Charts curve={data.curve} />
        </div>
        <div className="lg:col-span-1">
          <RadarSection metrics={data.radar} members={data.members} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <ClubStyle radar={data.radar} />
        <PortfolioTable positions={data.live} />
        <HistoryTable items={data.history} />
      </div>
    </div>
  );
};

export default ClubDashboard;
