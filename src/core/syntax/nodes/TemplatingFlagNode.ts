export class TemplatingFlagNode {
  constructor(
    /**
     * True if file should use Handlebars to render content, otherwise file should be copied
     */
    public readonly useHbs: boolean,
  ) { }
}
