/* eslint-disable react/prop-types */

const ShopFilter = ({ filters, filterState, setFilterState, clearFilters }) => {
    return (
      <>
        <div className="space-y-5 flex-shrink-0">
          <div className="flex flex-col space-y-3">
            <h4 className="font-medium text-lg">category</h4>
            <hr />
            {
              filters.categories.map((category) => {
                return (
                  <label key={category} className="flex captilize cursor-pointer">
                    <input
                      type='radio'
                      name="category"
                      value={category}
                      checked={filterState.category === category}
                      onChange={(e) => setFilterState({ ...filterState, category: e.target.value })}
                    />
                    <span className="ml-1">{category}</span>
                  </label>
                );
              })
            }
          </div>
        </div>
        <div className="flex flex-col space-y-3 mt-2">
            <h4 className="font-medium text-lg">colors</h4>
            <hr />
            {
              filters.colors.map((color) => {
                return (
                  <label key={color} className="flex captilize cursor-pointer">
                    <input
                      type='radio'
                      name="color"
                      value={color}
                      checked={filterState.color === color}
                      onChange={(e) => setFilterState({ ...filterState, color: e.target.value })}
                    />
                    <span className="ml-1">{color}</span>
                  </label>
                );
              })
            }

            
          
        </div>
        <button className="bg-primary py-1 px-4 text-white rounded " onClick={clearFilters}>clear all</button>
      </>
    );
  };
  
  export default ShopFilter;
  