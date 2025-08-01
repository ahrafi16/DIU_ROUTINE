import { useEffect, useState } from 'react';
import { TeacherModal } from './TeacherModal';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegCalendarCheck } from "react-icons/fa6";
import relaxLottie from '../src/assets/Meditation.json';
import Lottie from 'lottie-react';

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
        if (routine && section) {
            localStorage.setItem('routineData', JSON.stringify(routine));
            localStorage.setItem('selectedSection', section);
        }
    }, [routine, section]);

    // useEffect(() => {
    //     const savedRoutine = localStorage.getItem('routineData');
    //     const savedSection = localStorage.getItem('selectedSection');
    //     const savedDay = localStorage.getItem('selectedDay');

    //     if (savedRoutine && savedSection) {
    //         setRoutine(JSON.parse(savedRoutine));
    //         setSection(savedSection);
    //         if (savedDay) {
    //             setSelectDay(savedDay);
    //         }
    //     }
    // }, []);

    // new useEffect
    useEffect(() => {
        const savedRoutine = localStorage.getItem('routineData');
        const savedSection = localStorage.getItem('selectedSection');

        if (savedRoutine && savedSection) {
            const parsedRoutine = JSON.parse(savedRoutine);
            setRoutine(parsedRoutine);
            setSection(savedSection);

            // Set selectDay to today if available, otherwise first available day
            const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
            if (parsedRoutine[today]) {
                setSelectDay(today);
            } else {
                const availableDay = Object.keys(parsedRoutine)[0];
                setSelectDay(availableDay || '');
            }
        }
    }, []);
    // new useEffect

    useEffect(() => {
        if (selectDay) {
            localStorage.setItem('selectedDay', selectDay);
        }
    }, [selectDay]);



    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch('https://diu.zahidp.xyz/api/sections');
                const data = await res.json();
                // console.log("Sections Data", data);
                if (data.status?.toLowerCase() === 'success') {
                    setAllSections(data.data || []);
                    // console.log('All sections:', data.data);
                }
            } catch (err) {
                console.error("Error fetching sections:", err);
            }
        };
        fetchSections();
    }, []);


    const handleSectionChange = (e) => {
        const value = e.target.value.toString().toUpperCase();
        setSection(value);

        if (value.length >= 1 && allSections.length > 0) {
            const matches = allSections.filter((sec) =>
                sec.toUpperCase().startsWith(value)
            );
            // console.log("Matching sections:", matches);
            setFilteredSuggestions(matches);
        } else {
            setFilteredSuggestions([]);
        }


    };



    // const handleFetchRoutine = async () => {
    //     if (!section.trim()) return;

    //     if (!sectionHistory.includes(section)) {
    //         const updatedHistory = [section, ...sectionHistory];
    //         setSectionHistory(updatedHistory);
    //         localStorage.setItem('sectionHistory', JSON.stringify(updatedHistory));
    //     }

    //     setLoading(true);
    //     setError('');
    //     if (section !== localStorage.getItem('selectedSection')) {
    //         setRoutine(null);
    //     }
    //     if (routine && section && selectDay) {
    //         localStorage.setItem('routineData', JSON.stringify(routine));
    //         localStorage.setItem('selectedSection', section);
    //         localStorage.setItem('selectedDay', selectDay);
    //     }



    //     try {
    //         const response = await fetch(`https://diu.zahidp.xyz/api/routine?section=${section}`);
    //         const result = await response.json();
    //         // console.log("Data", result.data);

    //         if (result.status !== 'Success' || !result.data) {
    //             throw new Error('No routine found for this section');
    //         }

    //         setRoutine(result.data);
    //         // console.log("Data", result.data);

    //         const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    //         if (result.data[today]) {
    //             setSelectDay(today);
    //         } else {
    //             const availableDay = Object.keys(result.data)[0];
    //             setSelectDay(availableDay);
    //         }
    //     } catch (err) {
    //         setError(err.message || 'Something went wrong');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // new fetch routine 
    const handleFetchRoutine = async () => {
        if (!section.trim()) return;

        if (!sectionHistory.includes(section)) {
            const updatedHistory = [section, ...sectionHistory];
            setSectionHistory(updatedHistory);
            localStorage.setItem('sectionHistory', JSON.stringify(updatedHistory));
        }

        setLoading(true);
        setError('');
        if (section !== localStorage.getItem('selectedSection')) {
            setRoutine(null);
        }
        if (routine && section && selectDay) {
            localStorage.setItem('routineData', JSON.stringify(routine));
            localStorage.setItem('selectedSection', section);
            localStorage.setItem('selectedDay', selectDay);
        }

        try {
            const response = await fetch(`https://diu.zahidp.xyz/api/routine?section=${section}`);
            const result = await response.json();

            if (result.status !== 'Success' || !result.data) {
                throw new Error('No routine found for this section');
            }

            setRoutine(result.data);

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
    // new fetch routine 

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
            // year: 'numeric',
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const weekdays = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

    // const getTimeDifference = (start, end) => {
    //     const [startH, startM] = start.split(':').map(Number);
    //     const [endH, endM] = end.split(':').map(Number);

    //     const startTotalMins = startH * 60 + startM;
    //     const endTotalMins = endH * 60 + endM;

    //     const diff = endTotalMins - startTotalMins;
    //     const hours = Math.floor(diff / 60);
    //     const mins = diff % 60;

    //     return { hours, mins, total: diff };
    // };

    return (
        <div className="mx-auto bg-[#29303d] text-white p-6 mt-2 rounded shadow">
            <h1 className="text-2xl flex justify-center gap-2 items-center font-semibold mb-7 text-center"><FaRegCalendarCheck /> View Class Routine</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevents page reload
                    handleFetchRoutine();
                }}
                className="flex w-full mx-auto md:w-2/3 justify-center gap-2 mb-4"
            >
                <div className="relative w-full md:w-2/3 mx-auto mb-4">
                    <div className='flex items-center gap-2'>
                        <input
                            type="text"
                            placeholder="Enter Section (61_N)"
                            value={section}
                            onChange={handleSectionChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                        >
                            Search
                        </button>
                    </div>
                    {filteredSuggestions.length > 0 && (
                        <ul className="md:absolute z-10 bg-black/50 w-1/2 mt-1 border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                            {filteredSuggestions.map((sec, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSection(sec);
                                        setFilteredSuggestions([]);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                                >
                                    {sec}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </form>


            {loading &&
                <button disabled type="button" className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                </button>

            }
            {error && <p className="text-red-500">{error}</p>}

            {routine && (
                <>
                    {/* Day Cards */}
                    <div className="flex gap-1 md:gap-2 overflow-x-visible mt-6 pb-4">
                        {weekdays.map((day) => (
                            <motion.button
                                key={day}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectDay(day)}
                                className={`px-1 w-full md:px-1 py-2 rounded-md cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200
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
                                className="border w-full border-gray-600 rounded-xl shadow-sm p-4 mt-4"
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
                                                // transition={{ duration: 0.3, delay: idx * 0.05, ease: "easeInOut" }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 60, // lower = smoother
                                                    damping: 50,    // higher = less bounce
                                                    delay: idx * 0.05
                                                }}
                                                className="bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition"
                                            >

                                                <div className='flex items-center gap-5'>
                                                    <div>
                                                        <span className='flex text-sm md:text-md flex-col'>
                                                            <span>{formatTime(cls.start_time)}</span>
                                                            <span className='my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span className='my-1 md:my-1.5 mb-2 h-0.5 bg-gray-500 rounded-2xl'></span>
                                                            <span></span>
                                                            <span>{formatTime(cls.end_time)}</span>
                                                        </span>
                                                    </div>
                                                    <div className="text-md text-white flex flex-col gap-2 md:gap-6">
                                                        <div className="font-semibold text-[#83aff0] text-sm md:text-lg">
                                                            {cls.course_title}
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            <div className='flex text-sm md:text-md flex-col text-gray-400 gap-1'>
                                                                {/* <span>Time &nbsp; &nbsp; &nbsp;  : </span> */}
                                                                <span>Course  </span>
                                                                <span>Room  </span>
                                                                <span>Teacher </span>
                                                                <span>Section </span>
                                                            </div>
                                                            <div className='flex text-sm md:text-md flex-col gap-1'>
                                                                <span>:</span>
                                                                <span>:</span>
                                                                <span>:</span>
                                                                <span>:</span>
                                                            </div>
                                                            <div className='flex text-sm md:text-md flex-col gap-1'>
                                                                {/* <span><span>{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</span>
                                                            </span> */}
                                                                {cls.course_code}
                                                                <span>  {cls.room}</span>
                                                                <span
                                                                    className="text-[#83aff0] cursor-pointer font-semibold"
                                                                    onClick={() => setSelectedTeacher(cls.teacher)}
                                                                >
                                                                    {cls.teacher}
                                                                </span>
                                                                <span>{cls.section}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (

                                    <div className='flex flex-col items-center justify-center mt-6'>

                                        <Lottie
                                            animationData={relaxLottie}
                                            loop={true}
                                            autoplay={selectDay !== null} // Play when a day is selected
                                            style={{ width: 200, height: 200 }} // Adjust size as needed
                                        />
                                        <p className="text-white text-center text-xl">No class on {selectDay}. Recharge yourself !
                                        </p>
                                    </div>

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
