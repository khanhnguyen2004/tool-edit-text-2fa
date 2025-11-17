'use client';
import { useState } from 'react';
export default function ToolFacebookLink() {
    const [removeDuplicate, setRemoveDuplicate] = useState(true);
    const [uidList, setUidList] = useState('');
    const [links, setLinks] = useState<string[]>([]);
    const handleCreateLinks = () => {
        let uids = uidList.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
        if (removeDuplicate) {
            uids = Array.from(new Set(uids));
        }
        setLinks(uids);
    }
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
                <label className="text-gray-700 font-medium w-48 me-3">Danh sách UID Facebook</label>
                <textarea className="border rounded p-2 min-h-[100px] flex-1" placeholder="Nhập danh sách UID, mỗi UID một dòng" value={uidList} onChange={(e) => setUidList(e.target.value)} />
            </div>
            <div className="flex justify-start">
                <button onClick={handleCreateLinks} className="bg-green-600 ms-51 text-white px-4 py-2 rounded hover:bg-green-700">
                    Tạo liên kết
                </button>
            </div>
            {links.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-medium mb-2">Kết quả:</h2>
                    <div className="space-y-1">
                        {links.map((uid, index) => (
                            <div key={`${uid}-${index}`} className="bg-gray-100 p-2 rounded">
                                <a href={`https://facebook.com/${uid}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {uid}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )   
}