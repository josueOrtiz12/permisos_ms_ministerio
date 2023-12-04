const { error } = require("npmlog");
const { BAD_REQUEST, VENEZUELAN_ID_REGEX, UNAUTHORIZED } = require("../common/constants")
const {verifyToken} = require("../utils/jwt")
const secretKey = process.env.SECRET_KEY;

   // Middleware para verificar el token en las rutas protegidas
   function verifyTokenMiddleware(req, res, next) {
    try{
        const token = req.headers.authorization.split('Bearer').pop();
        if(!token){
            throw new Error('Error token require');
        }
        const result = verifyToken(token)
        if(!result){
            throw new Error ('Error in authenticate user');
        }
    next()
    }catch(e){
        return res.status(UNAUTHORIZED).send({ code : 1, message : e.message});
    }

  }


function paginationMiddleware(req, res, next) {
    try {
        const { query: { pageNumber, pageSize } } = req
        if(!Number.isInteger(parseInt(pageNumber))) throw new Error('Query param pageNumber should be integer')
        if(!Number.isInteger(parseInt(pageSize))) throw new Error('Query param pageSize should be integer')
        
        req.query.pageNumber = parseInt(pageNumber)
        req.query.pageSize = parseInt(pageSize)
        next()
    } catch (e) {
        return res.status(BAD_REQUEST).send({ code: 1, message: e.message })       
    }
}

function venezuelanIdMiddleware(req, res, next) {
    try {
        const id = req.body.id || req.params.id
        if(!id) throw new Error('id is required')
        if(!VENEZUELAN_ID_REGEX.test(id)) throw new Error('id is invalid')
        next()
    } catch (e) {
        return res.status(BAD_REQUEST).send({ code: 1, message: e.message })      
    }
}

module.exports = {
    paginationMiddleware,
    venezuelanIdMiddleware,
    verifyTokenMiddleware
}