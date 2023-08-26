// app.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://joyontokarmakarcse:OIoC2jdtcrX2LzDe@cluster0.sceomgg.mongodb.net/fileUpload';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
// Define the user schema and model



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/', async (req, res) => {
    res.send('Seopage1 server running')
})

const fileSchema = new mongoose.Schema({
    originalName: String,
    mimeType: String,
    filePath: String,
});

const File = mongoose.model('File', fileSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const uploadedFiles = req.files.map((file) => {
            return {
                originalName: file.originalname,
                mimeType: file.mimetype,
                filePath: `uploads/${file.originalname}`,
            };
        });

        await File.insertMany(uploadedFiles);

        res.json({ message: 'Files uploaded successfully', uploadedFiles }); // Return uploadedFiles
    } catch (error) {
        console.error('Error uploading files', error);
        res.status(500).json({ error: 'An error occurred while uploading files' });
    }
});



app.get('/files', async (req, res) => {
    try {
        const files = await File.find(); // Retrieve all files from the collection
        res.json({ files });
    } catch (error) {
        console.error('Error fetching files', error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
});
