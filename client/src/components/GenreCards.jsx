import { useState, useEffect } from "react";
import '../css/genreCard.css'

const SignUpCards = ({ name, state, setState}) => {

    // State for if a card is selected
    const [isSelected, setIsSelected] = useState(false)

    //Save genre to state
    const handleSaveGenre = (name) => {
        setState([...state, name]);
    }

    // remove genres in state value
    const handleRemoveGenre = (name) => {
        setState(prevData => {
            return prevData.filter(genre => genre !== name);
        })
    }

    // Checks if genre has been clicked
    const handleClick = (name) => {
        if(isSelected){
            handleRemoveGenre(name)
        }else{
            handleSaveGenre(name)
        }
        
        setIsSelected(!isSelected);
    }

    return (
        <div className={`cards ${isSelected ? "selected": ''}`} onClick={() => handleClick(name)}>
            <p className="genre-btn">{name}</p>
        </div>
    )
}

export default SignUpCards;