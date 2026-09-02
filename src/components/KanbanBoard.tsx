import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppContext } from '../context/AppContext';
import { Status, Defect } from '../types';
import { PriorityBadge, SeverityBadge } from './Badges';

const KANBAN_COLUMNS = [
  { id: Status.OPEN, title: 'Open' },
  { id: Status.IN_PROGRESS, title: 'In Progress' },
  { id: Status.IN_REVIEW, title: 'In Review' },
  { id: Status.QA_TESTING, title: 'QA Testing' },
  { id: Status.RESOLVED, title: 'Resolved' },
  { id: Status.CLOSED, title: 'Closed' }
];

export const KanbanBoard = ({ onRowClick }: { onRowClick: (defect: Defect) => void }) => {
  const { filteredDefects: defects, updateDefect } = useAppContext();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const defect = defects.find(d => d.id === draggableId);
      if (defect) {
        updateDefect({ ...defect, status: destination.droppableId as Status, updatedAt: new Date().toISOString() });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(column => {
          const columnDefects = defects.filter(d => d.status === column.id);
          
          return (
            <div key={column.id} className="w-80 shrink-0 flex flex-col bg-bg-base border border-ink-faint rounded-[24px]">
              <div className="p-3 border-b border-ink-faint flex justify-between items-center border-b border-ink-faint bg-transparent rounded-t-[24px] px-6 py-5">
                <h3 className="font-medium uppercase tracking-[0.1em] font-mono text-[0.7rem] text-ink">{column.title}</h3>
                <span className="font-mono text-xs text-ink-muted">
                  {columnDefects.length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-black/5' : ''
                    }`}
                  >
                    {columnDefects.map((defect, index) => (
                      <Draggable key={defect.id} draggableId={defect.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            onClick={() => onRowClick(defect)}
                            className={`p-4 mb-3 bg-white rounded-[16px] border shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer transition-shadow transition-colors duration-200 ${
                              snapshot.isDragging ? 'shadow-xl border-ink scale-[1.02]' : 'border-ink-faint hover:border-ink'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-semibold text-ink-muted">{defect.id}</span>
                              <div className="flex gap-1">
                                <PriorityBadge priority={defect.priority} />
                              </div>
                            </div>
                            <h4 className="font-sans font-bold text-[1.1rem] tracking-tight text-ink mb-2 leading-snug">{defect.title}</h4>
                            {defect.module && (
                              <div className="text-[10px] text-ink-muted font-medium mb-2 truncate">
                                {defect.module}
                              </div>
                            )}
                            <div className="flex justify-between items-end">
                              <SeverityBadge severity={defect.severity} />
                              <div className="flex items-center gap-2">
                                {defect.comments && (
                                  <span className="text-xs text-ink-muted" title={defect.comments}>💭</span>
                                )}
                                <span className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded text-ink-muted font-medium border border-slate-200" title="Reported Version">
                                  {defect.reportedVersion || 'v?'}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-ink" title={defect.assignee}>
                                  {defect.assignee.charAt(0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
