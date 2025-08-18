import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Music, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  years: string[];
  selectedYear: string | null;
  onYearSelect: (year: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  years,
  selectedYear,
  onYearSelect,
  isCollapsed,
  onToggle
}) => {
  const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-200 flex flex-col gap-2">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Navegar por Ano
          </h2>
        )}
        <button
          onClick={onToggle}
          className="self-end p-2 hover:bg-slate-200 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          )}
        </button>
        {/* Botão Com Áudio */}
        <button
          onClick={() => onYearSelect('Com Áudio')}
          className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-200 ${
            selectedYear === 'Com Áudio' ? "bg-green-600 text-white shadow-lg border-green-600" : "hover:bg-green-100"
          }`}
          title={isCollapsed ? `Com Áudio` : undefined}
        >
          <Music className="w-5 h-5" />
          <span className="font-medium">Com Áudio</span>
        </button>

        {/* Botão Todas */}
        <button
          onClick={() => onYearSelect('Todas')}
          className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-200 ${
            selectedYear === 'Todas' ? "bg-blue-600 text-white shadow-lg border-blue-600" : "hover:bg-blue-100"
          }`}
          title={isCollapsed ? `Todas` : undefined}
        >
          <List className="w-5 h-5" />
          <span className="font-medium">Todas</span>
        </button>
      </div>
      <div className="flex-1 p-2 space-y-1 overflow-y-auto max-h-[80vh]">
        {sortedYears.map((year) => (
          <button
            key={year}
            onClick={() => onYearSelect(year)}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3",
              selectedYear === year
                ? "bg-blue-600 text-white shadow-lg"
                : "hover:bg-slate-200 text-slate-700"
            )}
            title={isCollapsed ? `Ano ${year}` : undefined}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">{year}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
