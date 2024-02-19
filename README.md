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
* Offline database for client
* Add auth strategy for tokens 
* RBAC for crawler data

== Manga ==
* Add crawling functionality for automatic updates to clients (Done)
* Data Processing API (Done)

== Budgeting ==
* Image Recognition API (Done)
* Build a small demo client to understand image recognition (Done)
* Use image recognition on receipts to find purchase information
* Categorize and cluster purchase information for insights (e.g. groceries)
* Budgeting Insights API
* Client to render user-friendly budgeting information (e.g. how much was spent on groceries over the course of X days)

== Trip Planner (for vacations and itineraries) ==
* Gather location data from a client app
* Match location data with businesses using Maps API
* Develop an itinerary based on where and when
* With access to photos, can match photo location data/time data with itinerary data to create a story
* A story could be a map of the area they visited, the route they took, pins on where they stopped and photos where the pins took place
* Share itinerary with friends so they can plan their own trips

* Scarpe flight information for cheap flights to destinations you care about

== Omnom ==
* Gather location data from a client app
* Match location data with restaurants using Maps API
* Build f(frequency of visit, restaurant rating, restaurant price, distance from home/work) -> probability user likes the restaurant (i.e. user_score)
* E.g. Low frequency + high price + high rating + long way from home/work -> probably liked it or totally overrated
* Rank restaurants by user_score and build a recommendation list that can be shared with friends

== Other ==
* Automated Testing
* Build a small Android client or Web app (Done)
* Expose server to the Internet through Cloudflared tunnel
* Secure connection with Let's Encrypt
* Containerization (Done)
* Kubernetes (Done)
* Use arm64 instead of amd64 (depending on availability of hardware)
* CI tools for automatic deployment

## Deployment Setup (local)
See https://github.com/toiletpapar/smithers-infrastructure for baremetal setup.

### Cheatsheet
#### Build your images
`smithers-infrastructure/smithers-server/build.sh`
`smithers-infrastructure/smithers-crawler/build.sh`

#### Push your images
`docker push registry.smithers.private/smithers-server:1.0`
`docker push registry.smithers.private/smithers-crawler:1.0`

#### Deploy your images to your baremetal k8s cluster with the appropriate image modifications
`kubectl apply -f smithers-infrastructure/smithers-server/smithers-deployment.yaml`
`kubectl apply -f smithers-infrastructure/smithers-crawler/smithers-cron.yaml`

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