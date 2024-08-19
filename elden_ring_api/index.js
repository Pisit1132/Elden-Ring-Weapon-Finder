const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// MongoDB Atlas connection string (replace <password> with your actual password)
const uri = 'mongodb+srv://Pisit:bader@cluster0.wtysvr7.mongodb.net/EldenRingWeapons?retryWrites=true&w=majority';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
});

// Define the schema based on the structure of the imported JSON data
const weaponSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    category: String,
    weight: Number,
    requiredAttributes: {
        Str: Number,
        Dex: Number,
        Int: Number,
        Fai: Number,
        Arc: Number
    },
    attack: Object,
    defence: Object,
    scalesWith: Object
});

const Weapon = mongoose.model('Weapon', weaponSchema);

// API route to get weapons based on user stats
app.get('/weapons', async (req, res) => {
    const { Str, Dex, Int, Fai, Arc } = req.query;

    try {
        // Build the query dynamically
        let query = {};

        if (Str) {
            query['requiredAttributes.Str'] = { $lte: Str };
        }
        if (Dex) {
            query['requiredAttributes.Dex'] = { $lte: Dex };
        }
        if (Int) {
            query['requiredAttributes.Int'] = { $lte: Int };
        }
        if (Fai) {
            query['requiredAttributes.Fai'] = { $lte: Fai };
        }
        if (Arc) {
            query['requiredAttributes.Arc'] = { $lte: Arc };
        }

        const weapons = await Weapon.find(query);
        res.json(weapons);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching weapons', error: err });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
