# SMITHERS AI (BUDGETING-SERVER)
Trying to use image recognition on reciepts for automatic budgeting

Ultimately would like to be able to build an assistant for helping in everyday life.

## Roadmap
* Boilerplate (Done)
* Live Reload (Done)
* Secret Manager (Done)
* Linter (Done)
* Database (Done)
* Seeding
* Data Processing API
* Image Recognition API (Done)
* Build a small demo client to understand image recognition (Done)
* Matching algo with business directory API
* Automated Testing
* Build a small Android client or Web app
* Expose server to the Internet
* Secure connection with Let's Encrypt
* Containerization
* Kubernetes
* CI tools for automatic deployment

## Deployment
Cluster of two nodes:
* Pi
* Laptop

Currently manually deploy server on pi
* SSH into the pi
* (As required) Clone this repository with git
* `npm i`
* `npm run build`
* (As required) Grab the gcloud service account keys from google cloud storage `budget-server-secrets` and put it in `{repo}/credentials` directory
* `npm run start`

Currently manually deploy database on laptop
When deploying the psql database remember to:
* Update the pg_hba.conf file for remote access

## Next Steps
* ~Create tables and seed for storing location of blob data on the cloud (nothing relational yet)~
* ~Start with uploading a picture and storing the Blob through an endpoint~
* Create a client that can upload the picture using the endpoint
  - a form to input items for the two endpoints
  - read data and display
* Goal: end to end scaffold

## TODO
* Follow recommendations from https://www.postgresql.org/docs/current/populate.html for seeding
* Use Stored Procedures