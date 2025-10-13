import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // submit동안 다른 이벤트가 발생하지 않도록 중지시키는 것
    try {
      await api.post("/api/auth/signup", { username, password });
      alert("가입 성공");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("가입 실패");
    }
  };

  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" />
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};
export default Signup;
