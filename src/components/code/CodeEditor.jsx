import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, RangeSetBuilder } from '@codemirror/state';
import { Decoration, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const LANGS = {
  py: () => python(),
};

const theme = EditorView.theme({
  '&': { fontSize: '14.5px', height: '100%' },
  '.cm-scroller': { fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace", lineHeight: '1.6' },
  '.cm-content': { paddingBottom: '40px' },
  '.cm-line.cov-hit': { background: 'rgba(34, 197, 94, 0.16)' },
  '.cm-line.cov-miss': { background: 'rgba(248, 113, 113, 0.2)' },
});

/** Pinta las líneas cubiertas (verde) y sin cubrir (rojo) por las pruebas. */
function coverageMarks(doc, marks) {
  const b = new RangeSetBuilder();
  const hit = new Set(marks.executed);
  const miss = new Set(marks.missing);
  for (let n = 1; n <= doc.lines; n++) {
    const cls = hit.has(n) ? 'cov-hit' : miss.has(n) ? 'cov-miss' : null;
    if (cls) b.add(doc.line(n).from, doc.line(n).from, Decoration.line({ class: cls }));
  }
  return b.finish();
}

/** Editor de código (CodeMirror 6). Se recrea si cambia `docKey`. */
export default function CodeEditor({ value, lang = 'py', onChange, readOnly = false, docKey, marks }) {
  const host = useRef(null);
  const view = useRef(null);
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  const marksKey = marks ? JSON.stringify(marks) : '';

  useEffect(() => {
    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      (LANGS[lang] || LANGS.py)(),
      oneDark,
      theme,
      EditorState.tabSize.of(4),
      EditorView.lineWrapping,
      EditorState.readOnly.of(readOnly),
      EditorView.editable.of(!readOnly),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) changeRef.current?.(u.state.doc.toString());
      }),
    ];
    if (marks) extensions.push(EditorView.decorations.of((v) => coverageMarks(v.state.doc, marks)));
    const state = EditorState.create({ doc: value, extensions });
    view.current = new EditorView({ state, parent: host.current });
    return () => view.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, lang, readOnly, marksKey]);

  // Reemplazar el contenido cuando cambia desde fuera (por ejemplo, "Reiniciar código").
  useEffect(() => {
    const v = view.current;
    if (v && value !== v.state.doc.toString()) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div className={`code-editor ${readOnly ? 'readonly' : ''}`} ref={host} />;
}
