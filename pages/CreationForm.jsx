import React, { useState, useEffect } from "react";
import Select from "react-select";
import MealSelect from "./MealSelect";
import { useNavigate } from "react-router-dom";


// ─── MealGrid ─────────────────────────────────────────────────────────────────
const MealGrid = ({ label, name, options, form, toggleItem, customMeals, setCustomMeals, disableCustom = false }) => {

  // Is the "Custom" chip selected?
  const customSelected = !disableCustom && form[name]?.some((i) => i.value === "custom");

  // Current list of custom text entries for this meal
  const entries = customMeals[name] ?? [];

  const handleChipClick = (item) => {
    if (name === "medicalConditions" && item.value === "none") {
      setCustomMeals((prev) => ({ ...prev, [name]: [] }));
    }

    if (item.value === "custom" && !disableCustom) {
      const alreadySelected = form[name]?.some((i) => i.value === "custom");
      if (!alreadySelected) {
        // Selecting custom → add first blank entry immediately
        setCustomMeals((prev) => ({ ...prev, [name]: [...(prev[name] ?? []), ""] }));
      } else {
        // Deselecting custom → wipe all custom entries
        setCustomMeals((prev) => ({ ...prev, [name]: [] }));
      }
    }
    toggleItem(name, item);
  };

  const addEntry = () => {
    setCustomMeals((prev) => ({ ...prev, [name]: [...(prev[name] ?? []), ""] }));
  };

  const updateEntry = (index, value) => {
    setCustomMeals((prev) => {
      const updated = [...(prev[name] ?? [])];
      updated[index] = value;
      return { ...prev, [name]: updated };
    });
  };

  const removeEntry = (index) => {
    setCustomMeals((prev) => {
      const updated = (prev[name] ?? []).filter((_, i) => i !== index);
      return { ...prev, [name]: updated };
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300">{label}</p>

      {/* Option chips */}
      <div className="grid grid-cols-3 gap-2">
        {options.map((item) => {
          const selected = form[name]?.some((i) => i.value === item.value);
          return (
            <button
              type="button"
              key={item.value}
              onClick={() => handleChipClick(item)}
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

      {/* Custom text entries — only shown when "Custom" chip is active */}
      {customSelected && (
        <div className="space-y-2 mt-2">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-2 items-start">
              <textarea
                rows={2}
                placeholder={`Custom ${label} #${index + 1}`}
                value={entry}
                onChange={(e) => updateEntry(index, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {/* Remove button — always shown so user can remove any entry */}
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 text-sm mt-1 shrink-0"
              >
                −
              </button>
            </div>
          ))}

          {/* Add more custom entries */}
          <button
            type="button"
            onClick={addEntry}
            className="bg-green-600 hover:bg-green-700 transition px-4 py-1.5 rounded-lg text-sm"
          >
            + Add another custom {label}
          </button>
        </div>
      )}
    </div>
  );
};


// ─── CreationForm ─────────────────────────────────────────────────────────────
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
    earlyMorning: [],
    breakfast: [],
    lunch: [],
    brunch: [],
    dinner: [],
    bmi: 0,
    fitnessGoal: [],
    medicalConditions: [],
    instructionsSelected: [],
  });

  // One object stores ALL custom text arrays, keyed by meal name
  const [customMeals, setCustomMeals] = useState({
    earlyMorning: [],
    breakfast: [],
    lunch: [],
    brunch: [],
    dinner: [],
    fitnessGoal: [],
    medicalConditions: [],
  });

  const [instructions, setInstructions] = useState([""]);
  const navigate = useNavigate();

  // ── Options ─────────────────────────────────────────────────────────────────

  const earlyMorningOptions = [
    { value: "Warm water + ½ fresh lemon juice", label: "Warm water + ½ fresh lemon juice" },
    { value: "Soaked Fenugreek (Methi) seeds with Water", label: "Soaked Fenugreek (Methi) seeds with Water" },
    { value: "one tea spoon of apple cider vinegar with warm water", label: "one tea spoon of apple cider vinegar with warm water" },
    { value: "Papaya & Mint Infused Water", label: "Papaya & Mint Infused Water" },
    { value: "Papaya and carrot juice", label: "Papaya and carrot juice" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const breakfastOptions = [
    { value: "One bowl of boiled pulses with lemon and chopped vegetables + one teaspoon olive oil + black pepper + one bowl of dark-coloured fruits (blueberries / black grapes / cherries / strawberries / jamun / plum)", label: "One bowl of boiled pulses with lemon and chopped vegetables + one teaspoon olive oil + black pepper + one bowl of dark-coloured fruits (blueberries / black grapes / cherries / strawberries / jamun / plum)" },
    { value: "Any South Indian dish + one beetroot + one banana", label: "Any South Indian dish + one beetroot + one banana" },
    { value: "100 gram steamed broccoli + two slices of pineapple", label: "100 gram steamed broccoli + two slices of pineapple" },
    { value: "Any oats dish (oats porridge / oats chilla / oats smoothie)", label: "Any oats dish (oats porridge / oats chilla / oats smoothie)" },
    { value: "Oats + chia seeds + flax seeds + soy/almond milk", label: "Oats + chia seeds + flax seeds + soy/almond milk" },
    { value: "Besan cheela with paneer/tofu stuffing", label: "Besan cheela with paneer/tofu stuffing" },
    { value: "Smoothie (plant protein powder  + berries )", label: "Smoothie (plant protein powder  + berries )" },
    { value: "Vegetable poha + 50gms soaked mixed dry fruits", label: "Vegetable poha + 50gms soaked mixed dry fruits" },
    { value: "Soya milk/Almond milk + 20gms of mixed seeds", label: "Soya milk/Almond milk + 20gms of mixed seeds" },
    { value: "Sweet corn / Protein salad with tofu cubes / Sweet corn sandwich with tofu or panner / Oats + Peanut butter + Milk smoothie", label: "Sweet corn / Protein salad with tofu cubes / Sweet corn sandwich with tofu or panner / Oats + Peanut butter + Milk smoothie" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const lunchOptions = [
    { value: "One vegetable chilla + one big apple or one banana", label: "One vegetable chilla + one big apple or one banana" },
    { value: "One bowl steamed brown rice with boiled dal + green leafy vegetable salad with lemon", label: "One bowl steamed brown rice with boiled dal + green leafy vegetable salad with lemon" },
    { value: "Whole wheat roti with seasonal vegetables + salad + curd", label: "Whole wheat roti with seasonal vegetables + salad + curd" },
    { value: "2 multigrain roti + dal + mixed veg + salad", label: "2 multigrain roti + dal + mixed veg + salad" },
    { value: "Brown rice + rajma/chole + salad + 1 tsp olive oil", label: "Brown rice + rajma/chole + salad + 1 tsp olive oil" },
    { value: "Quinoa + chickpea salad + veggies + seeds", label: "Quinoa + chickpea salad + veggies + seeds" },
    { value: "Bajra/jowar roti + green sabzi + tofu/paneer", label: "Bajra/jowar roti + green sabzi + tofu/paneer" },
    { value: "Vegetable khichdi + curd (if allowed) + salad", label: "Vegetable khichdi + curd (if allowed) + salad" },
    { value: "Tofu/paneer stir fry + sautéed vegetables", label: "Tofu/paneer stir fry + sautéed vegetables" },
    { value: "Soya Chunk Curry + Green Salad", label: "Soya Chunk Curry + Green Salad" },
    { value: "Brown Rice + Rajma / Chole with lemon", label: "Brown Rice + Rajma / Chole with lemon" },
    { value: "Moong dal + Brown rice + Soya granuals", label: "Moong dal + Brown rice + Soya granuals" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const brunchOptions = [
    { value: "Roasted Chickpea Salad", label: "Roasted Chickpea Salad" },
    { value: "Vegan Protein Smoothie", label: "Vegan Protein Smoothie" },
    { value: "Sprouts (Moong dal + soaked peanuts + tomato + onion + lemon + Black pepper)", label: "Sprouts (Moong dal + soaked peanuts + tomato + onion + lemon + Black pepper)" },
    { value: "Oats Vegetable Upma", label: "Oats Vegetable Upma" },
    { value: "Any Seasonal Fruit", label: "Any Seasonal Fruit" },
    { value: "Vegetable sandwich", label: "Vegetable sandwich" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const dinnerOptions = [
    { value: "Tofu / soy chunks (50 gram)", label: "Tofu / soy chunks (50 gram)" },
    { value: "One bowl of sprouts (moong dal / kidney beans / chickpeas) with lemon and black pepper or 30 gram peanut sprouts", label: "One bowl of sprouts (moong dal / kidney beans / chickpeas) with lemon and black pepper or 30 gram peanut sprouts" },
    { value: "One seasonal fruit + 100 gram fruit yogurt + 20 gram mixed soaked seeds", label: "One seasonal fruit + 100 gram fruit yogurt + 20 gram mixed soaked seeds" },
    { value: "Grilled Tofu with Steamed Vegetables", label: "Grilled Tofu with Steamed Vegetables" },
    { value: "Any dish of oats (oats porridge/daliya/chella)", label: "Any dish of oats (oats porridge/daliya/chella)" },
    { value: "Brown Rice with Rajma", label: "Brown Rice with Rajma" },
    { value: "Mix vegetable soup", label: "Mix vegetable soup" },
    { value: "Grilled Vegetable sandwich", label: "Grilled Vegetable sandwich" },
    { value: "One bowl of brown rice with any dal + Lemon + green leafy salad", label: "One bowl of brown rice with any dal + Lemon + green leafy salad" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const medicalOptions = [
    { value: "joint_stiffness", label: "Joint stiffness/swelling" },
    { value: "spasms", label: "Spasms/cramps" },
    { value: "fracture", label: "Broken/fractured bones" },
    { value: "sprain", label: "Strains/sprains" },
    { value: "back_pain", label: "Back/hip pain" },
    { value: "shoulder_pain", label: "Shoulder/neck/arm/hand pain" },
    { value: "leg_pain", label: "Leg/foot pain" },
    { value: "chest_pain", label: "Chest/ribs/abdominal pain" },
    { value: "walking_problem", label: "Problems walking" },
    { value: "tmj", label: "Jaw pain/TMJ" },
    { value: "tendonitis", label: "Tendonitis" },
    { value: "bursitis", label: "Bursitis" },
    { value: "arthritis", label: "Arthritis" },
    { value: "osteoporosis", label: "Osteoporosis" },
    { value: "scoliosis", label: "Scoliosis" },
    { value: "bone_disease", label: "Bone or joint disease" },
    { value: "dizziness", label: "Dizziness" },
    { value: "breath_short", label: "Shortness of breath" },
    { value: "fainting", label: "Fainting" },
    { value: "cold_extremities", label: "Cold feet or hands" },
    { value: "cold_sweats", label: "Cold sweats" },
    { value: "swollen_ankles", label: "Swollen ankles" },
    { value: "pressure_sores", label: "Pressure sores" },
    { value: "varicose", label: "Varicose veins" },
    { value: "blood_clots", label: "Blood clots" },
    { value: "stroke", label: "Stroke" },
    { value: "heart_condition", label: "Heart condition" },
    { value: "allergies", label: "Allergies" },
    { value: "sinus", label: "Sinus problems" },
    { value: "asthma", label: "Asthma" },
    { value: "high_bp", label: "High blood pressure" },
    { value: "low_bp", label: "Low blood pressure" },
    { value: "lymphedema", label: "Lymphedema" },
    { value: "rashes", label: "Rashes" },
    { value: "skin_allergy", label: "Allergies (Skin)" },
    { value: "athletes_foot", label: "Athlete's foot" },
    { value: "warts", label: "Warts" },
    { value: "moles", label: "Moles" },
    { value: "acne", label: "Acne" },
    { value: "cosmetic_surgery", label: "Cosmetic surgery" },
    { value: "indigestion", label: "Indigestion" },
    { value: "constipation", label: "Constipation" },
    { value: "bloating", label: "Gas/Bloating" },
    { value: "diarrhea", label: "Diarrhea" },
    { value: "ibs", label: "Irritable bowel syndrome" },
    { value: "crohns", label: "Crohn's disease" },
    { value: "colitis", label: "Colitis" },
    { value: "numbness", label: "Numbness/tingling" },
    { value: "fatigue", label: "Fatigue" },
    { value: "chronic_pain", label: "Chronic pain" },
    { value: "sleep_disorder", label: "Sleep disorders" },
    { value: "paralysis", label: "Paralysis" },
    { value: "epilepsy", label: "Epilepsy" },
    { value: "multiple_sclerosis", label: "Multiple sclerosis" },
    { value: "parkinsons", label: "Parkinson's disease" },
    { value: "pregnancy", label: "Pregnancy" },
    { value: "pms", label: "PMS" },
    { value: "menopause", label: "Menopause" },
    { value: "endometriosis", label: "Endometriosis" },
    { value: "fertility", label: "Fertility concerns" },
    { value: "loss_appetite", label: "Loss of appetite" },
    { value: "depression", label: "Depression" },
    { value: "concentration", label: "Difficulty concentrating" },
    { value: "alcohol", label: "Alcohol use" },
    { value: "smoking", label: "Nicotine use" },
    { value: "caffeine", label: "Caffeine use" },
    { value: "diabetes", label: "Diabetes" },
    { value: "cancer", label: "Cancer" },
    { value: "surgeries", label: "Surgeries" },
    { value: "none", label: "None" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const fitnessGoalOptions = [
    { value: "fat_loss", label: "Fat Loss" },
    { value: "muscle_gain", label: "Muscle Gain" },
    { value: "weight_gain", label: "Weight Gain" },
    { value: "maintenance", label: "Maintenance" },
    { value: "strength", label: "Strength Training" },
    { value: "endurance", label: "Endurance" },
    { value: "general_fitness", label: "General Fitness" },
    { value: "custom", label: "Custom (Write your own)" },
  ];

  const instructionOptions = [
    { value: "drink at least 8-10 glass of water every day", label: "drink at least 8-10 glass of water every day" },
    { value: "take low sodium diet as salt accumulate water in body (water retention)", label: "take low sodium diet as salt accumulate water in body (water retention)" },
    { value: "eat healthy carbs, before two hours of exercise", label: "eat healthy carbs, before two hours of exercise" },
    { value: "avoid long gaps in meal", label: "avoid long gaps in meal" },
    { value: "strength training 5 times a week + cardio daily", label: "strength training 5 times a week + cardio daily" },
    { value: "take high fiber diet", label: "take high fiber diet" },
    { value: "Avoid processed and packed foods", label: "Avoid processed and packed foods" },
    { value: "Manage stress level", label: "Manage stress level" },
  ];

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

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleItem = (meal, item) => {
    setForm((prev) => {
      const exists = prev[meal].find((i) => i.value === item.value);
      let updated = exists
        ? prev[meal].filter((i) => i.value !== item.value)
        : [...prev[meal], item];

      if (meal === "medicalConditions") {
        if (item.value === "none") updated = [item];
        else updated = updated.filter((i) => i.value !== "none");
      }

      return { ...prev, [meal]: updated };
    });
  };

  const handleInstructionChange = (index, value) => {
    setInstructions((prev) => { const u = [...prev]; u[index] = value; return u; });
  };
  const addInstruction = () => setInstructions((prev) => [...prev, ""]);
  const removeInstruction = (index) => setInstructions((prev) => prev.filter((_, i) => i !== index));

  // ── BMR / TDEE / BMI auto-calc ───────────────────────────────────────────────

  useEffect(() => {
    const { weight, height, age, gender, workout } = form;
    if (!weight || !height || !age) return;

    const bmr = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const multiplierMap = { "1": 1.2, "3": 1.375, "5": 1.55, "7": 1.725 };
    const multiplier = multiplierMap[workout] ?? 1.2;
    const tdee = Math.round(bmr * multiplier);
    const bmi = (weight / (height / 100) ** 2).toFixed(1);

    setForm((prev) => ({ ...prev, bmi, bmr: Math.round(bmr), tdee }));
  }, [form.weight, form.height, form.age, form.gender, form.workout]);

  // ── Build final meal array ────────────────────────────────────────────────────
  // Strips the "custom" sentinel object and injects the actual typed strings.
  // Output: plain string[] — never contains the word "custom".
  const buildFinalMeal = (mealName) => {
    const selected = form[mealName] ?? [];
    const nonCustomItems = selected
      .filter((i) => i.value !== "custom")
      .map((i) => i.label ?? i.value);

    const hasCustom = selected.some((i) => i.value === "custom");
    const customTexts = hasCustom
      ? (customMeals[mealName] ?? []).map((t) => t.trim()).filter(Boolean)
      : [];

    return [...nonCustomItems, ...customTexts];
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...form,
      // Replace raw object arrays with clean string arrays
      earlyMorning: buildFinalMeal("earlyMorning"),
      breakfast: buildFinalMeal("breakfast"),
      lunch: buildFinalMeal("lunch"),
      brunch: buildFinalMeal("brunch"),
      dinner: buildFinalMeal("dinner"),
      fitnessGoal: buildFinalMeal("fitnessGoal"),
      medicalConditions: buildFinalMeal("medicalConditions"),
      instructionsSelected: form.instructionsSelected,
      instructions,
    };

    localStorage.setItem("dietData", JSON.stringify(finalData));
    navigate("/preview", { state: finalData });
  };

  // ── react-select dark styles ──────────────────────────────────────────────────

  const customSelectStyles = {
    control: (base) => ({ ...base, backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", color: "white", padding: "2px" }),
    menu: (base) => ({ ...base, backgroundColor: "#020617" }),
    singleValue: (base) => ({ ...base, color: "white" }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "#1e293b" : "#020617", color: "white", cursor: "pointer" }),
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-[20px] lg:px-[40px] py-[40px] lg:py-[80px]">

      <div className="absolute top-5 right-5">
        <button
          onClick={() => { localStorage.removeItem("isAuth"); navigate("/login"); }}
          className="bg-white/5 border border-white/10 backdrop-blur-lg text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-center tracking-wide">Diet Chart Creator</h2>

        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />

        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <input type="number" name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <Select options={genderOptions} defaultValue={genderOptions[0]}
          onChange={(s) => setForm({ ...form, gender: s.value })} styles={customSelectStyles} isSearchable={false} />

        <Select options={workoutOptions} defaultValue={workoutOptions[0]}
          onChange={(s) => setForm({ ...form, workout: s.value })} styles={customSelectStyles} />

        <div className="flex gap-5 items-center justify-between">
          <span className="whitespace-nowrap">BMR (Basal Metabolic Rate):</span>
          <input type="number" value={form.bmr} readOnly placeholder="BMR"
            className="w-[60%] bg-white/10 border border-white/10 p-2 rounded-lg text-gray-300" />
        </div>

        <div className="flex gap-5 items-center justify-between">
          <span className="whitespace-nowrap">BMI (Body Mass Index):</span>
          <input type="number" value={form.bmi} readOnly placeholder="BMI"
            className="w-[60%] bg-white/10 border border-white/10 p-2 rounded-lg text-gray-300" />
        </div>

        <div className="flex gap-5 items-center justify-between">
          <span className="whitespace-nowrap">TDEE (Total Daily Energy Expenditure):</span>
          <input type="number" value={form.tdee} readOnly placeholder="TDEE"
            className="w-[60%] bg-white/10 border border-white/10 p-2 rounded-lg text-gray-300" />
        </div>

        <MealGrid label="Fitness Goal" name="fitnessGoal" options={fitnessGoalOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Medical Conditions" name="medicalConditions" options={medicalOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Early Morning" name="earlyMorning" options={earlyMorningOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Breakfast" name="breakfast" options={breakfastOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Lunch" name="lunch" options={lunchOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Brunch" name="brunch" options={brunchOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <MealGrid label="Dinner" name="dinner" options={dinnerOptions}
          form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} />

        <div className="space-y-3">
          <MealGrid label="Special Instructions (Select)" name="instructionsSelected" options={instructionOptions}
            form={form} toggleItem={toggleItem} customMeals={customMeals} setCustomMeals={setCustomMeals} disableCustom={true} />

          {instructions.map((item, index) => (
            <div key={index} className="flex gap-2 items-center capitalize">
              <input type="text" value={item} onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Instruction ${index + 1}`}
                className="flex-1 bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {index === instructions.length - 1 && (
                <button type="button" onClick={addInstruction}
                  className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700">+</button>
              )}
              {instructions.length > 1 && (
                <button type="button" onClick={() => removeInstruction(index)}
                  className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700">−</button>
              )}
            </div>
          ))}
        </div>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium">
          Generate Diet Chart
        </button>
      </form>
    </div>
  );
};

export default CreationForm;
