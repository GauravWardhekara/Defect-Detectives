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
            <div key={column.id} className="w-80 shrink-0 flex flex-col bg-slate-100 rounded-xl">
              <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-200/50 rounded-t-xl">
                <h3 className="font-semibold text-slate-700 text-sm">{column.title}</h3>
                <span className="bg-slate-300 text-slate-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {columnDefects.length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
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
                            className={`p-4 mb-3 bg-white rounded-lg border shadow-sm cursor-pointer transition-shadow transition-colors duration-200 ${
                              snapshot.isDragging ? 'shadow-lg border-indigo-400' : 'border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-semibold text-slate-400">{defect.id}</span>
                              <div className="flex gap-1">
                                <PriorityBadge priority={defect.priority} />
                              </div>
                            </div>
                            <h4 className="font-medium text-slate-800 text-sm mb-2 leading-snug">{defect.title}</h4>
                            {defect.module && (
                              <div className="text-[10px] text-slate-500 font-medium mb-2 truncate">
                                {defect.module}
                              </div>
                            )}
                            <div className="flex justify-between items-end">
                              <SeverityBadge severity={defect.severity} />
                              <div className="flex items-center gap-2">
                                {defect.comments && (
                                  <span className="text-xs text-slate-400" title={defect.comments}>💭</span>
                                )}
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium border border-slate-200" title="Reported Version">
                                  {defect.reportedVersion || 'v?'}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700" title={defect.assignee}>
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
