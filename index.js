// Import required modules
const app = require('./app')
const mongoose = require('mongoose');

// Disable deprecation warnings
mongoose.set('useFindAndModify', false);

// Connect to MongoDB database using Mongoose
mongoose.connect('mongodb+srv://Nala:Pepe..123@cluster0.i5588ed.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB database');
    // Start server
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
})
.catch(err => console.error('Error connecting to MongoDB:', err));



