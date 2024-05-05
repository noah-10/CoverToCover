import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import FormFields from '../components/FormFields';
import Auth from '../../utils/auth'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SignUpModal from "../components/SignUpModal";

const SignUp = () => {

    const [addUser, { error, data }] = useMutation(ADD_USER);

    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: ''});

    const [showModal, setShowModal] = useState(false);

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
        <div className="container signup-container">
            <div className="row">
                <div className="col">
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
                            type="password"
                            onChange={handleInputChange}
                        />
                    </form>
                    <button id="signup-btn" onClick={handleFormSubmit}>SIGN UP</button>
                    <div className="to-login">
                        <Link to='/login'>Login Instead</Link>
                    </div>
                    {showModal && <SignUpModal />}
                </div>
            </div>
        </div>
    )
}

export default SignUp;