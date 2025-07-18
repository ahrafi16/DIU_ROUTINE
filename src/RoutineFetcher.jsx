import { useEffect, useState } from 'react';
import { TeacherModal } from './TeacherModal';
import { AnimatePresence, motion } from 'framer-motion';

const RoutineFetcher = () => {
    const [section, setSection] = useState('');
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectDay, setSelectDay] = useState('');
    const [sectionHistory, setSectionHistory] = useState(() => {
        const stored = localStorage.getItem('sectionHistory');
        return stored ? JSON.parse(stored) : [];
    });
    const [allSections, setAllSections] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch('https://diu.zahidp.xyz/api/sections');
                const data = await res.json();
                if (data.status === 'Success') {
                    setAllSections(data.data || []);
                }
            } catch (err) {
                console.error("Error fetching sections:", err);
            }
        };
        fetchSections();
    }, []);

    const handleSectionChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSection(value);

        // Filter suggestions from previously searched sections only (sectionHistory)
        const matches = sectionHistory.filter(sec => sec.startsWith(value));

        setFilteredSuggestions(matches);
    };



    const handleFetchRoutine = async () => {
        if (!section.trim()) return;

        if (!sectionHistory.includes(section)) {
            const updatedHistory = [section, ...sectionHistory];
            setSectionHistory(updatedHistory);
            localStorage.setItem('sectionHistory', JSON.stringify(updatedHistory));
        }

        setLoading(true);
        setError('');
        setRoutine(null);

        try {
            const response = await fetch(`https://diu.zahidp.xyz/api/routine?section=${section}`);
            const result = await response.json();
            // console.log("Data", result.data);

            if (result.status !== 'Success' || !result.data) {
                throw new Error('No routine found for this section');
            }

            setRoutine(result.data);
            // console.log("Data", result.data);

            const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
            if (result.data[today]) {
                setSelectDay(today);
            } else {
                const availableDay = Object.keys(result.data)[0];
                setSelectDay(availableDay);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getNextDateForDay = (dayName) => {
        const dayMap = {
            SUNDAY: 0,
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
            SATURDAY: 6,
        };

        const targetDayIndex = dayMap[dayName.toUpperCase()];
        if (targetDayIndex === undefined) return '';

        const today = new Date();
        const todayIndex = today.getDay();

        const diff = (targetDayIndex - todayIndex + 7) % 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + diff);

        return nextDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const weekdays = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];


    return (
        <div className="mx-auto bg-[#29303d] text-white p-6 mt-10 rounded shadow">
            <h1 className="text-2xl font-semibold mb-4 text-center">📅 View Class Routine</h1>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    list="section-options"
                    placeholder="Enter Section (e.g. 61_N)"
                    value={section}
                    onChange={handleSectionChange}
                    className="flex w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="section-options">
                    {filteredSuggestions.map((sec, index) => (
                        <option key={index} value={sec} />
                    ))}
                </datalist>
                <button
                    onClick={handleFetchRoutine}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                >
                    Search
                </button>
            </div>

            {loading && <button disabled type="button" className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                Loading...
            </button>}
            {error && <p className="text-red-500">{error}</p>}

            {routine && (
                <>
                    {/* Day Cards */}
                    <div className="flex gap-1 md:gap-2 overflow-x-auto mt-6 pb-4">
                        {weekdays.map((day) => (
                            <motion.button
                                key={day}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectDay(day)}
                                className={`px-1 md:px-4 py-2 rounded-md cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200
                ${selectDay === day
                                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {/* Show abbreviated on mobile, full on desktop */}
                                <span className="block md:hidden">{day.substring(0, 3)}</span>
                                <span className="hidden md:block">{day}</span>
                                <br />
                                <span className="text-xs font-normal">{getNextDateForDay(day)}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Selected Day's Routine with AnimatePresence */}
                    <AnimatePresence mode="wait">
                        {selectDay && (
                            <motion.div
                                key={selectDay}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="border border-gray-600  rounded-xl shadow-sm p-4 mt-4"
                            >
                                <h2 className="text-lg text-center font-semibold text-[#83aff0] mb-4">
                                    {selectDay} ({getNextDateForDay(selectDay)})
                                </h2>

                                {Array.isArray(routine[selectDay]) && routine[selectDay].length > 0 ? (
                                    <div className="space-y-4">
                                        {routine[selectDay].map((cls, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className="bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition"
                                            >
                                                <div className="font-semibold text-[#83aff0] text-xl mb-1">
                                                    {cls.course_code} – {cls.course_title}
                                                </div>
                                                <div className="text-md text-white flex gap-5">
                                                    <div className='flex flex-col gap-1'>
                                                        <span>Time &nbsp; &nbsp; &nbsp;  : </span>
                                                        <span>Room  &nbsp; &nbsp; :</span>
                                                        <span>Teacher &nbsp;:</span>
                                                        <span>Section &nbsp;:</span>
                                                    </div>
                                                    <div className='flex flex-col gap-1'>
                                                        <span><span>{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</span>
                                                        </span>
                                                        <span>  {cls.room}</span>
                                                        <span
                                                            className="text-[#83aff0] cursor-pointer"
                                                            onClick={() => setSelectedTeacher(cls.teacher)}
                                                        >
                                                            {cls.teacher}
                                                        </span>
                                                        <span>{cls.section}</span>
                                                    </div>

                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white text-center text-xl"> Alright, no class on {selectDay}. Go and enjoy!</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {selectedTeacher && (
                <TeacherModal
                    teacherInitial={selectedTeacher}
                    onClose={() => setSelectedTeacher(null)}
                />
            )}
        </div>
    );
};

export default RoutineFetcher;
