import {HighlightKeyword, HighlightUtils} from './highlight';

describe('highlight', () => {
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut';
  const highlights: HighlightKeyword[] = [
    {offset: 3, length: 5},
    {offset: 10, length: 4},
    {offset: 18, length: 15},
    {offset: 45, length: 10},
  ];

  it('should wrap the passed highlights with tags using the specified class name', () => {
    const expectedHighlight =
      'Lor<span class="coveo-highlight">em ip</span>su<span class="coveo-highlight">m do</span>lor <span class="coveo-highlight">sit amet, conse</span>ctetur adipi<span class="coveo-highlight">sicing eli</span>t, sed do eiusmod tempor incididunt ut';
    expect(
      HighlightUtils.highlightString(lorem, highlights, 'coveo-highlight')
    ).toBe(expectedHighlight);
  });

  it('should return the string unchanged if "content" is an empty string', () => {
    const expectedString = '';
    expect(
      HighlightUtils.highlightString('', highlights, 'coveo-highlight')
    ).toBe(expectedString);
  });

  it('should throw if "cssClass is empty"', () => {
    expect(() => HighlightUtils.highlightString(lorem, highlights, '')).toThrow(
      'cssClass should be a non-empty string'
    );
  });
});
