import { useState, useEffect } from "react";
import '../css/signUpCard.css'

const SignUpCards = ({ name, saveGenre, removeGenre}) => {

    const [isSelected, setIsSelected] = useState(false)

    const handleClick = () => {
        if(isSelected){
            removeGenre(name)
        }
        
        setIsSelected(!isSelected);
    }

    return (
        <div className={`cards ${isSelected ? "selected": ''}`} onClick={() => {saveGenre(name), handleClick()}}>
            <input type="button" name="genre" value={name} />
        </div>
    )
}

export default SignUpCards;