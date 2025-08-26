import "./Name.css";

const Name = ({ nickname, profileImage, badge, onAvatarClick }) => {
  return (
    <div className="Name">
      <img
        src={ profileImage || "기본프로필.png"}
        className="profile-img"
        onClick={onAvatarClick}
      />
      <img
        src={badge}
        alt="배지"
        className="badge-img"
        onClick={onAvatarClick}
      />
      <h3>{nickname}</h3>
    </div>
  );
};

export default Name;
