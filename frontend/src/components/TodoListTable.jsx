import React, { useEffect, useState } from "react";
import "../styles/TodoListTable.css";

const TodoListTable = ({ reloadFlag }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueDateSort, setDueDateSort] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/todos/deletetodo/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) reloadTodos();
      else alert(data.message || "Failed to delete.");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/todos/updateStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) reloadTodos();
      else alert(data.message || "Failed to update status.");
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    });
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "low",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/todos/updatetodo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        reloadTodos();
        cancelEditing();
      } else {
        alert(data.message || "Failed to update.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const reloadTodos = () => {
    setLoading(true); // triggers useEffect to refetch
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (priorityFilter) params.append("priority", priorityFilter);
        if (dueDateSort) params.append("sort", `dueDate_${dueDateSort}`);

        const response = await fetch(
          `http://localhost:9000/lps/todos/alltodo?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorJson = await response.json(); // Parse JSON instead of text
          throw new Error(errorJson.message);      // Access only the message field
        }

        const json = await response.json();
        setTodos(json.todos || []);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Something went wrong while loading todos.");
        setLoading(false);
      }
    };

    fetchTodos(); // ✅ always fetch on reloadFlag or filters changing
  }, [reloadFlag,statusFilter, priorityFilter, dueDateSort, loading]);

  if (loading) return <div className="todo-container">Loading...</div>;
  if (error) return <div className="todo-container">{error}</div>;

  return (
    <div className="todolist-container">
  <h2>Todo List</h2>
  <div className="filters">
  <label>
    Status:
    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        reloadTodos();
      }}
    >
      <option value="">All</option>
      <option value="true">Done</option>
      <option value="false">Pending</option>
    </select>
  </label>

  <label>
    Priority:
    <select
      value={priorityFilter}
      onChange={(e) => {
        setPriorityFilter(e.target.value);
        reloadTodos();
      }}
    >
      <option value="">All</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </label>

  <label>
    Sort by Due Date:
    <select
      value={dueDateSort}
      onChange={(e) => {
        setDueDateSort(e.target.value);
        reloadTodos();
      }}
    >
      <option value="">None</option>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </label>



  </div>
  <table className="todolist-table">
  <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={todo._id}>
              <td>{index + 1}</td>

              {editingTodo === todo._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleEditChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                </>
              ) : (
                <>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>{todo.dueDate}</td>
                  <td className={`priority-${todo.priority}`}>{todo.priority}</td>
                </>
              )}

              <td className={`status-${todo.status ? "done" : "pending"}`}>
                {todo.status ? "Done" : "Pending"}
              </td>

              <td>
                {editingTodo === todo._id ? (
                  <>
                    <button onClick={() => saveEdit(todo._id)} className="action-btn complete-btn">
                      Save
                    </button>
                    <button onClick={cancelEditing} className="action-btn delete-btn">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleComplete(todo._id, todo.status)}
                      className="action-btn complete-btn"
                    >
                      {todo.status ? "Mark Incomplete" : "Mark Done"}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEditing(todo)}
                      className="action-btn edit-btn"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>



  </table>
</div>
  );
};

export default TodoListTable;
