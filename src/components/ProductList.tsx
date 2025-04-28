import { useEffect, useState } from 'react';
import type { Product } from '../../types/product';
import { getPokeData } from '../../lib/mock-data';
import ProductTable from './ProductTable';
import ProductFilters, { Filters } from './ProductFilters';
import styles from './ProductList.module.css';

const defaultFilters: Filters = {
  name: '',
  priceRange: [0, 1000],
  availabilityRange: [0, 1000],
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending',
  });

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = getPokeData();
      setProducts(data);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredProducts = products
    .filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(filters.name.toLowerCase());
      const priceMatch =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const availabilityMatch =
        product.availability >= filters.availabilityRange[0] &&
        product.availability <= filters.availabilityRange[1];

      return nameMatch && priceMatch && availabilityMatch;
    })
    .sort((a, b) => {
      if (!sortConfig.key) {
        return 0;
      }
      if (sortConfig.direction === 'ascending') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProducts(products.filter((product) => product.id !== id));
    setIsLoading(false);
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key
          ? prev.direction === 'ascending'
            ? 'descending'
            : 'ascending'
          : 'ascending';
      return { key, direction };
    });
  };

  const handleEdit = async (product: Product) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
    setIsLoading(false);
  };

  const handleRowSelect = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedRows(isSelected ? filteredProducts.map((product) => product.id) : []);
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć zaznaczone produkty?')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProducts(products.filter((product) => !selectedRows.includes(product.id)));
      setSelectedRows([]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProductFilters
        filters={filters}
        onChange={handleFiltersChange}
        defaultFilters={defaultFilters}
      />
      <div className={styles.info}>
        <p>Liczba produktów: {filteredProducts.length}</p>
        {selectedRows.length > 0 && (
          <p>
            Zaznaczono: {selectedRows.length}{' '}
            <button className={styles.button} onClick={handleDeleteSelected}>
              Usuń zaznaczone
            </button>
          </p>
        )}
      </div>

      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        onDelete={handleDelete}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={handleEdit}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
      />
    </>
  );
}
