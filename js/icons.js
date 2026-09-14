export const TILE_ICONS = {
  shapes: `
    <svg viewBox="0 0 80 80" width="56" height="56">
      <polygon points="40,14 68,62 12,62" fill="#fdfaf4" stroke="#7f9878" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="32" cy="47" r="3.4" fill="#4a4238"/>
      <circle cx="48" cy="47" r="3.4" fill="#4a4238"/>
      <path d="M32 55 Q40 61 48 55" stroke="#4a4238" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
  counting: `
    <svg viewBox="0 0 80 80" width="56" height="56">
      <g transform="rotate(-10 27 27)">
        <rect x="10" y="10" width="34" height="34" rx="8" fill="#fdfaf4" stroke="#c17f65" stroke-width="3"/>
        <circle cx="20" cy="20" r="3.2" fill="#4a4238"/>
        <circle cx="34" cy="34" r="3.2" fill="#4a4238"/>
      </g>
      <g transform="rotate(9 54 54)">
        <rect x="37" y="37" width="34" height="34" rx="8" fill="#fdfaf4" stroke="#c17f65" stroke-width="3"/>
        <circle cx="46" cy="46" r="3.2" fill="#4a4238"/>
        <circle cx="54" cy="54" r="3.2" fill="#4a4238"/>
        <circle cx="62" cy="62" r="3.2" fill="#4a4238"/>
      </g>
    </svg>`,
  letters: `
    <svg viewBox="0 0 80 80" width="56" height="56">
      <rect x="8" y="10" width="34" height="34" rx="8" fill="#eaf1f2" stroke="#7ea3ab" stroke-width="3"/>
      <text x="25" y="35" font-family="-apple-system, sans-serif" font-weight="700" font-size="20" fill="#7ea3ab" text-anchor="middle">B</text>
      <rect x="30" y="32" width="42" height="42" rx="9" fill="#fdfaf4" stroke="#7ea3ab" stroke-width="3"/>
      <text x="51" y="62" font-family="-apple-system, sans-serif" font-weight="700" font-size="26" fill="#4a4238" text-anchor="middle">A</text>
    </svg>`,
  matching: `
    <svg viewBox="0 0 80 80" width="56" height="56">
      <defs>
        <g id="sparkle">
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#4a4238" stroke-width="3" stroke-linecap="round"/>
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#4a4238" stroke-width="3" stroke-linecap="round"/>
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#4a4238" stroke-width="3" stroke-linecap="round"/>
          <line x1="-5" y1="5" x2="5" y2="-5" stroke="#4a4238" stroke-width="3" stroke-linecap="round"/>
        </g>
      </defs>
      <rect x="8" y="22" width="28" height="36" rx="7" fill="#fdfaf4" stroke="#cba554" stroke-width="3"/>
      <rect x="44" y="22" width="28" height="36" rx="7" fill="#fdfaf4" stroke="#cba554" stroke-width="3"/>
      <use href="#sparkle" x="22" y="40"/>
      <use href="#sparkle" x="58" y="40"/>
    </svg>`,
};
