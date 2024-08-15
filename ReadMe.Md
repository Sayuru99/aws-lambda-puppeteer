# AWS Lambda with Puppeteer

This project demonstrates how to run a Chromium browser inside an AWS Lambda function using Puppeteer. It includes examples for taking screenshots, generating PDFs, and extracting text from web pages.

## Prerequisites

Before you begin, ensure you have the following installed:

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM CLI](https://aws.amazon.com/serverless/sam/)
- [Node.js](https://nodejs.org/)

## Project Structure

- `app.js`: Main Lambda function code.
- `template.yaml`: AWS SAM template defining the Lambda function.
- `package.json`: Node.js dependencies and scripts.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Sayuru99/aws-lambda-puppeteer.git
    cd aws-lambda-puppeteer
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Build and Deploy with AWS SAM

AWS SAM (Serverless Application Model) is a framework used for building and deploying serverless applications. To deploy this Lambda function using SAM, follow these steps:

### Create an S3 Bucket

Before deploying your application, you need to create an S3 bucket to store the deployment artifacts. You can create a new S3 bucket using the AWS CLI:

```bash
aws s3 mb s3://your-s3-bucket-name
```

Replace `your-s3-bucket-name` with a unique name for your S3 bucket. Make sure to define this bucket name in the `template.yaml` file under the `Deploy` section.

### Validate the SAM Template

Before building, you can validate your SAM template to ensure everything is correct:

```bash
sam validate
```

### Build the Project

Build the Lambda function using SAM:

```bash
sam build
```

This command packages your application and prepares it for deployment.

### Deploy the Lambda Function

Deploy the function to AWS:

```bash
sam deploy --guided
```

This command will guide you through the deployment process, where you can specify:

- Stack Name
- AWS Region
- S3 Bucket for deployment artifacts (use the bucket name you created earlier)
- Whether to allow SAM to create IAM roles for your functions

During this process, SAM will upload your deployment artifacts to the specified S3 bucket and create the necessary AWS resources defined in your `template.yaml`.

### Example Usage

Once deployed, the Lambda function can be triggered according to the schedule defined in the `template.yaml`. By default, it runs every 30 minutes. The function will perform the following actions:

- Navigate to `https://github.com`
- Take a screenshot of the page
- (Optional) Generate a PDF of the page
- (Optional) Extract text from the page
- (Optional) Take a screenshot of a specific element

### Viewing Logs

To view the logs for your Lambda function, use the following command:

```bash
sam logs -n BrowserFunction --stack-name <your-stack-name> --tail
```

Replace `<your-stack-name>` with the name of your stack.

## Cleaning Up

To delete the deployed stack and all associated resources:

```bash
sam delete --stack-name <your-stack-name>
```

This command will remove the CloudFormation stack, including the Lambda function, IAM roles, and other resources.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author
### [Sayuru De Alwis](https://github.com/Sayuru99)