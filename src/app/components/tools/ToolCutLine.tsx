'use client';
import { useState, useMemo } from 'react';

export default function ToolCutLine() {
    const [content, setContent] = useState('DAAAAE....|user1|pass1\nDAAAAAG....|user2|pass2\nDAAAAAH....|user3|pass3');
    const [cutQuantity, setCutQuantity] = useState('2');
    const [cutResult, setCutResult] = useState('');
    const [remainingResult, setRemainingResult] = useState('');
    const [copiedCut, setCopiedCut] = useState(false);
    const [copiedRemaining, setCopiedRemaining] = useState(false);

    // Tính số dòng
    const lineCount = useMemo(() => {
        if (!content.trim()) return 0;
        return content.split('\n').filter(line => line.trim()).length;
    }, [content]);

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setCutResult('');
            setRemainingResult('');
            return;
        }

        const lines = content.split('\n').filter(line => line.trim());
        const quantity = parseInt(cutQuantity, 10);

        if (isNaN(quantity) || quantity <= 0) {
            setCutResult('');
            setRemainingResult('');
            return;
        }

        // Cắt N dòng đầu
        const cutLines = lines.slice(0, quantity);
        // Các dòng còn lại
        const remainingLines = lines.slice(quantity);

        setCutResult(cutLines.join('\n'));
        setRemainingResult(remainingLines.join('\n'));
    };

    // Copy kết quả đã cắt
    const handleCopyCut = async () => {
        if (!cutResult) return;
        
        try {
            await navigator.clipboard.writeText(cutResult);
            setCopiedCut(true);
            setTimeout(() => setCopiedCut(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Copy kết quả còn lại
    const handleCopyRemaining = async () => {
        if (!remainingResult) return;
        
        try {
            await navigator.clipboard.writeText(remainingResult);
            setCopiedRemaining(true);
            setTimeout(() => setCopiedRemaining(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
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

            {/* Số dòng */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Số dòng
                </label>
                <span className="text-sm text-[var(--muted-foreground)] font-mono">
                    {lineCount}
                </span>
            </div>

            {/* Số lượng cut */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Số lượng cut
                </label>
                <input
                    type="text"
                    value={cutQuantity}
                    onChange={(e) => setCutQuantity(e.target.value)}
                    placeholder="2"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
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

            {/* Ô kết quả đã cắt */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Output
                </label>
                <div className="relative">
                    <textarea
                        value={cutResult}
                        readOnly
                        placeholder="Kết quả đã cắt sẽ hiển thị ở đây..."
                        className="w-full h-64 p-4 pr-12 border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        style={{ scrollbarWidth: 'thin' }}
                    />
                    {cutResult && (
                        <button
                            type="button"
                            onClick={handleCopyCut}
                            className="absolute top-3 right-3 p-2 rounded-md bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                            title={copiedCut ? 'Đã copy!' : 'Copy kết quả'}
                        >
                            {copiedCut ? (
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

            {/* Số dòng còn lại */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Số dòng còn lại
                </label>
                <div className="relative">
                    <textarea
                        value={remainingResult}
                        readOnly
                        placeholder="Các dòng còn lại sẽ hiển thị ở đây..."
                        className="w-full h-64 p-4 pr-12 border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        style={{ scrollbarWidth: 'thin' }}
                    />
                    {remainingResult && (
                        <button
                            type="button"
                            onClick={handleCopyRemaining}
                            className="absolute top-3 right-3 p-2 rounded-md bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                            title={copiedRemaining ? 'Đã copy!' : 'Copy kết quả'}
                        >
                            {copiedRemaining ? (
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

