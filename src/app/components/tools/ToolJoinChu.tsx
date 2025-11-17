'use client';
import { useState } from 'react';
export default function ToolJoinChu() {
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');
    const [subPerToken, setSubPerToken] = useState(500); // mặc định 500
    const [result, setResult] = useState('');
    const handleTrigger = () => {
        const linesA = inputA.split('\n').map(l => l.trim()).filter(Boolean);
        const linesB = inputB.split('\n').map(l => l.trim()).filter(Boolean);
        let output = '';
        let indexA = 0;
        for (let b of linesB) {
            if (indexA >= linesA.length) break;
            const [id, totalSubStr] = b.split('|');
            const totalSub = parseInt(totalSubStr) || 0;
            const num = Math.floor(totalSub / (subPerToken || 1)); // tránh chia 0
            for (let i = 0; i < num; i++) {
                if (indexA >= linesA.length) break;
                output += `${linesA[indexA]}|${id}\n`;
                indexA++;
            }
        }
        // Nếu còn dòng A chưa dùng → in luôn
        for (; indexA < linesA.length; indexA++) {
            output += linesA[indexA] + '\n';
        }
        setResult(output.trim());
    };
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung A</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={inputA} onChange={(e) => setInputA(e.target.value)} />
            </div>
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung B</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={inputB} onChange={(e) => setInputB(e.target.value)} />
            </div>
            <div className="flex flex-row items-center">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Sub Per Token</label>
                <input type="text" className="border rounded p-2 flex-1" value={subPerToken} onChange={(e) => setSubPerToken(parseInt(e.target.value)||0)} />
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