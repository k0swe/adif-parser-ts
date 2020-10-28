import { SimpleAdif } from './simple-adif';

/**
 * A class for parsing ADIF data into usable data structures.
 */
export class AdifFormatter {
  /**
   * Parse the given ADIF data string into an object.
   */
  static formatAdi(obj: SimpleAdif): string {
    return new AdifFormatter(obj).format();
  }

  private constructor(private readonly obj: SimpleAdif) {}

  private format(): string {
    return this.obj.toString();
  }
}
