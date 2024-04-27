import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import FormFields from '../components/FormFields';
import Auth from '../../utils/auth'

import { useState, useEffect } from "react";

const SignUp = () => {

    const [addUser, { error, data }] = useMutation(ADD_USER);

    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: ''});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try{
            const { data } = await addUser({
                variables: { ...userFormData }
            });

            Auth.login(data.addUser.token);
        }catch(err){
            console.error(err);
        };

        setUserFormData({
            username: '',
            email: '',
            password: '',
        })
    }

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form>
                <FormFields
                    label="Username"
                    name="username"
                    type="text"
                    onChange={handleInputChange}
                />
                <FormFields
                    label="Email"
                    name="email"
                    type="text"
                    onChange={handleInputChange}
                />
                <FormFields
                    label="Password"
                    name="password"
                    type="text"
                    onChange={handleInputChange}
                />
            </form>
            <button id="signup-btn" onClick={handleFormSubmit}>SIGN UP</button>
        </div>
    )
}

export default SignUp;