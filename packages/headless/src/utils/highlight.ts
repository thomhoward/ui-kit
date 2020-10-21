import {isNullOrUndefined} from '@coveo/bueno';

export interface HighlightKeyword {
  /**
   * The 0 based offset inside the string where the highlight should start.
   */
  offset: number;
  /**
   * The length of the offset.
   */
  length: number;
}

function isEmptyString(str: string) {
  return str === '';
}

/**
 * Function to escape a string. For more information, refer to {@link https://underscorejs.org/#escape}
 */
function escapeString(str: string): string {
  return str
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;')
    .replace('"', '&quot;')
    .replace("'", '&#x27;')
    .replace('`', '&#96;');
}

/**
 * Highlight the passed string using specified highlights.
 * @param content The string to highlight items in.
 * @param highlights The highlighted positions to highlight in the string.
 * @param openingDelimiter The opening delimiter used when starting to highlight.
 * @param closingDelimiter The closing delimiter used to close highlighted section.
 */
export function highlightString(
  content: string,
  highlights: HighlightKeyword[],
  openingDelimiter: string,
  closingDelimiter: string
): string {
  if (isEmptyString(openingDelimiter) || isEmptyString(closingDelimiter)) {
    throw Error('delimiters should be a non-empty string');
  }

  if (isNullOrUndefined(content) || isEmptyString(content)) {
    return content;
  }
  const maxIndex = content.length;
  let highlighted = '';
  let last = 0;
  for (let i = 0; i < highlights.length; i++) {
    const highlight = highlights[i];
    const start: number = highlight.offset;
    const end: number = start + highlight.length;

    if (end > maxIndex) {
      break;
    }

    highlighted += escapeString(content.slice(last, start));
    highlighted += openingDelimiter;
    highlighted += escapeString(content.slice(start, end));
    highlighted += closingDelimiter;

    last = end;
  }
  if (last !== maxIndex) {
    highlighted += escapeString(content.slice(last));
  }
  return highlighted;
}
