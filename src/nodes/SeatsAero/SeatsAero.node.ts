import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

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
  properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Available Flights',
            value: 'getAvailableFlights',
          },
          {
            name: 'Get Flight Details',
            value: 'getFlightDetails',
          },
          {
            name: 'Get Airports',
            value: 'getAirports',
          },
          {
            name: 'Get API Configuration',
            value: 'getApiConfiguration',
          },
        ],
        default: 'getAvailableFlights',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'string',
        displayOptions: {
          show: {
            operation: [
              'getAvailableFlights',
            ],
          },
        },
        default: '',
        placeholder: 'e.g. GRU',
        description: 'IATA code of the origin airport',
      },
      {
        displayName: 'Destination',
        name: 'destination',
        type: 'string',
        displayOptions: {
          show: {
            operation: [
              'getAvailableFlights',
            ],
          },
        },
        default: '',
        placeholder: 'e.g. JFK',
        description: 'IATA code of the destination airport',
      },
      {
        displayName: 'Flight ID',
        name: 'flightId',
        type: 'string',
        displayOptions: {
          show: {
            operation: [
              'getFlightDetails',
            ],
          },
        },
        default: '',
        description: 'ID of the flight to get details for',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('seatsAeroApi');

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === 'getAvailableFlights') {
          const origin = this.getNodeParameter('origin', i) as string;
          const destination = this.getNodeParameter('destination', i) as string;
          
          const response = await this.helpers.request({
            method: 'GET',
            uri: `https://api.seats.aero/flights?origin=${origin}&destination=${destination}`,
            headers: {
              'X-API-Key': credentials.apiKey as string,
            },
            json: true,
          });

          returnData.push(...this.helpers.returnJsonArray(response));
        }
        else if (operation === 'getFlightDetails') {
          const flightId = this.getNodeParameter('flightId', i) as string;
          
          const response = await this.helpers.request({
            method: 'GET',
            uri: `https://api.seats.aero/flights/${flightId}`,
            headers: {
              'X-API-Key': credentials.apiKey as string,
            },
            json: true,
          });

          returnData.push(...this.helpers.returnJsonArray(response));
        }
        else if (operation === 'getAirports') {
          const response = await this.helpers.request({
            method: 'GET',
            uri: 'https://api.seats.aero/airports',
            headers: {
              'X-API-Key': credentials.apiKey as string,
            },
            json: true,
          });

          returnData.push(...this.helpers.returnJsonArray(response));
        }
        else if (operation === 'getApiConfiguration') {
          const response = await this.helpers.request({
            method: 'GET',
            uri: 'https://api.seats.aero/config',
            headers: {
              'X-API-Key': credentials.apiKey as string,
            },
            json: true,
          });

          returnData.push(...this.helpers.returnJsonArray(response));
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return this.prepareOutputData(returnData);
  }
}
