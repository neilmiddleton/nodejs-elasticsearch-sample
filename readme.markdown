## Heroku Sample Node.js Application.

This example illustrates basic features of Heroku & [ElasticSearch](http://www.elasticsearch.org) as service.

To create initial index and sample data click Create Sample Index & Data! on the index page.

Type "*" or "cloud" to search box and hit enter for sample search results.

## Local Setup

```
npm install
foreman start
```

Note: If not on OS X, or using an ElasticSearch install other than Homebrew, you may
need to edit `Procfile` to respect your local systems command.

## Heroku Deployment

This sample can be deployed to Heroku with no change.

Make sure to install Bonsai ElasticSearch Addon

```
heroku addons:add bonsai:starter
```