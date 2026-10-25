import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-gherkin';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';

const GRAMMAR = { py: 'python', gherkin: 'gherkin', yaml: 'yaml', bash: 'bash', js: 'javascript', html: 'markup', text: null };

/** Bloque de código de solo lectura con resaltado de sintaxis. */
export default function CodeBlock({ code, lang = 'py', title, className = '' }) {
  return (
    <div className={`code-block ${className}`}>
      {title && <div className="code-block-title">{title}</div>}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
      </pre>
    </div>
  );
}

export function highlight(code, lang = 'py') {
  const g = GRAMMAR[lang] === undefined ? 'python' : GRAMMAR[lang];
  return g && Prism.languages[g] ? Prism.highlight(code, Prism.languages[g], g) : escape(code);
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
