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
    
    // Sets which input field is active
    const [activeField, setActiveField] = useState(1);

    // handles input in the personal info section
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });
    }

    // For creating user
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try{
            // Uses the addUSer mutation
            const { data } = await addUser({
                // Variables of all of users data
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

    const handleSaveCurrentBook = async () => {
        try{
            const bookTitle = currentBookInput.split(" ").join("+")
            const response = await searchBookTitle(bookTitle);
            const items  = await response.json();
            const book = items.docs[0];
            const firstSentString = book.first_sentence[0]

            // https://covers.openlibrary.org/b/id/$%7Bbook.cover_i%7D.jpg
            const saveBook = {
                authors: book.author_name,
                title: book.title,
                cover: book.cover_i,
                bookId: book.key,
                firstSentence: firstSentString,
            }

            setCurrentBooks([...currentBooks, saveBook]);
        }catch(err){
            return { error: err };
        }
    }

    const finishedBookInputChange = (e) => {
        setFinishedBookInput(e.target.value);
    }

    const handleSaveFinishedBook = async () => {
        try{
            const bookTitle = finishedBookInput.split(" ").join("+")
            const response = await searchBookTitle(bookTitle);
            const items  = await response.json();
            const book = items.docs[0];
            const firstSentString = book.first_sentence[0]
            // https://covers.openlibrary.org/b/id/$%7Bbook.cover_i%7D.jpg
            const saveBook = {
                authors: book.author_name,
                title: book.title,
                cover: book.cover_i,
                bookId: book.key,
                firstSentence: firstSentString,
            }

            setUserFinishedBooks([...userFinishedBooks, saveBook]);
        }catch(err){
            return { error: err };
        }
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
                            <SignUpList 
                                key={index}
                                name={author}
                                setState={setUserAuthor}
                            />
                        ))}
                    </ul>
                    
                    <button onClick={previousField} type="button">Previous</button>
                    <button onClick={nextField} type="button">Next</button>
                </fieldset>

                <fieldset className={activeField === 4 ? 'current' : 'hidden'}>
                    <h2>Currently Reading</h2>
                    <div className="current-read-input">
                        <input type="text" placeholder="Book Title" value={currentBookInput} onChange={currentBookInputChange}/>
                        <button type="button" onClick={handleSaveCurrentBook}>Save</button>
                    </div>

                    <ul className="currently-reading">
                        {currentBooks.map((book, index) => (
                            <SignUpBooks 
                                key={index}
                                name={book.title}
                                cover={book.cover}
                                setState={setCurrentBooks}
                            />
                        ))}
                    </ul>

                    <button onClick={previousField} type="button">Previous</button>
                    <button onClick={nextField} type="button">Next</button>
                </fieldset>

                <fieldset className={activeField === 5 ? 'current' : 'hidden'}>
                    <h2>Finished Books</h2>
                    <div className="finished-read-input">
                        <input type="text" placeholder="Book Title" value={finishedBookInput} onChange={finishedBookInputChange}/>
                        <button type="button" onClick={handleSaveFinishedBook}>Save</button>
                    </div>

                    <ul className="finished-reading">
                        {userFinishedBooks.map((book, index) => (
                            <SignUpBooks 
                                key={index}
                                name={book.title}
                                cover={book.cover}
                                setState={setUserFinishedBooks}
                            />
                        ))}
                    </ul>

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