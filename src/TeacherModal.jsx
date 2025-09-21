import { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdOutlineContentCopy } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import TeacherCard from './teacherCard';
import TeacherRoutine from './TeacherRoutine';

const TeacherModal = ({ teacherInitial, onClose }) => {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const modalRef = useRef();
    const [copied, setCopied] = useState("");

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Close on ESC key
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [onClose]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Copy to clipboard with better error handling
    const copyToClipboard = async (text, type) => {
        if (!text) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                setCopied(type);
                setTimeout(() => setCopied(""), 2000);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    setCopied(type);
                    setTimeout(() => setCopied(""), 2000);
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Fetch teacher info with proper error handling
    useEffect(() => {
        const fetchInfo = async () => {
            if (!teacherInitial) {
                setError('No teacher initial provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const res = await fetch(
                    `https://diu.zahidp.xyz/api/teacher-classes?teacher=${encodeURIComponent(teacherInitial)}`,
                    { signal: controller.signal }
                );

                clearTimeout(timeoutId);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (data.status === 'success') {
                    setInfo(data);
                } else {
                    setError(data.message || 'No data found');
                }
            } catch (e) {
                if (e.name === 'AbortError') {
                    setError('Request timed out. Please try again.');
                } else {
                    setError('Failed to fetch teacher data. Please try again.');
                }
                console.error('API Error:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [teacherInitial]);

    return (
        <div className="fixed m-1 inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-gray-700 m-2 p-3 py-6 md:p-6 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-500 z-10"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <MdOutlineCancel className='text-2xl' />
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="ml-3 text-white">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : info ? (
                    <div className='bg-gray-700 text-white flex flex-col md:flex-row items-start gap-4'>
                        {info.teacher_info ? (
                            <>
                                {info.teacher_info.image_url && (
                                    <img
                                        src={info.teacher_info.image_url}
                                        alt={info.teacher_info.name || 'Teacher'}
                                        className="w-24 md:w-32 h-24 md:h-32 object-cover rounded-full border mx-auto md:mx-0"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className='flex-1'>
                                    <h2 className="text-xl font-bold mb-3">{info.teacher_info.name || 'Unknown Teacher'}</h2>
                                    <div className="space-y-2">
                                        <p><strong>Designation:</strong> {info.teacher_info.designation || 'N/A'}</p>

                                        {info.teacher_info.email && (
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                <span><strong>Email:</strong></span>
                                                <span className="break-all">
                                                    {info.teacher_info.email.length > 19
                                                        ? `${info.teacher_info.email.substring(0, 18)}...`
                                                        : info.teacher_info.email}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(info.teacher_info.email, "email")}
                                                    className='text-green-300 hover:text-green-50 p-1'
                                                    aria-label="Copy email"
                                                >
                                                    <MdOutlineContentCopy />
                                                </button>
                                                {copied === "email" && (
                                                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {info.teacher_info.cell_phone && (
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                <span><strong>Phone:</strong></span>
                                                <span>{info.teacher_info.cell_phone}</span>
                                                <button
                                                    onClick={() => copyToClipboard(info.teacher_info.cell_phone, "phone")}
                                                    className='text-green-300 hover:text-green-50 p-1'
                                                    aria-label="Copy phone"
                                                >
                                                    <MdOutlineContentCopy />
                                                </button>
                                                {copied === "phone" && (
                                                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-300">No teacher info available.</p>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const TeacherSearch = () => {
    const [allInitials, setAllInitials] = useState([]);
    const [teacher, setTeacher] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [viewMode, setViewMode] = useState("routine");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Safe localStorage operations
    const saveToLocalStorage = (key, value) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
            }
        } catch (error) {
            console.warn('localStorage not available:', error);
        }
    };

    const getFromLocalStorage = (key) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
        } catch (error) {
            console.warn('localStorage not available:', error);
        }
        return null;
    };

    // Fetch all teacher initials
    useEffect(() => {
        const fetchInitials = async () => {
            setLoading(true);
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const res = await fetch('https://diu.zahidp.xyz/api/teachers', {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (data.status === 'success' && Array.isArray(data.data)) {
                    setAllInitials(data.data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    setError('Request timed out. Please refresh the page.');
                } else {
                    setError('Failed to load teachers. Please refresh the page.');
                }
                console.error('Error fetching initials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitials();
    }, []);

    // Restore last searched teacher from localStorage
    useEffect(() => {
        const savedTeacher = getFromLocalStorage('selectedTeacher');
        if (savedTeacher && savedTeacher.trim()) {
            setSelectedTeacher(savedTeacher);
        }
    }, []);

    // Filter suggestions based on input
    const filteredSuggestions = teacher.length >= 1 && Array.isArray(allInitials)
        ? allInitials.filter((t) => {
            if (!t || !t.teacher) return false;
            return (
                t.teacher.toLowerCase().startsWith(teacher.toLowerCase()) ||
                (t.name && t.name.toLowerCase().includes(teacher.toLowerCase()))
            );
        }).slice(0, 10) // Limit to 10 suggestions
        : [];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTeacher = teacher.trim();

        if (trimmedTeacher !== '') {
            setSelectedTeacher(trimmedTeacher);
            saveToLocalStorage('selectedTeacher', trimmedTeacher);
            setTeacher('');
            setShowSuggestions(false);
            setViewMode("routine");
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (teacherInitial) => {
        setTeacher(teacherInitial);
        setShowSuggestions(false);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setTeacher(value);
        setShowSuggestions(value.length >= 1);
    };

    // Handle input focus
    const handleInputFocus = () => {
        if (teacher.length >= 1) {
            setShowSuggestions(true);
        }
    };

    // Handle input blur (with delay to allow clicks)
    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    return (
        <div className="mx-auto bg-[#29303d] p-6 mt-2 rounded shadow">
            <h2 className="text-2xl flex justify-center items-center gap-2 font-bold mb-7 text-white">
                <FaSearch /> Search Teacher by Initial
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex w-full mx-auto md:w-2/3 justify-center gap-2 mb-4">
                <div className="relative w-full md:w-2/3 mx-auto mb-4">
                    <div className='flex items-center gap-2'>
                        <input
                            type="text"
                            placeholder="Teacher Initial (MFZ) or Name"
                            value={teacher}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className="px-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !teacher.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-[#124170] to-[#26667F] text-white rounded hover:bg-gradient-to-r hover:from-[#26667F] hover:to-[#124170] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Loading...' : 'Search'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode(prev => prev === "routine" ? "card" : "routine")}
                            className="p-3 flex flex-col items-center justify-center bg-[#26667F] text-white rounded hover:bg-[#124170] transition"
                            title={`Switch to ${viewMode === "routine" ? "card" : "routine"} view`}
                        >
                            <FaArrowsRotate className='text-lg' />
                        </button>
                    </div>

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-black/90 text-white w-full mt-1 border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                            {filteredSuggestions.map((t, index) => (
                                <li
                                    key={`${t.teacher}-${index}`}
                                    onClick={() => handleSuggestionClick(t.teacher)}
                                    className="px-4 py-2 hover:bg-gray-500 cursor-pointer flex flex-col border-b border-gray-600 last:border-b-0"
                                >
                                    <span className="font-bold">{t.teacher}</span>
                                    {t.name && <span className="text-sm text-gray-300">{t.name}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>

            {selectedTeacher && (
                <div className="mt-6">
                    {viewMode === "routine" ? (
                        <TeacherRoutine teacherInitial={selectedTeacher} />
                    ) : (
                        <TeacherCard teacherInitial={selectedTeacher} />
                    )}
                </div>
            )}
        </div>
    );
};

export { TeacherModal, TeacherSearch };