'use client';
import { useState } from 'react';
export default function ToolGhepFile() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [inputText1, setInputText1] = useState(
`A
C`);
    const [inputText2, setInputText2] = useState(
`B
D`);
    const [result, setResult] = useState('');
    const [separator, setSeparator] = useState(' + ');
    const handleTrigger = () => {
        let input1 = inputText1.split('\n').map((l) => l.trim()).filter(Boolean);
        let input2 = inputText2.split('\n').map((l) => l.trim()).filter(Boolean);
        const resultArr: string[] = [];
        const maxLength=Math.max(input1.length, input2.length);
        for (let i=0; i<maxLength; i++) {
            const content1=input1[i] || '';
            const content2=input2[i] || '';
            resultArr.push(`${content1}${separator}${content2}`);
        }
        let items = resultArr;
        if (removeDuplicate) {
            items = Array.from(new Set(items));
        }
        setResult(items.join('\n'));
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
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung 1</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={inputText1} onChange={(e) => setInputText1(e.target.value)} />
            </div>
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung 2</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={inputText2} onChange={(e) => setInputText2(e.target.value)} />
            </div>
            <div className="flex flex-row items-center">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung ngăn cách 2 dòng</label>
                <input type="text" placeholder="Để trống nếu không muốn xoá" className="border rounded p-2 flex-1" value={separator} onChange={(e) => setSeparator(e.target.value)} />
            </div>
            <div>
                <button type="button" onClick={handleTrigger} className="bg-green-600 text-white px-5 py-2 ms-51 rounded-md hover:bg-green-700 transition" >
                    Trigger
                </button>
            </div>
            <div className="flex flex-row items-start">
                <textarea className="border ms-51 rounded p-2 min-h-[100px] flex-1" rows={5} readOnly value={result} />
            </div>
        </div>
    )
}