/**
 * A class for parsing ADIF data into usable data structures.
 */
export default class AdifParser {
  /**
   * Parse the given ADIF data string into an object.
   */
  static parseAdi(adi: string): ParseResult {
    return new AdifParser(adi).parseTopLevel();
  }

  private cursor = 0;

  private constructor(private readonly adi: string) {}

  private parseTopLevel(): ParseResult {
    const parsed: ParseResult = {};
    if (this.adi.length === 0) {
      return parsed;
    }

    // Header
    if (this.adi[0] !== '<') {
      const header: { [field: string]: string } = {};
      header['text'] = this.parseHeaderText();
      while (this.cursor < this.adi.length) {
        const endOfHeader = this.parseTagValue(header);
        if (endOfHeader) {
          break;
        }
      }
      parsed.header = header;
    }

    // QSO Records
    const records = new Array<{ [field: string]: string }>();
    while (this.cursor < this.adi.length) {
      const record = this.parseRecord();
      if (Object.keys(record).length > 0) {
        records.push(record);
      }
    }
    if (records.length > 0) {
      parsed.records = records;
    }
    return parsed;
  }

  private parseHeaderText(): string {
    const startTag = this.adi.indexOf('<', this.cursor);
    this.cursor = startTag;
    return this.adi.substring(0, startTag).trim();
  }

  private parseRecord(): { [field: string]: string } {
    const record: { [field: string]: string } = {};
    while (this.cursor < this.adi.length) {
      const endOfRecord = this.parseTagValue(record);
      if (endOfRecord) {
        break;
      }
    }
    return record;
  }

  private parseTagValue(record: { [p: string]: string }): boolean {
    const startTag = this.adi.indexOf('<', this.cursor);
    if (startTag === -1) {
      this.cursor = this.adi.length;
      return true;
    }
    const endTag = this.adi.indexOf('>', startTag);
    const tagParts = this.adi.substring(startTag + 1, endTag).split(':');
    if (
      tagParts[0].toLowerCase() === 'eor' ||
      tagParts[0].toLowerCase() === 'eoh'
    ) {
      this.cursor = endTag + 1;
      return true;
    } else if (tagParts.length < 2) {
      throw new Error(
        'Encountered field tag without enough parts near char ' + startTag
      );
    }
    const fieldName = tagParts[0].toLowerCase();
    const width = +tagParts[1];
    record[fieldName] = this.adi.substr(endTag + 1, width);
    this.cursor = endTag + 1 + width;
    return false;
  }
}

export interface ParseResult {
  header?: { [field: string]: string };
  records?: Array<{ [field: string]: string }>;
}
