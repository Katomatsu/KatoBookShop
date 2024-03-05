const path = require('path');
const express = require('express');

const rootDir = require('./util/path')
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found', path: ''})
})

app.listen(8888);
