import { useEffect, useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";

const daysOrder = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

const TeacherCard = ({ teacherInitial }) => {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch(`https://diu.zahidp.xyz/api/teacher-classes?teacher=${teacherInitial}`);
                const data = await res.json();
                if (data.status === 'success') {
                    setInfo(data);
                    // console.log("Fetched Data:", data);
                } else {
                    setError('No data found');
                }
            } catch (e) {
                setError('Failed to fetch data', e);
            }
        };
        if (teacherInitial) {
            fetchInfo();
        }
    }, [teacherInitial]);

    if (!teacherInitial) return null;

    return (
        <div className="mt-6 p-4 bg-gray-800 text-white rounded-xl shadow w-full md:max-w-5xl mx-auto">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : info ? (
                <>
                    {/* Teacher Info */}
                    <div className="flex gap-2 md:gap-6 items-center mb-6">
                        {info.teacher_info?.image_url ? (
                            <img
                                src={info.teacher_info.image_url}
                                alt={info.teacher_info.name}
                                className="w-20 md:w-32 h-20 md:h-32 md:m-3 object-cover rounded-full border"
                            />
                        ) :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-36 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        }
                        <div className="flex flex-col gap-0.5">
                            <h2 className="md:text-2xl font-bold mb-2">{info.teacher_info?.name}</h2>
                            <p className="text-xs md:text-lg"><strong>Designation:</strong> {info.teacher_info?.designation}</p>
                            <p className="text-xs md:text-lg"><strong>Email:</strong> {info.teacher_info?.email}</p>
                            <p className="text-xs md:text-lg"><strong>Phone:</strong> {info.teacher_info?.cell_phone}</p>
                        </div>
                    </div>

                    {/* Class Schedule Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse border border-gray-500 bg-[#29303d] text-gray-300">
                            <thead className="bg-[#29303d]text-base">
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2 font-bold">DAY</th>
                                    <th className="border border-gray-400 px-4 py-2 font-bold">Time</th>
                                    <th className="border border-gray-400 px-4 py-2 font-bold">Course</th>
                                    <th className="border border-gray-400 px-4 py-2 font-bold">Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daysOrder.map((day) => {
                                    const classes = info.data[day];
                                    if (!classes || classes.length === 0) {
                                        return (
                                            <tr key={day}>
                                                <td className="border border-gray-400 px-4 py-2 font-medium bg-[#29303d]">{capitalize(day)}</td>
                                                <td className="border border-gray-400 px-4 py-2" colSpan="3"></td>
                                            </tr>
                                        );
                                    }

                                    return classes.map((cls, index) => (
                                        <tr key={`${day}-${index}`}>
                                            {index === 0 && (
                                                <td
                                                    rowSpan={classes.length}
                                                    className="border border-gray-400 px-2 md:px-4 py-2 font-medium align-top bg-[#29303d]"
                                                >
                                                    {capitalize(day)}
                                                </td>
                                            )}
                                            <td className="border border-gray-400 px-2 md:px-4 py-2 font-semibold">
                                                {cls.start_time}-{cls.end_time}
                                            </td>
                                            <td className="border border-gray-400 px-2 md:px-4 py-2">
                                                {cls.course_title || "N/A"}
                                            </td>


                                            <td className="border border-gray-400 px-2 md:px-4 py-2 whitespace-pre-line">
                                                {/* Desktop (sm and above) */}
                                                <span className="hidden sm:inline">
                                                    {(() => {
                                                        if (!cls.room.includes('(')) return cls.room;

                                                        const before = cls.room.split('(')[0].trim();
                                                        const after = cls.room.split('(')[1];
                                                        const inside = after.split(')')[0];

                                                        // If inside (..) is A or B (1 char), don't break line
                                                        if (inside.length <= 1) {
                                                            return `${before} (${after}`;
                                                        }

                                                        // Else, break into two lines
                                                        return (
                                                            <>
                                                                {before}
                                                                <br />
                                                                ({after}
                                                            </>
                                                        );
                                                    })()}
                                                </span>

                                                {/* Mobile only */}
                                                <span className="inline sm:hidden">{cls.room}</span>
                                            </td>



                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default TeacherCard;
