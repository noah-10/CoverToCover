
const SignUpBooks = ({ name, cover, setState }) => {
    // Removes author from state array
    const removeListItem = (name) => {
        setState(prevData => {
            return prevData.filter(item => item.title !== name);
        })
    }

    return (
        <li className="list-item">
            <div className="current-cover">
                <img src={`https://covers.openlibrary.org/b/id/${cover}.jpg`} alt="" />
            </div>
            <p>{name}</p>
            <button type="button" onClick={() => removeListItem(name)}>Remove</button>
        </li>
    )
}

export default SignUpBooks