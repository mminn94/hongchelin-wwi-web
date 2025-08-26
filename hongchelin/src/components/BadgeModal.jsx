import { useEffect, useState } from "react";
import { BADGES } from "../constants/BadgeImage";
import "./BadgeModal.css";
import Button from "./Button";
import { setActiveBadge } from "../api/users";

const BadgeModal = ({ onClose, onSave, initialBadgeId }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const handlePick = async (badge) => {
    try {
      setSaving(true);
      setError("");
      const me = await setActiveBadge(badge.id);
      onSave?.(me.activeBadgeId ?? badge.id);
      onClose();
    } catch (err) {
      console.error("대표 배지 설정 실패:", err);
      setError("대표 배지 설정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setSaving(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className="badge-modal-backdrop" onClick={!saving ? onClose : undefined}>
      <div className="badge-modal" onClick={stop}>
        <h3 className="badge-modal-title">배지 선택</h3>

        {error && <div className="badge-modal-error">{error}</div>}

        <div className={`badge-grid ${saving ? "is-saving" : ""}`}>
          {BADGES.map((badge) => (
            <button
              key={badge.id}
              className={`badge-cell ${initialBadgeId === badge.id ? "is-active" : ""}`}
              onClick={() => handlePick(badge)}
              aria-label={badge.alt}
              disabled={saving}
            >
              <img src={badge.src} alt={badge.alt} />
              {saving && initialBadgeId === badge.id && (
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
