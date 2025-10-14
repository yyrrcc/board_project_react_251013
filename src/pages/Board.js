import api from "../api/axiosConfig.js";
import "./Board.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardDetail from "./BoardDetail.js";

const Board = ({ user }) => {
  const [posts, setPosts] = useState([]); // 모든 글 목록
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩중

  // 모든 게시글 요청(get)
  const loadPosts = async () => {
    try {
      const res = await api.get("/api/board");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []); // 첫 랜더링 될 때 무조건 loadPosts() 실행하기

  const handleWrite = () => {
    // 이 방법은 한계가 있음(url 직접 접근 시 막을 수 없음)
    if (!user) {
      alert("로그인한 유저만 작성 가능합니다.");
      return;
    }
    navigate("/board/write");
  };

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
      {loading && <p>글 리스트 로딩 중...</p>}
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
                  {/* 제목을 클릭했을 때 id를 받아서 navigate로 이동 시키게 만들기 */}
                  <td onClick={() => navigate(`/board/${it.id}`)} className="board-title">
                    {it.title}
                  </td>
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
        <button onClick={handleWrite} className="write-button">
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default Board;
