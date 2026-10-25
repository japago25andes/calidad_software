import { useId } from 'react';
import { rich } from '../lib/utils.jsx';

// Bichi: un bug reformado que ahora trabaja en la Agencia de Calidad. Lleva lupa y un sello ✓ en el caparazón.
export function Mascot({ mood = 'normal', size = 110 }) {
  const uid = useId().replace(/:/g, '');
  const eyes = {
    normal: (
      <>
        <circle cx="49" cy="47" r="4.5" className="m-pupil" />
        <circle cx="71" cy="47" r="4.5" className="m-pupil" />
        <circle cx="50.5" cy="45.5" r="1.5" fill="#fff" />
        <circle cx="72.5" cy="45.5" r="1.5" fill="#fff" />
      </>
    ),
    happy: (
      <>
        <path d="M42 49 Q48 41 54 49" className="m-eye-line" />
        <path d="M66 49 Q72 41 78 49" className="m-eye-line" />
      </>
    ),
    sad: (
      <>
        <circle cx="48" cy="50" r="4" className="m-pupil" />
        <circle cx="72" cy="50" r="4" className="m-pupil" />
        <path d="M40 38 L54 41" className="m-eye-line thin" />
        <path d="M80 38 L66 41" className="m-eye-line thin" />
      </>
    ),
    wow: (
      <>
        <circle cx="48" cy="47" r="6" className="m-pupil" />
        <circle cx="72" cy="47" r="6" className="m-pupil" />
        <circle cx="50" cy="45" r="2" fill="#fff" />
        <circle cx="74" cy="45" r="2" fill="#fff" />
      </>
    ),
  };
  const mouth = {
    normal: <path d="M53 63 Q60 68 67 63" className="m-mouth" />,
    happy: <path d="M51 61 Q60 73 69 61 Z" className="m-mouth filled" />,
    sad: <path d="M53 67 Q60 61 67 67" className="m-mouth" />,
    wow: <ellipse cx="60" cy="65" rx="4" ry="5" className="m-mouth filled" />,
  };

  return (
    <svg className={`mascot mood-${mood}`} width={size} height={size * 1.08} viewBox="0 0 120 130" aria-hidden="true">
      <defs>
        <radialGradient id={`shell-${uid}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
      </defs>
      {/* antenas */}
      <path d="M48 26 Q40 10 30 8" className="m-antenna" />
      <path d="M72 26 Q80 10 90 8" className="m-antenna" />
      <circle cx="29" cy="8" r="4.5" fill="#38bdf8" className="m-tip" />
      <circle cx="91" cy="8" r="4.5" fill="#38bdf8" className="m-tip t2" />
      {/* patitas */}
      <path d="M26 92 L14 98 M27 106 L15 116 M94 92 L106 98" className="m-leg" />
      {/* caparazón */}
      <ellipse cx="60" cy="98" rx="38" ry="28" fill={`url(#shell-${uid})`} stroke="#881337" strokeWidth="2" />
      <path d="M60 72 V126" stroke="#881337" strokeWidth="2.5" />
      <circle cx="40" cy="92" r="6" fill="#1e293b" />
      <circle cx="80" cy="92" r="6" fill="#1e293b" />
      <circle cx="44" cy="112" r="5" fill="#1e293b" />
      <circle cx="76" cy="112" r="5" fill="#1e293b" />
      {/* sello de calidad */}
      <circle cx="60" cy="104" r="10" fill="#22c55e" stroke="#fff" strokeWidth="2" />
      <path d="M55 104 L59 108 L66 100" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* cabeza */}
      <circle cx="60" cy="50" r="30" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      <ellipse cx="48" cy="47" rx="10" ry="11" fill="#fff" />
      <ellipse cx="72" cy="47" rx="10" ry="11" fill="#fff" />
      {eyes[mood] || eyes.normal}
      {mouth[mood] || mouth.normal}
      <circle cx="38" cy="60" r="4" fill="#fb7185" opacity="0.6" />
      <circle cx="82" cy="60" r="4" fill="#fb7185" opacity="0.6" />
      {/* lupa */}
      <path d="M103 104 L113 118" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="97" cy="94" r="12" className="m-lens" />
      <path d="M92 89 Q95 86 99 87" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function Speech({ mood, children, size = 96, title }) {
  return (
    <div className="speech">
      <Mascot mood={mood} size={size} />
      <div className="bubble">
        {title && <div className="bubble-name">{title}</div>}
        {typeof children === 'string' ? rich(children) : children}
      </div>
    </div>
  );
}
