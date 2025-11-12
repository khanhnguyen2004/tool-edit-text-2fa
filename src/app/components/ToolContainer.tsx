'use client';
import { useState } from 'react';
import Sidebar from './SideBar';
import ToolFacebookLink from './tools/ToolFacebookLink';

export default function ToolContainer() {
    const [selectedTool, setSelectedTool] = useState('cookie');

    const renderTool = () => {
        switch (selectedTool) {
            case 'cookie':
            // return <CookieTool />;
            case 'pomodoro':
            // code xử lý cho Pomodoro
            case 'edit-text':
            // return <EditTextTool />;
            case 'uid-to-year':
            // return <UidToCreatedYearTool />;
            case 'cat-chuoi':

            case 'cat-line':

            case 'ghep-dong':

            case 'trung-lap':

            case 'dao-tu':

            case 'ghep-chuoi':

            case 'chia-cat-dong':

            case 'loc-chuoi':

            case 'loc-chu':

            case 'copy-file':

            case 'anh-html':

            case 'link-html':

            case 'loc-csv':

            case 'ghep-file':

            case 'json':

            case 'loc-tag':

            case 'tinh-sub':

            case 'join-chu':

            case 'account':

            case 'loai-text':

            case 'facebook-link':
                return <ToolFacebookLink />
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
