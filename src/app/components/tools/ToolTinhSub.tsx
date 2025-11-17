'use client';
import { useState } from 'react';
export default function ToolTinhSub() {
    const [subInput, setSubInput] = useState('');
    const [subRun, setSubRun] = useState('');
    const [subOutput, setSubOutput] = useState('');
    const handleTrigger = () => {
        // Map để lưu id -> sub value
        const mapSub = new Map();
        // Xử lý subInput (id|current|total)
        subInput.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
            const parts = line.split('|');
            if (parts.length === 3) {
                const id = parts[0];
                const current = parseInt(parts[1]) || 0;
                const total = parseInt(parts[2]) || 0;
                mapSub.set(id, -(current + total)); // giống logic tool gốc
            }
        });
        // Xử lý subRun (id|new_total)
        subRun.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
            const parts = line.split('|');
            if (parts.length === 2) {
                const id = parts[0];
                const newTotal = parseInt(parts[1]) || 0;
                if (mapSub.has(id)) {
                    mapSub.set(id, mapSub.get(id) + newTotal);
                } else {
                    mapSub.set(id, newTotal);
                }
            }
        });
        // Chuyển Map sang output
        let output = '';
        mapSub.forEach((value, key) => {
            output += `${key}|${value}\n`;
        });
        setSubOutput(output.trim());
    };
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung sub input</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={subInput} onChange={(e) => setSubInput(e.target.value)} />
            </div>
            <div className="flex flex-row items-start">
                <label className="text-gray-700 font-medium w-48 text-right me-3">Nội dung sub chạy</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" rows={5} value={subRun} onChange={(e) => setSubRun(e.target.value)} />
            </div>
            <div>
                <button type="button" onClick={handleTrigger} className="bg-green-600 text-white px-5 py-2 ms-51 rounded-md hover:bg-green-700 transition" >
                    Trigger
                </button>
            </div>
            <div className="flex flex-row items-start">
                <textarea className="border ms-51 rounded p-2 min-h-[100px] flex-1" rows={5} readOnly value={subOutput} />
            </div>
        </div>
    )
}