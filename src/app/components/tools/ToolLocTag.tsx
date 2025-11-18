'use client';
import { useState } from 'react';
export default function ToolLocTag() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [inputText, setInputText] = useState('[IMG]http://www.use.com/images/s_1/ff4aa1e27bbfa78b04d1_2.jpg[/IMG]');
    const [startStr, setStartStr] = useState('[IMG]'); // ký tự bắt đầu
    const [endStr, setEndStr] = useState('[/IMG]'); // ký tự kết thúc
    const [result, setResult] = useState('');
    const handleTrigger = () => {
        let outputArr: string[] = [];
        let lines = inputText.split('\n').map(l => l.trim()).filter(Boolean);
        outputArr = lines.map(lines => {
            if (startStr && endStr) {
                const startIndex = lines.indexOf(startStr);
                const endIndex = lines.indexOf(endStr, startIndex + startStr.length);
                if (startIndex !== -1 && endIndex !== -1) {
                    // loại bỏ từ startIndex đến endIndex + endStr.length
                    return lines.slice(startIndex + startStr.length, endIndex);
                }
            }
            return lines;
        });
        if (removeDuplicate) {
            outputArr = Array.from(new Set(outputArr));
        }
        setResult(outputArr.join('\n'));
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
            <div className="flex flex-row items-center">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Từ ký tự</label>
                <input type="text" className="border rounded p-2 flex-1" value={startStr} onChange={(e) => setStartStr(e.target.value)} />
            </div>
            <div className="flex flex-row items-center">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Tới ký tự</label>
                <input type="text" className="border rounded p-2 flex-1" value={endStr} onChange={(e) => setEndStr(e.target.value)} />
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