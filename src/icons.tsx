import type { ReactNode } from 'react';

export function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16 L20.5 20.5" />
    </Icon>
  );
}

export function TopicIcon() {
  return (
    <Icon>
      <path d="M12 3 L20 7.5 L12 12 L4 7.5 Z" />
      <path d="M4 12 L12 16.5 L20 12" />
      <path d="M4 16.5 L12 21 L20 16.5" />
    </Icon>
  );
}

export function RatingIcon() {
  return (
    <Icon>
      <circle cx="7" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="17" cy="12" r="2" />
    </Icon>
  );
}

export function MethodIcon() {
  return (
    <Icon>
      <path d="M6 4.5 H16 A2 2 0 0 1 18 6.5 V19.5 H8 A2 2 0 0 1 6 17.5 Z" />
      <path d="M6 17.5 H18" />
      <path d="M9 8.5 H15" />
      <path d="M9 12 H13" />
    </Icon>
  );
}

export function CorrectionsIcon() {
  return (
    <Icon>
      <path d="M5 7 H19 V17 H5 Z" />
      <path d="M5 7 L12 13 L19 7" />
    </Icon>
  );
}

export function BackIcon() {
  return (
    <Icon>
      <path d="M14.5 6 L8.5 12 L14.5 18" />
    </Icon>
  );
}

export function ClearIcon() {
  return (
    <Icon>
      <path d="M8 8 L16 16" />
      <path d="M16 8 L8 16" />
    </Icon>
  );
}

export function TimelineIcon() {
  return (
    <Icon>
      <path d="M6 4 V20" />
      <path d="M6 7 H16" />
      <path d="M6 12 H13" />
      <path d="M6 17 H17" />
    </Icon>
  );
}

export function ReadingIcon() {
  return (
    <Icon>
      <path d="M5 5.5 H11 A2 2 0 0 1 13 7.5 V19 H7 A2 2 0 0 1 5 17 Z" />
      <path d="M19 5.5 H13 A2 2 0 0 0 11 7.5 V19 H17 A2 2 0 0 0 19 17 Z" />
    </Icon>
  );
}

export function TopicGlyph({ topic }: { topic: string }) {
  const glyph = TOPIC_GLYPHS[topic] ?? <circle cx="12" cy="12" r="4" />;
  return <Icon>{glyph}</Icon>;
}

