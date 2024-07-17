const continueButton = document.getElementsByClassName("continue")[0];
const nameField = document.getElementsByClassName("name")[0];

nameField.value = sessionStorage.getItem("name") || ""

continueButton.onclick = () => {
    if (nameField.value.length) {
    sessionStorage.setItem("name", nameField.value);
    window.location.href = 'order3.html';
    } else {
        alert("Please enter a name!");
    }
};