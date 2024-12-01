const toggleButton = document.getElementById('toggleButton');
let transactionsToShow = [];
let idToWork;
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let monthToShow = Number(currentMonth);
let yearToShow = Number(currentYear);

function checkUebertrag() {
    let uebertrag = document.getElementById("transfer_amount").innerHTML;
    if(toggleButton.classList.contains("active")) {
        uebertrag = 0;
        document.getElementById('transfer_amount').innerHTML = uebertrag;
        document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML = uebertrag
    } else {
        uebertrag = 500;
        if (transactionsToShow.length > 0) {
            document.getElementById('transfer_amount').innerHTML = uebertrag;
            document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML = uebertrag
        }
    }
}

async function showCurrentMonth() {
    await getTransactionsFromStorage();
    await getIDFromStorage();
    document.getElementById("current_month").innerHTML = monthToShow + " / " + yearToShow;
    console.log(allTransactions)
    if (allTransactions.length == 0) {
        document.getElementById("pos_month").innerHTML = "Füge deine erste Transaktion mit dem + Button hinzu."
    } else {
        fillMonthHTML()
        calcMoney()
    }
}

async function showNextMonth(plusMinus1) {
    monthToShow = monthToShow + plusMinus1
    if(monthToShow == 13) {
        monthToShow = 1
        yearToShow = yearToShow + 1
    } else if (monthToShow == 0) {
        monthToShow = 12
        yearToShow = yearToShow - 1
    }
    document.getElementById("current_month").innerHTML = monthToShow + " / " + yearToShow;
    // await getIdAndData(pathData='');
    await getTransactionsFromStorage();
    await getIDFromStorage();
    fillMonthHTML()
}

function openMenuMore(id, e) {
    idToWork="";
    idToWork = id;
    document.getElementById(`show_more${id}`).style.right = "55px";
    document.getElementById(`show_more${id}`).style.opacity = "1";
}

function closeMenuMore(id) {
    document.getElementById(`show_more${id}`).style.right = "380px";
    document.getElementById(`show_more${id}`).style.opacity = "0";
}

function openForm() {
    document.getElementById("overview_ctn").style.display = "none";
    document.getElementById("overlay_ctn").style.display = "block";
    resetForm()
}

function closeForm() {
    resetForm()
    document.getElementById("overview_ctn").style.display = "block";
    document.getElementById("overlay_ctn").style.display = "none";
}

async function saveNewTransaction(e) {
    e.preventDefault()
    let date = document.getElementById("date").value;
    let [year, month, day] = date.split("-");
    let transaction = {
        type: document.getElementById("type_option").value,
        frequenzy: document.getElementById("frequenzy_option").value,
        year: year,
        month: month,
        day: day,
        plusMinus: checkplusMinus(),
        title: document.getElementById("title_input").value, 
        amount: document.getElementById("amount").value,
        id: year+month+day+"-"+id,
        showMoreID: id
    }
    resetForm()
    closeForm()
    id = Number(id) + 1;
    allTransactions.push(transaction);
    await setAndGetFromLocalStorage(allTransactions, id);
    fillMonthHTML()
    // calculate()
    
}

async function setAndGetFromLocalStorage(allTransactions, id) {
    localStorage.setItem("transactionsFinanzplan", JSON.stringify(allTransactions));
    localStorage.setItem("idFinanzplan", JSON.stringify(id));
    await getTransactionsFromStorage();
    await getIDFromStorage();
}

function checkplusMinus() {
    if (document.getElementById("type_option").value == "Einnahme") {
        return "+"
    } else {
        return "-"
    }
}

function calcMoney() {
    document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML = 0;
    for (let i = 0; i < transactionsToShow.length; i++) {
        let idForCalc = transactionsToShow[i].showMoreID;
        let plusOrMinus = transactionsToShow[i].plusMinus;
        console.log(plusOrMinus);
        let currentSum = Number(document.getElementById(`current_sum${idForCalc}`).innerHTML);
        console.log(currentSum);
        let amount = Number(transactionsToShow[i].amount);
        console.log(amount);
        
        let newSum = Number(currentSum + plusOrMinus + amount)
        newSum = Number(newSum)
        console.log(newSum);
        
    }
}

// function checkUebertrag(uebertrag, operator) {
//     if (uebertrag == 0) {
//         document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML = `${uebertrag} €`
//     } else {
//         let nextSum;
//         if (operator == '+') {
//             nextSum = Number(document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML) + Number(transactionsToShow[0].amount)
//         } else {
//             nextSum = Number(document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML) - Number(transactionsToShow[0].amount)
//         }
//         document.getElementById(`current_sum${transactionsToShow[0].showMoreID}`).innerHTML = `${Number(nextSum)} €`
//     }
// }

function fillMonthHTML() {
    document.getElementById("pos_month").innerHTML = "";    
    for (let i = 0; i < transactionsToShow.length; i++) {
        document.getElementById("pos_month").innerHTML += `
            <div class="single_pos">
            <span class="day">${transactionsToShow[i].day}</span>
            <span id="current_sum${transactionsToShow[i].showMoreID}" class="current_sum"></span>
            <span class="title">${transactionsToShow[i].title}</span>
            <span class="amount">${transactionsToShow[i].plusMinus} ${transactionsToShow[i].amount} €</span>
            <span onclick="openMenuMore(${transactionsToShow[i].showMoreID}, event)" class="show_more button">&#x22EF;</span>
            <div id="show_more${transactionsToShow[i].showMoreID}"  class="more">
                <div class="edit button">
                    <img src="./img/icons8-bleistift-64.png" alt="Bleistift">
                </div>
                <div class="delete button">
                    <img onclick="deleteTransaction()" src="./img/icons8-müll-64.png" alt="Mülleimer">
                </div>
                <div onclick="closeMenuMore(${transactionsToShow[i].showMoreID})" class="close_menu button">
                    <img src="./img/icons8-ausgang-80.png" alt="Mülleimer">
                </div>
            </div>
        </div>
        `
    }
}

function changeTypeOfTransaktion(value) {
    if (value == "Einnahme") {
        document.getElementById("plus_or_minus").innerHTML = '+';
    } else {
        document.getElementById("plus_or_minus").innerHTML = '-';     
    }
}

function checkTypeOfTransaktion() {
    let type;
    let einnahme = document.getElementById("type_einnahme");
    let ausgabe = document.getElementById("type_ausgabe");
    if (einnahme.checked == true) {
        type = einnahme.value;
    } else {
        type = ausgabe.value
    }
    return type;   
}

function resetForm() {
    document.getElementById("type_option").value = document.getElementById("type_ausgabe").value;
    document.getElementById("frequenzy_option").value = document.getElementById("freq_one_time").value;
    document.getElementById("date").value = "";
    document.getElementById("title_input").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("plus_or_minus").innerHTML = '-'
}