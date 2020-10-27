import {Component, h, State} from '@stencil/core';
import {Initialization} from '../../utils/initialization-utils';
import {
  BreadcrumbManagerState,
  BreadcrumbManager,
  Engine,
  Unsubscribe,
  buildBreadcrumbManager,
} from '@coveo/headless';

@Component({
  tag: 'atomic-breadcrumb-manager',
  styleUrl: 'atomic-breadcrumb-manager.css',
  shadow: true,
})
export class AtomicBreadcrumbManager {
  @State() state!: BreadcrumbManagerState;

  private engine!: Engine;
  private breadcrumbManager!: BreadcrumbManager;
  private unsubscribe: Unsubscribe = () => {};

  @Initialization()
  public initialize() {
    this.breadcrumbManager = buildBreadcrumbManager(this.engine);
    this.subscribe();
  }

  private subscribe() {
    this.unsubscribe = this.breadcrumbManager.subscribe(() =>
      this.updateState()
    );
  }

  private updateState() {
    this.state = this.breadcrumbManager.state;
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  private get breadcrumbs() {
    return this.state.breadcrumbs.map((breadcrumb) => (
      <button onClick={breadcrumb.deselect}>{breadcrumb.value}</button>
    ));
  }

  render() {
    return <div class="breadcrumb-manager">{this.breadcrumbs}</div>;
  }
}
