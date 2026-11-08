export interface AIProvider {
  generateJSON<T>(
    prompt: string,
    schema: object
  ): Promise<T>;

  generateText(
    prompt: string
  ): Promise<string>;
}
