// export const times = [
//   '06-00',
//   '07-00',
//   '08-00',
//   '09-00',
//   '09-50',
//   '12-00',
//   '12-52',
//   // '12-55', // keine StartID
//   '14-00',
//   '15-00',
//   '16-00',
//   '17-00',
//   // '17-50', // keine StartID
//   '18-00',
//   '20-00',
// ];

const MO_FR = [
  '06-00',
  '07-00',
  '08-00',
  '09-00',
  '12-00',
  '14-00',
  '15-00',
  '16-00',
  '17-00',
  '20-00',
];
const SA = ['09-50', '12-00', '17-00', '20-00'];
const SU = ['10-00', '12-00', '14-00', '18-00', '20-00'];

function unique(array: string[]): string[] {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        array.splice(j--, 1);
      }
    }
  }

  return array;
}

export const times = unique(MO_FR.concat(SA).concat(SU)).sort();

export const airtimes = [
  {
    weekday: 'sunday',
    times: SU,
  },
  { weekday: 'monday', times: MO_FR },
  { weekday: 'tuesday', times: MO_FR },
  { weekday: 'wednesday', times: MO_FR },
  { weekday: 'thursday', times: MO_FR },
  { weekday: 'friday', times: MO_FR },
  {
    weekday: 'saturday',
    times: SA,
  },
];
