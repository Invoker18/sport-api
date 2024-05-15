export class Prefix {
  private prefixText: string;

  constructor(prefixText: string) {
    this.prefixText = prefixText;
  }

  /*
   *
   * Updating the prefix
   *
   * @param newPrefix  The prefix to update to
   *
   * */
  setPrefix(newPrefix: string): void {
    this.prefixText = newPrefix;
  }

  /*
   *
   * Getting the prefix
   *
   * @return prefix
   *
   * */
  getPrefix(): string {
    return this.prefixText;
  }
}
