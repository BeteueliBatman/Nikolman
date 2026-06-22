type AdminLocaleFieldProps = {
  label: string;
  name: string;
  defaultEn?: string;
  defaultKa?: string;
  multiline?: boolean;
  required?: boolean;
};

export default function AdminLocaleField({
  label,
  name,
  defaultEn = "",
  defaultKa = "",
  multiline = false,
  required = true,
}: AdminLocaleFieldProps) {
  const Input = multiline ? "textarea" : "input";

  return (
    <fieldset className="admin-locale-field">
      <legend>{label}</legend>
      <label className="admin-field">
        <span>English</span>
        <Input
          name={`${name}_en`}
          defaultValue={defaultEn}
          required={required}
          rows={multiline ? 5 : undefined}
        />
      </label>
      <label className="admin-field">
        <span>Georgian</span>
        <Input
          name={`${name}_ka`}
          defaultValue={defaultKa}
          required={required}
          rows={multiline ? 5 : undefined}
        />
      </label>
    </fieldset>
  );
}
