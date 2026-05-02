
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const Preview = () => {
  const location = useLocation();
  const pdfRef = useRef();
  const [isLight, setIsLight] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const data =
    location.state ||
    JSON.parse(localStorage.getItem("dietData"));

  console.log('data', data)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No data found
      </div>
    );
  }

  const getItemText = (item) =>
    typeof item === "string"
      ? item
      : item?.label || item?.value || "";

  const renderMeal = (title, items) => (
    <div
      className={`rounded-xl p-5 ${isLight
          ? "bg-white border border-gray-200 text-black"
          : "bg-gray-800 border-gray-700 text-gray-300"
        }`}
    >
      <h3 className="text-2xl font-semibold mb-3 w-fit bg-gradient-to-r from-[#ff4f03] to-[#4505d9] bg-clip-text text-transparent">
        {title}{" "}
        <span className="text-gray-600 text-lg">
          (Choose anyone as per your taste and availability)
        </span>
      </h3>

      <ul className="space-y-2">
        {items?.map((item, i) => {
          // ✅ handle both object + string
          const value = getItemText(item);

          if (!value) return null;

          return (
            <li key={i} className="flex items-start gap-4 text-lg">
              <div className="flex items-start justify-center w-fit h-fit p-2">
                <span className="w-3 h-3 bg-gradient-to-r from-[#d7ff78] to-[#4505d9] rounded-full"></span>
              </div>
              <span className="capitalize">{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );


  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const dataUrl = await toPng(pdfRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        // backgroundColor: "#ffffff", 
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(dataUrl);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 🔥 ADD MARGIN HERE
      const margin = 10; // mm (left & right space)

      const usableWidth = pdfWidth
      const usableHeight = pdfHeight - margin * 2;

      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = usableWidth / usableHeight;

      let finalWidth, finalHeight;

      if (imgRatio > pdfRatio) {
        finalWidth = usableWidth;
        finalHeight = usableWidth / imgRatio;
      } else {
        finalHeight = usableHeight;
        finalWidth = usableHeight * imgRatio;
      }

      // 🔥 CENTER WITH MARGIN
      const x = (pdfWidth - finalWidth) / 2;
      const y = margin; // top margin

      pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
      pdf.save("diet-chart.pdf");

    } catch (err) {
      console.error("PDF error:", err);
    }
  };



  return (
    <div className={`relative  min-h-screen border font-sans  w-full mx-auto  text-white px-[20px] py-[20px] lg:px-[96px] lg:py-[60px] bg-white text-black`}>

      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={() => {
            localStorage.removeItem("isAuth");
            navigate("/login");
          }}
          className="bg-white/5 border border-white/10 backdrop-blur-lg cursor-pointer
               text-black px-4 py-2 rounded-lg 
               hover:bg-white/10 transition"
        >
          Logout
        </button>
      </div>


      <div
        ref={pdfRef}
        className={` mx-auto space-y-10 ${isLight ? "bg-white text-black" : "bg-gray-900"
          }`}
      >
        <div className="flex justify-between items-center">

          <img src="./logo.jpg" alt="" className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] border-4 border-dashed border-gray-300 rounded-full" />
          <img src="./moto.jpeg" alt="" className="aspect-auto h-[100px] lg:h-[150px] border-4 border-dashed border-gray-300 rounded-full" />

        </div>
        {/* Header */}
        <div
          className={`rounded-2xl p-6  ${isLight
            ? "bg-white border-gray-300 text-black"
            : "bg-gray-800  border-gray-700 "
            }`}
        >
          <h1
            className={`w-fit mx-auto text-5xl font-bold mb-20 text-center bg-gradient-to-r from-[#ff4f03]  to-[#4505d9] bg-clip-text text-transparent
              `}
          >
            Personal Information
          </h1>

          <div
            className={`grid md:grid-cols-3 gap-4 text-lg text-black text-center`}
          >
            <p><strong>Name:</strong> <span className="text-black">{data.name}</span></p>
            <p><strong>Age:</strong> <span className="text-black">{data.age}</span></p>
            <p><strong>Weight:</strong> <span className="text-black">{data.weight} kg</span></p>
            <p><strong>Height:</strong> <span className="text-black">{data.height} cm</span></p>
            <p className="capitalize"><strong>Gender:</strong> <span className="text-black">{data.gender} </span></p>
            <p><strong>Workout:</strong> <span className="text-black">{data.workout} days/week</span></p>
            <p><strong>BMR:</strong> <span className="text-black">{data.bmr}</span></p>
            <p><strong>BMI:</strong> <span className="text-black">{data.bmi}</span></p>
            {data.tdee && <p><strong>TDEE:</strong> <span className="text-black">{data.tdee}</span></p>}
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 border border-gray-200 shadow-lg rounded-2xl">
          <h1 className="text-xl font-bold text-center mb-4">
            BMI Classification
          </h1>

          <div className="divide-y text-lg">
            {[
              { range: "Below 18.5", label: "Underweight" },
              { range: "18.5 - 24.9", label: "Normal" },
              { range: "25.0 - 29.9", label: "Overweight" },
              { range: "30.0 - 34.9", label: "Obese - Class I" },
              { range: "35.0 - 39.9", label: "Obese - Class II" },
              { range: "40 and above", label: "Severe Obesity" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-2 "
              >
                <span className="">{item.range}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {data.fitnessGoal?.length > 0 && (
          <div className="border-gray-300 rounded-xl p-4">
            <h3 className="text-xl font-bold mb-3">
              Fitness Goal - <span className="font-normal">{data.fitnessGoal.map(getItemText).filter(Boolean).join(", ")}</span>
            </h3>
          </div>
        )}

        {data.medicalConditions?.length > 0 && (
          <div
            className={`rounded-xl p-4 mb-20 ${isLight
              ? " text-black"
              : "bg-gray-800 border border-gray-700 text-gray-300"
              }`}
          >
            <h3 className="text-xl font-semibold mb-3">
              Medical Conditions
            </h3>

            <ul className="space-y-1">
              {data.medicalConditions.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-lg">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {getItemText(item)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* <div className="border border-blue-600"></div> */}

        <h1 className="w-fit mx-auto text-5xl font-bold mb-10 text-center bg-gradient-to-r from-[#ff4f03]  to-[#4505d9] bg-clip-text text-transparent">
          Customised Diet Plan
        </h1>

        {/* Meals */}
        <div className="grid grid-cols-1 gap-6">
          {renderMeal("Early Morning (Detox Drink)", data.earlyMorning)}
          {renderMeal("Breakfast", data.breakfast)}
          {renderMeal("Lunch", data.lunch)}
          {renderMeal("Evening Brunch", data.brunch)}
          {renderMeal("Dinner", data.dinner)}
        </div>




        {(
          data.instructions?.filter(i => i.trim() !== "").length > 0 ||
          data.instructionsSelected?.length > 0
        ) && (
            <div
              className={`rounded-xl p-4 ${isLight
                ? "bg-gray-100 border border-gray-300 text-black"
                : "bg-gray-800 border border-gray-700 text-gray-300"
                }`}
            >
              <h3 className="text-2xl font-semibold mb-3 w-fit text-blue-600">
                Special Instructions
              </h3>

              <ul className="space-y-1">

                {/* ✅ Selected predefined instructions */}
                {data.instructionsSelected?.map((item, i) => (
                  <li key={`sel-${i}`} className="flex items-center gap-4 capitalize text-lg">
                    <span className="w-3 h-3 bg-gradient-to-r from-[#d7ff78]  to-[#4505d9] rounded-full"></span>
                    {item.label}
                  </li>
                ))}

                {/* ✅ Custom typed instructions */}
                {data.instructions
                  ?.filter((i) => i.trim() !== "")
                  .map((item, i) => (
                    <li key={`custom-${i}`} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-[#d7ff78]  to-[#4505d9] rounded-full"></span>
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          )}



        <footer className="border-2 border-gray-300 border-dashed p-4 text-xl rounded-lg italic font-semibold text-gray-700 mt-20 flex flex-col justify-end gap-5 bg-white">
          <div>Expertly designed by Jitender Chawla — Certified Fitness Trainer & Certified Nutritionist.</div>
          <div>Contact No- +919990156329</div>
          <div>Email- jitender71chawla@gmail.com</div>
        </footer>
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

