let allTransactions;
let allKeys = [];
let id;
let transactionsToShow = [];

async function getFromLocalStorage() {
    await getTransactionsFromStorage();
    await getIDFromStorage();
}

async function setAndGetFromLocalStorage(allTransactions, id) {
    localStorage.setItem("transactionsFinanzplan", JSON.stringify(allTransactions));
    localStorage.setItem("idFinanzplan", JSON.stringify(id));
    await getTransactionsFromStorage();
    await getIDFromStorage();
}

async function getTransactionsFromStorage() {
    let transactionsFromStorage = JSON.parse(localStorage.getItem("transactionsFinanzplan")) || [];
    allTransactions = transactionsFromStorage;  
    checkTransactionsToShow()  
}

async function getIDFromStorage() {
    let idFromStorage = JSON.parse(localStorage.getItem("idFinanzplan")) || 0;
    id = idFromStorage;   
}

function checkTransactionsToShow() {
    transactionsToShow = [];
    for (let i = 0; i < allTransactions.length; i++) {
        if (allTransactions[i].frequenzy == "monatlich" || (Number(allTransactions[i].year) == yearToShow && Number(allTransactions[i].month) == monthToShow)) {
            transactionsToShow.push(allTransactions[i])
        }
    }
    transactionsToShow.sort((a, b) => {
        const dayDifference = Number(a.day) - Number(b.day);
        if (dayDifference !== 0) {
            return dayDifference;}
        return String(a.id).localeCompare(String(b.id));
    });
    transactionsToShow = transactionsToShow
}

async function deleteTransaction() {
    allTransactions = allTransactions.filter(transaction => transaction.showMoreID !== idToWork);
    localStorage.setItem("transactionsFinanzplan", JSON.stringify(allTransactions));
    await getTransactionsFromStorage()
    await getIDFromStorage()
    closeMenuMore(idToWork)
    fillMonthHTML()
    document.querySelector(".button").removeEventListener("onclick", deleteTransaction)
}