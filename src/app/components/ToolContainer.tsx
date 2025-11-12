'use client';
import { useState } from 'react';
import Sidebar from './SideBar';

export default function ToolContainer() {
    const [selectedTool, setSelectedTool] = useState('cookie');

    const renderTool = () => {
        switch (selectedTool) {
            case 'cookie':
            // return <CookieTool />;
            case 'edit-text':
            // return <EditTextTool />;
            case 'uid-to-year':
            // return <UidToCreatedYearTool />;
            default:
                return <div className="p-6 text-gray-500 text-center">Đang phát triển...</div>;
        }
    };

    return (
        <div className="flex">
            <Sidebar onSelect={setSelectedTool} />
            <main className="flex-1 p-6 bg-white h-screen overflow-y-auto">{renderTool()}</main>
        </div>
    );
}
