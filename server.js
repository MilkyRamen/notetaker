const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4444;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/api/notes', (req, res) => {
    const notes = readNotesFromFile();
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const notes = readNotesFromFile();

const newNote = {
    id: generateUniqueId(),
    title: req.body.title,
    text: req.body.text,
};

notes.push(newNote);

writeNotesToFile(notes);

res.json(newNote);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function readNotesFromFile() {
    try {
        const notesData = fs.readFileSync('db.json', 'utf8');

        const notes = JSON.parse(notesData);
        return notes;
    } catch (error) {
        console.error('error reading notes from file', error);
        return[];
    }
}

function writeNotesToFile(notes) {
    try {
        const notesData = JSON.stringify(notes, null, 2);

        fs.writeFileSync('db.json', notesData);
        console.log('notes written to file successfully');
    } catch (error) {
        console.error('error writing notes to file');
    }
}

function generateUniqueId() {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 10000).toString();
    const uniqueId = timestamp + randomNumber;

    return uniqueId;
}