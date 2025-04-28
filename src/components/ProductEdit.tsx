import { useState } from 'react';
import { Product } from '../../types/product';
import styles from './ProductEdit.module.css';

interface ProductEditProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export default function ProductEdit({ product, onClose, onSave }: ProductEditProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const dialogRef = (ref: HTMLDialogElement) => {
    ref?.showModal();
  };
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'availability' ? Number.parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(editedProduct);
    setIsSaving(false);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <dialog ref={dialogRef} onCancel={handleCancel} className={styles.dialog}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Edycja produktu</h2>

        <label className={styles.label}>
          <span>Nazwa</span>
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isSaving}
          />
        </label>

        <label className={styles.label}>
          <span>Ikona</span>
          <input
            type="text"
            name="icon"
            value={editedProduct.icon}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isSaving}
          />
        </label>

        <label className={styles.label}>
          <span>Cena</span>
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
            className={styles.input}
            required
            min={0}
            step={0.01}
            disabled={isSaving}
          />
        </label>

        <label className={styles.label}>
          <span>Dostępność</span>
          <input
            type="number"
            name="availability"
            value={editedProduct.availability}
            onChange={handleChange}
            className={styles.input}
            required
            min={0}
            step={1}
            disabled={isSaving}
          />
        </label>

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.default}`}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Anuluj
          </button>
          <button type="submit" className={styles.button} disabled={isSaving}>
            {isSaving ? 'Zapisuję...' : 'Zapisz'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
