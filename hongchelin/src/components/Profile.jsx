import { useEffect, useRef, useState } from "react";
import Name from "./Name";
import Information from "./Information";
import NicknameModal from "./NicknameModal";
import ProfileImageModal from "./ProfileImageModal";
import BadgeModal from "./BadgeModal";
import {
  getMyProfile,
  updateMyNickname,
  updateMyProfileImage,
} from "../api/users";
import { BADGES } from "../constants/BadgeImage";

const Profile = () => {
  const defaultProfile = "/images/기본프로필.png";
  const apiBase = import.meta.env.VITE_API_URL;

  const [nickname, setNickname] = useState("닉네임");
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [activeBadgeId, setActiveBadgeId] = useState(BADGES[0]?.id);

  const [ownedBadgeIds, setOwnedBadgeIds] = useState([]);

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const tempObjectUrlRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMyProfile();
        setNickname(me.nickname ?? "닉네임");

        if (me?.profileImageUrl && me.profileImageUrl.trim() !== "") {
          setProfileImage(`${apiBase}${me.profileImageUrl}?t=${Date.now()}`);
        } else {
          setProfileImage(defaultProfile);
        }

        if (me.activeBadgeId != null) setActiveBadgeId(me.activeBadgeId);
        if (Array.isArray(me.badgeIds)) setOwnedBadgeIds(me.badgeIds);
      } catch (err) {
        console.error("마이페이지 조회 실패:", err);
      }
    })();
  }, [apiBase]);

  const handleNicknameSave = async (newNickname) => {
    try {
      const me = await updateMyNickname(newNickname);
      setNickname(me.nickname);
      setIsNicknameModalOpen(false);
    } catch (err) {
      console.error("닉네임 저장 실패:", err);
      alert(err.response?.data?.message || "닉네임 저장에 실패했습니다.");
    }
  };

  const handleImageSave = async (file) => {
    try {
      await updateMyProfileImage(file);
      const me = await getMyProfile();

      if (me?.profileImageUrl && me.profileImageUrl.trim() !== "") {
        setProfileImage(`${apiBase}${me.profileImageUrl}?t=${Date.now()}`);
      } else {
        setProfileImage(defaultProfile);
      }
      setIsImageModalOpen(false);
    } catch (error) {
      console.error("프로필 이미지 저장 실패:", error);
      alert(error.response?.data?.message || "프로필 이미지 저장에 실패했습니다.");
    }
  };

  useEffect(() => {
    return () => {
      if (tempObjectUrlRef.current) URL.revokeObjectURL(tempObjectUrlRef.current);
    };
  }, []);

  const handleBadgeSave = (newBadgeId) => {
    setActiveBadgeId(newBadgeId);
    setIsBadgeModalOpen(false);
  };

  //const displayImage = profileImage || defaultProfile;
  const badgeSrc = BADGES.find((b) => b.id === activeBadgeId)?.src;

  return (
    <>
      <Name nickname={nickname} profileImage={profileImage || defaultProfile} badge={badgeSrc} />

      <Information
        onOpenNicknameModal={() => setIsNicknameModalOpen(true)}
        onOpenProfileImageModal={() => setIsImageModalOpen(true)}
        onOpenBadgeModal={() => setIsBadgeModalOpen(true)}
        activeBadgeId={activeBadgeId}
      />

      {isNicknameModalOpen && (
        <NicknameModal
          onClose={() => setIsNicknameModalOpen(false)}
          onSave={handleNicknameSave}
          initialNickname={nickname}
        />
      )}

      {isImageModalOpen && (
        <ProfileImageModal
          onClose={() => setIsImageModalOpen(false)}
          onSave={handleImageSave}
        />
      )}

      {isBadgeModalOpen && (
        <BadgeModal
          onClose={() => setIsBadgeModalOpen(false)}
          onSave={handleBadgeSave}
          initialBadgeId={activeBadgeId}
          ownedBadgeIds={ownedBadgeIds}
        />
      )}
    </>
  );
};

export default Profile;
