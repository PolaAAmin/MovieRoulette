const emailNewsLetter = document.getElementById("emailNewsLetter");
const subscribeBtn = document.getElementById("subscribe");

let email = emailNewsLetter.value;

subscribeBtn.addEventListener("click", () => {
    console.log(email);
});
