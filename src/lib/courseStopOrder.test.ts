import { describe, expect, it } from 'vitest';
import { moveCourseStop } from './courseStopOrder';

describe('moveCourseStop', () => {
  it('moves a stop to the requested position while preserving the other stops', () => {
    expect(moveCourseStop(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('leaves the order unchanged when the source or target is outside the list', () => {
    expect(moveCourseStop(['a', 'b', 'c'], -1, 1)).toEqual(['a', 'b', 'c']);
    expect(moveCourseStop(['a', 'b', 'c'], 1, 3)).toEqual(['a', 'b', 'c']);
  });
});
