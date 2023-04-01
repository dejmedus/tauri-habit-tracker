import resetAtMidnight from '../src/helpers/midnightReset'
import '@testing-library/jest-dom'

describe('resetAtMidnight', () => {

  const reset = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('resets at midnight', () => {
    jest.setSystemTime(new Date('2023-03-05T00:00:00Z'));
    resetAtMidnight(reset);

    // reset is called once at 12am
    jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(reset).toBeCalled();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  test('resets at midnight of new month', () => {
    jest.setSystemTime(new Date('2023-02-28T0:00:00Z'));
    resetAtMidnight(reset);

    // reset is called once at midnight of a new month
    jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(reset).toHaveBeenCalledTimes(1);
  });
})
