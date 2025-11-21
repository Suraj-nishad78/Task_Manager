import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./context/AppContext";
import axios from "axios"
import Signin from "./components/Signin";
import Home from "./pages/Home";
import Create_Task from "./components/Create_Task";

function App() {
  const [login, setLogin] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [userId, setUserId] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}tasks/getAllTask`
      );
      const formattedTasks = res.data.tasks.map((item) => ({
        ...item,
        createdAt: extractDate(item.createdAt),
      }));
      setTasks(formattedTasks);
    } catch (e) {
      console.log("Error occured while fetching task: ", e);
    }
  };

  const extractDate = (isd) => {
    const date = new Date(isd);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // months are 0–based
    const day = date.getDate();

    const today = `${year}-${month}-${day}`;
    return today;
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    // localStorage.clear();
    fetchTask();
  }, []);

  const contextData = {
    userId,
    setUserId,
    login,
    setLogin,
    showTaskForm,
    setShowTaskForm,
    tasks,
    setTasks,
    fetchTask
  };

  return (
    <>
      <AppContext.Provider value={contextData}>
        {login && <Signin></Signin>}
        <Home ></Home>
        {showTaskForm && <Create_Task ></Create_Task>}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AppContext.Provider>
    </>
  );
}

export default App;
