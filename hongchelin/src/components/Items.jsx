import { useNavigate } from "react-router-dom";
import "./Items.css"

const Items = ({id, title, createdDate, content, restaurantName}) => {
    const nav = useNavigate();

    const handleClick = () => {
        nav(`/posts/${id}`)
    }

    return (
        <div className="item-card" onClick={handleClick}>
            <div className="item-header">
                <h3 className="item-title">{title}</h3>
                <span className="item-date">
                    {createdDate}
                </span>
            </div>
            <h4 className="item-location">🚩 {restaurantName}</h4>
            <p className="item-content">{content}</p>
        </div>
    );
}

export default Items;