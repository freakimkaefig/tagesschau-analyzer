import mockingoose from 'mockingoose';
import { ShowModel, IShowDocument } from '../src/models/show.model';

describe('test mongoose ShowModel', () => {
  it('should return the latest doc', async () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      date: new Date('2020-06-20T20:00:00').toISOString(),
      time: '20-00',
      showId: 1234,
      text: 'Lorem ispum',
    };

    const finderMock = (query: any) => {
      expect(query.getQuery()).toMatchSnapshot('find query');

      if (query.getQuery().time === '20-00') {
        return _doc;
      } else {
        return {};
      }
    };

    mockingoose(ShowModel).toReturn(finderMock, 'find');

    return ShowModel.find({ time: '20-00' }).then((doc: IShowDocument[]) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
    });
  });

  it('should create returns mock', async () => {
    mockingoose(ShowModel).toReturn(
      { _id: '507f191e810c19729de860ea' },
      'save'
    );

    const result = await ShowModel.create({
      date: new Date('2020-06-20T20:00:00').toISOString(),
      time: '20-00',
      showId: 1234,
      text: 'Lorem ispum',
    });

    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
      _id: '507f191e810c19729de860ea',
    });
  });
});
