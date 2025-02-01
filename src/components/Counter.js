import React from "react";

export default function Counter() {

  const [count, setCount] = React.useState(0);
  
  function handleIncrement() {
    if (count < 3) {
      setCount((count)=>count + 1);
    }
  };


  function handleReset() {
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-gray-300 rounded-xl w-60 m-5 bg-gray-50">
      <p className="text-xl font-bold">Counter: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={handleIncrement}
          disabled={count === 3}
          className={`px-4 py-2 text-white font-semibold rounded-md transition-colors duration-300 ${
            count === 3
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {count < 3 ? "Increment" : "Max Reached"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
