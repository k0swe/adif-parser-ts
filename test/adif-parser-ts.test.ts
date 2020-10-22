import AdifParser from "../src/adif-parser-ts"

describe("AdifParser", () => {

  it("can parse a basic ADI", () => {
    expect(AdifParser.parseAdi(`<CALL:6>J72IMS <QSO_DATE:8>20200328 <eor>
<CALL:4>KK9A <QSO_DATE:8>20200329 <eor>`))
      .toEqual({
        "records": [
          {
            "call": "J72IMS",
            "qso_date": "20200328"
          }, {
            "call": "KK9A",
            "qso_date": "20200329"
          }
        ]
      });
  });

  it("can throw for fields with no width", () => {
    expect(() => AdifParser.parseAdi(`<CALL:6>J72IMS <QSO_DATE>20200328`))
      .toThrowError("Encountered field tag without enough parts near char 15");
  });

  it("can ignore type indicators", () => {
    expect(AdifParser.parseAdi(`<CALL:6:s>J72IMS <QSO_DATE:8:d>20200328`))
      .toEqual({
        "records": [
          {
            "call": "J72IMS",
            "qso_date": "20200328"
          },
        ]
      });
  });
});
