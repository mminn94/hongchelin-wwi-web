import { useEffect, useState } from "react";
import { BADGES } from "../constants/BadgeImage";
import "./BadgeModal.css";
import Button from "./Button";
import { setActiveBadge } from "../api/users";

const BadgeModal = ({ onClose, onSave, initialBadgeId }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickedId, setPickedId] = useState(initialBadgeId);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const handlePick = async (badge) => {
    if (saving) return;
    try {
      setSaving(true);
      setError("");
      setPickedId(badge.id); // 낙관적 UI 업데이트
      const me = await setActiveBadge(badge.id);
      onSave?.(me.activeBadgeId ?? badge.id);
      onClose();
    } catch (err) {
      console.error("대표 배지 설정 실패:", err);
      setPickedId(initialBadgeId); // 롤백
      const msg =
        err.response?.data?.error ||
        "대표 배지 설정에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setError(msg);
      setSaving(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className="badge-modal-backdrop" onClick={!saving ? onClose : undefined}>
      <div className="badge-modal" onClick={stop}>
        <h3 className="badge-modal-title">대표 배지 선택</h3>

        {error && <div className="badge-modal-error">{error}</div>}

        <div className={`badge-grid ${saving ? "is-saving" : ""}`}>
          {BADGES.map((badge) => (
            <button
              key={badge.id}
              className={`badge-cell ${pickedId === badge.id ? "is-active" : ""}`}
              onClick={() => handlePick(badge)}
              aria-label={badge.alt}
              disabled={saving}
              type="button"
            >
              <img src={badge.src} alt={badge.alt} />
              {saving && pickedId === badge.id && (
                <span className="badge-saving-indicator">저장 중…</span>
              )}
            </button>
          ))}
        </div>

        <Button type="nickname" onClick={onClose} disabled={saving}>
          취소
        </Button>
      </div>
    </div>
  );
};

export default BadgeModal;
