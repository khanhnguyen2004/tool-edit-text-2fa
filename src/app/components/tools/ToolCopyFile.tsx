'use client';
import { useState } from 'react';

export default function ToolCopyFile() {
    const [content, setContent] = useState('Nội dung xyzt');
    const [startFrom, setStartFrom] = useState('1');
    const [endAt, setEndAt] = useState('100');
    const [fileExtension, setFileExtension] = useState('html');
    const [fileName, setFileName] = useState('google-');

    // Xử lý trigger - tạo và tải file zip
    const handleTrigger = async () => {
        if (!content.trim()) {
            alert('Vui lòng nhập nội dung');
            return;
        }

        const start = parseInt(startFrom, 10);
        const end = parseInt(endAt, 10);

        if (isNaN(start) || isNaN(end) || start > end) {
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
            for (let i = start; i <= end; i++) {
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
                    className="px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                    Trigger
                </button>
            </div>
        </div>
    );
}

