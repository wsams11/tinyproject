// check for indexedDB browser support

let db;
const request = window.indexedDB.open("budget", 1)
// create a new db request for a "budget" database.

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;

  const pendingStore = db.createObjectStore("pending", {
    autoIncrement: true
  });
  pendingStore.createIndex("transactionIndex", "transaction")
};

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingStore = transaction.objectStore("pending");
  const transactionIndex = pendingStore.index("transaction")


  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const pendingStore = transaction.objectStore("pending");
  // add record to your store with add method.
  pendingStore.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const pendingStore = transaction.objectStore("pending");
  // get all records from store and set to a variable
  const records = pendingStore.getAll("transaction");

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);