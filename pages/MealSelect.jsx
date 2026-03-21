const MealSelect = ({ label, name, options, setForm }) => {
  const hasCustom = form[name]?.some((i) => i.value === "custom");

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-300">{label}</p>

      <Select
        isMulti
        options={options}
        value={form[name]}
        onChange={(selected) =>
          setForm({ ...form, [name]: selected || [] })
        }
        styles={customStyles}
        placeholder={`Select ${label}`}
      />

      {hasCustom && (
        <textarea
          placeholder={`Enter custom ${label}`}
          value={form[`${name}_custom`] || ""}
          onChange={(e) =>
            setForm({
              ...form,
              [`${name}_custom`]: e.target.value,
            })
          }
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default MealSelect