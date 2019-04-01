const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const models = require('../models');

passport.use(new LocalStrategy({ passReqToCallback: true },
    (req, username, password, done) => {
        models.User.findOne({ where: { username }})
            .then(user => {
                if (!user) {
                    done(null, false, { message: 'Incorrect username.' });
                } else if (!user.isValidPassword(password)) {
                    done(null, false, { message: 'Incorrect password.' });
                } else {
                    done(null, user);
                }
            })
            .catch(err => done(err));
    }
));

passport.serializeUser((user, cb) => cb(null, user.id));
  
passport.deserializeUser(function(id, cb) {
    models.User.findByPk(id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
});  

module.exports = passport;