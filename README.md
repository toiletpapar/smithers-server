# SMITHERS AI
Trying to use image recognition on reciepts for automatic budgeting

Ultimately would like to be able to build an assistant for helping in everyday life.

## Roadmap
* Boilerplate (Done)
* Live Reload (Done)
* Secret Manager (Done)
* Linter (Done)
* Database (Done)
* Seeding (Done)
* Authentication (Done)
* Add auth strategy for tokens 
* RBAC for crawler data

== Manga ==
* Add crawling functionality for automatic updates to clients
* Data Processing API

== Budgeting ==
* Image Recognition API (Done)
* Build a small demo client to understand image recognition (Done)
* Matching algo with business directory API

== Other ==
* Automated Testing
* Build a small Android client or Web app
* Expose server to the Internet
* Secure connection with Let's Encrypt
* Containerization
* Kubernetes
* Use arm64 instead of amd64
* CI tools for automatic deployment

## Deployment Setup (local)
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

## Deployment Setup (cloud)
* Update secrets for multiple enviornments
* Containerize database, server, crawlers
* Configure artifact repository
* GKE Autopilot
  * psql container (internal service/stateful set/volumes)
  * webserver container (external service)
  * crawler containers (crons)
  * NGINX Ingress
* Certificate (Let's Encrypt)
* See toiletpapar/infrastructure for details

## TODO
* Follow recommendations from https://www.postgresql.org/docs/current/populate.html for seeding
* Use Stored Procedures
* Allowing sharing entities given permissions
* Refactor DB & SecretClient to parent package: used in smithers-server && smithers-crawler