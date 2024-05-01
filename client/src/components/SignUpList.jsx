
const SignUpList = ({ name, setState }) => {

    // Removes author from state array
    const removeListItem = (name) => {
        setState(prevData => {
            return prevData.filter(item => item !== name);
        })
    }

    return (
        <li className="list-item">
            <p>{name}</p>
            <button type="button" onClick={() => removeListItem(name)}>Remove</button>
        </li>
    )
}

export default SignUpList;