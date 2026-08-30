import React from 'react';
import { Priority, Severity, Status } from '../types';

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    [Priority.CRITICAL]: 'text-red-600',
    [Priority.HIGH]: 'text-red-500',
    [Priority.MEDIUM]: 'text-amber-500',
    [Priority.LOW]: 'text-slate-400',
  };
  return (
    <span className={`text-xs font-semibold uppercase ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const colors = {
    [Severity.BLOCKER]: 'bg-red-100 text-red-700',
    [Severity.MAJOR]: 'bg-orange-100 text-orange-700',
    [Severity.MINOR]: 'bg-yellow-100 text-yellow-700',
    [Severity.TRIVIAL]: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[severity]}`}>
      {severity}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const colors = {
    [Status.OPEN]: 'bg-indigo-100 text-indigo-700',
    [Status.IN_PROGRESS]: 'bg-sky-100 text-sky-700',
    [Status.IN_REVIEW]: 'bg-blue-100 text-blue-700',
    [Status.QA_TESTING]: 'bg-purple-100 text-purple-700',
    [Status.RESOLVED]: 'bg-green-100 text-green-700',
    [Status.CLOSED]: 'bg-slate-200 text-slate-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[status]}`}>
      {status}
    </span>
  );
};
