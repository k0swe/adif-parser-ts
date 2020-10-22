export default class AdifParser {

  static parseAdi(adi: string): object {
    return new AdifParser(adi).parseTopLevel();
  }

  private cursor = 0;

  private constructor(private readonly adi: string) {
  }


  parseTopLevel(): object {
    const parsed: { [key: string]: any } = {};
    // TODO: Header
    // QSO Records
    const records = new Array<object>();
    while (this.cursor < this.adi.length) {
      records.push(this.parseRecord());
    }
    parsed["records"] = records;
    return parsed;
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
    const endTag = this.adi.indexOf('>', startTag);
    const tagParts = this.adi.substring(startTag + 1, endTag).split(":");
    if (tagParts[0].toLowerCase() === 'eor' || tagParts[0].toLowerCase() === 'eoh') {
      this.cursor = endTag + 1;
      return true;
    } else if (tagParts.length < 2) {
      throw new Error();
    }
    const fieldName = tagParts[0].toLowerCase();
    const width = +tagParts[1];
    record[fieldName] = this.adi.substr(endTag + 1, width);
    this.cursor = endTag + 1 + width;
    return false;
  }
}
