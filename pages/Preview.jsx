
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const Preview = () => {
  const location = useLocation();
  const pdfRef = useRef();
  const [isLight, setIsLight] = useState(true);
  const [loading, setLoading] = useState(false);

  const data =
    location.state ||
    JSON.parse(localStorage.getItem("dietData"));

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No data found
      </div>
    );
  }

  const renderMeal = (title, items, custom) => (
    <div
      className={`rounded-xl p-4 ${
        isLight
          ? "bg-gray-100 border border-gray-300 text-black"
          : "bg-gray-800  border-gray-700 text-gray-300 "
      }`}
    >
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <ul className="space-y-1">
        {items?.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {item.label}
          </li>
        ))}

        {custom && (
          <li className="flex items-center gap-2 text-blue-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {custom}
          </li>
        )}
      </ul>
    </div>
  );

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsLight(true);
    try {
      const dataUrl = await toPng(pdfRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff", // IMPORTANT
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(dataUrl);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate ratio
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let finalWidth, finalHeight;

      if (imgRatio > pdfRatio) {
        // Image is wider → fit width
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgRatio;
      } else {
        // Image is taller → fit height
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * imgRatio;
      }

      // CENTERING (this fixes your issue)
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
      pdf.save("diet-chart.pdf");

    } catch (err) {
      console.error("PDF error:", err);
    }
  };

  return (
    <div className={`min-h-screen w-[800px] mx-auto  text-white p-6 ${isLight?"bg-white text-black":"bg-[#0f172a]"}`}>
      <div
        ref={pdfRef}
        className={` mx-auto space-y-6  ${isLight ? "bg-white text-black" : "bg-gray-900"
          }`}
      >
        {/* Header */}
        <div
          className={`rounded-2xl p-6 ${
            isLight
              ? "bg-gray-100  border-gray-300 text-black"
              : "bg-gray-800  border-gray-700 "
          }`}
        >
          <h1 className="text-3xl font-bold mb-10 text-center">
            Personalized Diet Chart
          </h1>

          <div
            className={`grid md:grid-cols-3 gap-4 text-sm ${
              isLight ? "text-gray-700" : "text-gray-300"
            }`}
          >
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Age:</strong> {data.age}</p>
            <p><strong>Weight:</strong> {data.weight} kg</p>
            <p><strong>Height:</strong> {data.height} cm</p>
            <p><strong>Workout:</strong> {data.workout} days/week</p>
            <p><strong>BMR:</strong> {data.bmr}</p>
            {data.tdee && <p><strong>TDEE:</strong> {data.tdee}</p>}
          </div>
        </div>

        {/* Meals */}
        <div className="grid md:grid-cols-3 gap-4">
          {renderMeal("Breakfast", data.breakfast, data.breakfastCustom)}
          {renderMeal("Lunch", data.lunch, data.lunchCustom)}
          {renderMeal("Dinner", data.dinner, data.dinnerCustom)}
        </div>

        {/* Instructions */}
        {data.instructions?.filter(i => i.trim() !== "").length > 0 && (
          <div
            className={`rounded-xl p-4 ${
              isLight
                ? "bg-gray-100 border border-gray-300 text-black"
                : "bg-gray-800 border border-gray-700 text-gray-300 "
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">
              Special Instructions
            </h3>

            <ul className="space-y-1">
              {data.instructions
                .filter((i) => i.trim() !== "")
                .map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6 no-print">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>



      </div>
    </div>
  );
};

export default Preview;

