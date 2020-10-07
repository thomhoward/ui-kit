import {Engine} from '../../app/headless-engine';

export type Controller = ReturnType<typeof buildController>;

export function buildController(engine: Engine) {
  return {
    prevState: '',

    /**
     * Determines whether or not the state has changed between two subscribe calls
     * @returns A boolean representing whether the state has changed
     */
    hasStateChanged(): boolean {
      const currentState = JSON.stringify(this.state);
      const prevState = this.prevState;
      this.prevState = currentState;
      return prevState !== currentState;
    },

    /**
     * Adds a callback that will be called on state change.
     *
     * @param listener A callback to be invoked on state change.
     * @returns An unsubscribe function to remove the listener.
     */
    subscribe(listener: () => void) {
      listener();
      return engine.subscribe(() => {
        if (this.hasStateChanged()) {
          listener();
        }
      });
    },

    get state() {
      return {};
    },
  };
}
