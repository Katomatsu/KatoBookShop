const express = require('express');

const errorController = require('./controllers/errorController');
const {mongoConnect} = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/userModel');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(async (req, res, next) => {
	try {
    const user = await User.findById('65f6bdc13ec71de682d3108e');
    req.user = new User(user.name, user.email, user.cart, user._id)
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(8888)
})