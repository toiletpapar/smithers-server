# BUDGETING-SERVER
Trying to use image recognition on reciepts for automatic budgeting

Built to run in low-memory environments

## Roadmap
* Boilerplate (Done)
* Live Reload (Done)
* Secret Manager (Done)
* Linter (Done)
* Database (Done)
* Data Processing API
* Image Recognition API (Done)
* Build a small demo client to understand image recognition
* Matching algo with business directory API
* Automated Testing
* Build a small Android client or Web app
* Expose server to the Internet
* Secure connection with Let's Encrypt
* Containerization
* Kubernetes
* CI tools for automatic deployment

## Deployment
Currently manually deployed on a single node
* SSH into the pi
* (As required) Clone this repository with git
* `npm i`
* `npm run build`
* (As required) Grab the gcloud service account keys from google cloud storage `budget-server-secrets` and put it in `{repo}/credentials` directory
* `npm run start`