import * as docGen from './controllers-parser.test.doc.json';
import {parseControllers} from './controllers-parser';
import {Controller} from './doc-json-types';

describe('Controllers Parser', () => {
  const config: Controller[] = [
    {
      name: 'SearchBox',
      initialize: {
        initializer: {
          name: 'buildSearchBox',
          source: 'src/controllers/search-box/headless-search-box.ts',
        },
        others: [
          {
            name: 'SearchBoxProps',
            source: 'src/controllers/search-box/headless-search-box.ts',
          },
          {
            name: 'SearchBoxOptions',
            source: 'src/controllers/search-box/headless-search-box-options.ts',
          },
        ],
      },
      state: 'SearchBoxState',
      related: [],
    },
  ];

  it('runs', () => {
    const result = parseControllers(docGen, config);
    expect(result).toBe(true);
  });
});
