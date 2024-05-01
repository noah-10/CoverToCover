import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import FormFields from '../components/FormFields';
import Auth from '../../utils/auth'
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import GenreCards from "../components/GenreCards";
import genresData from "../../utils/genres" ;
import FavoriteAuthors from "../components/FavoriteAuthors";
import '../css/signUp.css';
// import User from "../../../server/models/User";

const SignUp = () => {

    const [addUser, { error, data }] = useMutation(ADD_USER);

    const [authorInput, setAuthorInput] = useState("");

    // For user genres
    const [userGenre, setUserGenre] = useState([]);

    // For user authors
    const [userAuthor, setUserAuthor] = useState([]);

    // For user info
    const [userFormData, setUserFormData] = useState(
        {   
            username: '', 
            email: '', 
            password: '', 
            preferencedAuthor: userAuthor,
            preferencedGenre: userGenre,
        }
    );

    // Updates the userForm whenever the state of genre is updated
    useEffect(() => {
        setUserFormData(prevData => ({
            ...prevData,
            preferencedGenre: userGenre
        }));
    }, [userGenre]);

    // Updates the userForm whenever the state of author is updated
    useEffect(() => {
        setUserFormData(prevData => ({
            ...prevData,
            preferencedAuthor: userAuthor
        }));
    }, [userAuthor]);
    
    const [activeField, setActiveField] = useState(1);

    // useEffect(() => {
    //     console.log(userGenre);
    //     console.log(userAuthor);
    //     // console.log(userFormData)
    // })

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

    const nextField = () => {
        setActiveField(activeField + 1);
    }

    const previousField = () => {
        setActiveField(activeField - 1);
    }

    const handleAuthorChange = (e) => {
        setAuthorInput(e.target.value);
    }

    const handleSaveAuthor = () => {
        setUserAuthor([...userAuthor, authorInput]);
        setAuthorInput("");
    }

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form id="signupForm">
                <fieldset className={activeField === 1 ? 'current' : 'hidden'}>
                    <h2>Personal Details</h2>
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
                    <button onClick={nextField} type="button">Next</button>
                </fieldset>
                
                <fieldset className={activeField === 2 ? 'current' : 'hidden'}>
                    <h2>Favorite Genres</h2>
                    <div className="genre-card">
                        {genresData.map((genre, index) => (
                            <GenreCards 
                                key={index}
                                name={genre}
                                state={userGenre}
                                setState={setUserGenre}
                            />
                        ))}
                    </div>                    
                    <button onClick={previousField} type="button">Previous</button>
                    <button onClick={nextField} type="button">Next</button>
                </fieldset>

                <fieldset className={activeField === 3 ? 'current' : 'hidden'}>
                    <h2>Favorite Authors</h2>
                    <div className="author-input">
                        <input type="text" placeholder="Author" value={authorInput} onChange={handleAuthorChange}/>
                        <button type="button" onClick={handleSaveAuthor}>Save</button>
                    </div>

                    <ul className="author-list">
                        {userAuthor.map((author, index) => (
                            <FavoriteAuthors 
                                key={index}
                                name={author}
                                setState={setUserAuthor}
                            />
                        ))}
                    </ul>
                    
                    <button onClick={previousField} type="button">Previous</button>
                    <button type="submit" onClick={handleFormSubmit}>Submit</button>
                </fieldset>
                
            </form>
            <div className="to-login">
                <Link to='/login'>Login Instead</Link>
            </div>
        </div>
    )
}

export default SignUp;