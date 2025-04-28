import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ProductEdit from './ProductEdit';
import { Product } from '../../types/product';

describe('ProductEdit', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    icon: 'test-icon',
    price: 99.99,
    availability: 10,
  };

  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show dialog when rendered', () => {
    render(<ProductEdit product={mockProduct} onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByText('Edycja produktu')).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    render(<ProductEdit product={mockProduct} onClose={mockOnClose} onSave={mockOnSave} />);

    const nameInput = screen.getByLabelText('Nazwa');
    const priceInput = screen.getByLabelText('Cena');
    const availabilityInput = screen.getByLabelText('Dostępność');

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.change(priceInput, { target: { value: '149.99' } });
    fireEvent.change(availabilityInput, { target: { value: '20' } });

    expect(nameInput).toHaveValue('New Name');
    expect(priceInput).toHaveValue(149.99);
    expect(availabilityInput).toHaveValue(20);
  });

  it('should call onSave with updated product when form is submitted', async () => {
    render(<ProductEdit product={mockProduct} onClose={mockOnClose} onSave={mockOnSave} />);

    const nameInput = screen.getByLabelText('Nazwa');
    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });

    const submitButton = screen.getByText('Zapisz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockProduct,
        name: 'Updated Product',
      });
    });
  });

  it('should show loading state during save', async () => {
    mockOnSave.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<ProductEdit product={mockProduct} onClose={mockOnClose} onSave={mockOnSave} />);

    const submitButton = screen.getByText('Zapisz');
    fireEvent.click(submitButton);

    expect(screen.getByText('Zapisuję...')).toBeInTheDocument();
    expect(screen.getByLabelText('Nazwa')).toBeDisabled();
    expect(screen.getByLabelText('Cena')).toBeDisabled();
    expect(screen.getByLabelText('Dostępność')).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('Zapisuję...')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<ProductEdit product={mockProduct} onClose={mockOnClose} onSave={mockOnSave} />);

    const cancelButton = screen.getByText('Anuluj');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
