export interface InputProps {
    label: string
    placeholder: string
}

const Input = ({ label, placeholder }: InputProps) => {
    return (
        <div className="input-group mb-3 ml-5 mr-5">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                aria-label="Username"
                aria-describedby="basic-addon1"
            />
            <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                    {label}
                </span>
            </div>
        </div>
    )
}

export default Input
