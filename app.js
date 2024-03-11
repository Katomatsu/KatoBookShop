const express = require('express');

const errorController = require('./controllers/errorController')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))
app.use(express.static('./public'))

app.use('/admin', adminRoutes)
app.use(shopRoutes);

app.use(errorController.get404)

app.listen(8888);
