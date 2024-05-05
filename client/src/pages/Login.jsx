import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormFields from "../components/FormFields";
import Auth from '../../utils/auth';

const Login = () => {
    const [loginUser, { error, data }] = useMutation(LOGIN_USER);

    const [userFormData, setUserFormData] = useState({ email: '', password: '' });

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
        }catch(err){
            console.error(err);
        }

        setUserFormData({
            email: '',
            password: '',
        });
    }

    return (
        <div className="container login-container">
            <h1>Login</h1>
            <form>
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
            </form>
            <button id="login-btn" onClick={handleFormSubmit}>Login</button>
            <div className="to-signup">
                <Link to='/signup'>Sign Up Instead</Link>
            </div>
        </div>
    )
}

export default Login;