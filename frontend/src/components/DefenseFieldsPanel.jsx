import { useId } from "react";

function inputClass(status) {
  const base = "field-control mt-2 text-sm";

  if (status === "correct") {
    return `${base} border-teal-500 bg-teal-50/50 focus:border-teal-600 focus:ring-teal-100`;
  }

  if (status === "incorrect") {
    return `${base} border-rose-500 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-100`;
  }

  return base;
}

function messageClass(status) {
  if (status === "correct") return "text-teal-700";
  if (status === "incorrect") return "text-rose-600";
  return "text-slate-500";
}

function handleEnterValidation(event, field, onValidate) {
  if (!onValidate || event.key !== "Enter") return;

  if (field.type === "textarea" && !event.metaKey && !event.ctrlKey) return;

  event.preventDefault();
  onValidate(field.name);
}

function browserInputMemoryProps(fieldName, memoryKey) {
  return {
    autoCapitalize: "off",
    autoComplete: "off",
    autoCorrect: "off",
    name: `defense-${memoryKey}-${fieldName}`,
    spellCheck: false,
  };
}

export function DefenseFieldsPanel({
  checks,
  compact = false,
  fields,
  onChange,
  onValidate,
  title,
  values,
}) {
  const isControlled = Boolean(values && onChange);
  const memoryKey = useId().replaceAll(":", "");

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Defensa oral</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
          {onValidate ? (
            <p className="mt-1 text-sm text-slate-500">Completa las respuestas para revisar si coinciden con el cálculo.</p>
          ) : null}
        </div>
        <span className="chip text-teal-700">
          <span className="status-dot" />
          editable
        </span>
      </div>

      <div className={`mt-5 grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
        {fields.map((field) => (
          <label
            key={field.name}
            className={field.type === "textarea" && !compact ? "md:col-span-2" : ""}
          >
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                className={`${inputClass(checks?.[field.name]?.status)} min-h-28 resize-y`}
                {...browserInputMemoryProps(field.name, memoryKey)}
                onKeyDown={(event) => handleEnterValidation(event, field, onValidate)}
                {...(isControlled
                  ? {
                      value: values[field.name] || "",
                      onChange: (event) => onChange(field.name, event.target.value),
                    }
                  : {})}
              />
            ) : (
              <input
                className={inputClass(checks?.[field.name]?.status)}
                {...browserInputMemoryProps(field.name, memoryKey)}
                onKeyDown={(event) => handleEnterValidation(event, field, onValidate)}
                {...(isControlled
                  ? {
                      value: values[field.name] || "",
                      onChange: (event) => onChange(field.name, event.target.value),
                    }
                  : {})}
              />
            )}
            {checks?.[field.name]?.message ? (
              <p className={`mt-1 text-xs font-semibold ${messageClass(checks[field.name].status)}`}>
                {checks[field.name].message}
              </p>
            ) : null}
          </label>
        ))}
      </div>
    </section>
  );
}
