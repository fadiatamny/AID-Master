export interface InputProps {
    label: string
    placeholder: string
    id: string
    className?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const defaultProps: InputProps = {
    id: '',
    label: 'input label',
    placeholder: 'placeholder',
    className: '',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        return event.target.value
    }
}

const Input = ({ label, placeholder, id, className, onChange }: InputProps = defaultProps) => {
    return (
        <div className={className}>
            <div className="input-group mb-3 ml-5 mr-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    id={id}
                    onChange={onChange}
                />
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                        {label}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Input
