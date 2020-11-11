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
    // From just a moment of research, string concatenation should have OK
    // performance. Maybe do testing and reconsider.
    let buffer = '';
    if (this.obj.header) {
      buffer += this.obj.header.text + '\n';
      const restOfHeader = this.obj.header;
      delete restOfHeader.text;
      buffer += AdifFormatter.formatTags(restOfHeader);
      buffer += '<eoh>\n\n';
    }

    if (!this.obj.records) {
      return AdifFormatter.prepReturn(buffer);
    }
    for (const rec of this.obj.records) {
      buffer += AdifFormatter.formatTags(rec);
      buffer += '<eor>\n\n';
    }

    return AdifFormatter.prepReturn(buffer);
  }

  private static formatTags(obj: object): string {
    let buffer = '';
    for (const [key, value] of Object.entries(obj)) {
      const width = new TextEncoder().encode(value).byteLength;
      buffer += `<${key}:${width}>${value}\n`;
    }
    return buffer;
  }

  private static prepReturn(buffer: string) {
    buffer = buffer.trim();
    if (buffer.length === 0) {
      return buffer;
    }
    return buffer + '\n';
  }
}
