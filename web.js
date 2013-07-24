var express = require('express'),
    ElasticSearchClient = require('elasticsearchclient'),
    url = require('url');

var app = module.exports = express.createServer();

if (process.env.BONSAI_URL == 'undefined') {
    throw new Exception "ElasticSearch server is undefined";
}

var connectionString = url.parse(process.env.BONSAI_URL);

var serverOptions = {
    host: connectionString.hostname,
    port: connectionString.port,
    secure: false,
    auth: {
        username: connectionString.auth ? connectionString.auth.split(":")[0] : null,
        password: connectionString.auth ? connectionString.auth.split(":")[1] : null
    }
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

var _index = "sample";
var _type = 'document';

if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'My Application Name' // optional
  });
}

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', function (req, res) {
    res.render('index', {"result":""})
});

app.get('/search', function (req, res) {
    var qryObj = {
        "query":{
            "query_string":{
                "query":req.query.q
            }
        }
    };
    elasticSearchClient.search(_index, _type, qryObj)
        .on('data',
        function (data) {
            res.render('search', { result:JSON.parse(data)})
        }).on('error', function (error) {
            res.render('search', { result:error })
        })
        .exec()
});


app.get('/index', function (req, res) {
    elasticSearchClient.createIndex(_index, {}, {}).on('data',
        function (data) {
            var commands = []
            commands.push({ "index":{ "_index":_index, "_type":_type, "_id":"1"} });
            commands.push({'name':'Reliability',
                'text':'Reliability is improved if multiple ' +
                'redundant sites are used, which makes well-designed cloud ' +
                'computing suitable for business continuity and disaster recovery. '});

            commands.push({ "index":{ "_index":_index, "_type":_type, "_id":"2"} });
            commands.push({'name':'Virtualization',
                'text':'Virtualization technology allows servers and storage ' +
                'devices to be shared and utilization be increased. ' +
                'Applications can be easily migrated from one physical server to another. '});

            commands.push({ "index":{ "_index":_index, "_type":_type, "_id":"3"} });
            commands.push({'name':'Platform as a service',
                'text':'Platform as a service (PaaS) is a category of cloud ' +
                'computing services that provides a computing platform and a solution stack as a service'});

            commands.push({ "index":{ "_index":_index, "_type":_type, "_id":"4"} });
            commands.push({'name':'Infrastructure as a service',
                'text':'In the most basic cloud-service model, providers of ' +
                'IaaS offer computers - physical or (more often) virtual machines - and other resources.'});

            elasticSearchClient.bulk(commands, {})
                .on('data', function (data) {
                    res.render('index', {result:'Indexing Completed!'});
                })
                .on('error', function (error) {
                    res.render('index', {result:error});
                })
                .exec();
        }).on('error', function (error) {
            res.render('index', {result:error});
        }).exec();
})

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
