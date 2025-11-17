'use client';
import { useState } from 'react';
import { ToolIcons, type ToolIconKey } from './ToolIcons';

type ToolItem = {
    id: string;
    label: string;
    icon: ToolIconKey;
};

const tools: ToolItem[] = [
    { id: 'cookie', label: 'Cookie', icon: 'Cookie' },
    { id: 'pomodoro', label: 'Pomodoro', icon: 'Timer' },
    { id: 'edit-text', label: 'Edit Text', icon: 'Edit' },
    { id: 'uid-to-year', label: 'UID → Created Year', icon: 'Calendar' },
    { id: 'cat-chuoi', label: 'Cắt Chuỗi', icon: 'Scissors' },
    { id: 'cat-line', label: 'Cắt Line', icon: 'List' },
    { id: 'ghep-dong', label: 'Ghép dòng', icon: 'Link' },
    { id: 'trung-lap', label: 'Trùng lặp', icon: 'Duplicate' },
    { id: 'dao-tu', label: 'Đảo từ', icon: 'Shuffle' },
    { id: 'ghep-chuoi', label: 'Ghép Chuỗi', icon: 'FilePlus' },
    { id: 'chia-cat-dong', label: 'Chia cắt dòng', icon: 'Split' },
    { id: 'loc-chuoi', label: 'Lọc Chuỗi', icon: 'Filter' },
    { id: 'loc-chu', label: 'Lọc Chữ', icon: 'Type' },
    { id: 'copy-file', label: 'Copy file', icon: 'ClipboardCopy' },
    { id: 'anh-html', label: 'Ảnh html', icon: 'Image' },
    { id: 'link-html', label: 'Link html', icon: 'Globe' },
    { id: 'loc-csv', label: 'Lọc CSV', icon: 'Table' },
    { id: 'ghep-file', label: 'Ghép file', icon: 'Paperclip' },
    { id: 'json', label: 'JSON', icon: 'Braces' },
    { id: 'loc-tag', label: 'Lọc tag', icon: 'Tags' },
    { id: 'tinh-sub', label: 'Tính Sub', icon: 'Calculator' },
    { id: 'join-chu', label: 'Join chữ', icon: 'Hash' },
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'loai-text', label: 'Loại text', icon: 'ListChecks' },
    { id: 'facebook-link', label: 'Fb link', icon: 'Facebook' },
];

export default function Sidebar({ onSelect, collapsed = false }: { onSelect: (id: string) => void, collapsed?: boolean }) {
    const [active, setActive] = useState('cookie');

    const handleClick = (id: string) => {
        setActive(id);
        onSelect(id);
    };

    return (
        <aside className={`${collapsed ? 'w-14' : 'w-64'} bg-[var(--sidebar-background)] border-r border-[var(--border)] h-screen flex flex-col fixed left-0 top-0`}>
            {!collapsed && (
                <div className="px-5 pt-6 pb-4 shadow-md">
                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold text-[var(--foreground)] leading-tight">Tool Online</h1>
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Công cụ edit text.
                    </p>
                </div>
            )}
            <nav className={`flex-1 overflow-y-auto hide-scrollbar ${collapsed ? 'px-1 pt-2' : 'px-2 pt-2'} pb-6 space-y-1 font-medium text-sm`}>
                {tools.map((tool) => {
                    const isActive = active === tool.id;
                    const Icon = ToolIcons[tool.icon];
                    return (
                        <button
                            key={tool.id}
                            onClick={() => handleClick(tool.id)}
                            title={tool.label}
                            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} h-10 w-full rounded-lg ${collapsed ? 'px-0' : 'px-3'} transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                                isActive
                                    ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] shadow-sm'
                                    : 'text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
                            }`}
                            style={{ transition: 'var(--transition-smooth)' }}
                            aria-pressed={isActive}
                        >
                            <Icon className="h-4 w-4" strokeWidth={2} />
                            {!collapsed && <span className="truncate">{tool.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}