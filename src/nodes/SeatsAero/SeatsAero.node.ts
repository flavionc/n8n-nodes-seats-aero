import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class SeatsAero implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Seats.aero',
    name: 'seatsAero',
    icon: 'file:logo-seats-aero.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with Seats.aero API',
    defaults: {
      name: 'Seats.aero',
    },
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
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
            action: 'Get cached search results',
          },
          {
            name: 'Get Trips',
            value: 'getTrips',
            description: 'Get flight-level information from availability object',
            action: 'Get flight-level information from availability object',
            routing: {
              request: {
                method: 'GET',
                url: '=/trips/{{$parameter["id"]}}',
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
          {
            name: 'Bulk Availability',
            value: 'bulkAvailability',
            description: 'Retrieve a large amount of availability objects from one specific mileage program',
            routing: {
              request: {
                method: 'GET',
                url: '/availability',
                qs: {
                  source: '={{$parameter["source"]}}',
                  cabin: '={{$parameter["cabin"]}}',
                  start_date: '={{$parameter["start_date"].split("T")[0]}}',
                  end_date: '={{$parameter["end_date"].split("T")[0]}}',
                  origin_region: '={{$parameter["origin_region"]}}',
                  destination_region: '={{$parameter["destination_region"]}}',
                  take: '={{$parameter["take"]}}',
                  cursor: '={{$parameter["cursor"]}}',
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
            action: 'Get bulk availability',
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
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        }
      },
      {
        displayName: 'Destination Airport',
        name: 'destination_airport',
        type: 'string',
        hint: 'A list of destination airports. Comma-delimited if multiple, such as "FRA,LHR"',
        required: true,
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch'],
          },
        }
      },
      {
        displayName: 'Mileage Program',
        name: 'source',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            operation: ['bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Cabin',
        name: 'cabin',
        type: 'options',
        hint: 'Results must have this cabin available when specified',
        options: [
          { name: 'Economy', value: 'economy' },
          { name: 'Premium', value: 'premium' },
          { name: 'Business', value: 'business' },
          { name: 'First', value: 'first' },
        ],
        default: 'economy',
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        }
      },
      {
        displayName: 'Start Date',
        name: 'start_date',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        },
        description: 'Start date in YYYY-MM-DD format',
      },
      {
        displayName: 'End Date',
        name: 'end_date',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        },
        description: 'End date in YYYY-MM-DD format',
      },
      {
        displayName: 'Origin Region',
        name: 'origin_region',
        type: 'options',
        options: [
          { name: 'Africa', value: 'Africa' },
          { name: 'Asia', value: 'Asia' },
          { name: 'Europe', value: 'Europe' },
          { name: 'North America', value: 'North America' },
          { name: 'Oceania', value: 'Oceania' },
          { name: 'South America', value: 'South America' },
        ],
        default: 'North America',
        displayOptions: {
          show: {
            operation: ['bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Destination Region',
        name: 'destination_region',
        type: 'options',
        options: [
          { name: 'Africa', value: 'Africa' },
          { name: 'Asia', value: 'Asia' },
          { name: 'Europe', value: 'Europe' },
          { name: 'North America', value: 'North America' },
          { name: 'Oceania', value: 'Oceania' },
          { name: 'South America', value: 'South America' },
        ],
        default: 'North America',
        displayOptions: {
          show: {
            operation: ['bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'number',
        default: undefined,
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Take',
        name: 'take',
        type: 'number',
        default: undefined,
        description: 'Number of results to return (min: 10, max: 1000)',
        typeOptions: {
          minValue: 10,
          maxValue: 1000,
        },
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Order By',
        name: 'order_by',
        type: 'options',
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
        default: undefined,
        displayOptions: {
          show: {
            operation: ['getCachedSearch', 'bulkAvailability'],
          },
        },
      },
      {
        displayName: 'Trip ID',
        name: 'id',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            operation: ['getTrips'],
          },
        },
      }
    ],
  };
}
