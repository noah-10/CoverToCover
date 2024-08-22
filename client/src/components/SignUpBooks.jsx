import '../css/signUpBooks.css'

const SignUpBooks = ({ name, cover, setState }) => {
    // Removes author from state array
    const removeListItem = (name) => {
        setState(prevData => {
            return prevData.filter(item => item.title !== name);
        })
    }

    return (
        <li className="list-item book-list">
            <div className="current-cover">
                <img src={cover} alt={`Cover for ${name}`} />
            </div>
            <p>{name}</p>
            <button className="remove-book" type="button" onClick={() => removeListItem(name)}>X</button>
        </li>
    )
}

export default SignUpBooks