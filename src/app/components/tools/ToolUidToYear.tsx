'use client';
import { useState } from 'react';

type OutputStyle = 'short' | 'long';

export default function ToolUidToYear() {
    const [content, setContent] = useState('123123\nc_user=111;xs=xxx;sb=xxx;datr=xxx');
    const [result, setResult] = useState('');
    const [outputStyle, setOutputStyle] = useState<OutputStyle>('short');
    const [copied, setCopied] = useState(false);

    // Parse UID từ input (hỗ trợ cả UID thuần và cookie format)
    const parseUIDs = (text: string): string[] => {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const trimmed = line.trim();
            
            // Tìm c_user trong cookie
            const uidMatch = trimmed.match(/c_user=(\d+)/);
            if (uidMatch) {
                return uidMatch[1];
            }
            
            // Nếu không tìm thấy c_user, kiểm tra xem có phải là UID thuần không (chỉ số)
            if (/^\d+$/.test(trimmed)) {
                return trimmed;
            }
            
            // Nếu không phải format nào, trả về rỗng
            return '';
        }).filter(uid => uid !== '');
    };

    // Chuyển đổi UID thành năm tạo tài khoản
    // Facebook UID thường được tạo từ timestamp Unix
    // Công thức ước tính: UID có thể được tính từ timestamp
    const uidToYear = (uid: string): number | null => {
        const uidNum = parseInt(uid, 10);
        if (isNaN(uidNum) || uidNum <= 0) {
            return null;
        }

        // Facebook UID thường được tạo từ timestamp Unix (milliseconds)
        // Công thức: timestamp = UID / 4194304 (hoặc các hệ số khác tùy thuộc vào thời điểm)
        // Tuy nhiên, công thức chính xác có thể thay đổi
        // Sử dụng công thức ước tính phổ biến
        
        // Một số UID cũ có thể được tính trực tiếp từ timestamp
        // Thử nhiều công thức để tìm năm hợp lý (2004-2024)
        
        // Công thức 1: UID / 4194304 (cho UID cũ)
        let timestamp = uidNum / 4194304;
        let year = new Date(timestamp * 1000).getFullYear();
        
        // Nếu năm không hợp lý, thử công thức khác
        if (year < 2004 || year > new Date().getFullYear() + 1) {
            // Công thức 2: UID / 1000 (cho UID mới hơn)
            timestamp = uidNum / 1000;
            year = new Date(timestamp * 1000).getFullYear();
        }
        
        // Nếu vẫn không hợp lý, thử công thức 3: UID trực tiếp là timestamp (seconds)
        if (year < 2004 || year > new Date().getFullYear() + 1) {
            year = new Date(uidNum * 1000).getFullYear();
        }
        
        // Nếu vẫn không hợp lý, sử dụng công thức ước tính dựa trên phạm vi UID
        if (year < 2004 || year > new Date().getFullYear() + 1) {
            // Ước tính dựa trên phạm vi UID
            // UID nhỏ hơn thường là tài khoản cũ hơn
            if (uidNum < 1000000) {
                year = 2004 + Math.floor((uidNum / 1000000) * 10);
            } else if (uidNum < 10000000) {
                year = 2006 + Math.floor((uidNum / 10000000) * 8);
            } else if (uidNum < 100000000) {
                year = 2008 + Math.floor((uidNum / 100000000) * 6);
            } else {
                year = 2010 + Math.floor((uidNum / 1000000000) * 10);
            }
            
            // Giới hạn năm trong phạm vi hợp lý
            year = Math.max(2004, Math.min(year, new Date().getFullYear()));
        }
        
        return year;
    };

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        const uids = parseUIDs(content);
        const results = uids.map(uid => {
            const year = uidToYear(uid);
            if (year === null) {
                return '';
            }
            
            if (outputStyle === 'short') {
                return `${uid}|${year}`;
            } else {
                return `${uid}| YEAR: ${year}`;
            }
        }).filter(line => line !== '');

        setResult(results.join('\n'));
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
            {/* Ô nhập nội dung */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập UID hoặc cookie vào đây..."
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Output Style Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Output Style
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setOutputStyle('short')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            outputStyle === 'short'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        | 20xx
                    </button>
                    <button
                        type="button"
                        onClick={() => setOutputStyle('long')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            outputStyle === 'long'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                        }`}
                    >
                        | YEAR: 20xx
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

