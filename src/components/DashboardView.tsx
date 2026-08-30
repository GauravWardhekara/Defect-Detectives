import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Status, Priority, Severity } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Activity, Sparkles, Loader2 } from 'lucide-react';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const DashboardView = ({ token }: { token?: string | null }) => {
  const { filteredDefects: defects } = useAppContext();
  const [insights, setInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = async () => {
    if (!token) {
      alert("Please sign in with Google to use the AI insights feature.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ defects })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      setInsights(data.insights);
    } catch (e) {
      console.error(e);
      alert("Failed to generate insights. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Metrics
  const total = defects.length;
  const resolved = defects.filter(d => d.status === Status.RESOLVED || d.status === Status.CLOSED).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const blockers = defects.filter(d => d.severity === Severity.BLOCKER && d.status !== Status.CLOSED).length;
  const inFlight = defects.filter(d => d.status === Status.IN_PROGRESS || d.status === Status.IN_REVIEW).length;

  // Status Distribution
  const statusCounts = Object.values(Status).map(status => ({
    name: status,
    value: defects.filter(d => d.status === status).length
  }));

  // Project Health (Defects per project)
  const projectMap = new Map();
  defects.forEach(d => {
    projectMap.set(d.project, (projectMap.get(d.project) || 0) + 1);
  });
  const projectData = Array.from(projectMap.entries()).map(([name, count]) => ({ name, defects: count }));

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI Defect Insights
            </h3>
            <p className="text-sm text-indigo-700 mt-1">Generate an automated summary of current project risks, trends, and root causes.</p>
          </div>
          <button 
            onClick={generateInsights}
            disabled={isGenerating || defects.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Analyzing Data...' : 'Generate Insights'}
          </button>
        </div>
        
        {insights && (
          <div className="mt-4 p-5 bg-white rounded-lg border border-indigo-50 shadow-sm text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {insights}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resolution Rate</div>
          <div className="text-2xl font-bold text-slate-800">{resolutionRate}%</div>
          <div className="text-[10px] text-green-600 mt-2 font-medium">Target: &gt;90% SLA</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">In-Flight Issues</div>
          <div className="text-2xl font-bold text-slate-800">{inFlight}</div>
          <div className="text-[10px] text-blue-600 mt-2 font-medium">Currently in development</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Blockers</div>
          <div className="text-2xl font-bold text-red-600">{blockers}</div>
          <div className="w-full bg-slate-100 h-1 mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${(blockers / (total || 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Defects</div>
          <div className="text-2xl font-bold text-slate-800">{total}</div>
          <div className="flex -space-x-2 mt-2">
            <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-200"></div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-200"></div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-green-200"></div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">+{Math.max(0, total - 3)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Pipeline Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Health */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Project Defect Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="defects" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
