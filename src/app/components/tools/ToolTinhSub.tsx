'use client';
import { useState } from 'react';

export default function ToolTinhSub() {
    const [subInput, setSubInput] = useState('100021606163232|2078|11000');
    const [subRun, setSubRun] = useState('100021606163232|12000');
    const [subOutput, setSubOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleTrigger = () => {
        // Map để lưu id -> sub value
        const mapSub = new Map();
        // Xử lý subInput (id|current|total)
        subInput.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
            const parts = line.split('|');
            if (parts.length === 3) {
                const id = parts[0];
                const current = parseInt(parts[1]) || 0;
                const total = parseInt(parts[2]) || 0;
                mapSub.set(id, -(current + total)); // giống logic tool gốc
            }
        });
        // Xử lý subRun (id|new_total)
        subRun.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
            const parts = line.split('|');
            if (parts.length === 2) {
                const id = parts[0];
                const newTotal = parseInt(parts[1]) || 0;
                if (mapSub.has(id)) {
                    mapSub.set(id, mapSub.get(id) + newTotal);
                } else {
                    mapSub.set(id, newTotal);
                }
            }
        });
        // Chuyển Map sang output
        let output = '';
        mapSub.forEach((value, key) => {
            output += `${key}|${value}\n`;
        });
        setSubOutput(output.trim());
    };

    const handleCopy = async () => {
        if (!subOutput) return;
        try {
            await navigator.clipboard.writeText(subOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Ô nhập sub input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung sub input
                </label>
                <textarea
                    value={subInput}
                    onChange={(e) => setSubInput(e.target.value)}
                    placeholder="id|current|total"
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Ô nhập sub chạy */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung sub chạy
                </label>
                <textarea
                    value={subRun}
                    onChange={(e) => setSubRun(e.target.value)}
                    placeholder="id|new_total"
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                    Kết quả
                </label>
                <div className="relative">
                    <textarea
                        value={subOutput}
                        readOnly
                        placeholder="Kết quả sẽ hiển thị ở đây..."
                        className="w-full h-64 p-4 pr-12 border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        style={{ scrollbarWidth: 'thin' }}
                    />
                    {subOutput && (
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
