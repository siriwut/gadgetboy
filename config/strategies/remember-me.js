'use strict';
var passport = require('passport'),
mongoose = require('mongoose'),
Token = mongoose.model('Token'),
User = mongoose.model('User'),
RememberMeStrategy = require('passport-remember-me').Strategy,
crypto = require('crypto');

module.exports = function(){

  passport.use(new RememberMeStrategy(
    function(token, done) {
      Token.consume(token, function (err, userId) {
      
        if (err) { return done(err); }
        if (!userId) { return done(null, false); }

        User.findOne({_id:userId}).exec(function(err,user){
         if (err) { return done(err); }
         if (!user) { return done(null, false); }
       
         return done(null, user);
       });

      });

    },
    function(user, done) {   
      crypto.randomBytes(256, function(err, buffer) {
        var tokenString = buffer.toString('hex');    
        var token = new Token({token:tokenString,userId:user._id});

        token.save(function(err) {
          if (err) { return done(err); }
          return done(null, tokenString);
        });

      });


    })
  );

};