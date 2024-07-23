import { Link } from "react-router-dom"

const NotLoggedIn = () => {
    return (
        <div className="not-loggedIn">
            <h1>You need to be logged in to see this</h1>
            <Link to='/signup'><button>LOGIN</button></Link>
        </div>
        
    );
}

export default NotLoggedIn;