'use client';
import { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import ToolCookie from './tools/ToolCookie';
import ToolPomodoro from './tools/ToolPomodoro';
import ToolEditText from './tools/ToolEditText';
import ToolUidToYear from './tools/ToolUidToYear';
import ToolCutString from './tools/ToolCutString';
import ToolCutLine from './tools/ToolCutLine';
import ToolJoinLines from './tools/ToolJoinLines';
import ToolDuplicate from './tools/ToolDuplicate';
import ToolReverseWords from './tools/ToolReverseWords';
import ToolConcatString from './tools/ToolConcatString';
import ToolSplitLines from './tools/ToolSplitLines';
import ToolFilterString from './tools/ToolFilterString';
import ToolFilterChar from './tools/ToolFilterChar';
import ToolCopyFile from './tools/ToolCopyFile';
import ToolFilterCsv from './tools/ToolFilterCsv';
import ToolFacebookLink from './tools/ToolFacebookLink';
import ToolAccount from './tools/ToolAccount';
import ToolAnhHtml from './tools/ToolAnhHtml';
import ToolGhepFile from './tools/ToolGhepFile';
import ToolJoinChu from './tools/ToolJoinChu';
import ToolJson from './tools/ToolJson';
import ToolLinkHtml from './tools/ToolLinkHtml';
import ToolLoaiText from './tools/ToolLoaiText';
import ToolLocTag from './tools/ToolLocTag';
import ToolTinhSub from './tools/ToolTinhSub';

export default function ToolContainer() {
    const [selectedTool, setSelectedTool] = useState('cookie');
    const [collapsed, setCollapsed] = useState(false);

    const renderTool = () => {
        switch (selectedTool) {
            case 'cookie':
                return <ToolCookie />;
            case 'pomodoro':
                return <ToolPomodoro />;
            case 'edit-text':
                return <ToolEditText />;
            case 'uid-to-year':
                return <ToolUidToYear />;
            case 'cat-chuoi':
                return <ToolCutString />;
            case 'cat-line':
                return <ToolCutLine />;
            case 'ghep-dong':
                return <ToolJoinLines />;
            case 'trung-lap':
                return <ToolDuplicate />;

            case 'dao-tu':
                return <ToolReverseWords />;

            case 'ghep-chuoi':
                return <ToolConcatString />;

            case 'chia-cat-dong':
                return <ToolSplitLines />;

            case 'loc-chuoi':
                return <ToolFilterString />;

            case 'loc-chu':
                return <ToolFilterChar />;

            case 'copy-file':
                return <ToolCopyFile />;

            case 'anh-html':
                return <ToolAnhHtml />;
            case 'link-html':
                return <ToolLinkHtml />;
            case 'loc-csv':
                return <ToolFilterCsv />;
            case 'ghep-file':
                return <ToolGhepFile />;
            case 'json':
                return <ToolJson />;
            case 'loc-tag':
                return <ToolLocTag />;
            case 'tinh-sub':
                return <ToolTinhSub />;
            case 'join-chu':
                return <ToolJoinChu />;
            case 'account':
                return <ToolAccount />;
            case 'loai-text':
                return <ToolLoaiText />;
            case 'facebook-link':
                return <ToolFacebookLink />;
            default:
                return <div className="p-6 text-gray-500 text-center">Tool không tồn tại</div>;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--muted)]">
            <Sidebar onSelect={setSelectedTool} collapsed={collapsed} />
            <main className={`flex-1 bg-[var(--background)] text-[var(--foreground)] overflow-y-auto hide-scrollbar ${collapsed ? 'ml-14' : 'ml-64'}`} style={{ transition: 'margin-left 0.2s ease-out' }}>
                <Header collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
                <div className="p-6">
                    {renderTool()}
                </div>
            </main>
        </div>
    );
}
