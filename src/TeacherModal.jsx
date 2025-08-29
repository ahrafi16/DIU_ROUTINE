import { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdOutlineContentCopy } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import TeacherCard from './teacherCard';
import TeacherRoutine from './TeacherRoutine';
const TeacherModal = ({ teacherInitial, onClose }) => {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState('');
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

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    // copy to clip board
    const copyToClipboard = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(type); // e.g., "email" or "phone"
                setTimeout(() => setCopied(""), 2000); // hide after 2 seconds
            })
            .catch((err) => console.error("Failed to copy:", err));
    };


    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch(`https://diu.zahidp.xyz/api/teacher-classes?teacher=${teacherInitial}`);
                const data = await res.json();
                if (data.status === 'success') {
                    setInfo(data);
                } else {
                    setError('No data found');
                }
            } catch (e) {
                setError('Failed to fetch data', e);
            }
        };
        fetchInfo();
    }, [teacherInitial]);

    return (
        <div className="fixed m-1 inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-gray-700 p-4 md:p-6 rounded-lg shadow-xl w-full max-w-xl relative">
                <button className="absolute top-2 right-2 text-red-400" onClick={onClose}><MdOutlineCancel className='text-2xl' /></button>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : info ? (
                    <div className='bg-gray-700 text-white flex items-center gap-1 md:gap-5'>
                        {info.teacher_info ? (
                            <>
                                {info.teacher_info.image_url && (
                                    <img
                                        src={info.teacher_info.image_url}
                                        alt={info.teacher_info.name}
                                        className="w-32 h-32 object-cover mt-3 rounded-full border"
                                    />
                                )}
                                <div className=''>
                                    <h2 className="text-xl font-bold mb-2">{info.teacher_info.name}</h2>
                                    <p><strong>Designation:</strong> {info.teacher_info.designation}</p>
                                    <p className='flex items-center gap-1'><strong>Email:</strong>{info.teacher_info.email} <MdOutlineContentCopy className='text-green-300 hover:text-green-50'
                                        onClick={() => copyToClipboard(info.teacher_info.email, "email")} />
                                        {copied === "email" && (
                                            <span className="absolute bottom-1 right-1 ml-2 bg-black text-white text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </p>
                                    <p className='flex items-center gap-1'><strong>Phone:</strong> {info.teacher_info.cell_phone} <MdOutlineContentCopy className='text-green-300 hover:text-green-50'
                                        onClick={() => copyToClipboard(info.teacher_info.cell_phone, "phone")} />
                                        {copied === "phone" && (
                                            <span className="absolute bottom-1 right-1 ml-2 bg-black text-white text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </p>
                                </div>

                            </>
                        ) : (
                            <p className="text-gray-300">No teacher info available.</p>
                        )}

                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

const TeacherSearch = () => {
    const [allInitials, setAllInitials] = useState([]);
    const [teacher, setTeacher] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [viewMode, setViewMode] = useState("routine");

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const res = await fetch('https://diu.zahidp.xyz/api/teachers');
                const data = await res.json();
                if (data.status === 'success') {
                    // setAllInitials(data.data.map(t => t.teacher));
                    setAllInitials(data.data);
                    // console.log("Data", data.data);
                }
            } catch (error) {
                console.error('Error fetching initials:', error);
            }
        };
        fetchInitials();
    }, []);

    // Restore last searched teacher from localStorage
    useEffect(() => {
        const savedTeacher = localStorage.getItem('selectedTeacher');
        if (savedTeacher) {
            setSelectedTeacher(savedTeacher);
        }
    }, []);


    // const filteredSuggestions = teacher.length >= 1
    //     ? allInitials.filter((initial) =>
    //         initial.toLowerCase().startsWith(teacher.toLowerCase())
    //     )
    //     : [];
    const filteredSuggestions = teacher.length >= 1
        ? allInitials.filter((t) =>
            t.teacher.toLowerCase().startsWith(teacher.toLowerCase()) ||
            t.name.toLowerCase().includes(teacher.toLowerCase())
        )
        : [];



    return (
        <div className="mx-auto bg-[#29303d]  p-6 mt-2 rounded shadow">
            <h2 className="text-2xl flex justify-center items-center gap-1 font-bold mb-7"><FaSearch /> Search Teacher by Initial</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (teacher.trim() !== '') {
                        setSelectedTeacher(teacher);
                        localStorage.setItem('selectedTeacher', teacher);
                        setTeacher('');
                        setViewMode("routine");
                    }
                }}
                className="flex w-full mx-auto md:w-2/3 justify-center gap-2 mb-4"
            >
                <div className="relative w-full md:w-2/3 mx-auto mb-4">
                    <div className='flex items-center gap-2'>
                        <input
                            type="text"
                            placeholder="Teacher Initial (MFZ)"
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value.toUpperCase())}
                            className="px-4 py-2 w-full border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-[#124170] to-[#26667F] rounded hover:bg-gradient-to-r hover:from-[#26667F] hover:to-[#124170] cursor-pointer transition"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode(prev => prev === "routine" ? "card" : "routine")}
                            className="p-3 flex flex-col items-center justify-between bg-[#26667F] text-white rounded hover:bg-[#124170] cursor-pointer transition text-xs"
                        >
                            <FaArrowsRotate className='text-lg' />
                        </button>
                    </div>

                    {filteredSuggestions.length > 0 && (
                        // <ul className="md:absolute z-10 bg-black/50 w-1/2 mt-1 border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                        //     {filteredSuggestions.map((initial, index) => (
                        //         <li
                        //             key={index}
                        //             onClick={() => {
                        //                 setTeacher(initial);
                        //             }}
                        //             className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                        //         >
                        //             {initial}
                        //         </li>
                        //     ))}
                        // </ul>

                        <ul className="md:absolute z-10 bg-black/90 w-1/2 mt-1 border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                            {filteredSuggestions.map((t, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setTeacher(t.teacher); // pick the initial on click
                                    }}
                                    className="px-4 py-2 hover:bg-gray-500 cursor-pointer flex flex-col"
                                >
                                    <span className="font-bold">{t.teacher}</span>
                                    <span className="text-sm">{t.name}</span>
                                </li>
                            ))}
                        </ul>

                    )}


                </div>



            </form>

            {selectedTeacher && (
                viewMode === "routine"
                    ? <TeacherRoutine teacherInitial={selectedTeacher} />
                    : <TeacherCard teacherInitial={selectedTeacher} />
            )}
        </div>
    );
};

export { TeacherModal, TeacherSearch };
