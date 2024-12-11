const toggleButton = document.getElementById('toggleButton');
let idToWork = "";
let transactionToEdit = "";
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let monthToShow = Number(currentMonth);
let yearToShow = Number(currentYear);
let uebertragLastMonth = 0;

async function changeUebertrag() {
    if(toggleButton.classList.contains("active")) {
        document.getElementById("transfer_amount_input").disabled = true;
        document.getElementById("transfer_amount_input").value = 0;
    } else {
        document.getElementById("transfer_amount_input").disabled = false;
        uebertragLastMonth = 0;
    }
    fillMonthHTML();
    calcMoney();
    return uebertragLastMonth;
}

async function showCurrentMonth() {
    await getTransactionsFromStorage();
    await getIDFromStorage();
    document.getElementById("current_month").innerHTML = monthToShow + " / " + yearToShow;
    if (allTransactions.length == 0) {
        document.getElementById("pos_month").innerHTML = "Füge deine erste Transaktion mit dem + Button hinzu."
    } else {
        fillMonthHTML()
        changeUebertrag()
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
    await getTransactionsFromStorage();
    await getIDFromStorage();
    fillMonthHTML()
    calcMoney()
}

function openMenuMore(id, e) {
    e.stopPropagation();
    idToWork="";
    idToWork = id;
    document.getElementById(`show_more${id}`).style.width = "100%";
    document.getElementById(`show_more${id}`).style.visibility = "visible";
    document.getElementById(`show_more${id}`).style.opacity = "1";
    document.getElementById(`show_more_btn${id}`).style.width = "0px";
    document.getElementById(`show_more_btn${id}`).style.opacity = "0";
    const allImages = document.querySelectorAll(".more img");
    const allButtons = document.querySelectorAll(".more .button");
    allImages.forEach((img) => {
        img.style.width = "24px";
        img.style.height = "24px";
    });
    allButtons.forEach((button) => {
        button.style.disabled = "none"
    })
    return idToWork
}

function closeMenuMore(id) {
    document.getElementById(`show_more${id}`).style.width = "0px";
    document.getElementById(`show_more${id}`).style.visibility = "hidden";
    document.getElementById(`show_more${id}`).style.opacity = "0";
    document.getElementById(`show_more_btn${id}`).style.width = "30px";
    document.getElementById(`show_more_btn${id}`).style.opacity = "1";
    const allImages = document.querySelectorAll(".more img");
    const allButtons = document.querySelectorAll(".more .button");
    allImages.forEach((img) => {
        img.style.width = "0px";
        img.style.height = "0px";
    });
    allButtons.forEach((button) => {
        button.style.disabled = "none"
    })
    return idToWork = "";
}

function openForm() {
    document.querySelector("#error_title").style.display = "none";
    document.querySelector("#error_amount").style.display = "none";
    document.querySelector("#overview_ctn").style.backgroundColor = "rgb(236,236,236)";
    document.querySelector(".month").style.visibility = "hidden";
    document.querySelector(".overlay_add_pos").style.visibility = "visible";
    document.querySelector(".overlay_add_pos").style.bottom = "60px";
    document.querySelector(".overlay_add_pos").style.left = "7%";
    resetForm()
    prepareCalender();
    document.querySelector(".header_app").innerHTML = `
    <div class="header_app_logo">
         <img src="./img/icons8-münzen-50.png" alt="Münzen">
        <h1>neue Position</h1>
    </div>
    <span onclick="closeForm()" class="close_info_btn button">
        <img class="add_new_pos_img" src="./img/icons8-close-50.png" alt="Plus Zeichen">
    </span>
`
}

function prepareCalender() {
    const dateInput = document.getElementById("date");
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    dateInput.value = formattedDate;
}

function closeForm() {
    resetForm()
    document.querySelector("#overview_ctn").style.backgroundColor = "white";
    document.querySelector(".month").style.visibility = "visible";
    document.querySelector(".overlay_add_pos").style.visibility = "hidden";
    document.querySelector(".overlay_add_pos").style.bottom = "100%";
    document.querySelector(".overlay_add_pos").style.left = "100%";
    document.querySelector(".header_app").innerHTML = `
    <div class="header_app_logo">
         <img src="./img/icons8-münzen-50.png" alt="Münzen">
        <h1>Haushaltsbuch</h1>
    </div>
    <span onclick="openForm()" class="add_new_pos button">
        <img class="add_new_pos_img" src="./img/icons8-plus-mathe-50.png" alt="Plus Zeichen">
    </span>
`
    transactionToEdit = "";
    return transactionToEdit;
}

function editTransaction(transactionToEdit) {
    document.querySelector("#overview_ctn").style.backgroundColor = "rgb(236,236,236)";
    document.querySelector(".month").style.visibility = "hidden";
    document.querySelector(".overlay_add_pos").style.visibility = "visible";
    document.querySelector(".overlay_add_pos").style.bottom = "60px";
    document.querySelector(".overlay_add_pos").style.left = "7%";
    transactionToEdit = checkTransactionToEdit(idToWork);
    document.getElementById("date").value = `${transactionToEdit.year}-${transactionToEdit.month}-${transactionToEdit.day}`
    document.getElementById("type_option").value = transactionToEdit.type;
    document.getElementById("frequenzy_option").value = transactionToEdit.frequenzy;
    document.getElementById("title_input").value = transactionToEdit.title;
    document.getElementById("amount").value = transactionToEdit.amount;
    document.querySelector(".header_app").innerHTML = `
    <div class="header_app_logo">
         <img src="./img/icons8-münzen-50.png" alt="Münzen">
        <h1>Position ändern</h1>
    </div>
    <span onclick="closeForm()" class="close_info_btn button">
        <img class="add_new_pos_img" src="./img/icons8-close-50.png" alt="Plus Zeichen">
    </span>
`
    document.querySelector("#error_title").style.display = "none";
    document.querySelector("#error_amount").style.display = "none";
    return transactionToEdit;
}

function checkTransactionToEdit(idToWork) {
    let transaction;
    for (let i = 0; i < allTransactions.length; i++) {
        if (allTransactions[i].showMoreID == idToWork) {
            return transaction = allTransactions[i]
        }
    }
    return transaction
}

function isFormComplete(e, transactionToEdit) {
    e.preventDefault();
    checkTitle()
    checkAmount()
    if (document.getElementById("title_input").value !== "" &&
        document.getElementById("amount").value !== "") {
            editOrNewTransaction(transactionToEdit, idToWork)
    } else {
        return false
    }
}

function checkTitle() {
    if (document.getElementById("title_input").value == "") {
        document.getElementById("error_title").style.display = "flex";
    } else {
        document.getElementById("error_title").style.display = "none";
    }
}

function checkAmount() {
    if (document.getElementById("amount").value == "") {
        document.getElementById("error_amount").style.display = "flex";
    } else {
        document.getElementById("error_amount").style.display = "none";
    }
}

function editOrNewTransaction(transactionToEdit, idToWork) {
    if (idToWork == "") {
        saveNewTransaction(event)
        transactionToEdit = "";
        return transactionToEdit;
    } else {
        deleteTransaction(idToWork);
        saveNewTransaction(event);
        transactionToEdit = "";
        return transactionToEdit;
    }
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
    calcMoney()
    return transactionToEdit = "";
}

function checkplusMinus() {
    if (document.getElementById("type_option").value == "Einnahme") {
        return "+"
    } else {
        return "-"
    }
}

function calcMoney() {
    console.log(transactionsToShow);
    if (transactionsToShow.length == 0) {
        uebertragLastMonth = document.getElementById("transfer_amount_input").value;
        document.getElementById(`saldo_amount`).innerHTML = Number(uebertragLastMonth) + " €";
    } else {
        calcPosOne();
        for (let i = 1; i < transactionsToShow.length; i++) {
            calcOtherPos(i);
        }
        calcLastPos();
    }
  
}

function calcPosOne() {
    uebertragLastMonth = document.getElementById("transfer_amount_input").value;
    let idFromIndexOne = transactionsToShow[0].showMoreID;
    document.getElementById(`current_sum${idFromIndexOne}`).innerHTML = Number(uebertragLastMonth) + " €";
}

function calcOtherPos(i) {
    let plusOrMinusAbove = transactionsToShow[i-1].plusMinus;
    let lastAmount = Number(transactionsToShow[i-1].amount);
    let lastSum = (document.getElementById(`current_sum${transactionsToShow[i-1].showMoreID}`).innerHTML).slice(0, -2);
    let newSum = calc(plusOrMinusAbove, lastSum, lastAmount); 
    document.getElementById(`current_sum${transactionsToShow[i].showMoreID}`).innerHTML = Number(newSum) + " €";
}

function calcLastPos() {
    // uebertragLastMonth = 0;
    let plusOrMinusAbove = transactionsToShow[transactionsToShow.length-1].plusMinus;
    let lastAmount = Number(transactionsToShow[transactionsToShow.length-1].amount);
    let lastSum = (document.getElementById(`current_sum${transactionsToShow[transactionsToShow.length-1].showMoreID}`).innerHTML).slice(0, -2)
    let newSum = calc(plusOrMinusAbove, lastSum, lastAmount); 
    document.getElementById(`saldo_amount`).innerHTML = Number(newSum) + " €";
    // return uebertragLastMonth = newSum;
}

function calc(plusOrMinusAbove, lastSum, lastAmount) {
    let sum;
    if (plusOrMinusAbove == "+") {
        sum = Number(lastSum) + lastAmount;
    } else {
        sum = Number(lastSum) - lastAmount;
    }
    return Number(sum)
}

function fillMonthHTML() {
    document.getElementById("pos_month").innerHTML = "";   
     
    for (let i = 0; i < transactionsToShow.length; i++) {
        let color = checkColor(i);
        document.getElementById("pos_month").innerHTML += `
            <div class="single_pos">
                <div class="single_pos_part_day_title">
                    <span class="day">${transactionsToShow[i].day}</span>
                    <span id="current_sum${transactionsToShow[i].showMoreID}" class="current_sum"></span>
                    <span style="color:${color};" class="amount">${transactionsToShow[i].plusMinus} ${transactionsToShow[i].amount} €</span>
                    <span class="title">${transactionsToShow[i].title}</span>
                 </div>
                <div class="single_pos_part_amount_more">
                    
                    <div onclick="event.stopPropagation()" id="show_more${transactionsToShow[i].showMoreID}" class="more">
                        <div onclick="event.stopPropagation(); editTransaction(transactionToEdit)" class="edit button">
                            <img onclick="event.stopPropagation(); editTransaction(transactionToEdit)" src="./img/icons8-bleistift-64.png" alt="Bleistift">
                        </div>
                        <div onclick="event.stopPropagation(); deleteTransaction(idToWork)" class="delete button">
                            <img onclick="event.stopPropagation(); deleteTransaction(idToWork)" src="./img/icons8-müll-64.png" alt="Mülleimer">
                        </div>
                        <div onclick="event.stopPropagation(); closeMenuMore(${transactionsToShow[i].showMoreID})" class="close_menu button">
                            <img onclick="event.stopPropagation(); closeMenuMore(${transactionsToShow[i].showMoreID})" src="./img/icons8-ausgang-80.png" alt="Ausgang">
                        </div>
                    </div>
                    <span onclick="event.stopPropagation(); openMenuMore(${transactionsToShow[i].showMoreID}, event)" id="show_more_btn${transactionsToShow[i].showMoreID}" class="show_more button">&#x22EF;</span>
                </div>
            </div>
        `
    }
}

function checkColor(i) {
    if (transactionsToShow[i].plusMinus == "-") {
        return "rgb(103, 15, 7)"
    } else {
        return "rgb(5, 85, 15)"
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

function openInfo() {
    document.querySelector("#overview_ctn").style.backgroundColor = "rgb(236, 236, 236)";
    document.querySelector(".info_content").style.backgroundColor = "rgb(236, 236, 236)";
    document.querySelector(".info_content").style.top = "100px";
    document.querySelector(".info_content").style.right = "7%";
    document.querySelector(".header_app").innerHTML = `
        <div class="header_app_logo">
             <img src="./img/icons8-münzen-50.png" alt="Münzen">
            <h1>Information</h1>
        </div>
        <span onclick="closeInfo()" class="close_info_btn button">
            <img class="add_new_pos_img" src="./img/icons8-close-50.png" alt="Plus Zeichen">
        </span>
    `
    document.querySelector(".month").style.visibility = "hidden";
}

function closeInfo() {
    document.querySelector("#overview_ctn").style.backgroundColor = "white";
    document.querySelector(".info_content").style.top = "100%";
    document.querySelector(".info_content").style.right = "100%";
    document.querySelector(".header_app").innerHTML = `
        <div class="header_app_logo">
             <img src="./img/icons8-münzen-50.png" alt="Münzen">
            <h1>Haushaltsbuch</h1>
        </div>
        <span onclick="openForm()" class="add_new_pos button">
            <img class="add_new_pos_img" src="./img/icons8-plus-mathe-50.png" alt="Plus Zeichen">
        </span>
    `
    document.querySelector(".month").style.visibility = "visible";
}