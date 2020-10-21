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
      'Lor<span>em ip</span>su<span>m do</span>lor <span>sit amet, conse</span>ctetur adipi<span>sicing eli</span>t, sed do eiusmod tempor incididunt ut';
    expect(
      HighlightUtils.highlightString(lorem, highlights, '<span>', '</span>')
    ).toBe(expectedHighlight);
  });

  it('should return the string unchanged if "content" is an empty string', () => {
    const expectedString = '';
    expect(
      HighlightUtils.highlightString('', highlights, '<span>', '</span>')
    ).toBe(expectedString);
  });

  it('should throw if "tag" is an empty string', () => {
    expect(() =>
      HighlightUtils.highlightString(lorem, highlights, '', '</span>')
    ).toThrow('delimiters should be a non-empty string');
  });
});
