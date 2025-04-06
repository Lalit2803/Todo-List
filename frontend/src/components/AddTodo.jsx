import { useState } from "react";
import { format ,parse} from "date-fns";
import { Outlet } from "react-router-dom";
import "../styles/AddTodo.css"

export default function AddTodo({ userId,onTodoAdded   }) {
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: false,
  });

  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => { 
    const { name, value } = e.target;
  
    // Convert to correct date format if dueDate field
    // Format date correctly before storing
  const formattedValue = name === "dueDate" ? format(new Date(value), "dd/MM/yyyy"): value;
  
    setTodoData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Added data is data is :",todoData)
  
      const response= await fetch("http://localhost:9000/lps/todos/addtodo",{
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        credentials: "include",
        body:JSON.stringify(
          {
            title: todoData.title,
            description: todoData.description,
            dueDate: todoData.dueDate,
            priority: todoData.priority || "low",
            status: false,
            createdBy: userId,
         })
    });
    const json = await response.json();
            setServerMessage(json.message);

             // Reset form
        setTodoData({
          title: "",
          description: "",
          dueDate: "",
          priority: "low",
          status: false,
        });

        
    // Notify parent to reload todos
    if (onTodoAdded) {
      onTodoAdded();
    }
        
     
     
  };

 
  

  return (
    <div className="addtodo-container">
    <div className="addtodo-card">
      <h2>Add a New Todo</h2>
      {serverMessage && <p className="addtodo-message">{serverMessage}</p>}
      <form onSubmit={handleSubmit} className="addtodo-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={todoData.title}
          onChange={handleChange}
          required
          className="addtodo-input"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={todoData.description}
          onChange={handleChange}
          required
          className="addtodo-textarea"
        />
        <input
          type="date"
          name="dueDate"
          value={todoData.dueDate ? format(parse(todoData.dueDate, "dd/MM/yyyy", new Date()), "yyyy-MM-dd") : ""}
          onChange={handleChange}
          className="addtodo-input"
        />
        <select
          name="priority"
          value={todoData.priority}
          onChange={handleChange}
          className="addtodo-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="addtodo-button">Add Todo</button>
      </form>
    </div>
    <Outlet />
  </div>
  );
}
