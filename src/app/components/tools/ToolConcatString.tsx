'use client';
import { useState } from 'react';

export default function ToolConcatString() {
    const [removeDuplicates, setRemoveDuplicates] = useState(false);
    const [content, setContent] = useState('user1|pass1\nuser2|pass2\nuser3|pass3');
    const [prependString, setPrependString] = useState('START|');
    const [appendString, setAppendString] = useState('|END');
    const [concatToColumn, setConcatToColumn] = useState(false);
    const [columnNumber, setColumnNumber] = useState(1);
    const [delimiter, setDelimiter] = useState('|');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        const lines = content.split('\n').filter(line => line.trim());
        
        let processedLines = lines;

        // Loại bỏ trùng lặp nếu cần
        if (removeDuplicates) {
            processedLines = [...new Set(processedLines)];
        }

        // Xử lý ghép chuỗi
        const resultLines = processedLines.map(line => {
            if (concatToColumn) {
                // Ghép vào cột: split theo delimiter, ghép vào cột được chỉ định
                const columns = line.split(delimiter);
                const colIndex = columnNumber - 1; // Chuyển từ 1-indexed sang 0-indexed
                
                if (colIndex >= 0 && colIndex < columns.length) {
                    // Ghép chuỗi vào cột được chỉ định
                    columns[colIndex] = `${prependString}${columns[colIndex]}${appendString}`;
                    return columns.join(delimiter);
                } else {
                    // Nếu cột không tồn tại, giữ nguyên dòng
                    return line;
                }
            } else {
                // Ghép vào đầu và cuối dòng
                return `${prependString}${line}${appendString}`;
            }
        });

        setResult(resultLines.join('\n'));
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

            {/* Chuỗi ghép vào đầu dòng */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Chuỗi ghép vào đầu dòng
                </label>
                <input
                    type="text"
                    value={prependString}
                    onChange={(e) => setPrependString(e.target.value)}
                    placeholder="START|"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Chuỗi ghép vào cuối dòng */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Chuỗi ghép vào cuối dòng
                </label>
                <input
                    type="text"
                    value={appendString}
                    onChange={(e) => setAppendString(e.target.value)}
                    placeholder="|END"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Delimiter */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Ký tự phân cách
                </label>
                <input
                    type="text"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder="|"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Toggle Ghép vào cột */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Ghép vào cột
                </label>
                <button
                    type="button"
                    onClick={() => setConcatToColumn(!concatToColumn)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        concatToColumn ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                    }`}
                    role="switch"
                    aria-checked={concatToColumn}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            concatToColumn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Cột số mấy - chỉ hiển thị khi bật "Ghép vào cột" */}
            {concatToColumn && (
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Cột số mấy
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setColumnNumber(Math.max(1, columnNumber - 1))}
                            className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={columnNumber}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 1) {
                                    setColumnNumber(val);
                                }
                            }}
                            className="w-20 p-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setColumnNumber(columnNumber + 1)}
                            className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

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

