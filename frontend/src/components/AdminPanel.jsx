import { useEffect, useState } from "react";
import "../styles/AdminPanel.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [error, setError] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:9000/lps/admin/fetchall", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/admin/fetchone/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSelectedUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/admin/updaterole/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchAllUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAllTodos = async () => {
    try {
      const res = await fetch("http://localhost:9000/lps/admin/fetchalltodo", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTodos(data.todos || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTodoById = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/lps/admin/fetchonetodo/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSelectedTodo(data.todo);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllTodos();
  }, []);

  return (
    <div className="section">
      <h3 className="section-title">Users</h3>

      <div className="table-and-details">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn view" onClick={() => fetchUserById(user._id)}>
                        View
                      </button>
                      <button
                        className="btn update"
                        onClick={() => updateUserRole(user._id, user.role === "admin" ? "normalUser" : "admin")}
                      >
                        Set as {user.role === "admin" ? "Normal" : "Admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="details-box">
          {selectedUser ? (
            <>
              <h4>Selected User:</h4>
              <pre>{JSON.stringify(selectedUser, null, 2)}</pre>
              <button className="btn update" onClick={() => setSelectedUser(null)}>Clear</button>
            </>
          ) : (
            <>
              <h4>No user selected</h4>
              <p>Select a user to see more details.</p>
            </>
          )}
        </div>
      </div>

      <h3 className="section-title">Todos</h3>
      <div className="table-and-details">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo._id}>
                  <td>{todo.title}</td>
                  <td>
                    <button className="btn view" onClick={() => fetchTodoById(todo._id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="details-box">
          {selectedTodo ? (
            <>
              <h4>Selected Todo:</h4>
              <pre>{JSON.stringify(selectedTodo, null, 2)}</pre>
              <button className="btn update" onClick={() => setSelectedTodo(null)}>Clear</button>
            </>
          ) : (
            <>
              <h4>No todo selected</h4>
              <p>Select a todo to see more details.</p>
            </>
          )}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

