var mongoose = require('mongoose');

module.exports = function(app, passport) {

    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
      res.render('index.ejs'); // load the index.ejs file
    });

    //app.get('/item',function(req, res) {
    //    Item.findOne(function (err, item) {
    //        if (!err) {
    //           res.render('list.ejs',{
    //               item:req.item
    //           });
    //        } else {
    //            res.statusCode = 500;
    //            log.error('Internal error(%d): %s', res.statusCode, err.message);
    //            return res.send({error: 'Server error'});
    //        }
    //    });
    //});

    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // SIGNUP ==============================
    app.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // PROFILE SECTION =====================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


    // FACEBOOK ROUTES =====================
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // TWITTER ROUTES ======================
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

     //VKONTAKTE ROUTES ======================
    app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

   //  handle the callback after twitter has authenticated the user
    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

};



