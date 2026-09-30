import "./CategoryFilter.css";

export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <div className="category-filter-group">
      <button
        type="button"
        className={`category-pill ${value === "" ? "category-pill--active" : ""}`}
        onClick={() => onChange("")}
      >
        All categories
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          className={`category-pill ${value === c ? "category-pill--active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}

      {/* Fallback hidden or mobile native selector for accessibility */}
      <select
        className="category-filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
