'use client';
import { useState } from 'react';

export default function ToolLinkHtml() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [inputText, setInputText] = useState(
`<a href='http://google.com/1.html'>1.html</a>
<a href='/2.html'>2.html</a>`);
    const [link, SetLink] = useState('http://google.com/');
    const [links, setLinks] = useState<string[]>([]);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const handleTrigger = () => {
        const regex = /<a .*?href=['"]([^'"]*?)['"][^>]*?>/g;
        let outputArr: string[] = [];
        let match;
        const input = inputText.trim();
        while ((match = regex.exec(input))) {
            outputArr.push(match[1]);
        }
        let url = link;
        if (url.endsWith("/")) url = url.slice(0, -1);
        outputArr = outputArr.map(r => {
            let link = r;
            if (!r.startsWith("http://") && !r.startsWith("https://")) {
                if (r.startsWith("//")) {
                    link = "http:" + r;
                } else {
                    link = url + (r.startsWith("/") ? r : "/" + r);
                }
            }
            return link;
        });
        if (removeDuplicate) {
            outputArr = Array.from(new Set(outputArr));
        }
        setResult(outputArr.join("\n"));
        setLinks(outputArr);
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
            {/* Toggle Loại bỏ trùng lặp */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Loại bỏ trùng lặp?
                </label>
                <button
                    type="button"
                    onClick={() => setRemoveDuplicate(!removeDuplicate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        removeDuplicate ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                    }`}
                    role="switch"
                    aria-checked={removeDuplicate}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            removeDuplicate ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Link website */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Link website
                </label>
                <input
                    type="text"
                    value={link}
                    onChange={(e) => SetLink(e.target.value)}
                    placeholder="http://google.com/"
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
            </div>

            {/* Ô nhập nội dung */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nhập HTML chứa thẻ <a> vào đây..."
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
                        value={result}
                        readOnly
                        placeholder="Danh sách URL sẽ hiển thị ở đây..."
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

            {/* Danh sách links */}
            {links.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Danh sách links
                    </label>
                    <div className="space-y-2 border border-[var(--border)] rounded-lg bg-white p-4">
                        {links.map((url, index) => (
                            <div key={`${url}-${index}`} className="border border-[var(--border)] rounded-lg p-3 hover:bg-[var(--muted)] transition-colors">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--primary)] hover:underline text-sm break-all"
                                >
                                    {url}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
