import { SimpleAdif } from './simple-adif';

/**
 * A class for formatting objects into ADIF.
 */
export class AdifFormatter {
  /**
   * Format the given object into an ADIF string.
   */
  static formatAdi(obj: SimpleAdif): string {
    return new AdifFormatter(obj).format();
  }

  private constructor(private readonly obj: SimpleAdif) {}

  private format(): string {
    return this.obj.toString();
  }
}
