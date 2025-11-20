'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ToolIcons } from '../ToolIcons';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerPreset {
    label: string;
    minutes: number;
    mode: TimerMode;
    color: string;
}

interface PresetConfig {
    id: string;
    mode: TimerMode;
    minutes: number;
}

export default function ToolPomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [currentMode, setCurrentMode] = useState<TimerMode>('work');
    const [progress, setProgress] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [presetConfigs, setPresetConfigs] = useState<PresetConfig[]>([
        { id: '1', mode: 'work', minutes: 25 },
        { id: '2', mode: 'shortBreak', minutes: 5 },
        { id: '3', mode: 'work', minutes: 25 },
        { id: '4', mode: 'shortBreak', minutes: 5 },
    ]);

    const [tempPresetConfigs, setTempPresetConfigs] = useState<PresetConfig[]>(presetConfigs);

    // Memoize presets để tránh tính toán lại
    const presets = useMemo((): TimerPreset[] => {
        return presetConfigs.map((config) => ({
            label: config.mode === 'work' ? 'W' : config.mode === 'shortBreak' ? 'SB' : 'LB',
            minutes: config.minutes,
            mode: config.mode,
            color: config.mode === 'work' ? 'bg-yellow-400' : config.mode === 'shortBreak' ? 'bg-green-300' : 'bg-blue-300',
        }));
    }, [presetConfigs]);

    const totalTime = useRef(25 * 60);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Timer finished - could add notification here
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        const newProgress = ((totalTime.current - timeLeft) / totalTime.current) * 100;
        setProgress(Math.min(100, Math.max(0, newProgress)));
    }, [timeLeft]);

    // Memoize formatTime function
    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Memoize color functions
    const borderColor = useMemo(() => {
        if (currentMode === 'work') return 'border-orange-500';
        if (currentMode === 'shortBreak') return 'border-green-500';
        return 'border-blue-500';
    }, [currentMode]);

    const textColor = useMemo(() => {
        if (currentMode === 'work') return 'text-orange-500';
        if (currentMode === 'shortBreak') return 'text-green-500';
        return 'text-blue-500';
    }, [currentMode]);

    const handlePresetClick = useCallback((preset: TimerPreset) => {
        const newTime = preset.minutes * 60;
        setTimeLeft(newTime);
        totalTime.current = newTime;
        setCurrentMode(preset.mode);
        setIsRunning(false);
        setProgress(0);
    }, []);

    const handlePlayPause = useCallback(() => {
        setIsRunning(prev => !prev);
    }, []);

    const handleSkip = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(0);
        setProgress(100);
    }, []);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(totalTime.current);
        setProgress(0);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
            <div className="max-w-2xl w-full mx-auto">
                <div className="flex flex-col items-center gap-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                {/* Timer Display */}
                <div className={`w-full max-w-md border-4 ${borderColor} rounded-lg p-8 bg-white`}>
                    <div className={`text-6xl font-bold text-center ${textColor} mb-4`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${borderColor.replace('border-', 'bg-')}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-right text-sm text-gray-500">{Math.round(progress)}%</div>
                </div>

                {/* Preset Buttons */}
                <div className="flex gap-3">
                    {presets.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => handlePresetClick(preset)}
                            className={`${preset.color} px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:opacity-80 transition-opacity`}
                        >
                            {preset.label} {formatTime(preset.minutes * 60)}
                        </button>
                    ))}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePlayPause}
                        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                        aria-label={isRunning ? 'Pause' : 'Play'}
                    >
                        {isRunning ? (
                            <ToolIcons.Pause className="h-6 w-6" />
                        ) : (
                            <ToolIcons.Play className="h-6 w-6" />
                        )}
                    </button>
                    <button
                        onClick={handleSkip}
                        className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                        aria-label="Skip"
                    >
                        <ToolIcons.Skip className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
                        aria-label="Reset"
                    >
                        <ToolIcons.Reset className="h-6 w-6" />
                    </button>
                </div>

                {/* Settings */}
                <button 
                    onClick={() => {
                        setShowSettings(!showSettings);
                        setTempPresetConfigs([...presetConfigs]);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ToolIcons.Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                </button>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="w-full max-w-md border border-blue-300 rounded bg-white p-3">
                        <div className="flex items-center gap-1.5 mb-3">
                            <ToolIcons.Settings className="h-3.5 w-3.5 text-gray-700" />
                            <h2 className="text-sm font-bold text-gray-800">Settings</h2>
                        </div>

                        <div className="space-y-1.5 mb-3">
                            {tempPresetConfigs.map((config, index) => (
                                <div key={config.id} className="flex items-center gap-1.5">
                                    <select
                                        value={config.mode}
                                        onChange={(e) => {
                                            const updated = [...tempPresetConfigs];
                                            updated[index].mode = e.target.value as TimerMode;
                                            setTempPresetConfigs(updated);
                                        }}
                                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="work">Work</option>
                                        <option value="shortBreak">ShortBreak</option>
                                        <option value="longBreak">LongBreak</option>
                                    </select>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...tempPresetConfigs];
                                                if (updated[index].minutes > 1) {
                                                    updated[index].minutes -= 1;
                                                    setTempPresetConfigs(updated);
                                                }
                                            }}
                                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-xs leading-none">−</span>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={config.minutes}
                                            onChange={(e) => {
                                                const updated = [...tempPresetConfigs];
                                                updated[index].minutes = Math.max(1, parseInt(e.target.value) || 1);
                                                setTempPresetConfigs(updated);
                                            }}
                                            className="w-10 px-1 py-1 border-t border-b border-gray-300 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...tempPresetConfigs];
                                                updated[index].minutes += 1;
                                                setTempPresetConfigs(updated);
                                            }}
                                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-xs leading-none">+</span>
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-600 ml-0.5">mins</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (tempPresetConfigs.length > 1) {
                                                const updated = tempPresetConfigs.filter((_, i) => i !== index);
                                                setTempPresetConfigs(updated);
                                            }
                                        }}
                                        className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                                        disabled={tempPresetConfigs.length <= 1}
                                    >
                                        <ToolIcons.Trash className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-1.5 justify-end">
                            <button
                                onClick={() => {
                                    if (tempPresetConfigs.length < 8) {
                                        const newId = Date.now().toString();
                                        setTempPresetConfigs([...tempPresetConfigs, { id: newId, mode: 'work', minutes: 25 }]);
                                    }
                                }}
                                disabled={tempPresetConfigs.length >= 8}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ToolIcons.Plus className="h-3 w-3" />
                                <span>Add</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    setTempPresetConfigs([...presetConfigs]);
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                            >
                                <ToolIcons.X className="h-3 w-3" />
                                <span>Cancel</span>
                            </button>
                            <button
                                onClick={() => {
                                    setPresetConfigs([...tempPresetConfigs]);
                                    setShowSettings(false);
                                    // Reset timer với preset đầu tiên
                                    if (tempPresetConfigs.length > 0) {
                                        const firstPreset = tempPresetConfigs[0];
                                        const newTime = firstPreset.minutes * 60;
                                        setTimeLeft(newTime);
                                        totalTime.current = newTime;
                                        setCurrentMode(firstPreset.mode);
                                        setIsRunning(false);
                                        setProgress(0);
                                    }
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs font-medium text-white transition-colors"
                            >
                                <ToolIcons.Save className="h-3 w-3" />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

