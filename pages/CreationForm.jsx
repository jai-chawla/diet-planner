import React, { useState, useEffect } from "react";
import Select from "react-select";
import MealSelect from "./MealSelect";
import { useNavigate } from "react-router-dom";


const MealGrid = ({
  label,
  name,
  options,
  form,
  toggleItem,
  breakfastCustom,
  lunchCustom,
  dinnerCustom,
  setBreakfastCustom,
  setLunchCustom,
  setDinnerCustom,
}) => {
  const hasCustom = form[name]?.some((i) => i.value === "custom");

  const customValue =
    name === "breakfast"
      ? breakfastCustom
      : name === "lunch"
        ? lunchCustom
        : dinnerCustom;

  const setCustomValue =
    name === "breakfast"
      ? setBreakfastCustom
      : name === "lunch"
        ? setLunchCustom
        : setDinnerCustom;

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300">{label}</p>

      <div className="grid grid-cols-3 gap-2">
        {options.map((item) => {
          const selected = form[name]?.some(
            (i) => i.value === item.value
          );

          return (
            <button
              type="button"
              key={item.value}
              onClick={() => toggleItem(name, item)}
              className={`p-2 rounded-lg text-sm border transition 
                ${selected
                  ? "bg-blue-600 border-blue-500"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {hasCustom && (
        <textarea
          placeholder={`Enter custom ${label}`}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};


const CreationForm = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "male",
    workout: "1",
    bmr: 0,
    tdee: 0,
    breakfast: [],
    lunch: [],
    dinner: []
  });

  const [breakfastCustom, setBreakfastCustom] = useState("")
  const [lunchCustom, setLunchCustom] = useState("")
  const [dinnerCustom, setDinnerCustom] = useState("")
  const [instructions, setInstructions] = useState([""]);
  const navigate = useNavigate();

  console.log('form', form)


  const breakfastOptions = [
  { value: "oats", label: "Oats" },
  { value: "eggs", label: "Eggs" },
  { value: "milk", label: "Milk" },
  { value: "banana", label: "Banana" },
  { value: "peanut_butter", label: "Peanut Butter" },
  { value: "toast", label: "Brown Bread Toast" },
  { value: "smoothie", label: "Protein Smoothie" },
  { value: "poha", label: "Poha" },
  { value: "upma", label: "Upma" },
  { value: "idli", label: "Idli" },
  { value: "custom", label: "Custom (Write your own)" },
];

const lunchOptions = [
  { value: "rice", label: "Rice" },
  { value: "roti", label: "Roti" },
  { value: "dal", label: "Dal" },
  { value: "chicken", label: "Chicken Curry" },
  { value: "paneer", label: "Paneer" },
  { value: "sabzi", label: "Vegetable Sabzi" },
  { value: "curd", label: "Curd" },
  { value: "salad", label: "Salad" },
  { value: "rajma", label: "Rajma" },
  { value: "chole", label: "Chole" },
  { value: "custom", label: "Custom (Write your own)" },
];

const dinnerOptions = [
  { value: "roti", label: "Roti" },
  { value: "dal", label: "Dal" },
  { value: "paneer", label: "Paneer" },
  { value: "chicken", label: "Grilled Chicken" },
  { value: "soup", label: "Soup" },
  { value: "salad", label: "Salad" },
  { value: "khichdi", label: "Khichdi" },
  { value: "vegetables", label: "Boiled Vegetables" },
  { value: "egg_white", label: "Egg Whites" },
  { value: "fish", label: "Fish" },
  { value: "custom", label: "Custom (Write your own)" },
];

  // Dropdown options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const workoutOptions = [
    { value: "1", label: "1 day/week" },
    { value: "3", label: "3 days/week" },
    { value: "5", label: "5 days/week" },
    { value: "7", label: "Daily" },
  ];


  const handleInstructionChange = (index, value) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // add new field
  const addInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  // remove field (optional but recommended)
  const removeInstruction = (index) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleItem = (meal, item) => {
    setForm((prev) => {
      const exists = prev[meal].find((i) => i.value === item.value);

      let updated;

      if (exists) {
        updated = prev[meal].filter((i) => i.value !== item.value);
      } else {
        updated = [...prev[meal], item];
      }

      return {
        ...prev,
        [meal]: updated,
      };
    });
  };






  // Dark theme styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#020617",
      borderColor: "rgba(255,255,255,0.1)",
      color: "white",
      padding: "2px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#020617",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#1e293b" : "#020617",
      color: "white",
      cursor: "pointer",
    }),
  };

  // Handle normal inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto BMR calculation
  useEffect(() => {
    const { weight, height, age, gender, workout } = form;

    if (weight && height && age) {
      let bmr =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

      let multiplier = 1.2;

      if (workout === "3") multiplier = 1.375;
      if (workout === "5") multiplier = 1.55;
      if (workout === "7") multiplier = 1.725;

      const tdee = Math.round(bmr * multiplier);

      setForm((prev) => ({
        ...prev,
        bmr: Math.round(bmr),
        tdee,
      }));
    }
  }, [form.weight, form.height, form.age, form.gender, form.workout]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...form,
      breakfastCustom,
      lunchCustom,
      dinnerCustom,
      instructions,
    };

    // ✅ store in localStorage
    localStorage.setItem("dietData", JSON.stringify(finalData));

    // ✅ navigate with state
    navigate("/preview", { state: finalData });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-[20px] lg:px-[40px] py-[40px] lg:py-[80px]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-center tracking-wide">
          Diet Chart Creator
        </h2>

        {/* Basic Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={form.height}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* React Select - Gender */}
        <Select
          options={genderOptions}
          defaultValue={genderOptions[0]}
          onChange={(selected) =>
            setForm({ ...form, gender: selected.value })
          }
          styles={customStyles}
          isSearchable={false}
        />

        {/* React Select - Workout */}
        <Select
          options={workoutOptions}
          defaultValue={workoutOptions[0]}
          onChange={(selected) =>
            setForm({ ...form, workout: selected.value })
          }
          styles={customStyles}
        />

        {/* BMR */}
        <div className="flex gap-5 items-center justify-between">
          <span className="whitespace-nowrap">
            BMR (Basal Metabolic Rate):
          </span>
          <input
            type="number"
            value={form.bmr}
            readOnly
            placeholder="BMR"
            className="w-[60%] bg-white/10 border border-white/10 p-2 rounded-lg text-gray-300"
          />
        </div>
        
        <div className="flex gap-5 items-center justify-between">
          <span className="whitespace-nowrap">TDEE (Total Daily Energy Expenditure):</span>
          <input
            type="number"
            value={form.tdee}
            readOnly
          placeholder="TDEE"
          className="w-[60%] bg-white/10 border border-white/10 p-2 rounded-lg text-gray-300"
        />
        </div>

        {/* Meals */}
        <MealGrid
          label="Breakfast"
          name="breakfast"
          options={breakfastOptions}
          form={form}
          toggleItem={toggleItem}
          breakfastCustom={breakfastCustom}
          lunchCustom={lunchCustom}
          dinnerCustom={dinnerCustom}
          setBreakfastCustom={setBreakfastCustom}
          setLunchCustom={setLunchCustom}
          setDinnerCustom={setDinnerCustom}
        />
        <MealGrid
          label="Lunch"
          name="lunch"
           options={lunchOptions}
          form={form}
          toggleItem={toggleItem}
          breakfastCustom={breakfastCustom}
          lunchCustom={lunchCustom}
          dinnerCustom={dinnerCustom}
          setBreakfastCustom={setBreakfastCustom}
          setLunchCustom={setLunchCustom}
          setDinnerCustom={setDinnerCustom}
        />
        <MealGrid
          label="Dinner"
          name="dinner"
          options={dinnerOptions}
          form={form}
          toggleItem={toggleItem}
          breakfastCustom={breakfastCustom}
          lunchCustom={lunchCustom}
          dinnerCustom={dinnerCustom}
          setBreakfastCustom={setBreakfastCustom}
          setLunchCustom={setLunchCustom}
          setDinnerCustom={setDinnerCustom}
        />


        <div className="space-y-3">
  <p className="text-sm text-gray-300">Special Instructions</p>

          {instructions.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleInstructionChange(index, e.target.value)
                }
                placeholder={`Instruction ${index + 1}`}
                className="flex-1 bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* ➕ Add button (only on last field) */}
              {index === instructions.length - 1 && (
                <button
                  type="button"
                  onClick={addInstruction}
                  className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  +
                </button>
              )}

              {/* ❌ Remove button (if more than 1 field) */}
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  −
                </button>
              )}
            </div>
          ))}
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium"
        >
          Generate Diet Chart
        </button>
      </form>
    </div>
  );
};

export default CreationForm;