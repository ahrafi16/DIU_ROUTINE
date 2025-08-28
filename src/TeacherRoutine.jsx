import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import relaxLottie from "../src/assets/Meditation.json"; // your existing lottie animation
import { TeacherModal } from "./TeacherModal";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiChalkboardTeacherLight } from "react-icons/pi";

const weekdays = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

const TeacherRoutine = ({ teacherInitial }) => {
  const [teacher, setTeacher] = useState(teacherInitial || "");
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectDay, setSelectDay] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [tname, setTname] = useState('');

  useEffect(() => {
    if (teacherInitial) setTeacher(teacherInitial);
  }, [teacherInitial]);

  useEffect(() => {
    if (!teacher) return;

    const ctrl = new AbortController();

    const fetchRoutine = async () => {
      try {
        setLoading(true);
        setError("");
        setRoutine(null);

        const res = await fetch(
          `https://diu.zahidp.xyz/api/teacher-classes?teacher=${teacher}`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setTname(data.teacher_info.name);

        if (data.status?.toLowerCase() === "success") {
          setRoutine(data.data);
          const today = new Date().toLocaleString("en-US", { weekday: "long" }).toUpperCase();
          setSelectDay(data.data[today] ? today : Object.keys(data.data)[0]);
        } else {
          setError("No classes found for this teacher");
        }
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
    return () => ctrl.abort();
  }, [teacher]);

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
    if (targetDayIndex === undefined) return "";

    const today = new Date();
    const todayIndex = today.getDay();
    const diff = (targetDayIndex - todayIndex + 7) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);

    return nextDate.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  if (!teacher) return null;

  return (
    <div className="mx-auto bg-[#29303d] text-white mt-2 rounded shadow">
      <h1 className="text-2xl flex justify-center md:gap-1 md:items-center font-semibold mb-7 text-center">
        <PiChalkboardTeacherLight className="text-4xl" /> Routine of {tname}
      </h1>

      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {routine && (
        <>
          {/* Day Buttons */}
          <div className="flex gap-1 md:gap-2 overflow-x-visible mt-6 pb-4">
            {weekdays.map((day) => (
              <motion.button
                key={day}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectDay(day)}
                className={`px-1 w-full md:px-1 py-2 rounded-md cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200 ${selectDay === day
                  ? "bg-gradient-to-r from-[#124170] to-[#26667F]"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                <span className="block md:hidden">{day.substring(0, 3)}</span>
                <span className="hidden md:block">{day}</span>
                <br />
                <span className="text-xs font-normal">{getNextDateForDay(day)}</span>
              </motion.button>
            ))}
          </div>

          {/* Selected Day Routine */}
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
                        transition={{ type: "spring", stiffness: 60, damping: 50, delay: idx * 0.05 }}
                        className="bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition"
                      >
                        <div className="flex items-center gap-5">
                          <div>
                            <span className="flex text-sm md:text-md flex-col">
                              <span>{formatTime(cls.start_time)}</span>
                              <span className="my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl"></span>
                              {/* <span className="my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl"></span>
                              <span className="my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl"></span> */}
                              <span className="my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl"></span>
                              <span className="my-1 md:my-1.5 h-0.5 bg-gray-500 rounded-2xl"></span>
                              <span className="my-1 md:my-1.5 w-4 h-0.5 bg-gray-500 rounded-2xl"></span>
                              <span className="my-1 md:my-1.5 mb-2 h-0.5 bg-gray-500 rounded-2xl"></span>
                              <span></span>
                              <span>{formatTime(cls.end_time)}</span>
                            </span>
                          </div>

                          <div className="text-md text-white flex flex-col gap-2 md:gap-6">
                            <div className="font-semibold text-[#83aff0] text-sm md:text-lg">
                              {cls.course_title}
                            </div>
                            <div className="flex gap-3">
                              <div className="flex text-sm md:text-md flex-col text-gray-400 gap-1">
                                <span>Course</span>
                                <span>Room</span>
                                <span>Section</span>
                              </div>
                              <div className="flex text-sm md:text-md flex-col gap-1">
                                <span>:</span>
                                <span>:</span>
                                <span>:</span>
                              </div>
                              <div className="flex text-sm md:text-md flex-col gap-1">
                                <span>{cls.course_code}</span>
                                <span>{cls.room}</span>
                                <span
                                  className="text-[#83aff0] cursor-pointer font-semibold"
                                  onClick={() => setSelectedTeacher(cls.teacher)}
                                >
                                  {cls.section}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-6">
                    <Lottie
                      animationData={relaxLottie}
                      loop={true}
                      autoplay={selectDay !== null}
                      style={{ width: 200, height: 200 }}
                    />
                    <p className="text-white text-center text-xl">
                      No class on {selectDay}. Recharge yourself!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {selectedTeacher && (
        <TeacherModal teacherInitial={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
      )}
    </div>
  );
};

export default TeacherRoutine;
