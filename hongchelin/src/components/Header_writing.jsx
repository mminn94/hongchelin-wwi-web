import "./Header_writing.css";

const Header_writing = ({text}) => {
    return (
        <header className="Header_writing">
            <div>
                <h2>
                    {text}
                </h2>
            </div>
        </header>
    )

}

export default Header_writing;
