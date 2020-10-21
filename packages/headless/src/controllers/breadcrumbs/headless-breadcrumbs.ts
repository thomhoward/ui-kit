import {buildController, Engine} from '../..';

export const buildBreadcrumbs = (engine: Engine) => {
  const controller = buildController(engine);

  return {
    ...controller,

    get state() {
      return [];
    },
  };
};

type Breadcrumb = {
  value: string;
};
