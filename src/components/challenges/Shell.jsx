import { rich } from '../../lib/utils.jsx';
import CodeBlock from '../code/CodeBlock.jsx';

const KINDS = {
  quiz: { label: 'Pregunta', icon: '❓' },
  predict: { label: 'Predice el resultado', icon: '🔮' },
  pick: { label: 'Selección múltiple', icon: '☑️' },
  classify: { label: 'Clasifica', icon: '🗂️' },
  order: { label: 'Ordena', icon: '🔢' },
  fill: { label: 'Completa el código', icon: '✏️' },
  py: { label: 'Escribe las pruebas', icon: '🐍' },
  tdd: { label: 'TDD: haz pasar las pruebas', icon: '🔴' },
  pw: { label: 'Automatiza con Playwright', icon: '🎭' },
  bughunt: { label: 'Encuentra el bug', icon: '🐞' },
  report: { label: 'Reporta el bug', icon: '📝' },
  boundary: { label: 'Valores límite', icon: '📏' },
  grid: { label: 'Completa la tabla', icon: '🧮' },
  coverage: { label: 'Cobertura', icon: '📊' },
  case: { label: 'Caso de prueba', icon: '🧪' },
};

export function kindOf(challenge) {
  return KINDS[challenge.kind || challenge.type] || KINDS.quiz;
}

export default function Shell({ challenge, children, canCheck, revealed, onCheck, actionHint, wide }) {
  const kind = kindOf(challenge);
  return (
    <div className={`challenge type-${challenge.type} ${wide ? 'wide' : ''}`}>
      <div className="ch-kind">
        <span>{kind.icon}</span> {kind.label}
      </div>
      <h2 className="ch-question">{rich(challenge.question)}</h2>
      {challenge.story && <div className="story">🛒 {rich(challenge.story)}</div>}
      {challenge.snippet && <CodeBlock code={challenge.snippet.code} lang={challenge.snippet.lang || 'py'} title={challenge.snippet.title} />}
      {challenge.hint && !['py', 'pw'].includes(challenge.type) && <p className="ch-hint">{rich(challenge.hint)}</p>}
      {children}
      {onCheck && !revealed && (
        <div className="ch-actions">
          {actionHint && !canCheck && <span className="ch-action-hint">{actionHint}</span>}
          <button className="btn btn-primary btn-lg" disabled={!canCheck} onClick={onCheck}>
            Comprobar
          </button>
        </div>
      )}
    </div>
  );
}
