
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var Item = require('./app/models/item');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
//require('./config/operations');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());// this will let us get the data from a POST

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/list')
    // create item (accessed at POST http://localhost:8080/api/items)
    .post(function(req, res) {
            //res.send(req.body.item_name);
            //res.send(req.body.item_count);
        var item = new Item();      // create a new instance of the Item model
        item.item_name = req.body.item_name;  // set the items name (comes from the request)
        item.count = req.body.count;

        // save the item and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
        });

    })
    // get all the items (accessed at GET http://localhost:8080/api/items)
    .get(function(req, res) {
            Item.find(function(err, items) {
            if (err)
                res.send(err);
            //res.send(items);
            res.render('list.ejs',{
                items:items.map(x => x.toObject())
            });
        });
    });

router.route('/list/:item_id')

    // get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
    .get(function(req, res) {
        Item.findById(req.params.item_id, function(err, item) {
            if (err)
                res.send(err);
            res.json(item);//send()
        });
    })

// update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
.put(function(req, res) {

    // use our item model to find the item we want
    Item.findById(req.params.item_id, function(err, item) {

        if (err)
            res.send(err);

        item.item_name = req.body.item_name;  // update the items info
        item.count = req.body.count;

        // save the item
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item updated!' });
        });

    });
})
    // delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.item_id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


app.listen(port);
console.log('The magic happens on port ' + port);