const TOPIC_GLYPHS: Record<string, ReactNode> = {
  caffeine: (
    <>
      <path d="M6 9 H14 V13 A4 4 0 0 1 6 13 Z" />
      <path d="M14 10.5 H16.5 A2 2 0 0 1 16.5 14.5 H14" />
      <path d="M8 6 V7.5" />
      <path d="M11.5 6 V7.5" />
    </>
  ),
  'cold exposure': (
    <>
      <path d="M12 3 V21" />
      <path d="M4 12 H20" />
      <path d="M6 6 L18 18" />
      <path d="M18 6 L6 18" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5 V6" />
      <path d="M12 18 V20.5" />
      <path d="M3.5 12 H6" />
      <path d="M18 12 H20.5" />
      <path d="M6 6 L7.7 7.7" />
      <path d="M16.3 16.3 L18 18" />
      <path d="M18 6 L16.3 7.7" />
      <path d="M7.7 16.3 L6 18" />
    </>
  ),
  alcohol: (
    <>
      <path d="M8 4 H16 L14 11 A3 3 0 0 1 8 11 Z" />
      <path d="M12 14 V19" />
      <path d="M9 20 H15" />
    </>
  ),
  supplements: (
    <>
      <rect x="4" y="9" width="16" height="6" rx="3" />
      <path d="M12 9 V15" />
    </>
  ),
  NSDR: (
    <>
      <path d="M16 5.5 A6.5 6.5 0 1 0 16 18.5 A5 5 0 1 1 16 5.5 Z" />
    </>
  ),
  ashwagandha: (
    <>
      <path d="M12 20 V10" />
      <path d="M12 14 C8 14 6 10 6 7 C10 7 12 10 12 14 Z" />
      <path d="M12 12 C16 12 18 8 18 5 C14 5 12 8 12 12 Z" />
    </>
  ),
  magnesium: (
    <>
      <path d="M12 3 L20 12 L12 21 L4 12 Z" />
    </>
  ),
  sauna: (
    <>
      <path d="M6 16 C8 13 8 11 6 8" />
      <path d="M12 16 C14 13 14 11 12 8" />
      <path d="M18 16 C20 13 20 11 18 8" />
    </>
  ),
  'omega-3': (
    <>
      <path d="M12 4 C12 4 7 10 7 14 A5 5 0 0 0 17 14 C17 10 12 4 12 4 Z" />
    </>
  ),
  'vitamin D': (
    <>
      <circle cx="12" cy="13" r="3" />
      <path d="M12 5 V7" />
      <path d="M12 19 V21" />
      <path d="M5 13 H7" />
      <path d="M17 13 H19" />
      <path d="M7 8 L8.4 9.4" />
      <path d="M15.6 16.6 L17 18" />
    </>
  ),
  sulforaphane: (
    <>
      <path d="M12 20 V12" />
      <path d="M12 14 C9 12 8 8 12 5 C16 8 15 12 12 14 Z" />
      <path d="M12 16 H16" />
    </>
  ),
  fitness: (
    <>
      <path d="M12 19 C7 15 5 12 5 9.5 A3 3 0 0 1 10.2 8.2 L12 10 L13.8 8.2 A3 3 0 0 1 19 9.5 C19 12 17 15 12 19 Z" />
    </>
  ),
  exercise: (
    <>
      <circle cx="15" cy="5.5" r="1.6" />
      <path d="M8 20 L11 14 L14 16 L17 11" />
      <path d="M10 13 L7 11" />
      <path d="M14.5 12 L18 13" />
    </>
  ),
  lipids: (
    <>
      <circle cx="9" cy="10" r="3" />
      <circle cx="15" cy="14" r="3" />
    </>
  ),
  metformin: (
    <>
      <rect x="7" y="4" width="10" height="16" rx="5" />
      <path d="M10 12 H14" />
    </>
  ),
  rapamycin: (
    <>
      <rect x="4" y="9" width="16" height="6" rx="3" />
    </>
  ),
  'time-restricted eating': (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.5 V12 L15 14" />
    </>
  ),
  sleep: (
    <>
      <path d="M4 16 V12 H20 V16" />
      <path d="M7 12 V9 H14 V12" />
    </>
  ),
  creatine: (
    <>
      <path d="M4 9 H7 V15 H4 Z" />
      <path d="M17 9 H20 V15 H17 Z" />
      <path d="M7 12 H17" />
    </>
  ),
  protein: (
    <>
      <path d="M12 4 C15 4 17 7 17 10 C17 15 14 20 12 20 C10 20 7 15 7 10 C7 7 9 4 12 4 Z" />
    </>
  ),
  strength: (
    <>
      <path d="M3 9 H6 V15 H3 Z" />
      <path d="M18 9 H21 V15 H18 Z" />
      <path d="M6 10 H8 V14 H6 Z" />
      <path d="M16 10 H18 V14 H16 Z" />
      <path d="M8 12 H16" />
    </>
  ),
  steps: (
    <>
      <path d="M9 6 A1.4 1.4 0 1 0 9 8.8 A1.4 1.4 0 0 0 9 6" />
      <path d="M8 10 C10 10 11 12 10.5 15 C9.5 18 8 19 7 19 C6 17 6.5 14 7 12 C7.2 11 7.4 10 8 10 Z" />
      <path d="M15 8 A1.4 1.4 0 1 0 15 10.8 A1.4 1.4 0 0 0 15 8" />
      <path d="M14 12 C16 12 17 14 16.5 17 C15.5 20 14 21 13 21 C12 19 12.5 16 13 14 C13.2 13 13.4 12 14 12 Z" />
    </>
  ),
  'seed oils': (
    <>
      <path d="M10 4 H14 V7 H10 Z" />
      <path d="M9 7 H15 L16 20 H8 Z" />
    </>
  ),
  'ultra-processed food': (
    <>
      <path d="M5 8 H19 V19 H5 Z" />
      <path d="M8 8 V6 H16 V8" />
      <path d="M9 13 H15" />
    </>
  ),
  psilocybin: (
    <>
      <path d="M12 20 V12" />
      <path d="M6 12 C6 7 9 5 12 5 C15 5 18 7 18 12 Z" />
    </>
  ),
  'NMN/NAD': (
    <>
      <path d="M12 4 L18 8 V16 L12 20 L6 16 V8 Z" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  resveratrol: (
    <>
      <circle cx="8" cy="14" r="3" />
      <circle cx="15" cy="9" r="2.2" />
      <path d="M10.5 12.2 L13.2 10.4" />
    </>
  ),
  fasting: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8 V12" />
      <path d="M8 12 H12" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 20 C8 16 6 13 6 10 A6 6 0 0 1 18 10 C18 13 16 16 12 20 Z" />
      <path d="M12 10 V6" />
    </>
  ),
  sugar: (
    <>
      <path d="M8 8 H16 V16 H8 Z" />
      <path d="M8 12 H16" />
      <path d="M12 8 V16" />
    </>
  ),
  addiction: (
    <>
      <path d="M7 14 A5 5 0 1 1 12 17" />
      <path d="M12 14 V17 H15" />
    </>
  ),
  'addiction/depression': (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M9 14 C10 12.5 14 12.5 15 14" />
      <path d="M9 10 H9.1" />
      <path d="M15 10 H15.1" />
    </>
  ),
};
