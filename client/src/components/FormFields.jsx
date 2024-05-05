
const FormFields = (props) => {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor={props.name}>{props.label}</label>
            <input className="form-control" onChange={props.onChange} type={props.type} name={props.name} />
        </div>    
    )
    
}

export default FormFields;