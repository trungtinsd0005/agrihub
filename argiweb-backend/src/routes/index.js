const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const PaymentRouter = require('./PaymentRouter')
const OrderRouter = require('./OrderRouter')
const ImageRouter = require('./ImageRouter');


const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/image', ImageRouter); 
}

module.exports = routes