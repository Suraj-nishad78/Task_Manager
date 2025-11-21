import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Create_Task = ({ update, closeEditForm }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { showTaskForm, setShowTaskForm, fetchTask } = useContext(AppContext);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDesc = (e) => {
    setDesc(e.target.value);
  };

  const hideTaskForm = () => {
    setShowTaskForm(false);
  };

  const validation = (title, desc) => {
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill all the details");
      return false;
    }

    if (title.trim().length > 100) {
      toast.error("Title must be less than 100 characters");
      return false;
    }

    if (desc.trim().length > 500) {
      toast.error("Description must be less than 500 characters");
      return false;
    }

    return true; // valid
  };

  const createTask = async () => {
    try {
      if (!validation(title, desc)) return;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}tasks/createTask`,
        {
          title,
          description: desc,
        }
      );

      // Check status code
      if (res.status === 201) {
        toast.success("Task created successfully! 🎉");
        setTitle("");
        setDesc("");
        setShowTaskForm(false);
        fetchTask();
      } else {
        toast.error("Failed to create task ❌");
      }
    } catch (e) {
      console.log("Error occurred while creating task:", e);
    }
  };

  const updateTask = async () => {
    try {
      if (!validation(title, desc)) return;

      const obj = {
        id: update._id,
        title,
        description: desc,
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}tasks/updateTask`,
        obj
      );

      if (res.status === 200) {
        toast.success("Task updated successfully! ✅");

        // Clear fields
        setTitle("");
        setDesc("");

        // Close modal
        closeEditForm();

        // Refresh list
        fetchTask();
      } else {
        toast.error("Failed to update task ❌");
      }
    } catch (e) {
      console.log("Error while updating task:", e);

      if (e.response) {
        toast.error(e.response.data.error || "Something went wrong ❌");
      } else {
        toast.error("Network error ⚠️");
      }
    }
  };

  useEffect(() => {
    if (update) {
      setTitle(update.title);
      setDesc(update.description);
    }
  }, []);

  return (
    <>
      <div className="create-task-container">
        <div className="ct-title">
          <p>{update ? "Update Task" : "Create Task"}</p>
          {hideTaskForm && (
            <div className="close-form" onClick={hideTaskForm}>
              <img src={assets.cross_icon} />
            </div>
          )}
          {closeEditForm && (
            <div className="close-form" onClick={closeEditForm}>
              <img src={assets.cross_icon} />
            </div>
          )}
        </div>
        <div className="ct-input-container">
          <div className="ct-title-input">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              onChange={handleTitle}
              value={title}
              placeholder="e.g. Plan sprint backlog"
            />
          </div>
          <div className="ct-desc">
            <label htmlFor="desc">Description</label>
            <input
              type="text"
              onChange={handleDesc}
              value={desc}
              placeholder="Add Scope, owners and due date"
            />
          </div>
        </div>
        <div className="ct-bottom-btn">
          {closeEditForm ? (
            <button onClick={closeEditForm}>Cancel</button>
          ) : (
            <button onClick={hideTaskForm}>Cancel</button>
          )}
          {update ? (
            <button onClick={updateTask}>Update Task</button>
          ) : (
            <button onClick={createTask}>Save Task</button>
          )}
        </div>
      </div>
      {/* <Create_Task update={}></Create_Task> */}
    </>
  );
};

export default Create_Task;
