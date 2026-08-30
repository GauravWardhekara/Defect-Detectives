import * as XLSX from 'xlsx';
import { Defect, AuditEvent } from '../types';

export const exportToExcel = (defects: Defect[], auditTrail: AuditEvent[]) => {
  // 1. All Defects Register
  const defectsData = defects.map(d => ({
    'ID': d.id,
    'Project': d.project,
    'Priority': d.priority,
    'Severity': d.severity,
    'Status': d.status,
    'Title': d.title,
    'Assignee': d.assignee,
    'Reporter': d.reporter,
    'Reported Version': d.reportedVersion,
    'Target Fix Version': d.targetFixVersion,
    'Created At': new Date(d.createdAt).toLocaleString(),
    'Updated At': new Date(d.updatedAt).toLocaleString()
  }));
  const wsDefects = XLSX.utils.json_to_sheet(defectsData);

  // 2. Executive KPI Summary
  const resolutionRate = defects.length > 0 
    ? (defects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length / defects.length * 100).toFixed(1) + '%'
    : '0%';
  const blockerCount = defects.filter(d => d.severity === 'Blocker' && d.status !== 'Closed').length;
  
  const kpiData = [
    { Metric: 'Total Defects', Value: defects.length },
    { Metric: 'Resolution Rate', Value: resolutionRate },
    { Metric: 'Active Blockers', Value: blockerCount },
    { Metric: 'Open Issues', Value: defects.filter(d => d.status === 'Open').length },
    { Metric: 'In Progress', Value: defects.filter(d => d.status === 'In Progress').length }
  ];
  const wsKpi = XLSX.utils.json_to_sheet(kpiData);

  // 3. Detailed Reproduction & Root Cause
  const detailsData = defects.map(d => ({
    'ID': d.id,
    'Title': d.title,
    'Reproduction Steps': d.reproductionSteps,
    'Expected Behavior': d.expectedBehavior,
    'Actual Behavior': d.actualBehavior,
    'Root Cause Analysis': d.rootCauseAnalysis,
    'Resolution Notes': d.resolutionNotes
  }));
  const wsDetails = XLSX.utils.json_to_sheet(detailsData);

  // Build Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsDefects, 'All Defects Register');
  XLSX.utils.book_append_sheet(wb, wsKpi, 'Executive KPI Summary');
  XLSX.utils.book_append_sheet(wb, wsDetails, 'Detailed Reproduction');

  XLSX.writeFile(wb, `QA_Defect_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
