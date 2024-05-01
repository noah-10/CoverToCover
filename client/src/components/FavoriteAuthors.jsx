

const FavoriteAuthors = ({ name, removeAuthor }) => {
    return (
        <li className="author">
            <p>{name}</p>
            <button type="button" onClick={() => removeAuthor(name)}>Remove</button>
        </li>
    )
}

export default FavoriteAuthors;