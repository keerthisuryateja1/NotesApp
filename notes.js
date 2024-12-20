// Select the "Add Note" button
const addBtn = document.getElementById('add');

// Load saved notes from local storage
const notes = JSON.parse(localStorage.getItem('notes')) || [];

// Display existing notes on page load
if (notes.length) {
  notes.forEach((note) => addNewNote(note.text, note.canvasData));
}

// Add event listener to the "Add Note" button
addBtn.addEventListener('click', () => addNewNote());

// Function to create a new note
function addNewNote(text = '', canvasData = null) {
  const note = document.createElement('div');
  note.classList.add('note');

  note.innerHTML = `
    <div class="tools">
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main ${text ? '' : 'hidden'}"></div>
    <textarea class="${text ? 'hidden' : ''}"></textarea>
    <canvas class="note-canvas"></canvas>
  `;

  const editBtn = note.querySelector('.edit');
  const deleteBtn = note.querySelector('.delete');
  const main = note.querySelector('.main');
  const textArea = note.querySelector('textarea');
  const canvas = note.querySelector('.note-canvas');
  const ctx = canvas.getContext('2d');

  // Resize the canvas based on note's size
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  // Call resizeCanvas on window resize or whenever the note is resized
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Populate the note content
  textArea.value = text;
  main.innerHTML = marked(text);

  // If there is canvas data, restore the drawing
  if (canvasData) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = canvasData;
  }

  // Delete note functionality
  deleteBtn.addEventListener('click', () => {
    note.remove();
    updateLocalStorage();
  });

  // Edit note functionality
  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
  });

  // Save note content on input
  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    main.innerHTML = marked(value);
    updateLocalStorage();
  });

  // Add the note to the DOM
  document.body.appendChild(note);

  // Save canvas state to local storage
  canvas.addEventListener('mouseup', () => {
    saveCanvasState(canvas);
  });
}

// Function to save canvas drawing to local storage
function saveCanvasState(canvas) {
  const canvasData = canvas.toDataURL(); // Save canvas image as base64 string
  const notesText = document.querySelectorAll('textarea');
  const notes = [];

  notesText.forEach((textArea, index) => {
    const text = textArea.value;
    notes.push({
      text,
      canvasData: canvasData, // Save canvas image data along with text
    });
  });

  localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to update local storage with notes
function updateLocalStorage() {
  const textAreas = document.querySelectorAll('textarea');
  const notes = [];
  
  textAreas.forEach((textArea, index) => {
    const text = textArea.value;
    const canvas = document.querySelectorAll('.note-canvas')[index];
    const canvasData = canvas.toDataURL(); // Save canvas image data
    notes.push({ text, canvasData });
  });
  
  localStorage.setItem('notes', JSON.stringify(notes));
}
