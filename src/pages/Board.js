import api from "../api/axiosConfig.js";
import "./Board.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Board = ({ user }) => {
  const [posts, setPosts] = useState([]); // 모든 글 목록
  const navigate = useNavigate();

  // 모든 게시글 요청(get)
  const loadPosts = async () => {
    try {
      const res = await api.get("/api/board");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []); // 첫 랜더링 될 때 무조건 loadPosts() 실행하기

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const formattedDate = (dateString) => {
    return dateString.substring(0, 10);
  };

  return (
    <div className="container">
      <h2>게시판</h2>
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts
              .slice() // 얕은 복사
              .reverse() // 역순
              .map((it, index) => (
                <tr key={it.id}>
                  <td>{posts.length - index}</td>
                  <td>{it.title}</td>
                  <td>{it.author.username}</td>
                  <td>{formattedDate(it.createdAt)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4">게시글이 없습니다</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="write-button-container">
        {/* 글쓰기 버튼을 눌렀을 때 navigate를 이용해서 글쓰기 페이지로 이동시켜주기 */}
        <button onClick={() => navigate("/board/write")} className="write-button">
          글쓰기
        </button>
      </div>
    </div>
  );
};
export default Board;
