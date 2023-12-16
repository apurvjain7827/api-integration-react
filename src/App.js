import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatteryData } from "./Reducer/batterySlice";

function App() {
  const dispatch = useDispatch();
  const batteryData = useSelector((state) => state.battery.batteryData);
  const loading = useSelector((state) => state.battery.loading);
  const error = useSelector((state) => state.battery.error);
  const [displayData, setDisplayData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  useEffect(() => {
    if (!batteryData.length) {
      dispatch(fetchBatteryData());
    }
  }, [dispatch, batteryData]);

  useEffect(() => {
    setDisplayData([...batteryData]);
  }, [batteryData]);

  useEffect(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setDisplayData(batteryData.slice(start, end));
  }, [batteryData, currentPage]);

  const totalPages = Math.ceil(batteryData.length / rowsPerPage);

  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
    setCurrentPage(1);
    if (inputValue.trim() === "") {
      setDisplayData([...batteryData.slice(0, rowsPerPage)]);
    } else {
      const filteredData = batteryData.filter(
        (battery) => battery.id === parseInt(inputValue.trim())
      );
      setDisplayData([...filteredData.slice(0, rowsPerPage)]);
    }
  };

  return (
    <div style={{ backgroundColor: "#303031", minHeight: "100vh", color: "white" }}>
      <div className="flex justify-center"  style={{ backgroundColor: "#1e1e1e", padding: "10px" }}>
        <input
          type="text"
          placeholder="Search by ID"
          value={searchValue}
          onChange={handleSearch}
          style={{ backgroundColor: "#1e1e1e", color: "white", padding: "5px" }}
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          <p className="ml-2">Loading...</p>
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="flex justify-center flex-col items-center">
          <br></br>
          <table className="border-collapse border border-slate-400"  style={{ backgroundColor: "#1e1e1e" }}>
            {/* Table Headers */}
            {/* Table Body */}
             <thead>
               <tr>
                 <th class="w-64 border border-slate-300">BATTERY ID</th>
                 <th class="w-1/4 border border-slate-300">SOC</th>
                 <th class="w-1/4 border border-slate-300">IMEI</th>
                 <th class="w-1/4 border border-slate-300">CURRENT OWNER | ID</th>
               </tr>
             </thead>
             <tbody>
               {displayData.map((battery, index) => (
                <tr key={battery.id} style={{ backgroundColor: index % 2 === 0 ? "#2d2d30" : "#252526" }}>
                  <td class="border border-slate-300 text-center align-middle">{battery.id}</td>
                  <td class="border border-slate-300 text-center align-middle">{battery.soc}</td>
                  <td class="border border-slate-300 text-center align-middle">{battery.imei}</td>
                  <td class="border border-slate-300 text-center align-middle">{battery.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4" >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 mx-1 border border-gray-400 rounded"
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 mx-1 border border-gray-400 rounded ${
                  currentPage === index + 1 ? "bg-gray-300" : ""
                }`}
                style={{ backgroundColor: "#1e1e1e", color: "white" }}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 mx-1 border border-gray-400 rounded"
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

