# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Running neo4j database

In the project directory, you can run:

### `docker-compose up`

Then navigate to localhost: 7474 and ingest data with query `CREATE (p:Patient {name: "Patient1"}), (p2:Patient {name: "Patient2"}), (p3:Patient {name: "Patient3"}), (p4:Patient {name: "Patient4"}), (d:Doctor {name: "Doctor House"}), (d2:Doctor {name: "Doctor Evil"}), (h:Hospitl {name: "Hospital 1"}), (p)-[:Observed_by]->(d), (p2)-[:Observed_by]->(d), (p3)-[:Observed_by]->(d2), (p4)-[:Observed_by]->(d2), (d)-[:Works_in]->(h), (d2)-[:Works_in]->(h), (i:HealthIssues {name: "Health issues"}), (i2:HealthIssues {name: "Health issues"}), (i3:HealthIssues {name: "Health issues"}), (i4:HealthIssues {name: "Health issues"}), (p)-[:of]->(i), (p2)-[:of]->(i2), (p3)-[:of]->(i3), (p4)-[:of]->(i4), (ii:Issue {name: "diarrhea"}), (ii)-[:of]->(i), (ii2:Issue {name: "Cancer"}), (ii2)-[:of]->(i2) `

or any query you want

### Then you can use it

Also u can open [http://localhost:7474](http://localhost:7474) to ingest or see data through neo4j aura
