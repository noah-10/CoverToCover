import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import FormFields from '../components/FormFields';
import Auth from '../../utils/auth'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import GenreCards from "../components/GenreCards";
import genresData from "../../utils/genres" ;
import SignUpList from "../components/SignUpList";
import { searchBookTitle } from "../../utils/API";
import SignUpBooks from "../components/SignUpBooks";
import { checkImg } from "../../utils/bookCover";
import '../css/signUp.css';

const SignUp = () => {

    const [addUser, { error, data }] = useMutation(ADD_USER);

    // State of author input
    const [authorInput, setAuthorInput] = useState("");

    // For user genres
    const [userGenre, setUserGenre] = useState([]);

    // For user authors
    const [userAuthor, setUserAuthor] = useState([]);

    // For current book input
    const [currentBookInput, setCurrentBookInput] = useState("");

    // For current books
    const [currentBooks, setCurrentBooks] = useState([]);

    // For finished book input
    const [finishedBookInput, setFinishedBookInput] = useState("");

    // For finished books
    const [userFinishedBooks, setUserFinishedBooks] = useState([]);

    // Sets which input field is active
    const [activeField, setActiveField] = useState(1);

    // class for small text foe genre
    const [genreError, setGenreError] = useState(null);

    // For input errors
    const [inputError, setInputError] = useState(
        {   inputName: null, 
            className: "input-error-hidden", 
            message: null, 
            messageClass: "input-error-message-hidden",
            type: null
        });

    // For user info
    const [userFormData, setUserFormData] = useState(
        {   
            username: '', 
            email: '', 
            password: '', 
            preferencedAuthor: userAuthor,
            preferencedGenre: userGenre,
            currentlyReading: currentBooks,
            finishedBooks: userFinishedBooks,
        }
    );

    // Updates the userForm whenever the state of genre is updated
    useEffect(() => {
        
        setUserFormData(prevData => ({
            ...prevData,
            preferencedGenre: userGenre
        }));

        if(genreError === "genre-error" && userGenre.length >= 5){
            setGenreError(null);
        }
    }, [userGenre]);

    // Updates the userForm whenever the state of author is updated
    useEffect(() => {
        setUserFormData(prevData => ({
            ...prevData,
            preferencedAuthor: userAuthor
        }));
    }, [userAuthor]);

    // Updates the userForm whenever the state of current books is updated
    useEffect(() => {
        setUserFormData(prevData => ({
            ...prevData,
            currentlyReading: currentBooks
        }));
    }, [currentBooks]);

    // Updates the userForm whenever the state of finished books is updated
    useEffect(() => {
        setUserFormData(prevData => ({
            ...prevData,
            finishedBooks: userFinishedBooks
        }));
    }, [userFinishedBooks]);

    // handles input in the personal info section
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });

        // For required
        if(inputError.inputName === name && value.length > 0 && inputError.type === "required"){
            setInputError(prevData => ({
                ...prevData,
                className: null,
                messageClass: "input-error-message-hidden"
            }));
        }

        // If they delete their input when originally was empty
        else if(inputError.message && inputError.inputName === name && value.length < 1 && inputError.type === "required"){
            setInputError(prevData => ({
                ...prevData,
                className: "input-error",
                messageClass: "input-error-message"
            }));
        }

        // For password length after error message
        else if(inputError.message && name === "password" && value.length > 7 && inputError.type === "length"){
            setInputError(prevData => ({
                ...prevData,
                className: null,
                messageClass: "input-error-message-hidden"
            }));
        }

        // For password length if length goes under 7
        else if(inputError.message && name === "password" && value.length < 8 && inputError.type === "length"){
            setInputError(prevData => ({
                ...prevData,
                className: "input-error",
                messageClass: "input-error-message"
            }));
        }

        // For unique error msg
        else if(inputError.message && inputError.inputName === name && inputError.type === "unique"){
            setInputError(prevData => ({
                ...prevData,
                className: null,
                messageClass: "input-error-message-hidden"
            }));
        }

        // For valid email
        else if(inputError.message && name === "email" && inputError.type === "valid"){
            const checkEmail = (email) => {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                return emailRegex.test(email);
            };

            if(checkEmail(value)){
                setInputError(prevData => ({
                    ...prevData,
                    className: null,
                    messageClass: "input-error-message-hidden"
                }));
            }else{
                setInputError(prevData => ({
                    ...prevData,
                    className: "input-error",
                    messageClass: "input-error-message"
                }));
            }
        }
    }

    // For creating user
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if(userGenre.length < 5){
            setActiveField(2);
            setGenreError("genre-error");
            return;
        }

        try{
            // Uses the addUSer mutation
            const { data } = await addUser({
                // Variables of all of users data
                variables: { ...userFormData }
            });
            if(data){
                Auth.login(data.addUser.token);
                setUserFormData({
                    username: '',
                    email: '',
                    password: '',
                })
            }
        }catch(err){
            // find which input has the error
            if(err.message.includes("Username") || err.message.includes("username")){
                setInputError(prevData => ({
                    ...prevData,
                    inputName: "username"
                }));

            }else if(err.message.includes("Password") || err.message.includes("password")){
                setInputError(prevData => ({
                    ...prevData,
                    inputName: "password"
                }));

            }else if(err.message.includes("Email") || err.message.includes("email")){
                setInputError(prevData => ({
                    ...prevData,
                    inputName: "email"
                }));
            }

            // Find the type of error
            if(err.message.includes("required")){
                setInputError(prevData => ({
                    ...prevData,
                    type: "required"
                }));
            }
            else if(err.message.includes("used")){
                setInputError(prevData => ({
                    ...prevData,
                    type: "unique"
                }));
            }
            else if(err.message.includes("characters")){
                setInputError(prevData => ({
                    ...prevData,
                    type: "length"
                }));
            }
            else if(err.message.includes("valid")){
                setInputError(prevData => ({
                    ...prevData,
                    type: "valid"
                }));
            }

            setActiveField(1);
            setInputError(prevData => ({
                ...prevData,
                message: err.message,
                className: "input-error",
                messageClass: "input-error-message"
            }));
        };        
    }

    // When user clicks next, it sets the state to show that input field
    const nextField = () => {
        setActiveField(activeField + 1);
    }

    // When user clicks previous, it sets the state to show that input field
    const previousField = () => {
        setActiveField(activeField - 1);
    }

    // Handles the text input change when entering in an author
    const handleAuthorChange = (e) => {
        setAuthorInput(e.target.value);
    }

    // When saving an author, it adds the author to the state array
    const handleSaveAuthor = () => {
        setUserAuthor([...userAuthor, authorInput]);
        setAuthorInput("");
    }

    const currentBookInputChange = (e) => {
        setCurrentBookInput(e.target.value);
    }

    //Save all book info
    const handleSaveCurrentBook = async () => {
        try{
            const bookTitle = currentBookInput.split(" ").join("+")
            const response = await searchBookTitle(bookTitle);
            const { items }  = await response.json();
            const book = items[0];

            let cover = book.volumeInfo.imageLinks.thumbnail;
            cover = cover.replace("zoom=1", "zoom=4");

            cover = await checkImg(cover, book.volumeInfo.title, book.volumeInfo.authors[0]);

            const saveBook = {
                authors: book.volumeInfo.authors,
                title: book.volumeInfo.title,
                cover: cover,
                bookId: book.id,
                description: book.volumeInfo.description,
                categories: book.volumeInfo.categories,
            }

            setCurrentBooks([...currentBooks, saveBook]);
            setCurrentBookInput("");
        }catch(err){
            return { error: err };
        }
    }

    const finishedBookInputChange = (e) => {
        setFinishedBookInput(e.target.value);
    }

    // Save all book info
    const handleSaveFinishedBook = async () => {
        try{
            const bookTitle = finishedBookInput.split(" ").join("+")
            const response = await searchBookTitle(bookTitle);
            const { items }  = await response.json();
            const book = items[0];

            let cover = book.volumeInfo.imageLinks.thumbnail;
            cover = cover.replace("zoom=1", "zoom=4");

            cover = await checkImg(cover, book.volumeInfo.title, book.volumeInfo.authors[0]);
            console.log(cover)
            const saveBook = {
                authors: book.volumeInfo.authors,
                title: book.volumeInfo.title,
                cover: cover,
                bookId: book.id,
                description: book.volumeInfo.description,
                categories: book.volumeInfo.categories,
            }

            setUserFinishedBooks([...userFinishedBooks, saveBook]);

            setFinishedBookInput("");
        }catch(err){
            return { error: err };
        }
    }

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <div className="signup-items">
                <form className="signupForm">
                    <fieldset className={ activeField === 1 ? 'current' : 'hidden'}>
                        <h2 className="mt-4">Personal Details</h2>
                        <div className="signup-personal-details">
                            <FormFields
                                label="Username"
                                name="username"
                                type="text"
                                onChange={handleInputChange}
                                inputError= {inputError.inputName === "username" ? {inputError} : null}
                            />
                            <FormFields
                                label="Email"
                                name="email"
                                type="text"
                                onChange={handleInputChange}
                                inputError= {inputError.inputName === "email" ? {inputError} : null}
                            />
                            <FormFields
                                label="Password"
                                name="password"
                                type="password"
                                onChange={handleInputChange}
                                inputError= {inputError.inputName === "password" ? {inputError} : null}
                            />
                        </div>
                        <div className={`${inputError.messageClass}`}>
                            <p>{inputError.message}</p>
                        </div>
                        <div className="Btn">
                            <button className="next action-btn" onClick={nextField} type="button">Next</button>
                        </div>
                    </fieldset>
                    
                    <fieldset className={activeField === 2 ? 'current' : 'hidden'}>
                        <h2 className="mt-4">Favorite Genres</h2>
                        <small className={`${genreError}`}>Please select atleast 5 genres</small>
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
                        <div className="Btn">
                            <button className="previous action-btn" onClick={previousField} type="button">Previous</button>
                            <button className="next action-btn" onClick={nextField} type="button">Next</button>
                        </div>
                    </fieldset>

                    <fieldset className={activeField === 3 ? 'current' : 'hidden'}>
                        <h2 className="mt-4">Favorite Authors</h2>
                        <div className="signup-input">
                            <input className="form-control" type="text" placeholder="Author" value={authorInput} onChange={handleAuthorChange}/>
                            <button type="button" onClick={handleSaveAuthor}>Save</button>
                        </div>

                        <ul className="author-list mt-4">
                            {userAuthor.map((author, index) => (
                                <SignUpList 
                                    key={index}
                                    name={author}
                                    setState={setUserAuthor}
                                />
                            ))}
                        </ul>
                        
                        <div className="Btn">
                            <button className="previous action-btn" onClick={previousField} type="button">Previous</button>
                            <button className="next action-btn" onClick={nextField} type="button">Next</button>
                        </div>
                    </fieldset>

                    <fieldset className={activeField === 4 ? 'current' : 'hidden'}>
                        <h2 className="mt-4">Currently Reading</h2>
                        <div className="signup-input">
                            <input className="form-control" type="text" placeholder="Book Title" value={currentBookInput} onChange={currentBookInputChange}/>
                            <button type="button" onClick={handleSaveCurrentBook}>Save</button>
                        </div>

                        <ul className="book-container mt-4">
                            {currentBooks.map((book, index) => (
                                <SignUpBooks 
                                    key={index}
                                    name={book.title}
                                    cover={book.cover}
                                    setState={setCurrentBooks}
                                />
                            ))}
                        </ul>

                        <div className="Btn">
                            <button className="previous action-btn" onClick={previousField} type="button">Previous</button>
                            <button className="next action-btn" onClick={nextField} type="button">Next</button>
                        </div>
                    </fieldset>

                    <fieldset className={activeField === 5 ? 'current' : 'hidden'}>
                        <h2 className="mt-4">Finished Books</h2>
                        <div className="signup-input">
                            <input className="form-control" type="text" placeholder="Book Title" value={finishedBookInput} onChange={finishedBookInputChange}/>
                            <button type="button" onClick={handleSaveFinishedBook}>Save</button>
                        </div>

                        <ul className="book-container mt-4">
                            {userFinishedBooks.map((book, index) => (
                                <SignUpBooks 
                                    key={index}
                                    name={book.title}
                                    cover={book.cover}
                                    setState={setUserFinishedBooks}
                                />
                            ))}
                        </ul>
                        <div className="Btn">
                            <button className="previous action-btn" onClick={previousField} type="button">Previous</button>
                            <button className="action-btn submit" type="submit" onClick={handleFormSubmit}>Submit</button>
                        </div>
                    </fieldset>
                    
                </form>
                <div className="to-login">
                    <Link to='/login'>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp;