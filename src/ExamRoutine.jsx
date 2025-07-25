import Lottie from "lottie-react";
import examLottie from "./assets/coming_soon.json";

const ExamRoutine = () => {
    return (
        <div className='mx-auto bg-[#29303d]  p-6 mt-2 rounded shadow'>
            <h2 className="text-2xl font-bold mb-4 text-center">Exam Routine Coming soon</h2>
            <Lottie animationData={examLottie} loop={true} />
        </div>
    );
};

export default ExamRoutine;