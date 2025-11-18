'use client';
import { useState } from 'react';

type CutType = 'range' | 'clusters';

export default function ToolCutString() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [content, setContent] = useState('DAAAAE....|user1|pass1\nDAAAAAG....|user2|pass2\nDAAAAAH....|user3|pass3');
    const [delimiter, setDelimiter] = useState('|');
    const [cutType, setCutType] = useState<CutType>('range');
    const [startCut, setStartCut] = useState('1');
    const [endCut, setEndCut] = useState('1');
    const [cutClusters, setCutClusters] = useState('1,2');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        const lines = content.split('\n').filter(line => line.trim());
        const results: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Split theo delimiter
            const parts = trimmed.split(delimiter).map(p => p.trim());

            if (cutType === 'range') {
                // Cắt từ x tới y
                const start = parseInt(startCut, 10) - 1; // Chuyển từ 1-indexed sang 0-indexed
                const end = parseInt(endCut, 10); // Giữ nguyên vì slice sẽ lấy đến end (không bao gồm)
                
                if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
                    continue;
                }

                const sliced = parts.slice(start, end);
                if (sliced.length > 0) {
                    results.push(sliced.join(delimiter));
                }
            } else {
                // Cắt cụm x,y,z
                const clusterIndices = cutClusters
                    .split(',')
                    .map(s => parseInt(s.trim(), 10) - 1) // Chuyển từ 1-indexed sang 0-indexed
                    .filter(idx => !isNaN(idx) && idx >= 0 && idx < parts.length);

                if (clusterIndices.length > 0) {
                    const selectedParts = clusterIndices.map(idx => parts[idx]);
                    results.push(selectedParts.join(delimiter));
                }
            }
        }

        // Loại bỏ trùng lặp nếu cần
        let finalResults = results;
        if (removeDuplicates) {
            finalResults = [...new Set(results)];
        }

        setResult(finalResults.join('\n'));
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

            {/* Ngăn cách bởi ký tự */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Ngăn cách bởi ký tự
                </label>
                <input
                    type="text"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder="|"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Loại cắt */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Loại cắt
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setCutType('range')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            cutType === 'range'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        Cắt từ x tới y
                    </button>
                    <button
                        type="button"
                        onClick={() => setCutType('clusters')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            cutType === 'clusters'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        Cắt cụm x,y,z
                    </button>
                </div>
            </div>

            {/* Input fields dựa trên loại cắt */}
            {cutType === 'range' ? (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--foreground)]">
                            Bắt đầu cắt
                        </label>
                        <input
                            type="text"
                            value={startCut}
                            onChange={(e) => setStartCut(e.target.value)}
                            placeholder="1"
                            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--foreground)]">
                            Đến cụm
                        </label>
                        <input
                            type="text"
                            value={endCut}
                            onChange={(e) => setEndCut(e.target.value)}
                            placeholder="1"
                            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Cắt những cụm
                    </label>
                    <input
                        type="text"
                        value={cutClusters}
                        onChange={(e) => setCutClusters(e.target.value)}
                        placeholder="1,2"
                        className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                </div>
            )}

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

