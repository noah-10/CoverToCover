

const FavoriteAuthors = ({ name, setState }) => {

    const removeAuthor = (name) => {
        setState(prevData => {
            return prevData.filter(author => author !== name);
        })
    }

    return (
        <li className="author">
            <p>{name}</p>
            <button type="button" onClick={() => removeAuthor(name)}>Remove</button>
        </li>
    )
}

export default FavoriteAuthors;