const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage })
//const upload = multer()
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(multer().any()); - groźne!! i odradzane w dokumentacji;
//app.use(multer().single('image'));

app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about', {layout: 'dark'});
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
 res.render('hello', { name: req.params.name });
});

app.post('/contact/send-message', upload.single('image'), (req, res) => {
  
  const { author, sender, title, message } = req.body;

  if(author && sender && title && message && req.file) {
    res.render('contact', {isSent: true, fileName: req.file.originalname});
  }
  else {
    res.render('contact', {isError: true});
  }

});

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});