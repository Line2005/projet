const Progress = ({ value, className }) => {
    const progressValue = Math.min(Math.max(value, 0), 100); // Clamp value between 0 and 100
    return (
        <div className={`relative w-full bg-gray-200 rounded ${className}`}>
            <div
                className="absolute top-0 left-0 h-full bg-emerald-600 rounded"
                style={{ width: `${progressValue}%` }}
            ></div>
        </div>
    );
};

export default Progress;
