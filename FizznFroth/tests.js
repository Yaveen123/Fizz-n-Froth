function myFunction() {
    return "helloodasdfasdfo"
}

x = 0

function set(){
    document.getElementById('button_Func').textContent = x
}

function buttonClicked(){
    x = x + 1
    document.getElementById('button_Func').textContent = x
    console.log(x)
}
