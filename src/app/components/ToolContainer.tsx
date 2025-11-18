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

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--muted)]">
            <Sidebar onSelect={setSelectedTool} collapsed={collapsed} />
            <main className={`flex-1 bg-[var(--background)] text-[var(--foreground)] overflow-y-auto hide-scrollbar ${collapsed ? 'ml-14' : 'ml-64'}`} style={{ transition: 'margin-left 0.2s ease-out' }}>
                <Header collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
                <div className="p-6">
                    {/* Render tất cả các tool nhưng chỉ hiển thị tool được chọn */}
                    <div style={{ display: selectedTool === 'cookie' ? 'block' : 'none' }}>
                        <ToolCookie />
                    </div>
                    <div style={{ display: selectedTool === 'pomodoro' ? 'block' : 'none' }}>
                        <ToolPomodoro />
                    </div>
                    <div style={{ display: selectedTool === 'edit-text' ? 'block' : 'none' }}>
                        <ToolEditText />
                    </div>
                    <div style={{ display: selectedTool === 'uid-to-year' ? 'block' : 'none' }}>
                        <ToolUidToYear />
                    </div>
                    <div style={{ display: selectedTool === 'cat-chuoi' ? 'block' : 'none' }}>
                        <ToolCutString />
                    </div>
                    <div style={{ display: selectedTool === 'cat-line' ? 'block' : 'none' }}>
                        <ToolCutLine />
                    </div>
                    <div style={{ display: selectedTool === 'ghep-dong' ? 'block' : 'none' }}>
                        <ToolJoinLines />
                    </div>
                    <div style={{ display: selectedTool === 'trung-lap' ? 'block' : 'none' }}>
                        <ToolDuplicate />
                    </div>
                    <div style={{ display: selectedTool === 'dao-tu' ? 'block' : 'none' }}>
                        <ToolReverseWords />
                    </div>
                    <div style={{ display: selectedTool === 'ghep-chuoi' ? 'block' : 'none' }}>
                        <ToolConcatString />
                    </div>
                    <div style={{ display: selectedTool === 'chia-cat-dong' ? 'block' : 'none' }}>
                        <ToolSplitLines />
                    </div>
                    <div style={{ display: selectedTool === 'loc-chuoi' ? 'block' : 'none' }}>
                        <ToolFilterString />
                    </div>
                    <div style={{ display: selectedTool === 'loc-chu' ? 'block' : 'none' }}>
                        <ToolFilterChar />
                    </div>
                    <div style={{ display: selectedTool === 'copy-file' ? 'block' : 'none' }}>
                        <ToolCopyFile />
                    </div>
                    <div style={{ display: selectedTool === 'anh-html' ? 'block' : 'none' }}>
                        <ToolAnhHtml />
                    </div>
                    <div style={{ display: selectedTool === 'link-html' ? 'block' : 'none' }}>
                        <ToolLinkHtml />
                    </div>
                    <div style={{ display: selectedTool === 'loc-csv' ? 'block' : 'none' }}>
                        <ToolFilterCsv />
                    </div>
                    <div style={{ display: selectedTool === 'ghep-file' ? 'block' : 'none' }}>
                        <ToolGhepFile />
                    </div>
                    <div style={{ display: selectedTool === 'json' ? 'block' : 'none' }}>
                        <ToolJson />
                    </div>
                    <div style={{ display: selectedTool === 'loc-tag' ? 'block' : 'none' }}>
                        <ToolLocTag />
                    </div>
                    <div style={{ display: selectedTool === 'tinh-sub' ? 'block' : 'none' }}>
                        <ToolTinhSub />
                    </div>
                    <div style={{ display: selectedTool === 'join-chu' ? 'block' : 'none' }}>
                        <ToolJoinChu />
                    </div>
                    <div style={{ display: selectedTool === 'account' ? 'block' : 'none' }}>
                        <ToolAccount />
                    </div>
                    <div style={{ display: selectedTool === 'loai-text' ? 'block' : 'none' }}>
                        <ToolLoaiText />
                    </div>
                    <div style={{ display: selectedTool === 'facebook-link' ? 'block' : 'none' }}>
                        <ToolFacebookLink />
                    </div>
                </div>
            </main>
        </div>
    );
}
