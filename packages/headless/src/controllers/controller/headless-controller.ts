import {Engine} from '../../app/headless-engine';

export type Controller = ReturnType<typeof buildController>;

export function buildController(engine: Engine) {
  let prevState = '{}';

  /**
   * Determines whether or not the state has changed between two subscribe calls
   * @returns A boolean representing whether the state has changed
   */
  const hasStateChanged = (currentState: Record<string, any>): boolean => {
    try {
      const stringifiedState = JSON.stringify(currentState);
      const hasChanged = prevState !== stringifiedState;
      prevState = stringifiedState;
      return hasChanged;
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  return {
    /**
     * Adds a callback that will be called on state change.
     *
     * @param listener A callback to be invoked on state change.
     * @returns An unsubscribe function to remove the listener.
     */
    subscribe(listener: () => void) {
      listener();
      return engine.subscribe(() => {
        if (hasStateChanged(this.state)) {
          listener();
        }
      });
    },

    get state() {
      return {};
    },
  };
}
