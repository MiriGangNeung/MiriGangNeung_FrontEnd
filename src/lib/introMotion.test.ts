import { describe, expect, it } from 'vitest';

import { revealClass, revealDelay } from './introMotion';

describe('revealClass', () => {
  it('resolves to the settled transform once visible', () => {
    expect(revealClass(true)).toBe('translate-x-0 translate-y-0 opacity-100');
    expect(revealClass(true, 'left')).toBe('translate-x-0 translate-y-0 opacity-100');
  });

  it('offsets hidden elements along the requested axis', () => {
    expect(revealClass(false, 'up')).toBe('translate-y-12 opacity-0');
    expect(revealClass(false, 'left')).toBe('-translate-x-10 opacity-0');
    expect(revealClass(false, 'right')).toBe('translate-x-10 opacity-0');
  });
});

describe('revealDelay', () => {
  it('spaces list children by the step', () => {
    expect(revealDelay(0)).toEqual({ transitionDelay: '0ms' });
    expect(revealDelay(2, 120)).toEqual({ transitionDelay: '240ms' });
  });

  it('caps the delay so trailing items do not lag', () => {
    expect(revealDelay(20, 90, 6)).toEqual({ transitionDelay: '540ms' });
  });
});
