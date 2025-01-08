import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SeatsAeroApi implements ICredentialType {
  name = 'seatsAeroApi';
  displayName = 'Seats.aero API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];
}
