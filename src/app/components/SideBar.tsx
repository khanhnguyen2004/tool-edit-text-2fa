'use client';
import { useState } from 'react';

const tools = [
    { id: 'cookie', label: 'Cookie' },
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'edit-text', label: 'Edit Text' },
    { id: 'uid-to-year', label: 'UID → Created Year' },
    { id: 'cat-chuoi', label: 'Cắt Chuỗi' },
    { id: 'cat-line', label: 'Cắt Line' },
    { id: 'ghep-dong', label: 'Ghép Dòng' },
    { id: 'trung-lap', label: 'Trùng Lặp' },
    { id: 'dao-tu', label: 'Đảo Từ' },
    { id: 'ghep-chuoi', label: 'Ghép Chuỗi' },
    { id: 'chia-cat-dong', label: 'Chia Cắt Dòng' },
    { id: 'loc-chuoi', label: 'Lọc Chuỗi' },
    { id: 'loc-chu', label: 'Lọc Chữ' },
    { id: 'copy-file', label: 'Copy File' },
    { id: 'anh-html', label: 'Ảnh HTML' },
    { id: 'link-html', label: 'Link HTML' },
    { id: 'loc-csv', label: 'Lọc CSV' },
    { id: 'ghep-file', label: 'Ghép File' },
    { id: 'json', label: 'JSON' },
    { id: 'loc-tag', label: 'Lọc Tag' },
    { id: 'tinh-sub', label: 'Tính Sub' },
    { id: 'join-chu', label: 'Join Chữ' },
    { id: 'account', label: 'Account' },
    { id: 'loai-text', label: 'Loại Text' },
    { id: 'facebook-link', label: 'Facebook Link' },
];

export default function Sidebar({ onSelect }: { onSelect: (id: string) => void }) {
    const [active, setActive] = useState('cookie');

    const handleClick = (id: string) => {
        setActive(id);
        onSelect(id);
    };

    return (
        <aside className="w-56 bg-gray-50 border-r border-gray-200 h-screen py-4 px-2 overflow-y-auto">
            <h1 className="text-lg font-semibold text-green-700 px-3 mb-4">2FA Authenticator</h1>
            <nav className="flex flex-col space-y-1">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => handleClick(tool.id)}
                        className={`text-left px-3 py-2 rounded-md transition-all ${active === tool.id
                            ? 'bg-green-600 text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tool.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}