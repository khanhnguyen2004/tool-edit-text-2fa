'use client';
import { useState } from 'react';

type FilterMode = 'remove' | 'keep';

export default function ToolFilterChar() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [content, setContent] = useState('sb=Bdi-ue_fQZ; datr=BgVm_eecFso; c_user=100003266100440; xs=32%3AiwE4eOw%3A2%3A183%3A8676%3A81; pl=n; m_pixel_ratio=1;');
    const [fromWord, setFromWord] = useState('c_user');
    const [toWord, setToWord] = useState(';');
    const [mode, setMode] = useState<FilterMode>('remove');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        const lines = content.split('\n').filter(line => line.trim());
        
        const processedLines = lines.map(line => {
            if (!fromWord.trim() && !toWord.trim()) {
                return line;
            }

            let processedLine = line;

            if (mode === 'remove') {
                // Loại bỏ phần từ "Từ từ" đến "Đến từ"
                if (fromWord.trim() && toWord.trim()) {
                    const fromIndex = processedLine.indexOf(fromWord);
                    if (fromIndex !== -1) {
                        const searchStart = fromIndex + fromWord.length;
                        const toIndex = processedLine.indexOf(toWord, searchStart);
                        if (toIndex !== -1) {
                            // Loại bỏ từ vị trí fromIndex đến toIndex + length của toWord
                            processedLine = processedLine.substring(0, fromIndex) + processedLine.substring(toIndex + toWord.length);
                        } else if (fromWord.trim()) {
                            // Nếu không tìm thấy "Đến từ", loại bỏ từ "Từ từ" đến cuối
                            processedLine = processedLine.substring(0, fromIndex);
                        }
                    }
                } else if (fromWord.trim()) {
                    // Chỉ có "Từ từ", loại bỏ từ đó đến cuối
                    const fromIndex = processedLine.indexOf(fromWord);
                    if (fromIndex !== -1) {
                        processedLine = processedLine.substring(0, fromIndex);
                    }
                } else if (toWord.trim()) {
                    // Chỉ có "Đến từ", loại bỏ từ đầu đến "Đến từ"
                    const toIndex = processedLine.indexOf(toWord);
                    if (toIndex !== -1) {
                        processedLine = processedLine.substring(toIndex + toWord.length);
                    }
                }
            } else if (mode === 'keep') {
                // Chỉ giữ lại phần từ "Từ từ" đến "Đến từ"
                if (fromWord.trim() && toWord.trim()) {
                    const fromIndex = processedLine.indexOf(fromWord);
                    if (fromIndex !== -1) {
                        const searchStart = fromIndex + fromWord.length;
                        const toIndex = processedLine.indexOf(toWord, searchStart);
                        if (toIndex !== -1) {
                            // Giữ lại từ vị trí fromIndex đến toIndex + length của toWord
                            processedLine = processedLine.substring(fromIndex, toIndex + toWord.length);
                        } else if (fromWord.trim()) {
                            // Nếu không tìm thấy "Đến từ", giữ lại từ "Từ từ" đến cuối
                            processedLine = processedLine.substring(fromIndex);
                        } else {
                            processedLine = '';
                        }
                    } else {
                        processedLine = '';
                    }
                } else if (fromWord.trim()) {
                    // Chỉ có "Từ từ", giữ lại từ đó đến cuối
                    const fromIndex = processedLine.indexOf(fromWord);
                    if (fromIndex !== -1) {
                        processedLine = processedLine.substring(fromIndex);
                    } else {
                        processedLine = '';
                    }
                } else if (toWord.trim()) {
                    // Chỉ có "Đến từ", giữ lại từ đầu đến "Đến từ"
                    const toIndex = processedLine.indexOf(toWord);
                    if (toIndex !== -1) {
                        processedLine = processedLine.substring(0, toIndex + toWord.length);
                    } else {
                        processedLine = '';
                    }
                }
            }

            return processedLine;
        });

        let finalLines = processedLines;

        // Loại bỏ trùng lặp nếu cần
        if (removeDuplicates) {
            finalLines = [...new Set(finalLines)];
        }

        setResult(finalLines.join('\n'));
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
                    className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
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

