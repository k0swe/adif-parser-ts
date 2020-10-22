import AdifParser from "../src/adif-parser-ts"

describe("AdifParser test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("should parse a basic ADI", () => {
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
  })
})
