'use client'

export const FilterSidebar = () => {
  return (
    <aside className="w-full lg:w-1/4 p-6 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Category</label>
          <select className="w-full border rounded-md p-2">
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Price Range</label>
          <input type="range" className="w-full" min="0" max="1000" />
        </div>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Apply Filters
        </button>
      </form>
    </aside>
  );
};
