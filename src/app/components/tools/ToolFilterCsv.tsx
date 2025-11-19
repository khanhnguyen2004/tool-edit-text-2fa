'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

const CSV_DELIMITER = ';';
const QUOTE_REGEX = /^"|"$/g;

export default function ToolFilterCsv() {
    const [removeDuplicates, setRemoveDuplicates] = useState(true);
    const [hasHeader, setHasHeader] = useState(true);
    const [content, setContent] = useState('"id";"name"\n"1";"What The"\n"12";"It is"');
    const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['all', 'id', 'name']));
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Parse CSV và lấy danh sách cột - memoized và tối ưu
    const parseCSV = useCallback((csvText: string) => {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return { headers: [], rows: [] };

        // Parse header và rows
        const headers = lines[0].split(CSV_DELIMITER).map(h => h.trim().replace(QUOTE_REGEX, ''));
        const rows: string[][] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(CSV_DELIMITER).map(v => v.trim().replace(QUOTE_REGEX, ''));
            rows.push(values);
        }

        return { headers, rows };
    }, []);

    // Memoize parsed CSV data
    const csvData = useMemo(() => parseCSV(content), [content, parseCSV]);
    const { headers, rows } = csvData;

    // Memoize available columns
    const availableColumns = useMemo(() => headers, [headers]);

    // Xử lý trigger - tối ưu với useCallback
    const handleTrigger = useCallback(() => {
        if (headers.length === 0) {
            setResult('');
            return;
        }

        // Xác định các cột cần lấy
        const columnsToKeep: number[] = selectedColumns.has('all')
            ? headers.map((_, index) => index)
            : headers
                .map((header, index) => selectedColumns.has(header) ? index : -1)
                .filter(idx => idx !== -1);

        if (columnsToKeep.length === 0) {
            setResult('');
            return;
        }

        // Lọc và xử lý dữ liệu
        let processedRows = rows.map(row => 
            columnsToKeep.map(colIndex => row[colIndex] ?? '')
        );

        // Loại bỏ trùng lặp nếu cần
        if (removeDuplicates) {
            const seen = new Set<string>();
            processedRows = processedRows.filter(row => {
                const rowKey = row.join('|');
                if (seen.has(rowKey)) return false;
                seen.add(rowKey);
                return true;
            });
        }

        // Tạo kết quả
        const resultLines: string[] = [];

        // Thêm header nếu có
        if (hasHeader) {
            const headerRow = columnsToKeep.map(colIndex => `"${headers[colIndex]}"`).join(CSV_DELIMITER);
            resultLines.push(headerRow);
        }

        // Thêm các dòng dữ liệu
        processedRows.forEach(row => {
            const rowStr = row.map(val => `"${val}"`).join(CSV_DELIMITER);
            resultLines.push(rowStr);
        });

        setResult(resultLines.join('\n'));
    }, [headers, rows, selectedColumns, removeDuplicates, hasHeader]);

    // Toggle cột - tối ưu với useCallback
    const handleColumnToggle = useCallback((column: string) => {
        setSelectedColumns(prev => {
            const newSelected = new Set(prev);
            
            if (column === 'all') {
                if (newSelected.has('all')) {
                    // Bỏ chọn tất cả
                    newSelected.clear();
                } else {
                    // Chọn tất cả
                    newSelected.clear();
                    newSelected.add('all');
                    // Thêm tất cả các cột hiện có
                    headers.forEach(h => newSelected.add(h));
                }
            } else {
                if (newSelected.has(column)) {
                    newSelected.delete(column);
                    newSelected.delete('all'); // Bỏ chọn "Tất cả" nếu bỏ chọn một cột
                } else {
                    newSelected.add(column);
                    // Kiểm tra nếu tất cả các cột đều được chọn, thì tự động chọn "Tất cả"
                    const allColumnsSelected = headers.every(h => newSelected.has(h));
                    if (allColumnsSelected && headers.length > 0) {
                        newSelected.add('all');
                    }
                }
            }
            
            return newSelected;
        });
    }, [headers]);

    // Tự động chọn "Tất cả" nếu tất cả các cột đều được chọn
    useEffect(() => {
        if (headers.length > 0) {
            setSelectedColumns(prev => {
                const allColumnsSelected = headers.every(h => prev.has(h));
                const hasAll = prev.has('all');
                
                if (allColumnsSelected === hasAll) return prev; // Không thay đổi
                
                const newSet = new Set(prev);
                if (allColumnsSelected && !hasAll) {
                    newSet.add('all');
                } else if (!allColumnsSelected && hasAll) {
                    newSet.delete('all');
                }
                
                return newSet;
            });
        }
    }, [headers]);

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

            {/* Toggle Dòng đầu tiên là Tiêu đề file */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Dòng đầu tiên là Tiêu đề file
                </label>
                <button
                    type="button"
                    onClick={() => setHasHeader(!hasHeader)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        hasHeader ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                    }`}
                    role="switch"
                    aria-checked={hasHeader}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            hasHeader ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* CSV? */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    CSV:
                </label>
            </div>

            {/* Lấy cột dữ liệu nào? */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Lấy cột dữ liệu nào?
                </label>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedColumns.has('all')}
                            onChange={() => handleColumnToggle('all')}
                            className="checkbox-primary focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                        />
                        <span className={`text-sm ${selectedColumns.has('all') ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>Tất cả</span>
                    </label>
                    {availableColumns.map((column) => (
                        <label key={column} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedColumns.has(column)}
                                onChange={() => handleColumnToggle(column)}
                                className="checkbox-primary focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
                            />
                            <span className={`text-sm ${selectedColumns.has(column) ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{column}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Chỉ lấy các cột thỏa mã các điều kiện sau */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Chỉ lấy các cột thỏa mã các điều kiện sau
                </label>
            </div>

            {/* Ô nhập nội dung CSV */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung file CSV
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Nhập nội dung CSV vào đây, ví dụ: "id";"name"\n"1";"What The"'
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

