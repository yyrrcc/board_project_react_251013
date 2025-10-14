import { useNavigate, useParams } from "react-router-dom";
import "./BoardDetail.css";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const BoardDetail = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 id 추출
  const [post, setPost] = useState(null); // id로 받아온 객체
  const [loading, setLoading] = useState(true); // 로딩중

  const [editing, setEditing] = useState(false); // 수정 할 경우
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // id 이용해서 글 불러오기
  const loadPost = async () => {
    try {
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data);
      setTitle(res.data.title); // 불러온 글 title에 기본값 넣어주기
      setContent(res.data.content); // 불러온 글 content에 기본값 넣어주기
      // console.log(res.data); // 확인용
    } catch (error) {
      console.error(error);
      alert("해당 게시글은 존재하지 않습니다.");
      navigate("/board");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPost();
  }, [id]);

  // loading : 요청 진행 중, post : 요청 완료 후 받은 데이터 존재 여부
  if (loading) {
    return <div className="detail-container">게시글 로딩 중...</div>;
  }
  if (!post) {
    return <p style={{ color: "red" }}>해당 게시글이 존재하지 않습니다.</p>;
  }

  // 글 수정 시 (Update-put)
  const handleUpdate = async () => {
    try {
      const res = await api.put(`/api/board/${id}`, { title, content });
      setTitle(res.data.title);
      setContent(res.data.content);
      alert("글 수정 성공");
      setPost(res.data); // 변경된 내용을 setPost에 넣어줘서 다시 찍기
      setEditing(false); // 상세보기 화면으로 전환
    } catch (error) {
      if (error.response.status === 403) {
        alert("수정 할 권한이 없습니다.");
      } else {
        alert("글 수정 실패");
      }
    }
  };
  // 글 삭제 (Delete)
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) {
      return;
    }
    try {
      await api.delete(`/api/board/${id}`);
      navigate("/board", { replace: true });
    } catch (error) {
      if (error.response.status === 403) {
        // 백엔드에서 넘어온 status의 값을 통해서
        alert("삭제 할 권한이 없습니다.");
      } else {
        alert("글 삭제 실패");
      }
    }
  };

  // 로그인 상태이면서 글쓴이가 동일한 경우 (본인 글만 수정, 삭제 할 수 있게)
  const isAuthor = user && user === post.author.username;

  return (
    <div className="detail-container">
      {editing ? (
        <>
          {/* editing=true 즉, 수정 할 때! */}
          <div className="edit-form">
            <h2>글 수정하기</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="button-group">
              <button onClick={handleUpdate} type="submit">
                수정하기
              </button>
              <button type="button" onClick={() => setEditing(false)}>
                취소
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* editing=false 즉, 수정 버튼 누르지 않았을 때 기본 값! */}
          <h2>제목 : {post.title}</h2>
          <p className="author">작성자 : {post.author.username}</p>
          <div className="content">{post.content}</div>
          <div className="button-group">
            <button onClick={() => navigate("/board")}>글 목록</button>
            {isAuthor && (
              <>
                <button onClick={() => setEditing(true)} className="edit-button">
                  수정
                </button>
                <button onClick={handleDelete} className="delete-button">
                  삭제
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BoardDetail;
