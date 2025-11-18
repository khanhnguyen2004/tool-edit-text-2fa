'use client';
import { useState } from 'react';
export default function ToolJson() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [inputText, setInputText] = useState(
`[
    {
        "domain": ".facebook.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "act",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": true,
        "storeId": "0",
        "value": "323235353533",
        "id": 1
    }
]`);
    const [result, setResult] = useState('');
    const handleTrigger = () => {
        const regex = /\[.*?\]/g;
        const matches = inputText.match(regex) || [];
        let arr: any[] = [];
        matches.forEach(m => {
            const parsed = JSON.parse(m);
            if (Array.isArray(parsed)) {
                arr.push(JSON.stringify(parsed));
            }
        });
        if (removeDuplicate) {
            const seen = new Set();
            arr = arr.filter(item => {
                const key = JSON.stringify(item);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }
        setResult(arr.join('\n'));
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
                <label className="text-gray-700 font-medium w-48 text-right me-3">Kết quả</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} readOnly value={result} />
            </div>
        </div>
    )
}