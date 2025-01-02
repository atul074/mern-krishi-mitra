function ProductFilter({ filters, handleFilter }) {
    const filterOptions = {
      category: [
        { id: "PLANT GROWTH REGULATOR", label: "PLANT GROWTH REGULATOR" },
        { id: "BIO STIMULATES", label: "BIO STIMULATES" },
        { id: "FUNGICIDES", label: "FUNGICIDES" },
        { id: "SPREADER & ACTIVATOR", label: "SPREADER & ACTIVATOR" },
        { id: "INSECTICIDES", label: "INSECTICIDES" },
        { id: "FERTILIZER", label: "FERTILIZER" },
        { id: "PLANT NUTRITION", label: "PLANT NUTRITION" },
        { id: "GROWTH NUTRIENT", label: "GROWTH NUTRIENT" },
        { id: "BIOPESTICIDES", label: "BIOPESTICIDES" },
        { id: "AGI EQUIPMENTS", label: "AGI EQUIPMENTS" },
        { id: "HERBECIDES", label: "HERBECIDES" },
        { id: "RODENTICIDE", label: "RODENTICIDE" },
        { id: "PLANT CARE", label: "PLANT CARE" },
        { id: "SEEDS", label: "SEEDS" },
        { id: "GARDENING", label: "GARDENING" },
      ],
    };
    
  
    return (
      <div className="bg-gray-300 rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <hr className="border-gray-600" />
        <div className="p-4 space-y-4">
          {Object.keys(filterOptions).map((keyItem, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold mb-2">{keyItem}</h3>
              <hr className="border-gray-400" />
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-7 w-4 text-red-600 border-gray-800 rounded"
                      checked={
                        filters &&
                        filters[keyItem] &&
                        filters[keyItem].includes(option.id)
                      }
                      onChange={() => handleFilter(keyItem, option.id)}
                    />
                    <span className="text-sm text-gray-800">{option.label}</span>
                  </label>
                ))}
              </div>
              {index < Object.keys(filterOptions).length - 1 && (
                <hr className="my-4 border-gray-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default ProductFilter;
  