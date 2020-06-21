const MO_FR = ['09-00', '12-00', '14-00', '15-00', '16-00', '17-00', '20-00'];

export const airtimes = [
  {
    weekday: 'sunday',
    times: ['10-00', '12-00', '14-00', '18-00', '20-00'],
  },
  { weekday: 'monday', times: MO_FR },
  { weekday: 'tuesday', times: MO_FR },
  { weekday: 'wednesday', times: MO_FR },
  { weekday: 'thursday', times: MO_FR },
  { weekday: 'friday', times: MO_FR },
  {
    weekday: 'saturday',
    times: ['09-50', '12-00', '17-00', '17-50', '20-00'],
  },
];
