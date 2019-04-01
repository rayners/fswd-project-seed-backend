const express = require('express');
const passport = require('../passport');

const router = express.Router();

router.get('/current', (request, response) => {
    if (request.user) {
        response.json(request.user);
    } else {
        response.sendStatus(401);
    }
});

router.post('/username-is-available', async (request, response) => {
    const User = request.app.locals.models.User;
    const user = await User.findOne({ where: { username: request.body.username }});
    response.json(!user);
});

router.post('/register', async (request, response) => {
    const User = request.app.locals.models.User;
    if (request.body.password !== request.body.password_confirm) {
        response.format({
            html: () => response.end('Passwords must match'),
            json: () => response.status(400).json({ error: 'Passwords must match' })
        });
    } else {
        const existingUser = await User.findOne({ where: { username: request.body.username }});
        if (existingUser) {
            response.format({
                html: () => response.end('User already exists'),
                json: () => response.status(400).json({ error: 'User already exists' })
            });
        } else {
            const newUser = await User.create(request.body);
            request.login(newUser, () => {
                response.format({
                    html: () => response.redirect('/'),
                    json: () => response.json(newUser)
                });
            });
        }
    }
});

router.post('/login', (request, response, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        }
        if (!user) {
            response.status(401).json(info);
        } else {
            request.login(user, (err) => {
                if (err) {
                    next(err);
                } else {
                    response.json(user);
                }
            });
        }
    })(request, response, next);
});
  
router.post('/logout', (request, response) => {
    request.logout();
    response.json(true);
});
  
router.get('/', async (request, response) => {
    const users = await request.app.locals.models.User.findAll();
    response.json(users);
});
  
router.get('/:username', async (request, response) => {
    const user = await request.app.locals.models.User.findOne({ where: { username: request.params.username }});
    if (!user) {
        response.sendStatus(404);
    } else {
        response.json(user);
    }
});

module.exports = router;