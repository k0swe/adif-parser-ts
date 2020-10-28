import * as fs from 'fs';
import { AdifFormatter } from '../src/adif-formatter';

describe('AdifFormatter', () => {
  it('can format a basic ADI', () => {
    expect(
      AdifFormatter.formatAdi({
        records: [
          {
            call: 'J72IMS',
            qso_date: '20200328',
          },
          {
            call: 'KK9A',
            qso_date: '20200329',
          },
        ],
      })
    ).toEqual(`<call:6>J72IMS
<qso_date:8>20200328
<eor>

<call:4>KK9A
<qso_date:8>20200329
<eor>
`);
  });

  it('can format a basic ADI with a header', () => {
    expect(
      AdifFormatter.formatAdi({
        header: {
          text: 'Generated on 2011-11-22 at 02:15:23Z for WN4AZY',
          adif_ver: '3.0.5',
          programid: 'MonoLog',
          userdef1: 'QRP_ARCI',
          userdef2: 'SweaterSize,{S,M,L}',
          userdef3: 'ShoeSize,{5:20}',
        },
        records: [
          {
            call: 'J72IMS',
            qso_date: '20200328',
          },
          {
            call: 'KK9A',
            qso_date: '20200329',
          },
        ],
      })
    ).toEqual(`Generated on 2011-11-22 at 02:15:23Z for WN4AZY
<adif_ver:5>3.0.5
<programid:7>MonoLog
<userdef1:8>QRP_ARCI
<userdef2:19>SweaterSize,{S,M,L}
<userdef3:15>ShoeSize,{5:20}
<eoh>

<call:6>J72IMS
<qso_date:8>20200328
<eor>

<call:4>KK9A
<qso_date:8>20200329
<eor>
`);
  });

  it('can format degenerate examples', () => {
    expect(AdifFormatter.formatAdi({})).toEqual('');
    expect(AdifFormatter.formatAdi({ records: [] })).toEqual('');
    expect(AdifFormatter.formatAdi({ header: { text: '' } })).toEqual(
      '<eoh>\n'
    );
  });

  it('can round-trip the ADI sample from the ADIF spec', () => {
    const jsonContent = fs.readFileSync('test/data/spec-sample.json', {
      encoding: 'utf8',
    });
    const adiContent = fs.readFileSync('test/data/spec-sample.out.adi', {
      encoding: 'ascii',
    });
    expect(AdifFormatter.formatAdi(JSON.parse(jsonContent))).toEqual(
      adiContent
    );
  });

  it('can round-trip JSON from QRZ.com', () => {
    const jsonContent = fs.readFileSync('test/data/qrz.json', {
      encoding: 'utf8',
    });
    const adiContent = fs.readFileSync('test/data/qrz.out.adi', {
      encoding: 'ascii',
    });
    expect(AdifFormatter.formatAdi(JSON.parse(jsonContent))).toEqual(
      adiContent
    );
  });

  it('can round-trip JSON from WSJT-X', () => {
    const jsonContent = fs.readFileSync('test/data/wsjtx.json', {
      encoding: 'utf8',
    });
    const adiContent = fs.readFileSync('test/data/wsjtx.out.adi', {
      encoding: 'ascii',
    });
    expect(AdifFormatter.formatAdi(JSON.parse(jsonContent))).toEqual(
      adiContent
    );
  });

  it('can round-trip JSON from JS8Call', () => {
    const jsonContent = fs.readFileSync('test/data/js8call.json', {
      encoding: 'utf8',
    });
    const adiContent = fs.readFileSync('test/data/js8call.out.adi', {
      encoding: 'ascii',
    });
    expect(AdifFormatter.formatAdi(JSON.parse(jsonContent))).toEqual(
      adiContent
    );
  });
});
