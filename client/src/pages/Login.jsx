import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormFields from "../components/FormFields";
import Auth from '../../utils/auth';
import '../css/login.css';

const Login = () => {
    const [loginUser, { error, data }] = useMutation(LOGIN_USER);

    const [userFormData, setUserFormData] = useState({ email: '', password: '' });

    const [showError, setShowError] = useState("hide-login-error");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try{
            const { data } = await loginUser({
                variables: { ...userFormData }
            });
            Auth.login(data.login.token);
            setShowError("hide-login-error");
        }catch(err){
            setShowError("show-login-error");
        }

        setUserFormData({
            email: '',
            password: '',
        });
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form">
                <fieldset>
                    <div className="personal-details">
                        <FormFields
                            label="Email"
                            name="email"
                            type="text"
                            onChange={handleInputChange}
                        />
                        <FormFields
                            label="Password"
                            name="password"
                            type="password"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={showError}>
                        <p>The email or password is incorrect</p>
                    </div>
                    <div className="Btn">
                        <button className="action-btn" onClick={handleFormSubmit}>Login</button>
                    </div>
                </fieldset>
            </form>  
            <div className="to-signup">
                <Link to='/signup'>Sign Up Instead</Link>
            </div>
        </div>
    )
}

export default Login;