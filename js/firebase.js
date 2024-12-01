const firebase_URL = 'https://finanz-app-ba04e-default-rtdb.europe-west1.firebasedatabase.app/'


async function getIdAndData(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allTransactions = responseDataToJson.transactions
    id = responseDataToJson.id;
    console.log(id)
    console.log(allTransactions, typeof allTransactions)
    if (allTransactions !== undefined) {
        keyForAllTransactions()
    } 
}



async function postData(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    // console.log(responseToJson); 
}

async function putID(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    // console.log(response);
    // console.log(responseToJson);
}

async function deleteID(path="") {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "Delete",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify()
    });
    let responseToJson = await response.json();
    // console.log(response);
    // console.log(responseToJson);
}

async function deleteData() {
    console.log(idToWork);
    let keyToDelete = findKey()
    let keyToDeletePath = `transactions/${keyToDelete}`
    // console.log(keyToDelete);
    // console.log(keyToDeletePath);
    await deleteID(path=keyToDeletePath)
    await getIdAndData(pathData='')
    closeMenuMore(idToWork)
    fillMonthHTML()
   
}

function findKey() {
    let keyToWork;
    for (let i = 0; i < allKeys.length; i++) {
        if (allTransactions[allKeys[i]].showMoreID == idToWork) {
            keyToWork = allKeys[i];
            // console.log(keyToWork);
            return keyToWork
        }
    }
    return keyToWork
}