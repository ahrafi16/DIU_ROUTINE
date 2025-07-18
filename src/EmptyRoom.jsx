import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const timeOptions = ["08:30", "10:00", "11:30", "01:00", "02:30", "04:00"];
const weekdays = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

const EmptyRoom = () => {
    const [selectedTime, setSelectedTime] = useState("08:30");
    const [emptyRooms, setEmptyRooms] = useState({});
    const [selectedDay, setSelectedDay] = useState("");
    const [loading, setLoading] = useState(false);

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
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-6 bg-[#29303d] text-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Find Empty Rooms</h2>

            {/* Time Selection */}
            <div className="mb-6 flex gap-3 items-center">
                <label className="font-semibold">Select Time:</label>
                <select
                    className="border border-gray-500 text-red-50 font-bold rounded p-2"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                >
                    {timeOptions.map((time) => (
                        <option className="bg-stone-700" key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <p className="text-center text-lg">Loading...</p>
            )}

            {/* Day Cards */}
            {!loading && (
                <div className="flex gap-1 md:gap-2 overflow-x-auto pb-4">
                    {weekdays.map((day) => (
                        <motion.button
                            key={day}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedDay(day)}
                            className={`px-2 md:px-4 py-2 rounded-md cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200
                ${selectedDay === day
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
