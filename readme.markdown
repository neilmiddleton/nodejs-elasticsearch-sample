## Heroku Sample Node.js Application.

This example illustrates basic search features of Heroku & ([ElasticSearch](http://www.elasticsearch.org) as service).

Sample application is using [elasticsearchclient](https://github.com/phillro/node-elasticsearch-client) Node.js ElasticSearch client

To create initial index and sample data click Create Sample Index&Data! (2 sample documents will be created.) at index page.

Type "*" or "cloud" to search box and hit enter for sample search results.


## Local Setup

To run example in your local environment with a local ElasticSearch instance, change connection string with local url string inside web.js

var connectionString = url.parse('http://localhost:9200')


## Heroku Deployment

This sample can be deployed to Heroku with no change.

* Install SearchBox ElasticSearch Addon

Deploy sample application and experience real time search.
