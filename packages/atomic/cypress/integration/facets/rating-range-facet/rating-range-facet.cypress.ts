import {TestFixture} from '../../../fixtures/test-fixture';
import * as RatingRangeFacetAssertions from './rating-range-facet-assertions';
import * as RatingFacetAssertions from '../rating-facet/rating-facet-assertions';
import * as CommonAssertions from '../../common-assertions';
import * as CommonFacetAssertions from '../facet-common-assertions';
import {selectIdleLinkValueAt} from '../facet-common-actions';
import {
  addRatingRangeFacet,
  ratingRangeFacetField,
  ratingRangeFacetLabel,
  ratingRangeFacetDefaultNumberOfIntervals,
} from './rating-range-facet-actions';
import {
  ratingRangeFacetComponent,
  RatingRangeFacetSelectors,
} from './rating-range-facet-selectors';

describe('Rating Range Test Suites', () => {
  describe('with default rating facet', () => {
    function setupRatingRangeFacet() {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
          })
        )
        .init();
    }

    describe('verify rendering', () => {
      before(setupRatingRangeFacet);
      CommonAssertions.assertAccessibility(ratingRangeFacetComponent);
      CommonAssertions.assertContainsComponentError(
        RatingRangeFacetSelectors,
        false
      );
      CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, true);
      CommonFacetAssertions.assertLabelContains(
        RatingRangeFacetSelectors,
        ratingRangeFacetLabel
      );
      CommonFacetAssertions.assertDisplayValues(
        RatingRangeFacetSelectors,
        true
      );
      CommonFacetAssertions.assertDisplayPlaceholder(
        RatingRangeFacetSelectors,
        false
      );
      CommonFacetAssertions.assertNumberOfSelectedLinkValues(
        RatingRangeFacetSelectors,
        0
      );
      CommonFacetAssertions.assertNumberOfIdleLinkValues(
        RatingRangeFacetSelectors,
        ratingRangeFacetDefaultNumberOfIntervals
      );
      RatingFacetAssertions.assertNumberOfStarAtIndex(
        RatingRangeFacetSelectors,
        ratingRangeFacetDefaultNumberOfIntervals
      );
      RatingFacetAssertions.assertNumberofYellowStar(
        RatingRangeFacetSelectors,
        4,
        1
      );
      RatingRangeFacetAssertions.assertFacetValueContainsTextOnlyAndUp();
    });

    describe('when select a value', () => {
      const selectionIndex = 2;
      function setupSelectLinkValue() {
        setupRatingRangeFacet();
        selectIdleLinkValueAt(RatingRangeFacetSelectors, selectionIndex);
        cy.wait(TestFixture.interceptAliases.Search);
      }

      describe('verify rendering', () => {
        before(setupSelectLinkValue);

        CommonAssertions.assertAccessibility(ratingRangeFacetComponent);
        CommonFacetAssertions.assertDisplayClearButton(
          RatingRangeFacetSelectors,
          true
        );
        CommonFacetAssertions.assertNumberOfSelectedLinkValues(
          RatingRangeFacetSelectors,
          1
        );
        CommonFacetAssertions.assertNumberOfIdleLinkValues(
          RatingRangeFacetSelectors,
          ratingRangeFacetDefaultNumberOfIntervals - 1
        );
      });

      describe('verify analytic', () => {
        before(setupSelectLinkValue);
        RatingFacetAssertions.assertLogRatingFacetSelect(ratingRangeFacetField);
      });
    });
  });

  describe('with custom #numberOfIntervals', () => {
    const customNumberofInterval = 10;
    function setupRatingFacetWithCustomInterval() {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
            'number-of-intervals': customNumberofInterval,
          })
        )
        .init();
    }

    before(setupRatingFacetWithCustomInterval);
    CommonAssertions.assertAccessibility(ratingRangeFacetComponent);
    CommonAssertions.assertContainsComponentError(
      RatingRangeFacetSelectors,
      false
    );
    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, true);
    CommonFacetAssertions.assertNumberOfSelectedLinkValues(
      RatingRangeFacetSelectors,
      0
    );
    CommonFacetAssertions.assertNumberOfIdleLinkValues(
      RatingRangeFacetSelectors,
      ratingRangeFacetDefaultNumberOfIntervals
    );
    RatingFacetAssertions.assertNumberOfStarAtIndex(
      RatingRangeFacetSelectors,
      customNumberofInterval
    );
    RatingFacetAssertions.assertNumberofYellowStar(
      RatingRangeFacetSelectors,
      4,
      1,
      customNumberofInterval
    );
    RatingRangeFacetAssertions.assertFacetValueContainsAndUp();
  });

  describe('with custom #maxValueInIndex', () => {
    const customMaxValueInIndex = 4;
    function setupRatingFacetWithCustomMaxValueInIndex() {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
            'max-value-in-index': customMaxValueInIndex,
          })
        )
        .init();
    }

    before(setupRatingFacetWithCustomMaxValueInIndex);
    CommonAssertions.assertAccessibility(ratingRangeFacetComponent);
    CommonAssertions.assertContainsComponentError(
      RatingRangeFacetSelectors,
      false
    );
    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, true);
    CommonFacetAssertions.assertNumberOfSelectedLinkValues(
      RatingRangeFacetSelectors,
      0
    );
    CommonFacetAssertions.assertNumberOfIdleLinkValues(
      RatingRangeFacetSelectors,
      ratingRangeFacetDefaultNumberOfIntervals
    );
    RatingFacetAssertions.assertNumberOfStarAtIndex(
      RatingRangeFacetSelectors,
      customMaxValueInIndex
    );
    RatingFacetAssertions.assertNumberofYellowStar(
      RatingRangeFacetSelectors,
      0,
      4,
      customMaxValueInIndex
    );
    RatingRangeFacetAssertions.assertFacetValueContainsTextOnlyAndUp();
  });

  describe('with custom #minValueInIndex', () => {
    const customMinValueInIndex = 2;
    function setupRatingFacetWithCustomMinValueInIndex() {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
            'min-value-in-index': customMinValueInIndex,
          })
        )
        .init();
    }

    before(setupRatingFacetWithCustomMinValueInIndex);
    CommonAssertions.assertAccessibility(ratingRangeFacetComponent);
    CommonAssertions.assertContainsComponentError(
      RatingRangeFacetSelectors,
      false
    );
    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, true);
    CommonFacetAssertions.assertNumberOfSelectedLinkValues(
      RatingRangeFacetSelectors,
      0
    );
    RatingFacetAssertions.assertNumberOfStarAtIndex(
      RatingRangeFacetSelectors,
      ratingRangeFacetDefaultNumberOfIntervals
    );
    RatingFacetAssertions.assertNumberofYellowStar(
      RatingRangeFacetSelectors,
      'last',
      2
    );
    RatingRangeFacetAssertions.assertFacetValueContainsTextOnlyAndUp();
  });

  describe('with invalid option', () => {
    before(() => {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
            'number-of-intervals': '-10',
          })
        )
        .init();
    });

    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, false);
    CommonAssertions.assertContainsComponentError(
      RatingRangeFacetSelectors,
      true
    );
  });

  describe('when field returns no results', () => {
    before(() => {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: 'nofield',
            label: ratingRangeFacetLabel,
          })
        )
        .init();
    });

    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, false);
    CommonFacetAssertions.assertDisplayPlaceholder(
      RatingRangeFacetSelectors,
      false
    );
    CommonAssertions.assertContainsComponentError(
      RatingRangeFacetSelectors,
      false
    );
  });

  describe('with a selected path in the URL', () => {
    before(() => {
      new TestFixture()
        .with(
          addRatingRangeFacet({
            field: ratingRangeFacetField,
            label: ratingRangeFacetLabel,
          })
        )
        .withHash(`nf[${ratingRangeFacetField}]=4..5`)
        .init();
    });

    CommonFacetAssertions.assertDisplayFacet(RatingRangeFacetSelectors, true);
    CommonFacetAssertions.assertNumberOfSelectedLinkValues(
      RatingRangeFacetSelectors,
      1
    );
    CommonFacetAssertions.assertNumberOfIdleLinkValues(
      RatingRangeFacetSelectors,
      ratingRangeFacetDefaultNumberOfIntervals - 1
    );
    RatingFacetAssertions.assertSelectedFacetValueContainsNumberOfStar(
      RatingRangeFacetSelectors,
      4
    );
    RatingRangeFacetAssertions.assertFacetValueContainsTextOnlyAndUp();
  });
});
