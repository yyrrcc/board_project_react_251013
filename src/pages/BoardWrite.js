import { useState } from "react";
import "./BoardWrite.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const BoardWrite = ({ user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // submit동안 다른 이벤트가 발생하지 않도록 중지시키는 것 (새로고침 방지)

    if (!user) {
      alert("로그인한 유저만 작성 가능합니다.");
      return;
    }
    try {
      await api.post("/api/board", { title, content });
      // alert("글 작성 성공");
      navigate("/board");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="write-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit} className="write-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={() => navigate("/board")}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWrite;
