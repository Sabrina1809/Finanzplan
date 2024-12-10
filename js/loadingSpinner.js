async function setLoadingElements() {
    if (loadingScreenOption == 0) {
        document.querySelector(".loading_spinner_ctn").style.display = "flex";
        document.querySelector(".loading_img_ctn").classList.add("animation_before_click");
        setTimeout(showDescription, 2500)
    } 
    if (loadingScreenOption == 1) {
        document.querySelector(".loading_spinner_ctn").style.display = "flex";
        document.querySelector(".loading_img_ctn").classList.add("animation_welcome");
        document.querySelector(".loading_welcome_message").style.opacity = "1";
        setTimeout(() => {document.querySelector(".loading_spinner_ctn").style.display = "none"}, 3000)
    }
}

function showDescription() {
    document.querySelector(".accept_button_descr_ctn").classList.add("animation_visible");
    document.querySelector(".accept_button_descr_ctn").style.opacity = "1";  
    document.querySelector(".loading_welcome_message").style.opacity = "0";
}

function saveAcceptButton() {
    loadingScreenOption = 1;
    console.log(loadingScreenOption);
    localStorage.setItem("loadingScreenFinanzplan", JSON.stringify(loadingScreenOption));
    document.querySelector(".accept_button_descr_ctn").classList.remove("animation_visible");
    document.querySelector(".accept_button_descr_ctn").classList.add("animation_hidden");
    document.querySelector(".accept_button_descr_ctn").style.opacity = "0";  
    setTimeout(() => {document.querySelector(".loading_img_ctn").classList.add("animation_after_click")},1500)
    setTimeout(() => {document.querySelector(".loading_spinner_ctn").classList.add("animation_hide_loading_ctn")}, 3500)
    setTimeout(() => {document.querySelector(".loading_spinner_ctn").style.display = "none"}, 4400)
}

// function showWelcome() {
//     document.querySelector(".loading_spinner_ctn").style.display = "none";
// }