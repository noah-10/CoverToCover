
const FormFields = (props) => {
    return (
        <div className="form-field" >
            <input className={props.inputError ? `form-control ${props.inputError.inputError.className}` : "form-control"} placeholder={props.label} onChange={props.onChange} type={props.type} name={props.name} />
        </div>    
    )
    
}

export default FormFields;