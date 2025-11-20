'use client';
import { useState } from 'react';

export default function ToolJoinChu() {
    const [inputA, setInputA] = useState(
`ey1
ey2`);
    const [inputB, setInputB] = useState(
`id1|500
id2|10000`);
    const [subPerToken, setSubPerToken] = useState(500);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const handleTrigger = () => {
        const linesA = inputA.split('\n').map(l => l.trim()).filter(Boolean);
        const linesB = inputB.split('\n').map(l => l.trim()).filter(Boolean);
        let output = '';
        let indexA = 0;
        for (let b of linesB) {
            if (indexA >= linesA.length) break;
            const [id, totalSubStr] = b.split('|');
            const totalSub = parseInt(totalSubStr) || 0;
            const num = Math.floor(totalSub / (subPerToken || 1)); // tránh chia 0
            for (let i = 0; i < num; i++) {
                if (indexA >= linesA.length) break;
                output += `${linesA[indexA]}|${id}\n`;
                indexA++;
            }
        }
        // Nếu còn dòng A chưa dùng → in luôn
        for (; indexA < linesA.length; indexA++) {
            output += linesA[indexA] + '\n';
        }
        setResult(output.trim());
    };

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
            {/* Ô nhập Nội dung A */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung A
                </label>
                <textarea
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
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
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    placeholder="Nhập nội dung B vào đây (format: id|sub)..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Sub Per Token */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Sub Per Token
                </label>
                <input
                    type="number"
                    value={subPerToken}
                    onChange={(e) => setSubPerToken(parseInt(e.target.value) || 0)}
                    placeholder="500"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                    Kết quả
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
