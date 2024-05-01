import { useState, useEffect } from "react";
import '../css/signUpCard.css'

const SignUpCards = ({ name, state, setState}) => {

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

    const handleClick = () => {
        if(isSelected){
            handleRemoveGenre(name)
        }
        
        setIsSelected(!isSelected);
    }

    return (
        <div className={`cards ${isSelected ? "selected": ''}`} onClick={() => {handleSaveGenre(name), handleClick()}}>
            <input type="button" name="genre" value={name} />
        </div>
    )
}

export default SignUpCards;