import { useEffect, useState } from "react";
import Button from "./Button";

const ProfileImageModal = ({ onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(()=>{
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")){
      alert("이미지 파일만 업로드할 수 있어요")
      return;
    }

    if(file.size > 5 * 1024 * 1024){
      alert(`파일 용량이 너무 큽니다. 5MB 이하로 업로드해주세요`);
      return;
    }

    if(previewURL) URL.revokeObjectURL(previewURL);

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("파일을 선택하세요.");
      return;
    }
    try{
      setIsSaving(true);
      await onSave(selectedFile);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>프로필 사진 변경</h2>
        <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}/>

        {previewURL &&
        <img
        src={previewURL}
        alt="미리보기"
        width="150"
        height="150"
        style={{ borderRadius: "50%", marginTop: "10px", objectFit:"cover" }} />}
        <div className="modal-buttons">
          <Button onClick={onClose} type="nickname" disabled={isSaving}>취소</Button>
          <Button onClick={handleSave} type="nickname" disabled={isSaving}>
            {isSaving ? "저장중..." : "저장" }
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
