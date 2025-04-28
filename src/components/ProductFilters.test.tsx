import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilters, { Filters } from './ProductFilters';

describe('ProductFilters', () => {
  const defaultFilters: Filters = {
    name: '',
    priceRange: [0, 1000],
    availabilityRange: [0, 100],
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all filter inputs', () => {
    render(
      <ProductFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    expect(screen.getByPlaceholderText('Wyszukaj po nazwie')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Od')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Do')).toHaveLength(2);
  });

  it('updates name filter when input changes', () => {
    render(
      <ProductFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    const nameInput = screen.getByPlaceholderText('Wyszukaj po nazwie');
    fireEvent.change(nameInput, { target: { value: 'test product' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      name: 'test product',
    });
  });

  it('updates price range when inputs change', () => {
    render(
      <ProductFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    const [minPriceInput] = screen.getAllByPlaceholderText('Od');
    const [maxPriceInput] = screen.getAllByPlaceholderText('Do');
    fireEvent.change(minPriceInput, { target: { value: '100' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      priceRange: [100, 1000],
    });

    fireEvent.change(maxPriceInput, { target: { value: '500' } });
    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      priceRange: [0, 500],
    });
  });

  it('updates availability range when inputs change', () => {
    render(
      <ProductFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    const [, minAvailInput] = screen.getAllByPlaceholderText('Od');
    const [, maxAvailInput] = screen.getAllByPlaceholderText('Do');

    fireEvent.change(minAvailInput, { target: { value: '10' } });
    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      availabilityRange: [10, 100],
    });

    fireEvent.change(maxAvailInput, { target: { value: '50' } });
    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultFilters,
      availabilityRange: [0, 50],
    });
  });

  it('shows reset button when filters are changed', () => {
    const changedFilters: Filters = {
      name: 'test',
      priceRange: [100, 500],
      availabilityRange: [10, 50],
    };

    render(
      <ProductFilters
        filters={changedFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    expect(screen.getByText('Resetuj filtry')).toBeInTheDocument();
  });

  it('hides reset button when filters match defaults', () => {
    render(
      <ProductFilters
        filters={defaultFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    expect(screen.queryByText('Resetuj filtry')).not.toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    const changedFilters: Filters = {
      name: 'test',
      priceRange: [100, 500],
      availabilityRange: [10, 50],
    };

    render(
      <ProductFilters
        filters={changedFilters}
        onChange={mockOnChange}
        defaultFilters={defaultFilters}
      />,
    );

    const resetButton = screen.getByText('Resetuj filtry');
    fireEvent.click(resetButton);

    expect(mockOnChange).toHaveBeenCalledWith(defaultFilters);
  });
});
