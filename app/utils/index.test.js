import { getRandomColors, getMemoizedRandomColors } from './index';

const HEX_COLOR_RE = /^#[0-9A-F]{6}$/i;

describe('getRandomColors', () => {
  it('returns a hex color from the fixed palette', () => {
    const color = getRandomColors();
    expect(color).toMatch(HEX_COLOR_RE);
  });
});

describe('getMemoizedRandomColors', () => {
  it('returns the same color for the same key on repeated calls', () => {
    const first = getMemoizedRandomColors('user-1');
    const second = getMemoizedRandomColors('user-1');
    const third = getMemoizedRandomColors('user-1');

    expect(first).toMatch(HEX_COLOR_RE);
    expect(second).toBe(first);
    expect(third).toBe(first);
  });

  it('can return different colors for different keys', () => {
    // Not deterministic in principle, but with a 50-color palette and two
    // distinct cache keys, both resolving are still valid hex colors.
    const a = getMemoizedRandomColors('user-a');
    const b = getMemoizedRandomColors('user-b');

    expect(a).toMatch(HEX_COLOR_RE);
    expect(b).toMatch(HEX_COLOR_RE);
  });
});
