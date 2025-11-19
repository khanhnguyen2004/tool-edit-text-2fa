'use client';
import { useState, useCallback, useMemo } from 'react';

export default function ToolCopyFile() {
    const [content, setContent] = useState('Nội dung xyzt');
    const [startFrom, setStartFrom] = useState('1');
    const [endAt, setEndAt] = useState('100');
    const [fileExtension, setFileExtension] = useState('html');
    const [fileName, setFileName] = useState('google-');

    // Memoize parsed values
    const parsedStart = useMemo(() => {
        const val = parseInt(startFrom, 10);
        return isNaN(val) ? 0 : val;
    }, [startFrom]);

    const parsedEnd = useMemo(() => {
        const val = parseInt(endAt, 10);
        return isNaN(val) ? 0 : val;
    }, [endAt]);

    // Validate range
    const isValidRange = useMemo(() => {
        return parsedStart > 0 && parsedEnd > 0 && parsedStart <= parsedEnd;
    }, [parsedStart, parsedEnd]);

    // Xử lý trigger - tạo và tải file zip - tối ưu với useCallback
    const handleTrigger = useCallback(async () => {
        if (!content.trim()) {
            alert('Vui lòng nhập nội dung');
            return;
        }

        if (!isValidRange) {
            alert('Vui lòng nhập số hợp lệ (Bắt đầu từ <= Kết thúc)');
            return;
        }

        try {
            // Dynamic import JSZip
            // @ts-ignore - JSZip will be available after npm install
            const JSZipModule = await import('jszip');
            const JSZip = JSZipModule.default || JSZipModule;
            const zip = new JSZip();

            // Tạo các file trong zip
            for (let i = parsedStart; i <= parsedEnd; i++) {
                const fullFileName = `${fileName}${i}.${fileExtension}`;
                zip.file(fullFileName, content);
            }

            // Tạo file zip và tải xuống
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}${fileExtension}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to create zip:', err);
            alert('Có lỗi xảy ra khi tạo file zip. Vui lòng đảm bảo đã cài đặt jszip: npm install jszip');
        }
    }, [content, isValidRange, parsedStart, parsedEnd, fileName, fileExtension]);

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

            {/* Bắt đầu từ */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Bắt đầu từ
                </label>
                <input
                    type="number"
                    value={startFrom}
                    onChange={(e) => setStartFrom(e.target.value)}
                    placeholder="1"
                    min="1"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Kết thúc */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Kết thúc
                </label>
                <input
                    type="number"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    placeholder="100"
                    min="1"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Đuôi file */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Đuôi file
                </label>
                <input
                    type="text"
                    value={fileExtension}
                    onChange={(e) => setFileExtension(e.target.value)}
                    placeholder="html"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Tên file */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Tên file
                </label>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="google-"
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
        </div>
    );
}

