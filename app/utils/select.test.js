import { formatSelectOptions, unformatSelectOptions } from './select';

describe('formatSelectOptions', () => {
  it('maps {_id, name} records to {value, label}', () => {
    const data = [
      { _id: '1', name: 'Alpha' },
      { _id: '2', name: 'Beta' }
    ];

    expect(formatSelectOptions(data)).toEqual([
      { value: '1', label: 'Alpha' },
      { value: '2', label: 'Beta' }
    ]);
  });

  it('returns an empty array for empty/missing data', () => {
    expect(formatSelectOptions([])).toEqual([]);
    expect(formatSelectOptions(undefined)).toEqual([]);
  });

  it('prepends a "No option selected" option when empty is true', () => {
    const result = formatSelectOptions([{ _id: '1', name: 'Alpha' }], true);
    expect(result[0]).toEqual({ value: 0, label: 'No option selected' });
    expect(result).toHaveLength(2);
  });
});

describe('unformatSelectOptions', () => {
  it('pulls the raw ids back out of a list of {value, label} options', () => {
    const data = [
      { value: '1', label: 'Alpha' },
      { value: '2', label: 'Beta' }
    ];

    expect(unformatSelectOptions(data)).toEqual(['1', '2']);
  });

  it('returns null for falsy input', () => {
    expect(unformatSelectOptions(null)).toBeNull();
  });

  it('returns an empty array when given an empty list', () => {
    expect(unformatSelectOptions([])).toEqual([]);
  });
});
