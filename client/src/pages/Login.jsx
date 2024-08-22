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

    useEffect(() => {
        console.log(userFormData)
    })

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try{
            const { data } = await loginUser({
                variables: { ...userFormData }
            });
            Auth.login(data.login.token);
            setShowError("hide-login-error");
            setUserFormData({
                email: '',
                password: '',
            });
        }catch(err){
            setShowError("show-login-error");
            
        }

        
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <div className="login-items">
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
                        <div className="login-Btn">
                            <button className="action-btn" onClick={handleFormSubmit}>Login</button>
                        </div>
                    </fieldset>
                </form>  
                <div className="to-signup">
                    <Link to='/signup'>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;