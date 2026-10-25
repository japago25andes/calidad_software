/*
  Comprobaciones de los retos de Python. Cada comprobación es un objeto con una de estas claves:
    allPass: true        todas las pruebas pasan (y hay al menos una)
    minTests: n          hay al menos n pruebas
    kills: 'id'          las pruebas detectan el bug sembrado `id` (alguna falla con ese mutante)
    cov: n               la cobertura de líneas del módulo `target` es de al menos n %
    uses: 'regex'        el código editable contiene el patrón
    avoid: 'regex'       el código editable NO contiene el patrón
    fails: 'nombre'      la prueba indicada falla (útil en TDD: primero en rojo)
    test: 'cuerpo JS'    función propia: (r, m, src, h) => boolean
  r = resultado con el código correcto, m = resultados con cada bug sembrado, src = archivos.
*/

const killed = (m, id) => !!m[id] && !m[id].collectErrors.length && m[id].failed + m[id].errors > 0;
const allPass = (r) => r.total > 0 && r.passed === r.total && !r.collectErrors.length;

export function evaluateChecks(challenge, res, files) {
  const editable = challenge.editable || [Object.keys(challenge.files)[0]];
  const code = editable.map((f) => files[f]).join('\n');
  const r = res.main;
  const m = res.mut;
  const h = { allPass, killed: (id) => killed(m, id), test: (name) => r.tests.find((t) => t.name === name || t.name.startsWith(`${name}[`)) };
  return challenge.checks.map((c) => {
    try {
      let ok;
      if (c.allPass) ok = allPass(r);
      else if (c.minTests != null) ok = r.total >= c.minTests && !r.collectErrors.length;
      else if (c.kills) ok = allPass(r) && [].concat(c.kills).every((id) => killed(m, id));
      else if (c.cov != null) ok = allPass(r) && (r.coverage?.percent ?? 0) >= c.cov;
      else if (c.uses) ok = new RegExp(c.uses, 'm').test(code);
      else if (c.avoid) ok = !new RegExp(c.avoid, 'm').test(code);
      else if (c.fails) ok = h.test(c.fails)?.outcome === 'failed';
      else ok = !!new Function('r', 'm', 'src', 'h', c.test)(r, m, files, h);
      return { ok };
    } catch (e) {
      return { ok: false, err: e.message };
    }
  });
}
