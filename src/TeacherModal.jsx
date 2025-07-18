import { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
const TeacherModal = ({ teacherInitial, onClose }) => {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState('');
    const modalRef = useRef();

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
                setError('Failed to fetch data');
            }
        };
        fetchInfo();
    }, [teacherInitial]);

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-xl relative">
                <button className="absolute top-2 right-2 text-red-400" onClick={onClose}><MdOutlineCancel  className='text-2xl'/></button>

                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : info ? (
                    <div className='bg-gray-700 text-white flex items-center gap-5'>
                        {info.teacher_info ? (
                            <>
                                {info.teacher_info.image_url && (
                                    <img
                                        src={info.teacher_info.image_url}
                                        alt={info.teacher_info.name}
                                        className="w-32 h-32 object-cover mt-3 rounded-full border"
                                    />
                                )}
                                <div>
                                    <h2 className="text-xl font-bold mb-2">{info.teacher_info.name}</h2>
                                    <p><strong>Designation:</strong> {info.teacher_info.designation}</p>
                                    <p><strong>Email:</strong> {info.teacher_info.email}</p>
                                    <p><strong>Phone:</strong> {info.teacher_info.cell_phone}</p>
                                </div>

                            </>
                        ) : (
                            <p className="text-gray-300">No teacher info available.</p>
                        )}

                        {/* <h3 className="mt-4 text-lg font-semibold">🗓️ Classes</h3> */}
                        {/* {Object.keys(info.data).map((day) => (
                            <div key={day} className="mt-2">
                                <strong>{day}</strong>
                                <ul className="list-disc list-inside text-sm text-white">
                                    {Array.isArray(info.data[day]) && info.data[day].length > 0 ? (
                                        info.data[day].map((cls, idx) => (
                                            <li key={idx}>
                                                {cls.course_code} – {cls.course_title} | {cls.start_time} - {cls.end_time} | 📍 {cls.room} | Section: {cls.section}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">No classes</li>
                                    )}
                                </ul>
                            </div>
                        ))} */}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

const TeacherSearch = () => {
    const [teacher, setTeacher] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    return (
        <div className="mx-auto bg-[#29303d]  p-6 mt-10 rounded shadow">
            <h2 className="text-xl font-bold mb-4">🔍 Search Teacher by Initial</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Teacher Initial (e.g. MM)"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value.toUpperCase())}
                    className="px-4 w-1/3 py-2 border border-gray-300 rounded"
                />
                <button
                    onClick={() => setSelectedTeacher(teacher)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                >
                    Search
                </button>
            </div>
            {selectedTeacher && (
                <TeacherModal
                    teacherInitial={selectedTeacher}
                    onClose={() => setSelectedTeacher(null)}
                />
            )}
        </div>
    );
};

export { TeacherModal, TeacherSearch };
