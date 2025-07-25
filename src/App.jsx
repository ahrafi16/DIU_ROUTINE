// import RoutineFetcher from './RoutineFetcher';
// import { TeacherModal, TeacherSearch } from './TeacherModal';
// import logo from "../src/assets/logo.png"




// function App() {
//   return (
//     <div className="min-h-screen text-white mx-auto md:px-100">
//       <div className='flex justify-around rounded items-center p-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
//         <img className='w-15' src={logo} alt="" />
//         <div>
//           <h1 className='text-4xl font-bold'>DIU Class Routine</h1>
//           <p className='text-center'>Department of CSE</p>
//         </div>
//         <h2>AHR</h2>
//       </div>
//       <RoutineFetcher />
//       <TeacherSearch />
//     </div>
//   )
// }

// export default App




import { useState } from 'react';
import RoutineFetcher from './RoutineFetcher';
import { TeacherSearch } from './TeacherModal';
import logo from "../src/assets/logo.png";
import EmptyRoom from './EmptyRoom';
import ExamRoutine from './ExamRoutine';
import { SlCalender } from "react-icons/sl";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { LuCalendarCheck } from "react-icons/lu";

function App() {
  const [activeSection, setActiveSection] = useState('routine');

  const renderSection = () => {
    if (activeSection === 'routine') return <RoutineFetcher />;
    if (activeSection === 'teacher') return <TeacherSearch />;
    if (activeSection === 'empty') return <EmptyRoom />;
    if (activeSection === 'examroutine') return <ExamRoutine />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1c23] text-white mx-auto md:px-70">
      {/* Topbar (Desktop only) */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="flex items-center space-x-3">
          <img src={logo} className="w-10" alt="Logo" />
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">DIU Class Routine</h1>
        </div>
        <p className="text-lg font-bold text-center sm:text-right">Department of CSE</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar (Desktop only) */}
        <div className="hidden md:block w-64 flex-shrink-0 bg-[#29303d] p-6 space-y-4">
          <button
            onClick={() => setActiveSection('routine')}
            className={`w-full text-left px-4 py-2 rounded cursor-pointer hover:bg-indigo-600 ${activeSection === 'routine' ? 'bg-indigo-700 font-semibold' : ''
              }`}
          >
            Routine
          </button>
          <button
            onClick={() => setActiveSection('teacher')}
            className={`w-full text-left px-4 py-2 rounded cursor-pointer hover:bg-purple-600 ${activeSection === 'teacher' ? 'bg-purple-700 font-semibold' : ''
              }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setActiveSection('empty')}
            className={`w-full text-left px-4 py-2 rounded cursor-pointer hover:bg-pink-600 ${activeSection === 'empty' ? 'bg-pink-700 font-semibold' : ''
              }`}
          >
            Empty Room
          </button>
          <button
            onClick={() => setActiveSection('examroutine')}
            className={`w-full text-left px-4 py-2 rounded cursor-pointer hover:bg-orange-600 ${activeSection === 'examroutine' ? 'bg-orange-700 font-semibold' : ''
              }`}
          >
            Exam Routine
          </button>
        </div>

        {/* Main Content (desktop) */}
        <div className="flex-1 pt-4 pl-4 hidden md:block overflow-auto">
          {renderSection()}
        </div>

        {/* Bottom Nav + Content (Mobile only) */}
        <div className="md:hidden flex flex-col w-full">
          {/* Section content */}
          <div className="flex-1 overflow-y-auto p-3">{renderSection()}</div>

          {/* Bottom Nav */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#2b2f3a]/80 text-white shadow-lg flex justify-around gap-1 items-center h-14 md:hidden">
            <button
              onClick={() => setActiveSection('routine')}
              className={`flex-1 text-center rounded-2xl py-2 flex flex-col gap-1 items-center justify-center  text-sm font-medium transition ${activeSection === 'routine' ? 'bg-indigo-600 font-semibold' : 'hover:bg-[#3b3f4a]'
                }`}
            >
              <SlCalender className='text-xl' />
              <span className='text-xs'>Routine</span>
            </button>
            <button
              onClick={() => setActiveSection('teacher')}
              className={`flex-1 text-center rounded-2xl py-2 flex flex-col gap-1 items-center justify-center  text-sm font-medium transition ${activeSection === 'teacher' ? 'bg-purple-600 font-semibold' : 'hover:bg-[#3b3f4a]'
                }`}
            >
              <LiaChalkboardTeacherSolid className='text-xl' />
              <span className='text-xs'>Teacher</span>
            </button>
            <button
              onClick={() => setActiveSection('empty')}
              className={`flex-1 text-center rounded-2xl py-2 flex flex-col gap-1 items-center justify-center text-sm font-medium transition ${activeSection === 'empty' ? 'bg-pink-600 font-semibold' : 'hover:bg-[#3b3f4a]'
                }`}
            >
              <MdOutlineMeetingRoom className='text-xl' />
              <span className='text-xs'>Empty Room</span>
            </button>
            <button
              onClick={() => setActiveSection('examroutine')}
              className={`flex-1 text-center rounded-2xl py-2 flex flex-col gap-1 items-center justify-center  text-sm font-medium transition ${activeSection === 'examroutine' ? 'bg-orange-600 font-semibold' : 'hover:bg-[#3b3f4a]'
                }`}
            >
              <LuCalendarCheck className='text-xl' />
              <span className='text-xs'>Exam Routine</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
