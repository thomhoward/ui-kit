import * as _ from 'underscore';
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

export class HighlightUtils {
  /**
   * Highlight the passed string using specified highlights.
   * @param content The string to highlight items in.
   * @param highlights The highlighted positions to highlight in the string.
   * @param tag The opening tag to use when starting to highlight (e.g. <span class="my-class">).
   */
  static highlightString(
    content: string,
    highlights: HighlightKeyword[],
    openingDelimiter: string,
    closingDelimiter: string
  ): string {
    if (isEmptyString(openingDelimiter) || isEmptyString(closingDelimiter)) {
      throw Error('delimiters should be a non-empty string');
    }

    if (isNullOrUndefined(content) || content === '') {
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

      highlighted += _.escape(content.slice(last, start));
      highlighted += openingDelimiter;
      highlighted += _.escape(content.slice(start, end));
      highlighted += closingDelimiter;

      last = end;
    }
    if (last !== maxIndex) {
      highlighted += _.escape(content.slice(last));
    }
    return highlighted;
  }
}
