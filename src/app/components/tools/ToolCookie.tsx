'use client';
import { useState, useEffect } from 'react';

type CookieLine = {
    uid: string;
    fullCookie: string;
    token?: string;
};

type SortOrder = 'asc' | 'desc' | 'none';

export default function ToolCookie() {
    const [removeDuplicates, setRemoveDuplicates] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState<string>('extract-uid');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [content, setContent] = useState('');
    const [result, setResult] = useState('');
    const [columnCutPairs, setColumnCutPairs] = useState<Array<{ column: string; cutChars: string }>>([{ column: '1', cutChars: '0' }]);
    const [outputFormat, setOutputFormat] = useState<'uid' | 'token' | 'uid|token'>('uid|token');
    const [copied, setCopied] = useState(false);

    // Parse cookie lines và extract UID
    // Hỗ trợ cả cookie format (c_user=123;...) và UID thuần (chỉ số)
    const parseCookies = (text: string): CookieLine[] => {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const trimmed = line.trim();
            
            // Tìm c_user trong cookie
            const uidMatch = trimmed.match(/c_user=(\d+)/);
            let uid = uidMatch ? uidMatch[1] : '';
            
            // Nếu không tìm thấy c_user, kiểm tra xem có phải là UID thuần không (chỉ số)
            if (!uid && /^\d+$/.test(trimmed)) {
                uid = trimmed;
            }
            
            // Tìm token (xs= hoặc datr=)
            const tokenMatch = trimmed.match(/(?:xs|datr)=([^;]+)/);
            const token = tokenMatch ? tokenMatch[1] : undefined;

            return {
                uid,
                fullCookie: trimmed,
                token
            };
        });
    };

    // Lấy UID từ cookie
    const extractUIDs = (cookies: CookieLine[], sort: SortOrder = 'none', removeDup: boolean = false): string => {
        let uids = cookies
            .map(c => c.uid)
            .filter(uid => uid !== '');
        // Loại bỏ trùng lặp UID nếu cần
        if (removeDup) {
            uids = [...new Set(uids)];
        }

        // Sắp xếp nếu có yêu cầu
        if (sort === 'asc') {
            uids = uids.sort((a, b) => {
                const numA = parseInt(a) || 0;
                const numB = parseInt(b) || 0;
                return numA - numB;
            });
        } else if (sort === 'desc') {
            uids = uids.sort((a, b) => {
                const numA = parseInt(a) || 0;
                const numB = parseInt(b) || 0;
                return numB - numA;
            });
        }
        // Nếu sort === 'none', giữ nguyên thứ tự

        return uids.join('\n');
    };

    // Sắp xếp cookie theo UID
    const sortCookiesByUID = (cookies: CookieLine[], order: SortOrder): CookieLine[] => {
        if (order === 'none') return cookies;
        
        const sorted = [...cookies].sort((a, b) => {
            // Xử lý cookie không có UID - đặt ở cuối (hoặc đầu nếu desc)
            if (!a.uid && !b.uid) return 0; // Cả hai đều không có UID, giữ nguyên thứ tự
            if (!a.uid) return 1; // a không có UID, đặt sau
            if (!b.uid) return -1; // b không có UID, đặt sau
            
            // Parse UID thành số để sắp xếp chính xác
            const uidA = parseInt(a.uid, 10);
            const uidB = parseInt(b.uid, 10);
            
            // Nếu parse thất bại, xử lý như không có UID
            if (isNaN(uidA) && isNaN(uidB)) return 0;
            if (isNaN(uidA)) return 1;
            if (isNaN(uidB)) return -1;
            
            // Sắp xếp theo số
            if (order === 'asc') {
                return uidA - uidB;
            } else {
                return uidB - uidA;
            }
        });
        
        return sorted;
    };

    // Sắp xếp chỉ UID - chỉ xuất danh sách UID đã sắp xếp
    const sortUIDs = (cookies: CookieLine[], order: SortOrder, removeDup: boolean = false): string => {
        // Lấy tất cả UID
        let uids = cookies
            .map(c => c.uid)
            .filter(uid => uid !== '');
        
        // Loại bỏ trùng lặp nếu cần
        if (removeDup) {
            uids = [...new Set(uids)];
        }
        
        // Parse thành số để sắp xếp chính xác
        const uidNumbers = uids
            .map(uid => parseInt(uid, 10))
            .filter(uid => !isNaN(uid));
        
        // Sắp xếp theo số
        if (order !== 'none') {
            uidNumbers.sort((a, b) => order === 'asc' ? a - b : b - a);
        }
        
        // Chuyển về string và xuất
        return uidNumbers.map(uid => uid.toString()).join('\n');
    };

    // Loại bỏ trùng lặp theo UID
    const removeDuplicateCookies = (cookies: CookieLine[]): CookieLine[] => {
        const seen = new Set<string>();
        return cookies.filter(cookie => {
            if (cookie.uid === '') return true; // Giữ lại cookie không có UID
            if (seen.has(cookie.uid)) return false;
            seen.add(cookie.uid);
            return true;
        });
    };

    // A-Z theo cột (sắp xếp theo cột được chọn, alphabetical)
    // Hỗ trợ nhiều cột với cắt ký tự riêng cho mỗi cột
    const sortByColumn = (cookies: CookieLine[], order: SortOrder, columnCutPairs: Array<{ column: number; cutChars: number }>): CookieLine[] => {
        if (order === 'none') return cookies;
        
        // Sắp xếp theo cột đầu tiên trong danh sách
        const firstPair = columnCutPairs[0];
        if (!firstPair) return cookies;
        
        const sorted = [...cookies].sort((a, b) => {
            // Lấy giá trị từ cột đầu tiên để sắp xếp
            const getColumnValue = (line: string, colIndex: number, cutChars: number): string => {
                let parts: string[] = [];
                
                if (line.includes('|')) {
                    parts = line.split('|').map(p => p.trim());
                } else {
                    parts = [line.trim()];
                }
                
                const colIdx = colIndex - 1;
                if (colIdx >= 0 && colIdx < parts.length) {
                    let value = parts[colIdx];
                    if (cutChars > 0 && value.length >= cutChars) {
                        value = value.substring(cutChars);
                    } else if (cutChars > 0 && value.length < cutChars) {
                        value = '';
                    }
                    return value.trim();
                }
                return '';
            };
            
            const valueA = getColumnValue(a.fullCookie, firstPair.column, firstPair.cutChars);
            const valueB = getColumnValue(b.fullCookie, firstPair.column, firstPair.cutChars);
            
            const trimmedA = valueA.trim();
            const trimmedB = valueB.trim();
            
            const numA = trimmedA !== '' ? parseFloat(trimmedA) : NaN;
            const numB = trimmedB !== '' ? parseFloat(trimmedB) : NaN;
            
            const isNumA = !isNaN(numA) && isFinite(numA) && trimmedA !== '';
            const isNumB = !isNaN(numB) && isFinite(numB) && trimmedB !== '';
            
            let comparison: number;
            
            if (isNumA && isNumB) {
                comparison = numA - numB;
            } else if (isNumA && !isNumB) {
                comparison = -1;
            } else if (!isNumA && isNumB) {
                comparison = 1;
            } else {
                comparison = trimmedA.localeCompare(trimmedB);
            }
            
            return order === 'asc' ? comparison : -comparison;
        });
        
        // Sau khi sắp xếp, cắt ký tự trong tất cả các cột được chọn của output
        const hasCutChars = columnCutPairs.some(pair => pair.cutChars > 0);
        if (hasCutChars) {
            return sorted.map(cookie => {
                const line = cookie.fullCookie;
                let parts: string[] = [];
                
                if (line.includes('|')) {
                    parts = line.split('|').map(p => p.trim());
                } else {
                    parts = [line.trim()];
                }
                
                // Áp dụng cắt ký tự cho tất cả các cột trong danh sách
                columnCutPairs.forEach(pair => {
                    const colIdx = pair.column - 1;
                    if (colIdx >= 0 && colIdx < parts.length && pair.cutChars > 0) {
                        const originalValue = parts[colIdx];
                        if (originalValue.length >= pair.cutChars) {
                            parts[colIdx] = originalValue.substring(pair.cutChars);
                        } else if (originalValue.length < pair.cutChars) {
                            parts[colIdx] = '';
                        }
                    }
                });
                
                const newLine = parts.join('|');
                return {
                    uid: cookie.uid,
                    fullCookie: newLine,
                    token: cookie.token
                };
            });
        }
        
        return sorted;
    };

    // Bỏ cookie trong acc - loại bỏ phần cookie khỏi mỗi dòng
    // Input: uid|pass|cookie|2fa
    // Output: uid|pass|2fa (bỏ cột cookie)
    const removeCookieFromAccount = (text: string): string => {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const trimmed = line.trim();
            
            // Kiểm tra xem có dấu | không (dữ liệu dạng cột)
            if (trimmed.includes('|')) {
                const parts = trimmed.split('|').map(p => p.trim());
                
                // Thường cookie là cột thứ 3 (index 2), nhưng có thể là cột khác
                // Logic: tìm cột chứa cookie (có chứa c_user= hoặc có nhiều ký tự đặc biệt)
                // Hoặc đơn giản: bỏ cột thứ 3 nếu có ít nhất 3 cột
                
                if (parts.length >= 3) {
                    // Tìm cột cookie - thường là cột có chứa "c_user=" hoặc cột dài nhất (trừ cột đầu)
                    let cookieIndex = -1;
                    
                    // Tìm cột có chứa "c_user="
                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].includes('c_user=') || parts[i].includes(';')) {
                            cookieIndex = i;
                            break;
                        }
                    }
                    
                    // Nếu không tìm thấy, mặc định bỏ cột thứ 3 (index 2)
                    if (cookieIndex === -1 && parts.length >= 3) {
                        cookieIndex = 2; // Cột thứ 3
                    }
                    
                    // Loại bỏ cột cookie
                    if (cookieIndex >= 0 && cookieIndex < parts.length) {
                        const newParts = [...parts];
                        newParts.splice(cookieIndex, 1);
                        return newParts.join('|');
                    }
                }
                
                // Nếu không thể xác định, trả về nguyên bản
                return trimmed;
            }
            
            // Nếu không có dấu |, có thể là cookie format đơn giản
            // Thử loại bỏ phần cookie nếu có
            if (trimmed.includes(';')) {
                // Cookie format: c_user=123;xs=xxx;sb=xxx;datr=xxx
                // Nếu có format uid|pass|cookie, sẽ được xử lý ở trên
                // Ở đây chỉ xử lý trường hợp đơn giản
                return trimmed;
            }
            
            return trimmed;
        }).join('\n');
    };

    // Tách Token từ cookie với nhiều format xuất
    const extractTokens = (cookies: CookieLine[], format: 'uid' | 'token' | 'uid|token'): string => {
        return cookies
            .map(c => {
                // Tìm UID
                let uid = c.uid;
                if (!uid) {
                    const uidMatch = c.fullCookie.match(/c_user=(\d+)/);
                    uid = uidMatch ? uidMatch[1] : '';
                }
                
                // Tìm token (ưu tiên xs, sau đó datr)
                let token = '';
                const xsMatch = c.fullCookie.match(/xs=([^;]+)/);
                if (xsMatch) {
                    token = xsMatch[1];
                } else {
                    const datrMatch = c.fullCookie.match(/datr=([^;]+)/);
                    if (datrMatch) {
                        token = datrMatch[1];
                    }
                }
                
                // Xuất theo format đã chọn
                if (format === 'uid') {
                    return uid || '';
                } else if (format === 'token') {
                    return token;
                } else {
                    // uid|token
                    if (uid && token) {
                        return `${uid}|${token}`;
                    } else if (uid) {
                        return uid;
                    } else if (token) {
                        return token;
                    }
                    return '';
                }
            })
            .filter(line => line !== '')
            .join('\n');
    };

    // Xử lý trigger
    const handleTrigger = () => {
        if (!content.trim()) {
            setResult('');
            return;
        }

        let cookies = parseCookies(content);

        // Áp dụng loại bỏ trùng lặp nếu bật
        if (removeDuplicates) {
            cookies = removeDuplicateCookies(cookies);
        }

        let output = '';

        switch (selectedFunction) {
            case 'extract-uid':
                // Khi lấy UID, áp dụng loại bỏ trùng lặp UID riêng (không dùng removeDuplicates của cookie)
                output = extractUIDs(cookies, sortOrder, removeDuplicates);
                break;

            case 'sort-by-uid':
                cookies = sortCookiesByUID(cookies, sortOrder);
                output = cookies.map(c => c.fullCookie).join('\n');
                break;

            case 'sort-uid':
                // Sắp xếp UID - áp dụng loại bỏ trùng lặp UID riêng
                output = sortUIDs(cookies, sortOrder, removeDuplicates);
                break;

            case 'sort-column':
                // Parse và validate giá trị cột và cắt ký tự từ array
                const parsedPairs = columnCutPairs.map(pair => {
                    let colNum = parseInt(pair.column, 10);
                    if (isNaN(colNum) || colNum < 1) colNum = 1;
                    
                    let cutNum = parseInt(pair.cutChars, 10);
                    if (isNaN(cutNum) || cutNum < 0) cutNum = 0;
                    
                    return { column: colNum, cutChars: cutNum };
                });
                
                cookies = sortByColumn(cookies, sortOrder, parsedPairs);
                output = cookies.map(c => c.fullCookie).join('\n');
                break;

            case 'remove-in-acc':
                // Loại bỏ phần cookie trong acc (thường là cột thứ 3 trong format uid|pass|cookie|2fa)
                output = removeCookieFromAccount(content);
                break;

            case 'extract-token':
                output = extractTokens(cookies, outputFormat);
                break;

            default:
                output = cookies.map(c => c.fullCookie).join('\n');
        }

        setResult(output);
    };

    // Copy kết quả vào clipboard
    const handleCopy = async () => {
        if (!result) return;
        
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset sau 2 giây
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const functionButtons = [
        { id: 'extract-uid', label: 'Lấy UID từ cookie' },
        { id: 'sort-by-uid', label: 'Sắp xếp Cookie theo UID' },
        { id: 'sort-uid', label: 'Sắp xếp UID trong Cookie ' },
        { id: 'sort-column', label: 'A-Z theo Cột' },
        { id: 'remove-in-acc', label: 'Bỏ Cookie trong Acc' },
        { id: 'extract-token', label: 'Tách Token từ Cookie' },
    ];

    // Dữ liệu mẫu cho từng chức năng (sẽ tự động điền vào textarea)
    const sampleData: Record<string, string> = {
        'extract-uid': `c_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=289;xs=yyy;sb=yyy;datr=yyy`,
        'sort-by-uid': `c_user=289;xs=yyy;sb=yyy;datr=yyy\nc_user=123;xs=xxx;sb=xxx;datr=xxx\nc_user=456;xs=zzz;sb=zzz;datr=zzz`,
        'sort-uid': `123\n789\n567`,
        'sort-column': `123|04/11/2020\n46|02/11/2022\n789|01/01/2021`,
        'remove-in-acc': `uid|pass|c_user=123;xs=xxx;sb=xxx|2fa\nuid|pass|c_user=456;xs=yyy;sb=yyy|2fa`,
        'extract-token': `c_user=123;xs=abc123;sb=xxx;datr=yyy\nc_user=456;xs=def456;sb=xxx;datr=zzz`,
    };

    // Placeholder cho từng chức năng
    const placeholders: Record<string, string> = {
        'extract-uid': `Dán cookie vào đây...`,
        'sort-by-uid': `Dán cookie vào đây...`,
        'sort-uid': `Dán UID hoặc cookie vào đây...`,
        'sort-column': `Dán dữ liệu vào đây (phân tách bằng |)...`,
        'remove-in-acc': `Dán dữ liệu vào đây...`,
        'extract-token': `Dán cookie vào đây...`,
    };

    // Tự động điền dữ liệu mẫu và reset sortOrder khi chọn chức năng
    useEffect(() => {
        if (sampleData[selectedFunction]) {
            setContent(sampleData[selectedFunction]);
            setResult(''); // Xóa kết quả cũ
        }
        
        // Reset sortOrder về mặc định khi chuyển chức năng
        // extract-uid có tùy chọn "Không sắp xếp" nên mặc định là 'none'
        // Các chức năng khác mặc định là 'asc' (A→Z)
        if (selectedFunction === 'extract-uid') {
            setSortOrder('none');
        } else if (selectedFunction === 'sort-by-uid' || 
                   selectedFunction === 'sort-uid' || 
                   selectedFunction === 'sort-column') {
            setSortOrder('asc');
        }
        
        // Reset columnCutPairs khi chuyển sang chức năng sort-column
        if (selectedFunction === 'sort-column') {
            setColumnCutPairs([{ column: '1', cutChars: '0' }]);
        }
    }, [selectedFunction]);

    return (
        <div className="space-y-6">
            {/* Toggle loại bỏ trùng lặp */}
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Loại bỏ trùng lặp?
                </label>
                <button
                    type="button"
                    onClick={() => setRemoveDuplicates(!removeDuplicates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        removeDuplicates ? 'bg-[var(--primary)]' : 'bg-[var(--muted-foreground)]'
                    }`}
                    role="switch"
                    aria-checked={removeDuplicates}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            removeDuplicates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Nhóm nút chức năng */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Đổi cookie từ:
                </label>
                <div className="flex flex-wrap gap-2">
                    {functionButtons.map((btn) => (
                        <button
                            key={btn.id}
                            type="button"
                            onClick={() => setSelectedFunction(btn.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedFunction === btn.id
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Nút A->Z / Z->A / Không sắp xếp */}
                {(selectedFunction === 'sort-by-uid' || 
                  selectedFunction === 'sort-uid' || 
                  selectedFunction === 'sort-column' ||
                  selectedFunction === 'extract-uid') && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            {selectedFunction === 'extract-uid' && (
                                <button
                                    type="button"
                                    onClick={() => setSortOrder('none')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        sortOrder === 'none'
                                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]'
                                    }`}
                                >
                                    Không sắp xếp
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setSortOrder('asc')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    sortOrder === 'asc'
                                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]'
                                }`}
                            >
                                A → Z
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortOrder('desc')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    sortOrder === 'desc'
                                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]'
                                }`}
                            >
                                Z → A
                            </button>
                            {selectedFunction === 'sort-column' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (columnCutPairs.length < 5) {
                                            setColumnCutPairs([...columnCutPairs, { column: '1', cutChars: '0' }]);
                                        }
                                    }}
                                    disabled={columnCutPairs.length >= 5}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-opacity flex items-center gap-1 ${
                                        columnCutPairs.length >= 5
                                            ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed opacity-50'
                                            : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90'
                                    }`}
                                >
                                    <span>+</span>
                                    <span>Thêm cột</span>
                                </button>
                            )}
                        </div>
                        
                        {/* Trường nhập liệu cho A-Z theo cột - hỗ trợ nhiều cột */}
                        {selectedFunction === 'sort-column' && (
                            <div className="space-y-2">
                                {columnCutPairs.map((pair, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-[var(--foreground)] whitespace-nowrap">
                                                Cột:
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={pair.column}
                                                onChange={(e) => {
                                                    const newPairs = [...columnCutPairs];
                                                    newPairs[index].column = e.target.value;
                                                    setColumnCutPairs(newPairs);
                                                }}
                                                className="w-20 px-2 py-1 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-[var(--foreground)] whitespace-nowrap">
                                                Cắt bao nhiêu ký tự:
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={pair.cutChars}
                                                onChange={(e) => {
                                                    const newPairs = [...columnCutPairs];
                                                    newPairs[index].cutChars = e.target.value;
                                                    setColumnCutPairs(newPairs);
                                                }}
                                                className="w-20 px-2 py-1 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                            />
                                        </div>
                                        {columnCutPairs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPairs = columnCutPairs.filter((_, i) => i !== index);
                                                    setColumnCutPairs(newPairs);
                                                }}
                                                className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Xóa"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Ô nhập nội dung */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nội dung
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholders[selectedFunction] || placeholders['extract-uid']}
                    className="w-full h-64 p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Phần Xuất format (chỉ hiện khi chọn Tách Token) */}
            {selectedFunction === 'extract-token' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Xuất
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setOutputFormat('uid')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                outputFormat === 'uid'
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                            }`}
                        >
                            UID
                        </button>
                        <button
                            type="button"
                            onClick={() => setOutputFormat('token')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                outputFormat === 'token'
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                            }`}
                        >
                            Token
                        </button>
                        <button
                            type="button"
                            onClick={() => setOutputFormat('uid|token')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                outputFormat === 'uid|token'
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                            }`}
                        >
                            UID|Token
                        </button>
                    </div>
                </div>
            )}

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
                        placeholder="Kết quả sẽ hiển thị ở đây..."
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
        </div>
    );
}

