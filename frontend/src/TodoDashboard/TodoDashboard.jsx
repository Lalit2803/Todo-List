import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AddTodo from "../components/AddTodo";
import TodoListTable from "../components/TodoListTable";
import Navbar from "../navbar/Navbar";
import ProfilePage from "../userprofile/UserSetting";

export default function TodoDashboard({ userId }) {
  const [reloadFlag, setReloadFlag] = useState(false);

  const triggerReload = () => {
    setReloadFlag((prev) => !prev); // toggle to trigger useEffect in child
  };

  return (
    <>
      <Navbar /> {/* Always shown */}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <AddTodo userId={userId} onTodoAdded={triggerReload} />
              <TodoListTable reloadFlag={reloadFlag} />
            </>
          }
        />

        <Route
          path="/update"
          element={
            <>
              <ProfilePage />
            </>
          }
        />
      </Routes>
    </>
  );
}
