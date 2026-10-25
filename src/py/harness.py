# Ejecutor de pytest dentro del navegador (Pyodide).
# run_session() escribe los archivos del estudiante en una carpeta nueva, ejecuta pytest
# y devuelve un JSON con el resultado de cada prueba, la salida de la terminal y,
# opcionalmente, la cobertura de líneas del módulo bajo prueba.
import ast
import io
import json
import os
import sys
import time

import pytest

sys.dont_write_bytecode = True
_RUN = [0]
LINE_LIMIT = 300_000


class LoopGuard(Exception):
    """Se lanza cuando el código ejecuta demasiadas líneas (probable bucle infinito)."""


class _Collector:
    def __init__(self):
        self.tests = {}
        self.errors = []

    def pytest_runtest_logreport(self, report):
        name = report.nodeid.split("::", 1)[-1]
        t = self.tests.setdefault(name, {"name": name, "outcome": "passed", "message": ""})
        if report.failed:
            t["outcome"] = "failed" if report.when == "call" else "error"
            crash = getattr(report.longrepr, "reprcrash", None)
            t["message"] = crash.message if crash else str(report.longrepr).strip().splitlines()[-1]
        elif report.skipped and t["outcome"] == "passed":
            t["outcome"] = "skipped"

    def pytest_collectreport(self, report):
        if report.failed:
            self.errors.append(str(report.longrepr))


def _statements(path):
    """Líneas ejecutables de un módulo (como coverage.py: sin docstrings)."""
    try:
        tree = ast.parse(open(path, encoding="utf-8").read())
    except SyntaxError:
        return set()
    lines = set()
    for node in ast.walk(tree):
        body = getattr(node, "body", None)
        skip = None
        if isinstance(body, list) and body and isinstance(body[0], ast.Expr) and isinstance(getattr(body[0], "value", None), ast.Constant) and isinstance(body[0].value.value, str):
            skip = body[0]
        for child in ast.iter_child_nodes(node):
            if isinstance(child, ast.stmt) and child is not skip:
                lines.add(child.lineno)
    return lines


def _purge_previous_runs():
    for name, mod in list(sys.modules.items()):
        f = getattr(mod, "__file__", None) or ""
        if f.startswith("/tmp/run"):
            del sys.modules[name]
    sys.path[:] = [p for p in sys.path if not p.startswith("/tmp/run")]


def run_session(files_json, cov_name=None, app=False):
    files = json.loads(files_json)
    _purge_previous_runs()
    _RUN[0] += 1
    root = f"/tmp/run{_RUN[0]}"
    os.makedirs(root)
    for name, code in files.items():
        path = os.path.join(root, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(code)
        if "/" in name:
            # Paquetes (por ejemplo pages/): un __init__.py vacío en cada carpeta.
            pkg = os.path.dirname(path)
            while pkg != root:
                init = os.path.join(pkg, "__init__.py")
                if not os.path.exists(init):
                    open(init, "w").close()
                pkg = os.path.dirname(pkg)

    cov_file = os.path.join(root, cov_name) if cov_name else None
    executed = set()
    count = [0]

    def local(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > LINE_LIMIT:
                raise LoopGuard("Bucle infinito detectado: el código ejecutó demasiadas líneas y se detuvo")
            if frame.f_code.co_filename == cov_file:
                executed.add(frame.f_lineno)
        return local

    def tracer(frame, event, arg):
        if frame.f_code.co_filename.startswith(root):
            return local
        return None

    collector = _Collector()
    out = io.StringIO()
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    sys.path.insert(0, root)
    started = time.time()
    args = [
        root, "-q", "--tb=short", "--color=no", "--capture=sys", "--import-mode=importlib",
        "--rootdir", root, "-p", "no:cacheprovider", "-p", "no:faulthandler",
        "-o", "console_output_style=classic",
    ]
    if app:
        args += ["-p", "playwright._pytest_plugin"]
    sys.settrace(tracer)
    try:
        exit_code = int(pytest.main(args, plugins=[collector]))
    except BaseException as e:  # noqa: BLE001 - cualquier fallo se muestra al estudiante
        exit_code = 3
        out.write(f"\n{type(e).__name__}: {e}\n")
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr = old

    tests = list(collector.tests.values())
    result = {
        "tests": tests,
        "total": len(tests),
        "passed": sum(t["outcome"] == "passed" for t in tests),
        "failed": sum(t["outcome"] == "failed" for t in tests),
        "errors": sum(t["outcome"] == "error" for t in tests) + len(collector.errors),
        "collectErrors": collector.errors,
        "exitCode": exit_code,
        "output": out.getvalue().replace(root + "/", "").replace(root, "."),
        "ms": round((time.time() - started) * 1000),
    }
    if cov_file and os.path.exists(cov_file):
        stmts = _statements(cov_file)
        hit = executed & stmts
        result["coverage"] = {
            "statements": sorted(stmts),
            "executed": sorted(hit),
            "missing": sorted(stmts - hit),
            "percent": round(100 * len(hit) / len(stmts)) if stmts else 100,
        }
    return json.dumps(result)
