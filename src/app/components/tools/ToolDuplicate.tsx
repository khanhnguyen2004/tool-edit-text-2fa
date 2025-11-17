'use client';
import { useState } from 'react';

type DuplicateMode = 'remove' | 'keep';

export default function ToolDuplicate() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [contentA, setContentA] = useState('one\ntwo\nthree');
    const [contentB, setContentB] = useState('one\ntwo');
    const [mode, setMode] = useState<DuplicateMode>('remove');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Xử lý trigger
    const handleTrigger = () => {
        // Parse nội dung A và B thành mảng các dòng
        const linesA = contentA.split('\n').filter(line => line.trim());
        const linesB = contentB.split('\n').filter(line => line.trim());

        // Loại bỏ trùng lặp trong từng nội dung nếu cần
        let processedA = linesA;
        let processedB = linesB;

        if (removeDuplicates) {
            processedA = [...new Set(processedA)];
            processedB = [...new Set(processedB)];
        }

        // Chuyển thành Set để dễ so sánh
        const setA = new Set(processedA);
        const setB = new Set(processedB);

        let output: string[] = [];

        if (mode === 'remove') {
            // Bỏ dòng trùng: chỉ giữ lại các dòng chỉ có trong A hoặc chỉ có trong B
            // (A - B) ∪ (B - A)
            const onlyInA = processedA.filter(line => !setB.has(line));
            const onlyInB = processedB.filter(line => !setA.has(line));
            output = [...onlyInA, ...onlyInB];
        } else if (mode === 'keep') {
            // Giữ dòng trùng: chỉ giữ lại các dòng xuất hiện trong cả A và B
            // A ∩ B
            output = processedA.filter(line => setB.has(line));
        }

        setResult(output.join('\n'));
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

            {/* Ô nhập Nội dung A */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung A
                </label>
                <textarea
                    value={contentA}
                    onChange={(e) => setContentA(e.target.value)}
                    placeholder="Nhập nội dung A vào đây..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Ô nhập Nội dung B */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung B
                </label>
                <textarea
                    value={contentB}
                    onChange={(e) => setContentB(e.target.value)}
                    placeholder="Nhập nội dung B vào đây..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Phần Thực thi */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Thực thi
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
                        Bỏ dòng trùng
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
                        Giữ dòng trùng
                    </button>
                </div>
            </div>

            {/* Nút Trigger */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleTrigger}
                    className="px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
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

