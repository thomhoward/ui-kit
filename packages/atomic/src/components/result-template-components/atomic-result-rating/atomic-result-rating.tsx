import {Component, Element, Prop, h, State} from '@stencil/core';
import {Result, ResultTemplatesHelpers} from '@coveo/headless';
import Star from '../../../images/star.svg';
import {ResultContext} from '../../result-template-components/result-template-decorators';
import {Rating} from '../../atomic-rating/atomic-rating';

/**
 * The `atomic-result-rating` element renders a star rating.
 *
 *  @part value-rating - The wrapper that contains the row of inactive stars and the row of active stars.
 */
@Component({
  tag: 'atomic-result-rating',
  styleUrl: 'atomic-result-rating.pcss',
  shadow: true,
})
export class AtomicResultRating {
  @ResultContext() private result!: Result;
  @Element() host!: HTMLElement;

  /**
   * The field whose values you want to display as a rating.
   */
  @Prop() public field!: string;

  /**
   * The maximum value of the field. This value is also used as the number of icons to be displayed.
   */
  @Prop() public maxValueInIndex = 5;

  /**
   * The SVG icon to use to display the rating.
   *
   * - Use a value that starts with `http://`, `https://`, `./`, or `../`, to fetch and display an icon from a given location.
   * - Use a value that starts with `assets://`, to display an icon from the Atomic package.
   * - Use a stringified SVG to display it directly
   */
  @Prop() public icon = Star;

  @State() public error?: Error;

  @State() numberOfStars: number | null = null;

  private updateNumberOfStars() {
    const value = ResultTemplatesHelpers.getResultProperty(
      this.result,
      this.field
    );
    if (value === null) {
      this.numberOfStars = null;
      return;
    }
    const valueAsNumber = parseFloat(`${value}`);
    if (Number.isNaN(valueAsNumber)) {
      this.error = new Error(
        `Could not parse "${value}" from field "${this.field}" as a number.`
      );
      this.numberOfStars = null;
      return;
    }
    this.numberOfStars = valueAsNumber;
  }

  componentWillRender() {
    this.updateNumberOfStars();
  }

  render() {
    if (this.numberOfStars === null) {
      this.host.remove();
      return;
    }
    return (
      <Rating
        icon={this.icon}
        numberOfTotalIcons={this.maxValueInIndex}
        numberOfActiveIcons={this.numberOfStars}
        iconSize={0.875}
      ></Rating>
    );
  }
}
