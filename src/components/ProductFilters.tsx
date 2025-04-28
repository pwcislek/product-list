import styles from './ProductFilters.module.css';

export interface Filters {
  name: string;
  priceRange: [number, number];
  availabilityRange: [number, number];
}

interface ProductFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  defaultFilters: Filters;
}

export default function ProductFilters({ filters, onChange, defaultFilters }: ProductFiltersProps) {
  const isFiltered =
    filters.name !== defaultFilters.name ||
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1] ||
    filters.availabilityRange[0] !== defaultFilters.availabilityRange[0] ||
    filters.availabilityRange[1] !== defaultFilters.availabilityRange[1];

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <p>Nazwa</p>
        <input
          type="text"
          placeholder="Wyszukaj po nazwie"
          className={styles.input}
          value={filters.name}
          onChange={(e) => onChange({ ...filters, name: e.target.value })}
        />
      </div>
      <div className={styles.filter}>
        <p>Cena</p>
        <div className={styles.inputContainer}>
          <input
            type="number"
            placeholder="Od"
            className={styles.input}
            value={filters.priceRange[0]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Do"
            className={styles.input}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
          />
        </div>
      </div>
      <div className={styles.filter}>
        <p>Dostępność</p>
        <div className={styles.inputContainer}>
          <input
            type="number"
            placeholder="Od"
            className={styles.input}
            value={filters.availabilityRange[0]}
            onChange={(e) =>
              onChange({
                ...filters,
                availabilityRange: [Number(e.target.value), filters.availabilityRange[1]],
              })
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Do"
            className={styles.input}
            value={filters.availabilityRange[1]}
            onChange={(e) =>
              onChange({
                ...filters,
                availabilityRange: [filters.availabilityRange[0], Number(e.target.value)],
              })
            }
          />
        </div>
      </div>
      {isFiltered && (
        <div className={styles.resetFilters}>
          <p>&nbsp;</p>
          <button className={styles.button} onClick={() => onChange(defaultFilters)}>
            Resetuj filtry
          </button>
        </div>
      )}
    </div>
  );
}
