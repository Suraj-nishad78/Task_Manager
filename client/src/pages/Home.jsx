import React, { useState } from "react";
import Task from "../components/Task";
import Task_Audit from "./Task_Audit";

export default function Home() {
  const [showAudit, setShowAudit] = useState(false);
  const handleShowAduit = () => {
    setShowAudit(true);
  };
  const handleShowTask = () => {
    setShowAudit(false);
  };

  return (
    <>
      <div className="tm-container">
        {/* Sidebar */}
        <div className="tm-sidebar">
          <h1 className="tm-title">Task Manager</h1>

          <div className="tm-sidebar-buttons">
            <button className={!showAudit && "active"} onClick={handleShowTask}>
              Tasks
            </button>
            <button className={showAudit && "active"} onClick={handleShowAduit}>
              Audit Logs
            </button>
          </div>
        </div>

        {/* Main */}
        {showAudit ? <Task_Audit></Task_Audit> : <Task></Task>}
      </div>
    </>
  );
}
