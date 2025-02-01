
import React, { useReducer, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Plus, X, Edit2, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

const getLocalStorageData = () => {
  const savedBoard = localStorage.getItem("kanbanBoard");
  return savedBoard
    ? JSON.parse(savedBoard)
    : {
        columns: [
          {
            id: "column-1",
            title: "To Do",
            tasks: [
              { id: "task-1", content: "First task" },
              { id: "task-2", content: "Second task" },
            ],
          },
          {
            id: "column-2",
            title: "In Progress",
            tasks: [{ id: "task-3", content: "Third task" }],
          },
          {
            id: "column-3",
            title: "Done",
            tasks: [],
          },
        ],
      };
};

const saveToLocalStorage = debounce((board) => {
  localStorage.setItem("kanbanBoard", JSON.stringify(board));
}, 500);

const boardReducer = (state, action) => {
  switch (action.type) {
    case "ADD_COLUMN":
      return {
        ...state,
        columns: [...state.columns, { id: uuidv4(), title: "New Column", tasks: [] }],
      };
    case "REMOVE_COLUMN":
      return {
        ...state,
        columns: state.columns.filter((col) => col.id !== action.payload),
      };
    case "ADD_TASK":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload
            ? { ...col, tasks: [...col.tasks, { id: uuidv4(), content: "New Task" }] }
            : col
        ),
      };
    case "REMOVE_TASK":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.columnId
            ? { ...col, tasks: col.tasks.filter((task) => task.id !== action.payload.taskId) }
            : col
        ),
      };
    case "UPDATE_TASK":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.columnId
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                  task.id === action.payload.taskId ? { ...task, content: action.payload.content } : task
                ),
              }
            : col
        ),
      };
    case "UPDATE_COLUMN":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.columnId ? { ...col, title: action.payload.title } : col
        ),
      };
    case "DRAG_TASK":
      return { ...action.payload }; // New board state after dragging
    default:
      return state;
  }
};

export default function DragDrop() {
  const [board, dispatch] = useReducer(boardReducer, getLocalStorageData());

  useEffect(() => {
    saveToLocalStorage(board);
    return () => saveToLocalStorage.cancel(); // Cleanup on unmount
  }, [board]);

  // for editing task content
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");

  //  for editing column title
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // memoize columns 
  const memoizedColumns = useMemo(() => board.columns, [board]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = board.columns.find((col) => col.id === source.droppableId);
    const destCol = board.columns.find((col) => col.id === destination.droppableId);
    if (!sourceCol || !destCol) return;

    const sourceTasks = [...sourceCol.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    dispatch({
      type: "DRAG_TASK",
      payload: {
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) return { ...col, tasks: sourceTasks };
          if (col.id === destination.droppableId) return { ...col, tasks: destTasks };
          return col;
        }),
      },
    });
  };

  // task edit
  const handleTaskEdit = (taskId, content) => {
    setEditingTaskId(taskId);
    setNewTaskContent(content);
  };

  const handleSaveTaskEdit = (columnId, taskId) => {
    dispatch({ type: "UPDATE_TASK", payload: { columnId, taskId, content: newTaskContent } });
    setEditingTaskId(null);
  };

  // column name edit
  const handleColumnEdit = (columnId, title) => {
    setEditingColumnId(columnId);
    setNewColumnTitle(title);
  };

  const handleSaveColumnEdit = (columnId) => {
    dispatch({ type: "UPDATE_COLUMN", payload: { columnId, title: newColumnTitle } });
    setEditingColumnId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Drag and Drop Kanban Board</h1>
        <button
          onClick={() => dispatch({ type: "ADD_COLUMN" })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={20} /> Add Column
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-6 overflow-x-auto pb-4">
          {memoizedColumns.map((column) => (
            <div key={column.id} className="w-80 min-h-[400px] bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                {editingColumnId === column.id ? (
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <h2 className="font-bold">{column.title}</h2>
                )}
                <div className="flex gap-2">
                  {editingColumnId === column.id ? (
                    <button
                      onClick={() => handleSaveColumnEdit(column.id)}
                      className="p-1 hover:bg-gray-200 rounded text-green-500"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleColumnEdit(column.id, column.title)}
                      className="p-1 hover:bg-gray-200 rounded text-blue-500"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => dispatch({ type: "REMOVE_COLUMN", payload: column.id })}
                    className="p-1 hover:bg-gray-200 rounded text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[100px] bg-gray-100">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 p-4 bg-white rounded shadow-sm flex items-center justify-between"
                          >
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                className="border p-1 rounded"
                              />
                            ) : (
                              <span>{task.content}</span>
                            )}
                            <div className="flex gap-2">
                              {editingTaskId === task.id ? (
                                <button
                                  onClick={() => handleSaveTaskEdit(column.id, task.id)}
                                  className="p-1 hover:bg-gray-100 rounded text-green-500"
                                >
                                  <Check size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTaskEdit(task.id, task.content)}
                                  className="p-1 hover:bg-gray-100 rounded text-blue-500"
                                >
                                  <Edit2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  dispatch({ type: "REMOVE_TASK", payload: { columnId: column.id, taskId: task.id } })
                                }
                                className="p-1 hover:bg-gray-100 rounded text-red-500"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                onClick={() => dispatch({ type: "ADD_TASK", payload: column.id })}
                className="mt-4 w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

