import {Engine} from '../../app/headless-engine';

export type Controller = ReturnType<typeof buildController>;

export function buildController(engine: Engine) {
  let prevState = '{}';

  /**
   * Determines whether or not the state has changed between two subscribe calls
   * @returns A boolean representing whether the state has changed
   */
  const hasStateChanged = (currentState: string): boolean => {
    const hasChanged = prevState !== currentState;
    prevState = currentState;
    return hasChanged;
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
        console.log(this.state);
        if (hasStateChanged(JSON.stringify(this.state))) {
          listener();
        }
      });
    },

    get state() {
      return {};
    },
  };
}
