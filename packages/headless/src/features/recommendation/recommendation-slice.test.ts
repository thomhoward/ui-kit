import {setRecommendation} from './recommendation-actions';
import {recommendationReducer} from './recommendation-slice';

describe('recommendation slice', () => {
  it('should allow to set recommendation', () => {
    expect(recommendationReducer('', setRecommendation('foo'))).toBe('foo');
  });
});
