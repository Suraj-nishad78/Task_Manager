import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Signin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  //   const navigate = useNavigate();

  const { login, setLogin, userId, setUserId } = useContext(AppContext);

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handlePass = (e) => {
    setPassword(e.target.value);
  };

  const hideLogin = () => {
    setLogin(false);
  };

  const validation = (username, userpass) => {
    if (!username.trim() || !userpass.trim()) {
      toast.error("Please fill the all details ⚠️");
      return;
    } else if (userpass.length < 6) {
      toast.error(
        "Password must be greater than 11 mixed digits & character ⚠️"
      );
      return;
    } else {
      return true;
    }
  };

  const handleLogin = async () => {
    if (validation(name, password)) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}users/signin`,
          {
            username: name.toLowerCase(),
            password,
          }
        );
        if (res.data.userId) {
          toast.success("Login Successfully! 😊");

          setUserId(res.data.userId);
          setName("");
          setPassword("");
          setLogin(false);

          localStorage.setItem("userId", res.data.userId);

          setTimeout(() => {
            localStorage.clear();
            setUserId(null);
          },  10 * 60* 1000);
          axios.defaults.withCredentials = true;
          return;
        } else {
          toast.error(`${res.data.msg} ⚠️`);
          return;
        }
      } catch (e) {
        toast.error("Something went wrong. Please try again! ⚠️");
        console.log("Error occured while logging: ", e);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-title">
        <h1>Login</h1>
        <p>"Welcome back! Please sign in to continue.</p>
      </div>
      <div className="form-input">
        <img id="profile" src={assets.profile_icon} />
        <input type="text" placeholder="Username" onChange={handleName} />
      </div>
      <div className="form-input">
        <img src={assets.lock_icon} />
        <input type="password" placeholder="Password" onChange={handlePass} />
      </div>
      <div className="form-footer">
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </div>
      <div className="close-form" onClick={hideLogin}>
        <img src={assets.cross_icon} />
      </div>
    </div>
  );
};

export default Signin;
