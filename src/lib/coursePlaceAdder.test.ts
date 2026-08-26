import { describe, expect, it } from 'vitest';
import { getCoursePlaceAdderPosition } from './coursePlaceAdder';

describe('course place adder position', () => {
  it('opens beside the add button and clamps to the viewport', () => {
    expect(
      getCoursePlaceAdderPosition(
        { top: 140, right: 460 },
        { width: 1280, height: 720 },
        { width: 360, height: 520 },
      ),
    ).toEqual({ left: 472, top: 140 });

    expect(
      getCoursePlaceAdderPosition(
        { top: 640, right: 1200 },
        { width: 1280, height: 720 },
        { width: 360, height: 520 },
      ),
    ).toEqual({ left: 904, top: 184 });
  });
});
