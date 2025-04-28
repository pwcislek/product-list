import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from './ProductTable';
import { getPokeData } from '../../lib/mock-data';

describe('ProductTable', () => {
  const mockProducts = getPokeData().slice(0, 3); // Use first 3 products for testing
  const mockSortConfig = {
    key: 'id' as keyof (typeof mockProducts)[0],
    direction: 'ascending' as const,
  };
  const mockOnSort = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnRowSelect = vi.fn();
  const mockOnSelectAll = vi.fn();

  const defaultProps = {
    products: mockProducts,
    sortConfig: mockSortConfig,
    onSort: mockOnSort,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    selectedRows: [],
    onRowSelect: mockOnRowSelect,
    onSelectAll: mockOnSelectAll,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with products', () => {
    render(<ProductTable {...defaultProps} />);

    expect(screen.getByText('Id')).toBeInTheDocument();
    expect(screen.getByText('Nazwa')).toBeInTheDocument();
    expect(screen.getByText('Ikona')).toBeInTheDocument();
    expect(screen.getByText('Cena')).toBeInTheDocument();
    expect(screen.getByText('Dostępność')).toBeInTheDocument();
    expect(screen.getByText('Akcje')).toBeInTheDocument();

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.id.toString())).toBeInTheDocument();
      expect(screen.getByText(`${product.price.toFixed(2)} zł`)).toBeInTheDocument();
      expect(screen.getByText(product.availability.toString())).toBeInTheDocument();
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<ProductTable {...defaultProps} isLoading={true} products={[]} />);
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
  });

  it('shows empty state when no products are available', () => {
    render(<ProductTable {...defaultProps} products={[]} />);
    expect(screen.getByText('Brak produktów spełniających wybrane kryteria')).toBeInTheDocument();
  });

  it('calls onSort when column header is clicked', () => {
    render(<ProductTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Nazwa'));
    expect(mockOnSort).toHaveBeenCalledWith('name');
  });

  it('calls onRowSelect when checkbox is clicked', () => {
    render(<ProductTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click first product checkbox
    expect(mockOnRowSelect).toHaveBeenCalledWith(mockProducts[0].id, true);
  });

  it('calls onSelectAll when select all checkbox is clicked', () => {
    render(<ProductTable {...defaultProps} />);
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    expect(mockOnSelectAll).toHaveBeenCalledWith(true);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    // Confirm mocked to return true
    window.confirm = vi.fn(() => true);

    render(<ProductTable {...defaultProps} />);
    const deleteButtons = screen.getAllByText('Usuń');
    fireEvent.click(deleteButtons[0]);
    expect(window.confirm).toHaveBeenCalledWith(
      `Czy na pewno chcesz usunąć ${mockProducts[0].name}?`,
    );
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('does not call onDelete when delete is not confirmed', () => {
    // Confirm mocked to return false
    window.confirm = vi.fn(() => false);

    render(<ProductTable {...defaultProps} />);
    const deleteButtons = screen.getAllByText('Usuń');
    fireEvent.click(deleteButtons[0]);
    expect(window.confirm).toHaveBeenCalledWith(
      `Czy na pewno chcesz usunąć ${mockProducts[0].name}?`,
    );
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
