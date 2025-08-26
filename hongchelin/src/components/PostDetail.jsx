import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCommunityPostById,
  deleteCommunityPost,
  getCommunityComments,
  createCommunityComment,
  deleteCommunityComment,
} from "../api/community";
import Button from "./Button";
import "./PostDetail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const nav = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getCommunityPostById(postId);
      setPost(data);
    } catch (err) {
      console.error("게시글 불러오기 실패", err);
      setError("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async () => {
    try {
      const data = await getCommunityComments(postId);
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteCommunityPost(postId);
      alert("게시글이 삭제되었습니다.");
      nav("/community");
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    try {
      await createCommunityComment(postId, { content: comment });
      setComment("");
      await fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteCommunityComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    nav(`/writing/edit/${post.id}`, { state: post });
  };

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="PostDetail">
      <div>
        <Button type="back" onClick={() => nav(`/community`)} style={{ marginTop: "10px" }}>
          뒤로가기
        </Button>
      </div>

      <div className="info">
        <img
          src={post.profileImage || post.profileImage }
          alt={`${post.nickname} 프로필`}
          className="profile-image"
        />
        <div className="info-text">
          <p className="nickname">{post.nickname}</p>
          <p className="created-date">
            {new Date(post.createdDate).toLocaleDateString("ko-KR")}{" "}
            {new Date(post.createdDate).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="title">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>

      <div className="detail">
        <p>🚩 위치: {post.restaurantName}</p>
        <p>🍽️ 추천메뉴: {post.recommendedMenu}</p>
        <p>⭐️ 별점: {post.rating} / 5</p>
        {post.imageUrl && <img src={post.imageUrl} alt="첨부 이미지" width="300" />}
      </div>

      <div className="postDetail">
        <Button type="detail" onClick={handleEdit}>수정</Button>
        <Button type="detail" onClick={handleDelete}>삭제</Button>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h3>💬 댓글 작성</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{
            width: "90%",
            height: "80px",
            padding: "10px",
            marginTop: "10px",
          }}
        />
        <Button onClick={handleCommentSubmit} style={{ marginTop: "10px" }}>
          댓글 등록
        </Button>
      </section>

      {comments.length > 0 && (
        <section style={{ marginTop: "20px" }}>
          <h3>📝 댓글 목록</h3>
          {comments.map((c) => (
            <div key={c.id} className="comment-item" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              {c.authorProfileImageUrl && (
                <img
                  src={c.authorProfileImageUrl}
                  alt={`${c.authorNickname} 프로필`}
                  className="comment-profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px"
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{c.authorNickname}</p>
                <p style={{ margin: "2px 0", fontSize: "12px", color: "#666" }}>
                  {new Date(c.createdAt).toLocaleDateString("ko-KR")}{" "}
                  {new Date(c.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p style={{ margin: "4px 0" }}>{c.content}</p>
              </div>
              <Button
                type="delete"
                onClick={() => handleCommentDelete(c.id)}
                style={{ marginLeft: "10px" }}
              >
                삭제
              </Button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default PostDetail;
