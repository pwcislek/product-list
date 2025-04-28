import { Product } from '../../types/product';
import UpDownIcon from './icons/UpDownIcon';
import UpIcon from './icons/UpIcon';
import DownIcon from './icons/DownIcon';
import styles from './ProductTable.module.css';
import { useState } from 'react';
import ProductEdit from './ProductEdit';
interface ProductTableProps {
  products: Product[];
  sortConfig: {
    key: keyof Product | null;
    direction: 'ascending' | 'descending';
  };
  onSort: (key: keyof Product) => void;
  onDelete: (id: number) => Promise<void>;
  onEdit: (product: Product) => Promise<void>;
  selectedRows: number[];
  onRowSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  isLoading: boolean;
}

export default function ProductTable({
  products,
  sortConfig,
  onSort,
  onDelete,
  onEdit,
  selectedRows,
  onRowSelect,
  onSelectAll,
  isLoading,
}: ProductTableProps) {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  const handleSave = async (product: Product) => {
    await onEdit(product);
    setEditedProduct(null);
  };

  const renderSortIcon = (key: keyof Product) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <UpIcon /> : <DownIcon />;
    }
    return <UpDownIcon />;
  };

  const areAllProductsSelected = products.length > 0 && selectedRows.length === products.length;

  return (
    <>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th data-label="Zaznacz wszystkie" className={styles.sticky}>
                <div className={styles.sorting}>
                  <input
                    type="checkbox"
                    checked={areAllProductsSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    aria-label="Zaznacz wszystkie"
                  />
                </div>
              </th>
              <th onClick={() => onSort('id')}>
                <div className={styles.sorting}>
                  <span>Id</span> {renderSortIcon('id')}
                </div>
              </th>
              <th onClick={() => onSort('name')}>
                <div className={styles.sorting}>
                  <span>Nazwa</span> {renderSortIcon('name')}
                </div>
              </th>
              <th className={styles.center}>Ikona</th>
              <th onClick={() => onSort('price')}>
                <div className={styles.sorting}>
                  <span>Cena</span> {renderSortIcon('price')}
                </div>
              </th>
              <th onClick={() => onSort('availability')}>
                <div className={styles.sorting}>
                  <span>Dostępność</span> {renderSortIcon('availability')}
                </div>
              </th>
              <th className={`${styles.right} ${styles.stickyRight}`}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && products.length === 0 && (
              <tr>
                <td colSpan={7} className={`${styles.loading} ${styles.center}`}>
                  <p>Ładowanie...</p>
                </td>
              </tr>
            )}
            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={7} className={`${styles.loading} ${styles.center}`}>
                  <p>Brak produktów spełniających wybrane kryteria</p>
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.sticky}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(product.id)}
                    onChange={(e) => onRowSelect(product.id, e.target.checked)}
                    aria-label={`Zaznacz produkt ${product.name}`}
                  />
                </td>
                <td data-label="Id">{product.id}</td>
                <td data-label="Nazwa" className={styles.name}>
                  {product.name}
                </td>
                <td className={styles.center} data-label="Ikona">
                  <img
                    src={product.icon}
                    alt={product.name}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </td>
                <td data-label="Cena">{product.price.toFixed(2)} zł</td>
                <td data-label="Dostępność">{product.availability}</td>
                <td className={`${styles.right} ${styles.stickyRight}`} data-label="Akcje">
                  <div className={styles.buttons}>
                    <button className={styles.button} onClick={() => setEditedProduct(product)}>
                      Edytuj
                    </button>
                    <button
                      className={`${styles.button} ${styles.danger}`}
                      onClick={() => {
                        if (window.confirm(`Czy na pewno chcesz usunąć ${product.name}?`)) {
                          onDelete(product.id);
                        }
                      }}
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && products.length > 0 && <div className={styles.loading} />}
      </div>
      {editedProduct && (
        <ProductEdit
          product={editedProduct}
          onClose={() => setEditedProduct(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
