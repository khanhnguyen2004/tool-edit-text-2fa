'use client';
import { useState } from 'react';
export default function ToolLinkHtml() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [inputText, setInputText] = useState('');
    const [link, SetLink] = useState('http://google.com/');
    const [links, setLinks] = useState<string[]>([]);
    const [result, setResult] = useState('');
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
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Loại bỏ trùng lặp?</label>
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={removeDuplicate} onChange={(e) => setRemoveDuplicate(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative">
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-transform ${removeDuplicate ? 'translate-x-5' : ''}`} ></span>
                    </div>
                </label>
            </div>
            <div className="flex flex-row items-center">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Link website lấy ảnh</label>
                <input type="text" className="border rounded p-2 flex-1" value={link} onChange={(e) => SetLink(e.target.value)} />
            </div>
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={inputText} onChange={(e) => setInputText(e.target.value)} />
            </div>
            <div>
                <button type="button" onClick={handleTrigger} className="bg-green-600 text-white px-5 py-2 ms-51 rounded-md hover:bg-green-700 transition" >
                    Trigger
                </button>
            </div>
            <div className="flex flex-row items-start">
                <textarea className="border ms-51 rounded p-2 min-h-[100px] flex-1" rows={5} readOnly value={result} />
            </div>
            <div className="mt-4">
                <div className="space-y-1">
                    {links.map((uid, index) => (
                        <div key={`${uid}-${index}`} className="bg-gray-100 p-2 rounded">
                            <a href={`${uid}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {uid}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}