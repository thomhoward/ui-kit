import defaultStory from '../../../.storybook/default-story';
import NoResultsDoc from './atomic-no-results.mdx';

const {defaultModuleExport, exportedStory} = defaultStory(
  'Atomic/NoResult',
  'atomic-no-results',
  {},
  NoResultsDoc,
  {
    engineConfig: {
      search: {
        preprocessSearchResponseMiddleware: (r) => {
          r.body.results = [];
          return r;
        },
      },
    },
  }
);

export default defaultModuleExport;
export const DefaultNoResults = exportedStory;
