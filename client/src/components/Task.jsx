import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Create_Task from "./Create_Task";

const Task = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const { userId, setLogin, setShowTaskForm, tasks, fetchTask } =
    useContext(AppContext);

  // ---------------------
  // Search Input Handler
  // ---------------------
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  // ---------------------
  // Create Task Modal
  // ---------------------
  const handleTaskForm = () => {
    if (!userId) {
      setLogin(true);
      return;
    }
    setShowTaskForm(true);
  };

  // ---------------------
  // Update Task Modal
  // ---------------------
  const handleEditForm = (data) => {
    if (!userId) {
      setLogin(true);
      return;
    }
    setShowUpdateForm(true);
    setUpdateData(data);
  };

  const closeEditForm = () => {
    setShowUpdateForm(false);
    setUpdateData(null);
  };

  // ---------------------
  // Delete Task
  // ---------------------
  const handleDeleteTask = async (id) => {
    if (!userId) {
      setLogin(true);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}tasks/deleteTask`,
        {
          data: { id },
        }
      );

      if (res.status === 200) {
        toast.success("Task deleted successfully 🗑️");
        fetchTask();
      } else {
        toast.error("Failed to delete task ❌");
      }
    } catch (e) {
      console.log("Error while deleting task:", e);
    }
  };

  // ---------------------
  // SEARCH FILTER
  // ---------------------
  const filteredTasks = tasks.filter((t) => {
    const query = searchInput.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  });

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  // ---------------------
  // PAGINATION LOGIC
  // ---------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // 5 tasks per page

  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="tm-main">
        <div className="tm-header">
          <h2>Tasks</h2>
        </div>

        <div className="tm-table-wrapper">
          <div className="tm-seach-box">
            <input
              type="text"
              placeholder="Search by title or description"
              className="tm-search"
              onChange={handleSearchInput}
              value={searchInput}
            />
            <button className="tm-create-btn" onClick={handleTaskForm}>
              + Create Task
            </button>
          </div>

          {paginatedTasks.length > 0 ? (
            <table className="tm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTasks.map((t) => (
                  <tr key={t._id}>
                    <td>#{t._id}</td>
                    <td>{t.title}</td>
                    <td>{t.description}</td>
                    <td>{t.createdAt}</td>

                    <td className="tm-actions">
                      <button
                        className="tm-edit"
                        onClick={() => handleEditForm(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="tm-delete"
                        onClick={() => handleDeleteTask(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tasks found</p>
          )}
        </div>

        {/* Pagination UI */}
        <div className="tm-pagination">
          <span>
            Showing {paginatedTasks.length} of {filteredTasks.length} tasks
          </span>

          <div className="tm-page-controls">
            <button disabled={currentPage === 1} onClick={prevPage}>
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button disabled={currentPage === totalPages} onClick={nextPage}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Update Task Modal */}
      {showUpdateForm && (
        <Create_Task update={updateData} closeEditForm={closeEditForm} />
      )}
    </>
  );
};

export default Task;
