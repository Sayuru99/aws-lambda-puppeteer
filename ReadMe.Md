# AWS Lambda Puppeteer

This repository contains a sample code template for creating AWS Lambda functions with Puppeteer, a headless browser automation tool. Puppeteer is used to control headless Chrome or Chromium instances, allowing you to perform tasks such as web scraping, generating screenshots, or automating web interactions.

## Why Puppeteer?

[Puppeteer](https://github.com/puppeteer/puppeteer) provides a high-level API to control headless Chrome or Chromium instances. It allows you to interact with web pages programmatically, enabling various use cases such as:

- Web scraping: Extracting data from websites.
- Automated testing: Running tests in a headless browser environment.
- Generating screenshots or PDFs of web pages.
- Web automation: Automating repetitive tasks on websites.

## Dependencies

This project uses the following npm packages:

- **axios**: A promise-based HTTP client for making HTTP requests. It is used to fetch data from external APIs.
- **chrome-aws-lambda**: A package that provides a version of Chromium that can run on AWS Lambda. It is required for Puppeteer to work in a serverless environment.
- **puppeteer**: The official Puppeteer package. It is used to control headless Chrome or Chromium instances.

## Why Node.js 14.x?

The `runtime` field in the `provider` section of the `serverless.yml` file specifies the Node.js runtime version for AWS Lambda functions. In this project, Node.js version 14.x (`nodejs14.x`) is specified because it is the only version that works with `chrome-aws-lambda`. Puppeteer relies on certain features and APIs that are available in Node.js 14.x but may not be available in older versions.

## Usage

1. Clone or fork this repository.
2. Install dependencies by running the following command in your terminal:

    ```bash
    npm install
    ```

3. Customize the code in `index.js` to suit your specific use case.
4. Run the function locally using the following command:

    ```bash
    serverless invoke local -f fetchData
    ```

5. Deploy the AWS Lambda function using your preferred deployment method. For example, you can use the Serverless Framework by running:

    ```bash
    serverless deploy
    ```

6. Test the deployed Lambda function to ensure it behaves as expected.  


## Requirements

- Node.js
- AWS account with permissions to create and manage Lambda functions
- Serverless Framework (optional, but recommended for streamlined deployment)

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.