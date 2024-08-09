import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiG8rZ05Q95wWdTXfwTFP9x1f-JLKpm5M",
  authDomain: "fir-db-5e055.firebaseapp.com",
  projectId: "fir-db-5e055",
  storageBucket: "fir-db-5e055.appspot.com",
  messagingSenderId: "1065966186312",
  appId: "1:1065966186312:web:a1f6309dd769e9da534d7d",
  measurementId: "G-LG2DG1Z3D5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let todosCollection = collection(db, "todos");
let todo_input = document.querySelector("#todo_input");
let add_todo = document.querySelector("#add_todo");
let editDocId = null;

add_todo.addEventListener("click", async () => {
  if (editDocId) {
    await updateTodoInDb(editDocId);
  } else {
    await addTodoToDb();
  }
});

async function addTodoToDb() {
  try {
    const obj = {
      todo: todo_input.value,
      createdAt: new Date().toISOString(),
    };
    await addDoc(todosCollection, obj);
    getTodosFromDb();
    todo_input.value = "";
  } catch (e) {
    alert(e);
  }
}

async function updateTodoInDb(docId) {
  try {
    const docRef = doc(db, "todos", docId);
    await updateDoc(docRef, {
      todo: todo_input.value,
    });
    getTodosFromDb();
    todo_input.value = "";
    add_todo.textContent = "Add Todo";
    editDocId = null;
  } catch (e) {
    alert(e);
  }
}

let todo_list = document.querySelector("#dynamic_todo");

async function getTodosFromDb() {
  try {
    const querySnapshot = await getDocs(todosCollection);
    todo_list.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const { todo, createdAt } = doc.data();

      const elem = `
      <tr>
        <td>${todo}</td>
        <td>${new Date(createdAt).toLocaleDateString()}</td>
        <td>
          <button type="button" id="edit-${doc.id}" class="btn btn-success">✏️</button>
          <button type="button" id="delete-${doc.id}" class="btn btn-danger ms-2">🗑️</button>
        </td>
      </tr>`;

      todo_list.innerHTML += elem;
    });


    addListeners();
  } catch (error) {
    console.log(error);
  }
}

function addListeners() {
  todo_list.querySelectorAll(".btn-danger").forEach(button => {
    button.addEventListener("click", async function () {
      const docId = this.id.replace('delete-', '');
      console.log("Delete button clicked, Doc ID:", docId);
      try {
        const docRef = doc(db, "todos", docId);
        await deleteDoc(docRef);
        getTodosFromDb();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    });
  });

  todo_list.querySelectorAll(".btn-success").forEach(button => {
    button.addEventListener("click", function () {
      const docId = this.id.replace('edit-', '');
      console.log("Edit button clicked, Doc ID:", docId);

      const todoText = this.closest('tr').querySelector('td').textContent;
      todo_input.value = todoText;
      editDocId = docId;

      add_todo.textContent = "Update Todo";
    });
  });
}

getTodosFromDb();
