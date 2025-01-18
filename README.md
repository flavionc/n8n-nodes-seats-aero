<div style="display: flex; justify-content: left; align-items: center; gap: 20px;">
  <img src="./dist/logo-n8n.svg" width="100" alt="n8n logo">
  <img src="dist/nodes/SeatsAero/logo-seats-aero.svg" width="100" alt="Seats.aero logo">
</div>

# n8n-nodes-seats-aero

This repository contains an n8n community node for integrating with Seats.aero's API. The node enables automation of flight search and availability monitoring workflows, including:

- Searching for available award seats
- Monitoring specific routes and availability
- Integrating flight data with other n8n workflows
- Retrieving detailed flight and loyalty program information

## About Seats.aero

[Seats.aero](https://seats.aero/) is a powerful flight search engine that helps users find available award seats across multiple airlines and alliances. Key features include:

- Comprehensive search across multiple airlines and alliances
- Real-time availability of award seats
- Advanced filtering and sorting options
- Integration with major loyalty programs

## Installation and Configuration

Follow the installation instructions for [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

## Usage

### Credentials
1. Add Seats.aero API credentials.
2. Enter your API key.

### Available Operations
- **Cached Search**: Search for available flights between specific airports and dates.
- **Bulk Availability**: Retrieve a large amount of availability objects from one specific mileage program. Use this for broad availability searches across regions.
- **Get Trips**: Retrieve flight-level information from an Availability object.
- **Get Routes**: Get information about available routes.

## Resources

* [Documentation](https://docs.n8n.io/integrations/community-nodes/)
* [n8n community](https://community.n8n.io)
* [Seats.aero API Documentation](https://docs.seats.aero/)
* [Author's LinkedIn](https://www.linkedin.com/in/flavio-nc/)
* [Artificial Valley Community](https://chat.whatsapp.com/DHDGIcVPVcz8ApmthWXOLV)

## 🤝 Contribution
Contribute to the growth of this project! You can help in several ways:

- Pull Requests: Send improvements, fixes or new features.
- Issues: Report problems or suggest new ideas.
- Suggestions: Share your opinions and feedback.
- Documentation: Help improve or expand existing documentation.

Please make sure to follow our [Code of Conduct](https://github.com/n8n-io/n8n/blob/master/CODE_OF_CONDUCT.md) and [Contribution Guidelines](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md).

## License

n8n is [fair-code](http://faircode.io) distributed under the [**Sustainable Use License**](https://github.com/n8n-io/n8n/blob/master/LICENSE.md).

Additional information about the license can be found in the [FAQ](https://docs.n8n.io/reference/license/#faq).
