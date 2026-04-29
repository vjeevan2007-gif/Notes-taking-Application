// State Management
let notes = JSON.parse(localStorage.getItem('my_notes')) || [];
let editId = null;

const titleInput = document.getElementById('noteTitle');
const contentInput = document.getElementById('noteContent');
const categoryInput = document.getElementById('noteCategory');
const addBtn = document.getElementById('addBtn');
const notesGrid = document.getElementById('notesGrid');
const searchBar = document.getElementById('searchBar');
const filterCat = document.getElementById('filterCategory');
const saveStatus = document.getElementById('saveStatus');

// INITIAL RENDER
renderNotes();

// ADD / UPDATE NOTE
addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const category = categoryInput.value;

    if (!title || !content) {
        alert("Please fill in both title and content!");
        return;
    }

    if (editId) {
        notes = notes.map(note => note.id === editId ? 
            { ...note, title, content, category, timestamp: new Date().toLocaleString() } : note
        );
        editId = null;
        addBtn.textContent = 'Save Note';
    } else {
        const newNote = {
            id: Date.now(),
            title,
            content,
            category,
            timestamp: new Date().toLocaleString()
        };
        notes.unshift(newNote);
    }

    saveAndRender();
    clearFields();
});

// AUTO-SAVE LOGIC
let timeout = null;
contentInput.addEventListener('keyup', () => {
    clearTimeout(timeout);
    saveStatus.textContent = "Typing...";
    timeout = setTimeout(() => {
        if (contentInput.value.trim() !== "") {
            saveStatus.textContent = "Changes ready to save";
        } else {
            saveStatus.textContent = "";
        }
    }, 1000);
});

// DELETE NOTE
function deleteNote(id) {
    if (confirm("Delete this note?")) {
        notes = notes.filter(n => n.id !== id);
        saveAndRender();
    }
}

// EDIT NOTE
function editNote(id) {
    const note = notes.find(n => n.id === id);
    titleInput.value = note.title;
    contentInput.value = note.content;
    categoryInput.value = note.category;
    editId = id;
    addBtn.textContent = 'Update Note';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// SEARCH & FILTER
[searchBar, filterCat].forEach(element => {
    element.addEventListener('input', renderNotes);
});

function renderNotes() {
    const searchTerm = searchBar.value.toLowerCase();
    const filterValue = filterCat.value;

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm) || 
                             note.content.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'All' || note.category === filterValue;
        return matchesSearch && matchesFilter;
    });

    notesGrid.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <span class="note-title">${note.title}</span>
                <span class="note-category">${note.category}</span>
            </div>
            <div class="note-body">${note.content}</div>
            <div class="note-footer">
                <span>${note.timestamp}</span>
                <div class="actions">
                    <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function saveAndRender() {
    localStorage.setItem('my_notes', JSON.stringify(notes));
    renderNotes();
    saveStatus.textContent = "Saved to LocalStorage";
    setTimeout(() => saveStatus.textContent = "", 2000);
}

function clearFields() {
    titleInput.value = '';
    contentInput.value = '';
    categoryInput.value = 'General';
    editId = null;
    addBtn.textContent = 'Save Note';
}

document.getElementById('clearBtn').addEventListener('click', clearFields);