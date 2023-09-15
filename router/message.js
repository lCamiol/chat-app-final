/*
    Path: api/mensajes
*/
const {Router} = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { getChat } = require('../controllers/message');

const router = Router()

router.get('/:de',validateJWT, getChat );


module.exports= router;