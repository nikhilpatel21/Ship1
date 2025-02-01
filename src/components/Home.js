import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const cards = [
    { title: "Counter", subtitle: "Counter Increases till 3, Reset", route: "/counter" },
    { title: "Fetch Data", subtitle: "Fetching Data from given api", route: "/fetch-data" },
    { title: "Debounced Search Bar", subtitle: "0.5 sec(500ms)", route: "/search-bar" },
    { title: "React Virtualized List", subtitle: "Working.", route: "/list" },
    { title: "Drag and Drop", subtitle: " Drag Drop, Data Persist, Optimize", route: "/drag-drop" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Shipyaari Assignment</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigate(card.route)}
          >
            <h2 className="text-xl font-bold text-gray-800">{card.title}</h2>
            <p className="text-gray-600 mt-2">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}