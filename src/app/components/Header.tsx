'use client';
import { ToolIcons } from './ToolIcons';

interface HeaderProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export default function Header({ collapsed, onToggleCollapse }: HeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
            <div className="h-12 flex items-center gap-3 px-3">
                <button
                    type="button"
                    aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                    onClick={onToggleCollapse}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:text-[var(--sidebar-accent-foreground)] hover:bg-[var(--sidebar-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                    style={{ transition: 'var(--transition-smooth)' }}
                    title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                >
                    <ToolIcons.LayoutToggle className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

