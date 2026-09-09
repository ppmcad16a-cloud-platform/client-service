import { formatDate, formatTime } from './date';

describe('formatDate', () => {
  it('formats a date in UTC, en-US, long-weekday form', () => {
    // Noon UTC avoids any timezone-rollover ambiguity for the day-of-week.
    const result = formatDate('2024-01-15T12:00:00.000Z');
    expect(result).toBe('Monday, Jan 15, 2024');
  });
});

describe('formatTime', () => {
  it('formats a time as hour:minute with an AM/PM marker', () => {
    const result = formatTime('2024-01-15T12:30:00.000Z');
    expect(result).toMatch(/^\d{1,2}:\d{2}\s?[AP]M$/i);
  });
});
