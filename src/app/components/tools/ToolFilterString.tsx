'use client';
import { useState } from 'react';

export default function ToolFilterString() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [content, setContent] = useState('good1 good1 good1 good1 good1\ngood2 good2 good2 good2 good2\ngood3 good3 good3 good3 good3\nbad bad bad bad bad bad');
    const [includeWords, setIncludeWords] = useState('good\ngood1');
    const [excludeWords, setExcludeWords] = useState('bad');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        const lines = content.split('\n').filter(line => line.trim());
        
        // Parse inclusion và exclusion words
        const includeList = includeWords.split('\n').map(w => w.trim()).filter(w => w);
        const excludeList = excludeWords.split('\n').map(w => w.trim()).filter(w => w);

        // Lọc các dòng
        let filteredLines = lines;

        // Lọc theo inclusion: lấy dòng chứa ít nhất một trong các từ
        if (includeList.length > 0) {
            filteredLines = filteredLines.filter(line => {
                return includeList.some(word => line.includes(word));
            });
        }

        // Lọc theo exclusion: loại bỏ dòng chứa tất cả các từ
        if (excludeList.length > 0) {
            filteredLines = filteredLines.filter(line => {
                // Loại bỏ dòng nếu nó chứa TẤT CẢ các từ trong exclusion list
                return !excludeList.every(word => line.includes(word));
            });
        }

        let processedLines = filteredLines;

        // Loại bỏ trùng lặp nếu cần
        if (removeDuplicates) {
            processedLines = [...new Set(processedLines)];
        }

        setResult(processedLines.join('\n'));
    };

    // Copy kết quả vào clipboard
    const handleCopy = async () => {
        if (!result) return;
        
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
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
                    onClick={() => setRemoveDuplicates(!removeDuplicates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        removeDuplicates ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                    }`}
                    role="switch"
                    aria-checked={removeDuplicates}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            removeDuplicates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Ô nhập nội dung */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung vào đây..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Lấy dòng chứa một trong các từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Lấy dòng chứa một trong các từ (Mỗi từ trên 1 dòng)
                </label>
                <textarea
                    value={includeWords}
                    onChange={(e) => setIncludeWords(e.target.value)}
                    placeholder="Nhập các từ để lọc, mỗi từ trên một dòng..."
                    className="w-full h-32 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Lấy dòng không chứa tất cả các từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Lấy dòng không chứa tất cả các từ (Mỗi từ trên một dòng)
                </label>
                <textarea
                    value={excludeWords}
                    onChange={(e) => setExcludeWords(e.target.value)}
                    placeholder="Nhập các từ để loại trừ, mỗi từ trên một dòng..."
                    className="w-full h-32 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Nút Trigger */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleTrigger}
                    className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow focus:outline-none"
                >
                    Trigger
                </button>
            </div>

            {/* Ô kết quả */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Output
                </label>
                <div className="relative">
                    <textarea
                        value={result}
                        readOnly
                        placeholder="Kết quả sẽ hiển thị ở đây..."
                        className="w-full h-64 p-4 pr-12 border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        style={{ scrollbarWidth: 'thin' }}
                    />
                    {result && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="absolute top-3 right-3 p-2 rounded-md bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                            title={copied ? 'Đã copy!' : 'Copy kết quả'}
                        >
                            {copied ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

