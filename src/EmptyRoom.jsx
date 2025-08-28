import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";

const timeOptions = ["08:30", "10:00", "11:30", "01:00", "02:30", "04:00"];
const weekdays = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

const EmptyRoom = () => {
    const [selectedTime, setSelectedTime] = useState("08:30");
    const [emptyRooms, setEmptyRooms] = useState({});
    const [selectedDay, setSelectedDay] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchEmptyRooms = (time) => {
        setLoading(true);
        fetch(`https://diu.zahidp.xyz/api/empty-rooms?start_time=${time}`)
            .then((res) => res.json())
            .then((data) => {
                const roomsData = data?.data || {};
                setEmptyRooms(roomsData);

                // Default to today or first available day
                const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
                if (roomsData[today]) {
                    setSelectedDay(today);
                } else {
                    const firstAvailable = Object.keys(roomsData)[0];
                    setSelectedDay(firstAvailable);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching empty rooms:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmptyRooms(selectedTime);
    }, [selectedTime]);

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
        const target = dayMap[dayName.toUpperCase()];
        const today = new Date();
        const current = today.getDay();
        const diff = (target - current + 7) % 7;
        today.setDate(today.getDate() + diff);
        return today.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            // year: "numeric",
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-2 bg-[#29303d] text-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Find Empty Rooms</h2>

            {/* Time Selection */}
            <div className="mb-6 flex gap-3 items-center">
                <label className="font-semibold">Select Time :</label>
                {/* <div className="relative inline-block w-26">
                    <select
                        className="appearance-none w-full border border-gray-500 text-red-50 font-bold rounded p-2 "
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    >
                        {timeOptions.map((time) => (
                            <option className="bg-stone-700" key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-white">
                        <RiArrowDropDownLine className="text-2xl" />
                    </div>
                </div> */}

                {/* New dropdown */}
                {/* <div class="relative inline-block">
                    <button id="menu-button" type="button" aria-expanded="true" aria-haspopup="true" class="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-gray-300 ring-inse">
                        Options
                        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="-mr-1 size-5 text-gray-400">
                            <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                        </svg>
                    </button>

                    <div role="menu" tabindex="-1" aria-labelledby="menu-button" aria-orientation="vertical" class="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-black/90 shadow-lg ring-1 ring-black/5 focus:outline-hidden">
                        <div role="none" class="py-1">
                            {timeOptions.map((time) => (
                                <a id="menu-item-0" key={time} role="menuitem" href="#" tabindex="-1" class="block px-4 py-2 text-sm hover:bg-red-400 text-white">{time}</a>
                            ))}
                        </div>
                    </div>
                </div> */}
                <div className="relative inline-block w-24">
                    <button
                        id="menu-button"
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setIsOpen(!isOpen)}
                        className="group inline-flex w-full justify-center gap-x-4 rounded-md px-3 py-2 text-sm font-semibold text-gray-400 hover:text-white shadow-xs ring-1 ring-gray-300 ring-inset cursor-pointer"
                    >
                        <span className="group-hover:text-white text-gray-400">
                            {selectedTime}
                        </span>
                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="-mr-0.5 size-5 group-hover:text-white text-gray-400">
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div
                            role="menu"
                            tabIndex="-1"
                            aria-labelledby="menu-button"
                            aria-orientation="vertical"
                            className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-black/90 shadow-lg ring-1 ring-black/5 focus:outline-none"
                        >
                            <div role="none" className="py-1">
                                {timeOptions.map((time) => (
                                    <a
                                        key={time}
                                        href="#"
                                        role="menuitem"
                                        tabIndex="-1"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedTime(time);
                                            setIsOpen(false);
                                        }}
                                        className="block px-4 py-2 text-sm hover:bg-gray-700 text-white"
                                    >
                                        {time}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* New dropdown */}

            </div>

            {/* Loading Spinner */}
            {loading && (
                // <p className="text-center text-lg">Loading...</p>
                <div className="px-2 w-full flex justify-between gap-1 md:gap-2 md:px-4 py-2 rounded-md text-xs md:text-sm font-semibold animate-pulse">
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                    <div className="border border-gray-600 w-full md:w-fit px-2 py-2 rounded-md">
                        <div className="h-4 w-6 md:w-20 bg-gray-600 rounded mb-1 mx-auto"></div>
                        <div className="h-3 w-6 md:w-20 bg-gray-500 rounded mx-auto"></div>
                    </div>
                </div>

            )}

            {/* Day Cards */}
            {!loading && (
                <div className="flex gap-1 md:gap-2 overflow-x-visible pb-4">
                    {weekdays.map((day) => (
                        <motion.button
                            key={day}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedDay(day)}
                            className={`px-2 w-full md:px-1 py-2 rounded-md cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200
                ${selectedDay === day
                                    ? 'bg-gradient-to-r from-[#124170] to-[#26667F]'
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
            )}

            {/* Selected Day Rooms */}
            <AnimatePresence mode="wait">
                {!loading && selectedDay && (
                    <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 p-4 border border-gray-600 rounded-xl"
                    >
                        <h3 className="text-xl font-semibold text-center text-[#83aff0] mb-4">
                            {selectedDay} ({getNextDateForDay(selectedDay)})
                        </h3>

                        {emptyRooms[selectedDay] && emptyRooms[selectedDay].length > 0 ? (
                            <ul className="space-y-2">
                                {emptyRooms[selectedDay].map((room, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                    >
                                        🏠 {room.room}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-white text-lg">
                                No empty rooms found on {selectedDay}.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmptyRoom;
