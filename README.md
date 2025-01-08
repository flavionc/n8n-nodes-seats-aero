# n8n-nodes-seats-aero

Community node for integrating Seats.aero with n8n

## Installation

1. Clone the repository:
```bash
git clone https://github.com/flavionc/n8n-nodes-seats-aero.git
cd n8n-nodes-seats-aero
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Link the package locally:
```bash
npm link
```

5. In your n8n installation directory:
```bash
npm link n8n-nodes-seats-aero
```

6. Restart n8n

## Usage

### Credentials
1. Add Seats.aero API credentials
2. Enter your API key

### Nodes
- **Get Available Flights**: Search for available flights between two airports
- **Get Flight Details**: Get detailed information about a specific flight
- **Get Airports**: List all available airports
- **Get API Configuration**: Get API configuration and limits

## Examples

### Get Available Flights
1. Add Seats.aero node
2. Select "Get Available Flights" operation
3. Enter origin and destination airport codes (e.g. GRU, JFK)
4. Execute the workflow

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT
