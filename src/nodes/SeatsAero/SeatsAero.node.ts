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
            name: 'Get Cached Search',
            value: 'getCachedSearch',
          }
        ],
        default: 'getCachedSearch',
      },
      {
        displayName: 'Origin Airport',
        name: 'origin_airport',
        type: 'string',
        hint: 'A list of origin airports. Comma-delimited if multiple, such as "SFO,LAX".',
        required: true,
        default: '',
      },
      {
        displayName: 'Destination Airport',
        name: 'destination_airport',
        type: 'string',
        hint: 'A list of destination airports. Comma-delimited if multiple, such as "FRA,LHR".',
        required: true,
        default: '',
      },
      {
        displayName: 'Cabin',
        name: 'cabin',
        type: 'options',
        required: false,
        options: [
          { name: 'Economy', value: 'economy' },
          { name: 'Premium', value: 'premium' },
          { name: 'Business', value: 'business' },
          { name: 'First', value: 'first' },
        ],
        default: 'economy', // Valor padrão para cabin
      },
      {
        displayName: 'Start Date',
        name: 'start_date',
        // TODO: Usar DateTime e verificar o erro que está ocorrendo ao retirar o time da string
        type: 'string',
        required: false,
        default: '',
        description: 'Data de início no formato YYYY-MM-DD',
      },
      {
        displayName: 'End Date',
        name: 'end_date',
        // TODO: Usar DateTime e verificar o erro que está ocorrendo ao retirar o time da string
        type: 'string',
        required: false,
        default: '',
        description: 'Data de término no formato YYYY-MM-DD',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'number',
        required: false,
        default:'',
        displayOptions: {
          show: {
            operation: ['getCachedSearch']
          }
        }
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
            operation: ['getCachedSearch']
          }
        }
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
            operation: ['getCachedSearch']
          }
        }
      },
      {
        displayName: 'Skip',
        name: 'skip',
        type: 'number',
        required: false,
        default: '',
        displayOptions: {
          show: {
            operation: ['getCachedSearch']
          }
        }
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
        if (operation === 'getCachedSearch') {
          const origin_airport = this.getNodeParameter('origin_airport', i) as string;
          const destination_airport = this.getNodeParameter('destination_airport', i) as string;
          
          // Validar códigos IATA dos aeroportos
          const airportRegex = /^[A-Z]{3}(,[A-Z]{3})*$/;
          if (!airportRegex.test(origin_airport)) {
            throw new Error('Código(s) do aeroporto de origem inválido(s). Use códigos IATA de 3 letras, separados por vírgula se múltiplos.');
          }
          if (!airportRegex.test(destination_airport)) {
            throw new Error('Código(s) do aeroporto de destino inválido(s). Use códigos IATA de 3 letras, separados por vírgula se múltiplos.');
          }
          const cabin = this.getNodeParameter('cabin', i) as string;
          const start_date = this.getNodeParameter('start_date', i) as string;
          const end_date = this.getNodeParameter('end_date', i) as string;
          
          const cursor = this.getNodeParameter('cursor', i) as number;
          const take = this.getNodeParameter('take', i) as number || 500;
          const order_by = this.getNodeParameter('order_by', i) as string;
          const skip = this.getNodeParameter('skip', i) as number;
          // Montar query string dinamicamente
          const params = new URLSearchParams({
            origin_airport,
            destination_airport
          });
          
          if (cabin) params.set('cabin', cabin);
          if (start_date) params.set('start_date', start_date);
          if (end_date) params.set('end_date', end_date);
          if (cursor) params.set('cursor', cursor.toString());
          if (take) params.set('take', take.toString());
          if (order_by) params.set('order_by', order_by);
          if (skip) params.set('skip', skip.toString());

          const response = await this.helpers.request({
            method: 'GET',
            uri: `https://seats.aero/partnerapi/search?${params.toString()}`,
            headers: {
              'Partner-Authorization': credentials.apiKey as string,
            },
            json: true,
          });
          returnData.push(...this.helpers.returnJsonArray(response));
        }
      } catch (error) {
        let errorMessage = 'Ocorreu um erro';
        
        if (error.response) {
          // Erro da API
          if (error.response.status === 401) {
            errorMessage = 'Credenciais inválidas. Verifique sua API Key.';
          } else if (error.response.status === 400) {
          const errorData = error.response?.data || {};
          console.error('Erro completo da API:', JSON.stringify(errorData, null, 2));
          errorMessage = `Requisição inválida: ${errorData.message || errorData.error || 'Verifique os parâmetros fornecidos'}`;
          } else if (error.response.status === 429) {
            errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde.';
          } else {
            errorMessage = `Erro na API: ${error.response.status} - ${error.response.statusText}`;
          }
        } else if (error.request) {
          // Erro de rede
          errorMessage = 'Falha na conexão com a API. Verifique sua conexão com a internet.';
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Tempo limite de conexão excedido. Tente novamente.';
        } else {
          // Outros erros
          errorMessage = error.message || 'Erro desconhecido';
        }

        if (this.continueOnFail()) {
          returnData.push({ json: { error: errorMessage } });
          continue;
        }
        throw new Error(errorMessage);
      }
    }

    return this.prepareOutputData(returnData);
  }
}
