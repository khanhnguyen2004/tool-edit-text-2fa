import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

const baseIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const createIcon = (paths: React.ReactNode) => {
  return function Icon({ width = 16, height = 16, ...props }: IconProps) {
    return (
      <svg {...baseIconProps} width={width} height={height} {...props}>
        {paths}
      </svg>
    );
  };
};

export const ToolIcons = {
  Cookie: createIcon(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  Timer: createIcon(
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M10 2h4" />
      <path d="M12 9v4l2 2" />
    </>
  ),
  Edit: createIcon(
    <>
      <path d="M4 17.5V20h2.5L18 8.5l-2.5-2.5L4 17.5z" />
      <path d="M14.5 5.5l2.5 2.5" />
    </>
  ),
  Calendar: createIcon(
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Scissors: createIcon(
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="7" cy="17" r="2.5" />
      <path d="M21 6L9.5 12" />
      <path d="M21 18L9.5 12" />
    </>
  ),
  List: createIcon(
    <>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <circle cx="5" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Link: createIcon(
    <>
      <path d="M10.5 13.5a3 3 0 0 1 0-4.2l2.7-2.8a3 3 0 0 1 4.2 4.2l-1.2 1.2" />
      <path d="M13.5 10.5a3 3 0 0 1 0 4.2l-2.7 2.8a3 3 0 0 1-4.2-4.2l1.2-1.2" />
    </>
  ),
  Duplicate: createIcon(
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M5 5h10a2 2 0 0 1 2 2v10" />
      <path d="M5 9v-2a2 2 0 0 1 2-2h2" />
    </>
  ),
  Shuffle: createIcon(
    <>
      <path d="M16 3h5l-3 3" />
      <path d="M21 21h-5l3-3" />
      <path d="M4 4l11 11" />
      <path d="M4 20l5-5" />
    </>
  ),
  FilePlus: createIcon(
    <>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M14 2v7h7" />
      <path d="M12 13v6" />
      <path d="M9 16h6" />
    </>
  ),
  Split: createIcon(
    <>
      <path d="M8 3v5a5 5 0 0 0 5 5h3" />
      <path d="M16 3h3v3" />
      <path d="M16 21h3v-3" />
      <path d="M8 21v-5a5 5 0 0 1 5-5h3" />
    </>
  ),
  Filter: createIcon(
    <>
      <path d="M4 4h16" />
      <path d="M6 10h12" />
      <path d="M9 16h6" />
      <path d="M10 20h4" />
    </>
  ),
  Type: createIcon(
    <>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </>
  ),
  ClipboardCopy: createIcon(
    <>
      <rect x="7" y="3" width="10" height="14" rx="2" />
      <path d="M9 3V2h6v1" />
      <path d="M9 9h6" />
      <path d="M9 13h4" />
      <path d="M5 7v11a2 2 0 0 0 2 2h10" />
    </>
  ),
  Image: createIcon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M4 18l4-4 4 4 5-6 3 4" />
    </>
  ),
  Globe: createIcon(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M2 12h20" />
      <path d="M12 4a15 15 0 0 1 4 8 15 15 0 0 1-4 8 15 15 0 0 1-4-8 15 15 0 0 1 4-8z" />
    </>
  ),
  Table: createIcon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 11h18" />
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </>
  ),
  Files: createIcon(
    <>
      <path d="M15 3H7a2 2 0 0 0-2 2v14" />
      <path d="M9 7h8a2 2 0 0 1 2 2v12" />
      <path d="M9 7V5a2 2 0 0 1 2-2h4" />
      <path d="M5 19h12" />
    </>
  ),
  Braces: createIcon(
    <>
      <path d="M7 4c-2 0-3 1-3 3v3c0 1.1-.9 2-2 2v0c1.1 0 2 .9 2 2v3c0 2 1 3 3 3" />
      <path d="M17 4c2 0 3 1 3 3v3c0 1.1.9 2 2 2v0c-1.1 0-2 .9-2 2v3c0 2-1 3-3 3" />
    </>
  ),
  Tags: createIcon(
    <>
      <path d="M6 3h6l7 7-6 6-7-7z" />
      <path d="M15 12l3 3-6 6-7-7V8l3 3" />
      <circle cx="9" cy="6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Calculator: createIcon(
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8" />
      <rect x="8" y="11" width="3" height="3" rx="0.5" />
      <rect x="13" y="11" width="3" height="3" rx="0.5" />
      <rect x="8" y="16" width="3" height="3" rx="0.5" />
      <rect x="13" y="16" width="3" height="3" rx="0.5" />
    </>
  ),
  Case: createIcon(
    <>
      <path d="M4 18l6-12 6 12" />
      <path d="M5.5 15h9" />
      <path d="M18 8v8" />
      <path d="M16 10h4" />
    </>
  ),
  User: createIcon(
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.8-2.4 4.5-3.5 7-3.5s5.2 1.1 7 3.5" />
    </>
  ),
  ListChecks: createIcon(
    <>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="m4 6 1.5 1.5L8 5" />
      <path d="m4 12 1.5 1.5L8 11" />
      <path d="m4 18 1.5 1.5L8 17" />
    </>
  ),
  Facebook: createIcon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M13 8h2V5h-2a3 3 0 0 0-3 3v3H8v3h2v5h3v-5h2.2l.3-3H13V8.5c0-.8.4-1.5 1-1.5z" />
    </>
  ),
  Paperclip: createIcon(
    <>
      <path d="M16.5 6.5 7 16a4 4 0 1 0 5.7 5.7L20 14.4a3 3 0 0 0-4.2-4.2l-7.1 7.2" />
    </>
  ),
  Hash: createIcon(
    <>
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3 8 21" />
      <path d="M16 3l-2 18" />
    </>
  ),
  Sparkles: createIcon(
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 4l.8 2.3L8 7l-2.2.7L5 10l-.8-2.3L2 7l2.2-.7L5 4z" />
      <path d="M19 15l.8 2.3L22 18l-2.2.7L19 21l-.8-2.3L16 18l2.2-.7L19 15z" />
    </>
  ),
  LayoutToggle: createIcon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M10 4v16" />
    </>
  ),
  Play: createIcon(
    <>
      <polygon points="6 3 20 12 6 21" fill="currentColor" stroke="none" />
    </>
  ),
  Pause: createIcon(
    <>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </>
  ),
  Skip: createIcon(
    <>
      <polygon points="6 3 12 12 6 21" fill="currentColor" stroke="none" />
      <path d="M14 3v18" strokeWidth="2.5" />
      <polygon points="18 3 22 12 18 21" fill="currentColor" stroke="none" />
    </>
  ),
  Reset: createIcon(
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  Settings: createIcon(
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Trash: createIcon(
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  Plus: createIcon(
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  X: createIcon(
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  Save: createIcon(
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </>
  ),
};

export type ToolIconKey = keyof typeof ToolIcons;

