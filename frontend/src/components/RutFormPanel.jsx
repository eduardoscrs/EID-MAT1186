import { EMPTY_RUT_DIGITS, getRutDigits, getRutValidationState } from "../modules/shared/rut";
import { ExampleRutStrip } from "./ExampleRutStrip";

const toneClasses = {
  amber: {
    action:
      "self-end rounded-lg bg-amber-600 px-5 py-3 font-black text-white shadow-lg shadow-amber-600/20 transition hover:-translate-y-0.5 hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0",
    kicker: "text-amber-700",
  },
  teal: {
    action: "primary-action self-end px-5 py-3",
    kicker: "",
  },
};

function DefaultRutSummary({ rut, validation }) {
  const state = getRutValidationState(validation);
  const digits = getRutDigits(rut);
  const visibleDigits = digits.length ? digits : EMPTY_RUT_DIGITS;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Resultado</p>
          <p className={`mt-1 text-lg font-black ${state.className}`}>{state.label}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white ${
            validation?.valido ? "bg-emerald-600" : validation ? "bg-rose-600" : "bg-slate-500"
          }`}
        >
          {state.badge}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Dígitos extraídos</p>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4">
          {visibleDigits.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-lg font-black text-slate-800 shadow-sm"
            >
              {digit}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function RutFormPanel({
  actionLabel,
  aside,
  description,
  examples = [],
  fieldId = "rut",
  kicker = "Entrada",
  loading,
  loadingLabel = "Calculando...",
  rut,
  title = "Validación RUT",
  tone = "teal",
  validation,
  onRutChange,
  onSubmit,
}) {
  const classes = toneClasses[tone] || toneClasses.teal;

  return (
    <section className="panel overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="p-5 md:p-6">
          <p className={`section-kicker ${classes.kicker}`}>{kicker}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}

          <form className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor={fieldId} className="text-sm font-extrabold text-slate-700">
                RUT
              </label>
              <input
                id={fieldId}
                value={rut}
                onChange={(event) => onRutChange(event.target.value)}
                placeholder="12345678-5"
                className="field-control text-base font-semibold text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button type="submit" disabled={loading || !rut.trim()} className={classes.action}>
              {loading ? loadingLabel : actionLabel}
            </button>
          </form>

          {examples.length ? <ExampleRutStrip examples={examples} onSelect={onRutChange} tone={tone} /> : null}
        </div>

        <aside className="border-t border-slate-200 bg-slate-50/80 p-5 lg:border-l lg:border-t-0">
          {aside || <DefaultRutSummary rut={rut} validation={validation} />}
        </aside>
      </div>
    </section>
  );
}
