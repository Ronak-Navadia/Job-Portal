import clsx from "clsx";
import { Placeholder } from "react-select/animated";

interface FormControlProps {
  id: string;
  type: string;
  name: string;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string | number;
  placeholderText?: string;
}
const FormControl = ({
  id,
  type,
  onChange,
  value,
  name,
  className,
  placeholderText
}: FormControlProps) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={clsx(className, `form-control`)}
      id={id}
      placeholder={placeholderText || ""}
    />
  );
};

export default FormControl;
