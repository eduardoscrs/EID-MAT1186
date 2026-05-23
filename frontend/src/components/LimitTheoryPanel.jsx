import { MathText } from "./MathText";

function badgeClass(kind) {
	if (kind === "removible") return "bg-emerald-600";
	if (kind === "salto") return "bg-amber-600";
	if (kind === "infinita") return "bg-rose-600";
	return "bg-slate-600";
}

export function LimitTheoryPanel({ result }) {
	const tramos = result?.tramos || [];

	return (
		<section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Regla</p>
					<h2 className="mt-1 text-xl font-black text-blue-950">Construcción de la función por tramos</h2>
				</div>
				<span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white ${badgeClass(result?.caso)}`}>
					{result?.caso || "Sin resultado"}
				</span>
			</div>

			{result ? (
				<div className="mt-5 space-y-4">
					<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
						<p className="text-sm font-bold text-slate-600">Regla de selección</p>
						<p className="mt-2 text-sm text-slate-700">
							<MathText value={result.regla_seleccion} />
						</p>
						<p className="mt-2 text-sm text-slate-600">
							Punto de análisis: <span className="font-bold text-blue-950">a = {result.a}</span>
						</p>
					</div>

					<div className="rounded-2xl bg-blue-950 p-4 text-white">
						<p className="text-sm font-bold uppercase tracking-wide text-blue-200">Función generada</p>
						<pre className="mt-3 overflow-x-auto text-sm leading-6 text-blue-50">{result.funcion_por_tramos}</pre>
						{result.extension_sugerida ? (
							<p className="mt-3 text-sm text-blue-100">
								Extensión sugerida: <span className="font-bold text-white">{result.extension_sugerida}</span>
							</p>
						) : null}
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
							<p className="text-xs font-black uppercase tracking-wide text-slate-500">Límite izquierdo</p>
							<p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.izquierdo || "--"}</p>
						</div>
						<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
							<p className="text-xs font-black uppercase tracking-wide text-slate-500">Límite derecho</p>
							<p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.derecho || "--"}</p>
						</div>
						<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
							<p className="text-xs font-black uppercase tracking-wide text-slate-500">¿Existe el límite?</p>
							<p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.existe ? "Sí" : "No"}</p>
						</div>
					</div>

					<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
						<p className="text-sm font-bold text-slate-600">Clasificación</p>
						<p className="mt-2 text-lg font-black text-blue-950">Discontinuidad {result.continuidad?.clasificacion}</p>
						<p className="mt-1 text-sm text-slate-600">
							Definida en a: <span className="font-bold text-slate-900">{result.continuidad?.definida_en_a ? "Sí" : "No"}</span>
						</p>
						<p className="mt-1 text-sm text-slate-600">
							¿Continua en a?: <span className="font-bold text-slate-900">{result.continuidad?.continua_en_a ? "Sí" : "No"}</span>
						</p>
					</div>

					<div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
						<p className="text-sm font-bold text-slate-600">Puntos críticos</p>
						{tramos.length ? (
							<div className="mt-3 space-y-3">
								{tramos.map((tramo, index) => (
									<div key={`${tramo.condicion}-${index}`} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
										<p className="text-xs font-black uppercase tracking-wide text-slate-500">{tramo.condicion}</p>
										<p className="mt-1 text-sm font-medium text-slate-700">
											<MathText value={tramo.expresion} />
										</p>
									</div>
								))}
							</div>
						) : null}
						{result.puntos_criticos?.length ? (
							<ul className="mt-3 space-y-2 text-sm text-slate-700">
								{result.puntos_criticos.map((punto, index) => (
									<li key={`${punto.x}-${index}`} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
										x = <span className="font-bold text-blue-950">{punto.x}</span> - {punto.motivo}
									</li>
								))}
							</ul>
						) : null}
					</div>

					<div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
						<p className="font-bold">Paso a paso</p>
						<ol className="mt-3 space-y-2">
							{result.pasos?.map((paso, index) => (
								<li key={`${index}-${paso}`} className="rounded-lg bg-white px-3 py-2 ring-1 ring-blue-100">
									<span className="mr-2 font-black text-blue-800">{index + 1}.</span>
									<MathText value={paso} />
								</li>
							))}
						</ol>
					</div>
				</div>
			) : (
				<p className="mt-4 text-sm text-slate-500">Ingresa un RUT para construir la función por tramos y analizar el límite.</p>
			)}
		</section>
	);
}
