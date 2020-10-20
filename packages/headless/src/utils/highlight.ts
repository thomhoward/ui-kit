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
  /**
   * The group number for the highlight. A single string can have the same term highlighted multiple times.
   * This allows to regroup the different highlights.
   */
  dataHighlightGroup?: number;
  /**
   * The string that represent the highlight. A single string can have the same term highlighted multiple times.
   * This allows to regroup the different highlights.
   */
  dataHighlightGroupTerm?: string;
}

export class HighlightUtils {
  /**
   * Highlight the passed string using specified highlights.
   * @param content The string to highlight items in.
   * @param highlights The highlighted positions to highlight in the string.
   * @param cssClass The css class to use on the highlighting `span`.
   */
  static highlightString(
    content: string,
    highlights: HighlightKeyword[],
    cssClass: string
  ): string {
    if (_.isString(cssClass) && cssClass === '') {
      throw Error('cssClass should be a non-empty string');
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
      highlighted += `<span class="${cssClass}"`;
      if (highlight.dataHighlightGroup) {
        highlighted += ` data-highlight-group="${highlight.dataHighlightGroup.toString()}"`;
      }
      if (highlight.dataHighlightGroupTerm) {
        highlighted += ` data-highlight-group-term="${highlight.dataHighlightGroupTerm}"`;
      }
      highlighted += '>';
      highlighted += _.escape(content.slice(start, end));
      highlighted += '</span>';

      last = end;
    }
    if (last !== maxIndex) {
      highlighted += _.escape(content.slice(last));
    }
    return highlighted;
  }
}
