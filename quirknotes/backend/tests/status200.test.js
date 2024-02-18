test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

async function postNote(title, content) {
  return fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });
};

async function deleteNote(id) {
  return fetch(`${SERVER_URL}/deleteNote/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function deleteAllNotes() {
  return fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
}

async function getAllNotes() {
  return fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function patchNote(id, newTitle, newContent) {
  return fetch(`${SERVER_URL}/patchNote/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
      content: newContent,
    }),
  });
}

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await postNote(title, content);

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  await deleteAllNotes();
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  // Code here
  const getRes = await getAllNotes();
  const body = await getRes.json();
  expect(getRes.status).toBe(200);
  expect(body.response.length).toBe(0);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  // Code here
  await postNote("1", "1")
  await postNote("2", "2")
  const getRes = await getAllNotes();
  const body = await getRes.json();
  expect(getRes.status).toBe(200);
  expect(body.response.length).toBe(2);
  await deleteAllNotes();
});

test("/deleteNote - Delete a note", async () => {
  // Code here
  const postRes = await postNote("1", "1");
  const postbody = await postRes.json();

  const deleteRes = await deleteNote(postbody.insertedId);
  const deleteBody = await deleteRes.json();

  expect(deleteRes.status).toBe(200);
  expect(deleteBody.response).toBe(`Document with ID ${postbody.insertedId} deleted.`)

});

test("/patchNote - Patch with content and title", async () => {
  // Code here
  const postRes = await postNote("1", "1");
  const postbody = await postRes.json();

  const patchRes = await patchNote(postbody.insertedId, "New", "New");
  const patchbody = await patchRes.json();
  expect(patchRes.status).toBe(200);
  expect(patchbody.response).toBe(`Document with ID ${postbody.insertedId} patched.`)

  const getAllNotesRes = await getAllNotes();
  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesBody.response[0].title).toBe("New");
  expect(getAllNotesBody.response[0].content).toBe("New");

  await deleteAllNotes();
});

test("/patchNote - Patch with just title", async () => {
  // Code here
  const postRes = await postNote("1", "1");
  const postbody = await postRes.json();

  const patchRes = await patchNote(postbody.insertedId, "New", undefined);
  const patchbody = await patchRes.json();
  expect(patchRes.status).toBe(200);
  expect(patchbody.response).toBe(`Document with ID ${postbody.insertedId} patched.`)

  const getAllNotesRes = await getAllNotes();
  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesBody.response[0].title).toBe("New");

  await deleteAllNotes();
});

test("/patchNote - Patch with just content", async () => {
  // Code here
  const postRes = await postNote("1", "1");
  const postbody = await postRes.json();

  const patchRes = await patchNote(postbody.insertedId, undefined, "New");
  const patchbody = await patchRes.json();
  expect(patchRes.status).toBe(200);
  expect(patchbody.response).toBe(`Document with ID ${postbody.insertedId} patched.`)

  const getAllNotesRes = await getAllNotes();
  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesBody.response[0].content).toBe("New");

  await deleteAllNotes();
});

test("/deleteAllNotes - Delete one note", async () => {
  // Code here
  await postNote("1", "1");
  const deleteRes = await deleteAllNotes();
  const deleteBody = await deleteRes.json();

  expect(deleteRes.status).toBe(200);
  expect(deleteBody.response).toBe(`1 note(s) deleted.`)
});

test("/deleteAllNotes - Delete three notes", async () => {
  // Code here
  await postNote("1", "1");
  await postNote("1", "1");
  await postNote("1", "1");
  const deleteRes = await deleteAllNotes();
  const deleteBody = await deleteRes.json();

  expect(deleteRes.status).toBe(200);
  expect(deleteBody.response).toBe('3 note(s) deleted.')
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  // Code here
  const postNoteRes = await postNote("1", "1")
  const postNoteBody = await postNoteRes.json();

  const updateNoteColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${postNoteBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "#FF0000",
    }),
  });

  const updateNoteColorBody = await updateNoteColorRes.json();
  expect(updateNoteColorRes.status).toBe(200);
  expect(updateNoteColorBody.message).toBe("Note color updated successfully.");

  // get the note corresponding to that id and check if it actually changed
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });
  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesBody.response[0].color).toBe("#FF0000");
  
  await deleteAllNotes();
});
