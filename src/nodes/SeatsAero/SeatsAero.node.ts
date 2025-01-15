import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class SeatsAero implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Seats.aero',
    name: 'seatsAero',
    icon: 'file:seatsAero.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with Seats.aero API',
    defaults: {
      name: 'Seats.aero',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'seatsAeroApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://seats.aero/partnerapi',
      headers: {
        'Partner-Authorization': '={{$credentials.apiKey}}',
      },
    },
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Cached Search',
            value: 'getCachedSearch',
            description: 'Get cached search results',
            routing: {
              request: {
                method: 'GET',
                url: '/search',
                qs: {
                  origin_airport: '={{$parameter["origin_airport"]}}',
                  destination_airport: '={{$parameter["destination_airport"]}}',
                  cabin: '={{$parameter["cabin"]}}',
                  start_date: '={{$parameter["start_date"].split("T")[0]}}',
                  end_date: '={{$parameter["end_date"].split("T")[0]}}',
                  cursor: '={{$parameter["cursor"]}}',
                  take: '={{$parameter["take"]}}',
                  order_by: '={{$parameter["order_by"]}}',
                  skip: '={{$parameter["skip"]}}',
                },
              },
              output: {
                postReceive: [
                  {
                    type: 'set',
                    properties: {
                      value: '={{ { "success": true, "data": $response.body } }}'
                    }
                  }
                ],
              },
            },
          },
        ],
        default: 'getCachedSearch',
      },
      {
        displayName: 'Origin Airport',
        name: 'origin_airport',
        type: 'string',
        hint: 'A list of origin airports. Comma-delimited if multiple, such as "SFO,LAX"',
        required: true,
        default: '',
      },
      {
        displayName: 'Destination Airport',
        name: 'destination_airport',
        type: 'string',
        hint: 'A list of destination airports. Comma-delimited if multiple, such as "FRA,LHR"',
        required: true,
        default: '',
      },
      {
        displayName: 'Cabin',
        name: 'cabin',
        type: 'options',
        hint: 'Results must have this cabin available when specified',
        required: false,
        options: [
          { name: 'Economy', value: 'economy' },
          { name: 'Premium', value: 'premium' },
          { name: 'Business', value: 'business' },
          { name: 'First', value: 'first' },
        ],
        default: 'economy',
      },
      {
        displayName: 'Start Date',
        name: 'start_date',
        type: 'dateTime',
        required: false,
        default: '',
        description: 'Start date in YYYY-MM-DD format',
      },
      {
        displayName: 'End Date',
        name: 'end_date',
        type: 'dateTime',
        required: false,
        default: '',
        description: 'End date in YYYY-MM-DD format',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'number',
        required: false,
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        },
      },
      {
        displayName: 'Take',
        name: 'take',
        type: 'number',
        required: false,
        default: '',
        description: 'Number of results to return (min: 10, max: 1000)',
        typeOptions: {
          minValue: 10,
          maxValue: 1000,
        },
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        },
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
        required: false,
        default: 'departure_date',
        options: [
          { name: 'Departure Date', value: 'departure_date' },
          { name: 'Lowest Mileage', value: 'lowest_mileage' },
        ],
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        },
      },
      {
        displayName: 'Skip',
        name: 'skip',
        type: 'number',
        hint: 'How many results to skip',
        required: false,
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        },
      },
    ],
  };
}
