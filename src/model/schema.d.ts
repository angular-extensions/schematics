export interface Schema {
  /**
   * The name of the service.
   */
  name: string;
  /**
   * The path to create the service.
   */
  path?: string;
  /**
   * The name of the project.
   */
  project?: string;
  /**
   * Allows specification of the declaring module.
   */
  module?: string;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Specifies whether to apply lint fixes after generating the component.
   */
  lintFix?: boolean;
  /**
   * Flag to indicate if model is a collection of items.
   */
  items?: boolean;
}
