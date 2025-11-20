'use client';
import { useState } from 'react';

export default function ToolFacebookLink() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [uidList, setUidList] = useState('');
    const [links, setLinks] = useState<string[]>([]);

    const handleCreateLinks = () => {
        let uids = uidList.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
        if (removeDuplicate) {
            uids = Array.from(new Set(uids));
        }
        setLinks(uids);
    };

    return (
        <div className="space-y-6">
            {/* Toggle Loại bỏ trùng lặp */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Loại bỏ trùng lặp?
                </label>
                <button
                    type="button"
                    onClick={() => setRemoveDuplicate(!removeDuplicate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        removeDuplicate ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                    }`}
                    role="switch"
                    aria-checked={removeDuplicate}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            removeDuplicate ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Ô nhập danh sách UID */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Danh sách UID Facebook
                </label>
                <textarea
                    value={uidList}
                    onChange={(e) => setUidList(e.target.value)}
                    placeholder="Nhập danh sách UID, mỗi UID một dòng..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Nút Tạo liên kết */}
            <div className="flex justify-center">
                <button
                    onClick={handleCreateLinks}
                    className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow focus:outline-none"
                >
                    Tạo liên kết
                </button>
            </div>

            {/* Danh sách links */}
            {links.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Kết quả ({links.length} links)
                    </label>
                    <div className="space-y-2 border border-[var(--border)] rounded-lg bg-white p-4 max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        {links.map((uid, index) => (
                            <div key={`${uid}-${index}`} className="border border-[var(--border)] rounded-lg p-3 hover:bg-[var(--muted)] transition-colors">
                                <a
                                    href={`https://facebook.com/${uid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--primary)] hover:underline text-sm break-all"
                                >
                                    https://facebook.com/{uid}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
