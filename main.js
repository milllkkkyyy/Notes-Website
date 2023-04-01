// Creating and adding thumbnails
const section = document.querySelector("section");
const wrapper = document.getElementById("wrapper");
const createNoteBtn = document.getElementById("NewNoteButton");
const deleteNoteBtn = document.getElementById("DeleteNoteButton");
const textArea = document.querySelector("textarea");
const input = document.querySelector("input");

// Max length for sidebar text / title
const MAX_TITLE_LENGTH = 20;
const MAX_TEXT_LENGTH = 50;

// Storing and loading notes
const notes = JSON.parse(localStorage.getItem("notes")) || [];
const ID_LENGTH = 13;

// Which note is currently being selected
var curr_note = null;

function updateSidebar(e) {
  if (e.target.nodeName === "TEXTAREA")
  {
    // Update the notes text in local storage
    curr_note.text = e.target.value;
    index = notes.indexOf(curr_note);
    notes[index].text = curr_note.text;
    
    // Update the sidebar
    text = document.getElementById(curr_note.id + "text");
    if (curr_note.text.length === 0)
    {
      text.innerHTML = "[Empty Text]";
    }
    else
    {
      text.innerHTML = curr_note.text.substring(0, MAX_TEXT_LENGTH) + (curr_note.text.length >= MAX_TEXT_LENGTH ? "..." : "");
    }
  }
  else
  {
    // Update the notes title in local storage
    curr_note.title = e.target.value;
    index = notes.indexOf(curr_note);
    notes[index].title = curr_note.title;

    // Update the sidebar
    title = document.getElementById(curr_note.id + "title");
    if (curr_note.title.length === 0)
    {
      title.innerHTML = "[Empty Title]";
    }
    else
    {
      title.innerHTML = curr_note.title.substring(0, MAX_TITLE_LENGTH) + (curr_note.title.length >= MAX_TITLE_LENGTH ? "..." : "");
    }
  }
  localStorage.setItem("notes", JSON.stringify(notes));
}

input.addEventListener("input", updateSidebar);
textArea.addEventListener("input", updateSidebar);

function switchNote(id)
{
  if (curr_note == null) 
  {
    curr_note = notes.filter(note => note.id.toString() === id)[0];
    document.getElementById(curr_note.id + "button").style.backgroundColor = "deepskyblue";
  }
  else
  {
    document.getElementById(curr_note.id + "button").style.backgroundColor = "white";
    curr_note = notes.filter(note => note.id.toString() === id)[0];
    document.getElementById(id + "button").style.backgroundColor = "deepskyblue";
  }
  textArea.disabled = false;
  input.disabled = false;
  textArea.value = curr_note.text;
  input.value = curr_note.title;
}

function noteClicked(e) {
    // Do not update if clicked on wrapper div
    const isButton = e.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }

    textArea.setAttribute("placeholder", "Title...")
    input.setAttribute("placeholder", "Text...")

    textArea.disabled = false;
    input.disabled = false;
    
    // Save current note if any
    if (curr_note)
    {
      document.getElementById(curr_note.id + "button").style.backgroundColor = "white";
      index = notes.indexOf(curr_note);
      notes[index].title = input.value;
      notes[index].text = textArea.value;
      curr_note = null;
    }

    // Find the note and update the main content
    actual_id = e.target.id.substring(0, ID_LENGTH);
    switchNote(actual_id);
}

// Deleting a note
function deleteNote()
{
  textArea.disabled = true;
  input.disabled = true;

  textArea.setAttribute("placeholder", "Click add note on the sidebar...")
  input.setAttribute("placeholder", "Add A Note...");

  if (notes.length === 0 || curr_note == null)
  {
    return;
  }

  textArea.value = "";
  input.value = "";

  // Update local storage
  index = notes.indexOf(curr_note);
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));

  // Delete the element from the html
  document.getElementById(curr_note.id + "button").remove();
  curr_note = null;
}

deleteNoteBtn.addEventListener("click", deleteNote);

// Create the thumbnail for the sidebar
function createNoteThumbnail({id, title, text})
{
  thumbnail = document.createElement("div");
  thumbnail.setAttribute("class", "NoteThumbnail");

  thumbnailButton = document.createElement("button");
  thumbnailButton.setAttribute("class", "NoteButton");
  thumbnailButton.setAttribute("id", id + "button");
  
  thumbnailTitle = document.createElement("div");
  thumbnailTitle.setAttribute("class", "NoteThumbnailTitle")
  thumbnailTitle.setAttribute("id", id + "title");
  thumbnailTitle.innerHTML = title.substring(0, MAX_TITLE_LENGTH) + (title.length >= MAX_TITLE_LENGTH ? "..." : "");

  thumbnailText = document.createElement("div");
  thumbnailText.setAttribute("class", "NoteThumbnailText")
  thumbnailText.setAttribute("id", id + "text");
  thumbnailText.innerHTML = text.substring(0, MAX_TEXT_LENGTH) + (text.length >= MAX_TEXT_LENGTH ? "..." : "");

  thumbnailButton.appendChild(thumbnailTitle);
  thumbnailButton.appendChild(thumbnailText);
  thumbnail.appendChild(thumbnailButton);
  wrapper.appendChild(thumbnail);
}

// Add note to list of notes, save it to the local storage
function AddNote({id, title, text}) {
  notes.push(
    {
      id,
      title,
      text,
    }
  );

  localStorage.setItem("notes", JSON.stringify(notes));
}

// Add a note
function addNewNote() {
  textArea.setAttribute("placeholder", "Title...")
  input.setAttribute("placeholder", "Text...")

  id = Date.now();
  title = "New Note";
  text = "Add Text";
  AddNote({id, title, text});
  createNoteThumbnail({id, title, text});
  switchNote(id.toString());
}

createNoteBtn.addEventListener("click", addNewNote);
wrapper.addEventListener("click", noteClicked);

notes.forEach(createNoteThumbnail);