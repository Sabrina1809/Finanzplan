let allTransactions;
let allKeys = [];
let id;
let transactionsToShow = [];
let loadingScreenOption;

async function init() {
    await checkLoadingScreen();
    await setLoadingElements();
    await getTransactionsFromStorage();
    await getIDFromStorage();
    showCurrentMonth()
}

async function checkLoadingScreen() {
    let loadingScreenOptionStorage = JSON.parse(localStorage.getItem("loadingScreenFinanzplan")) || 0;
    loadingScreenOption = loadingScreenOptionStorage;
    console.log(loadingScreenOption);
    return loadingScreenOption
}

async function saveAcceptButton() {
    loadingScreenOption = 1;
    console.log(loadingScreenOption);
    localStorage.setItem("loadingScreenFinanzplan", JSON.stringify(loadingScreenOption));
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

async function deleteTransaction(idToWork) {
    allTransactions = allTransactions.filter(transaction => transaction.showMoreID !== idToWork);
    localStorage.setItem("transactionsFinanzplan", JSON.stringify(allTransactions));
    await getTransactionsFromStorage()
    await getIDFromStorage()
    fillMonthHTML()
    calcMoney()
}