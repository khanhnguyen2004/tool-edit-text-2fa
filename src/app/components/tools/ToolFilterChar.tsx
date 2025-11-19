'use client';
import { useState, useCallback, useMemo } from 'react';

type FilterMode = 'remove' | 'keep';

export default function ToolFilterChar() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [content, setContent] = useState('sb=Bdi-ue_fQZ; datr=BgVm_eecFso; c_user=100003266100440; xs=32%3AiwE4eOw%3A2%3A183%3A8676%3A81; pl=n; m_pixel_ratio=1;');
    const [fromWord, setFromWord] = useState('c_user');
    const [toWord, setToWord] = useState(';');
    const [mode, setMode] = useState<FilterMode>('remove');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Memoize lines
    const lines = useMemo(() => {
        if (!content.trim()) return [];
        return content.split('\n').filter(line => line.trim());
    }, [content]);

    // Helper function để xử lý một dòng
    const processLine = useCallback((line: string): string => {
        const hasFrom = fromWord.trim().length > 0;
        const hasTo = toWord.trim().length > 0;

        if (!hasFrom && !hasTo) {
            return line;
        }

        if (mode === 'remove') {
            // Loại bỏ phần từ "Từ từ" đến "Đến từ"
            if (hasFrom && hasTo) {
                const fromIndex = line.indexOf(fromWord);
                if (fromIndex !== -1) {
                    const searchStart = fromIndex + fromWord.length;
                    const toIndex = line.indexOf(toWord, searchStart);
                    if (toIndex !== -1) {
                        return line.substring(0, fromIndex) + line.substring(toIndex + toWord.length);
                    }
                    return line.substring(0, fromIndex);
                }
            } else if (hasFrom) {
                const fromIndex = line.indexOf(fromWord);
                return fromIndex !== -1 ? line.substring(0, fromIndex) : line;
            } else if (hasTo) {
                const toIndex = line.indexOf(toWord);
                return toIndex !== -1 ? line.substring(toIndex + toWord.length) : line;
            }
        } else {
            // Chỉ giữ lại phần từ "Từ từ" đến "Đến từ"
            if (hasFrom && hasTo) {
                const fromIndex = line.indexOf(fromWord);
                if (fromIndex !== -1) {
                    const searchStart = fromIndex + fromWord.length;
                    const toIndex = line.indexOf(toWord, searchStart);
                    if (toIndex !== -1) {
                        return line.substring(fromIndex, toIndex + toWord.length);
                    }
                    return hasFrom ? line.substring(fromIndex) : '';
                }
                return '';
            } else if (hasFrom) {
                const fromIndex = line.indexOf(fromWord);
                return fromIndex !== -1 ? line.substring(fromIndex) : '';
            } else if (hasTo) {
                const toIndex = line.indexOf(toWord);
                return toIndex !== -1 ? line.substring(0, toIndex + toWord.length) : '';
            }
        }

        return line;
    }, [fromWord, toWord, mode]);

    // Xử lý trigger - tối ưu với useCallback
    const handleTrigger = useCallback(() => {
        if (lines.length === 0) {
            setResult('');
            return;
        }

        const processedLines = lines.map(processLine);
        const finalLines = removeDuplicates ? [...new Set(processedLines)] : processedLines;
        setResult(finalLines.join('\n'));
    }, [lines, processLine, removeDuplicates]);

    // Copy kết quả vào clipboard - tối ưu với useCallback
    const handleCopy = useCallback(async () => {
        if (!result) return;
        
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [result]);

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

            {/* Từ từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Từ từ
                </label>
                <input
                    type="text"
                    value={fromWord}
                    onChange={(e) => setFromWord(e.target.value)}
                    placeholder="c_user"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Đến từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Đến từ
                </label>
                <input
                    type="text"
                    value={toWord}
                    onChange={(e) => setToWord(e.target.value)}
                    placeholder=";"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Đổi cookie từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Đổi cookie từ
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setMode('remove')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                            mode === 'remove'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        Loại bỏ
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('keep')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                            mode === 'keep'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        Giữ lại
                    </button>
                </div>
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

