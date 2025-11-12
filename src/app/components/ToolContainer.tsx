'use client';
import { useState } from 'react';
import Sidebar from './SideBar';
import ToolFacebookLink from './tools/ToolFacebookLink';
import { ToolIcons } from './ToolIcons';

export default function ToolContainer() {
    const [selectedTool, setSelectedTool] = useState('cookie');
    const [collapsed, setCollapsed] = useState(false);

    const renderTool = () => {
        switch (selectedTool) {
            case 'cookie':
            // return <CookieTool />;
            case 'pomodoro':
            // code xử lý cho Pomodoro
            case 'edit-text':
            // return <EditTextTool />;
            case 'uid-to-year':
            // return <UidToCreatedYearTool />;
            case 'cat-chuoi':

            case 'cat-line':

            case 'ghep-dong':

            case 'trung-lap':

            case 'dao-tu':

            case 'ghep-chuoi':

            case 'chia-cat-dong':

            case 'loc-chuoi':

            case 'loc-chu':

            case 'copy-file':

            case 'anh-html':

            case 'link-html':

            case 'loc-csv':

            case 'ghep-file':

            case 'json':

            case 'loc-tag':

            case 'tinh-sub':

            case 'join-chu':

            case 'account':

            case 'loai-text':

            case 'facebook-link':
                return <ToolFacebookLink />
            default:
                return <div className="p-6 text-gray-500 text-center">Đang phát triển...</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--muted)]">
            <Sidebar onSelect={setSelectedTool} collapsed={collapsed} />
            <main className="flex-1 bg-[var(--background)] text-[var(--foreground)] overflow-y-auto hide-scrollbar">
                <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
                    <div className="h-12 flex items-center gap-3 px-3">
                        <button
                            type="button"
                            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                            onClick={() => setCollapsed((v) => !v)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:text-[var(--sidebar-accent-foreground)] hover:bg-[var(--sidebar-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                            style={{ transition: 'var(--transition-smooth)' }}
                            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                        >
                            <ToolIcons.LayoutToggle className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    {renderTool()}
                </div>
            </main>
        </div>
    );
}
