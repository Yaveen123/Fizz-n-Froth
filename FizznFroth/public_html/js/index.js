function get(url){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(null);
    return xhttp.responseText;
}

let data = JSON.parse(get("/api/items.php"));

currMenu = 0
if (sessionStorage.getItem("cart") == null) {
    sessionStorage.setItem("cart", "[]")
}


// Returns the name of the drink
function getDrinkHeader() {
    document.getElementById("p_main_drink_header").textContent = data[currMenu]["name"];
}



// Returns the image to display for that item
function getDrinkImage() {
    document.getElementById("img_main_drink").src = `/images/${data[currMenu]["image"]}`;
}

// Returns list of ingredients
function getDrinkDescription() {
    document.getElementsByClassName("ingredientsbutton_left")[0].innerHTML = data[currMenu]["description"];
}

function addItemToCart() {
    let cart = sessionStorage.getItem("cart");
    console.log(cart)

    cart = cart.split(",");
    cart.push(currMenu);
    sessionStorage.setItem("cart", cart);


    updateOrderNowButton(cart)
}



function updateOrderNowButton(cartls) {

    if (cartls.length-1 == 1) {
        document.getElementById("orderNowButton").textContent = "Order now! || " + (cartls.length-1) + " item";
    } else if (cartls.length-1 < 1) {
        document.getElementById("orderNowButton").textContent = "Order now!";
    } else {
        document.getElementById("orderNowButton").textContent = "Order now! || " + (cartls.length-1) + " items";
    }
}

function click(id) {
    currMenu = id;

    getDrinkHeader();
    getDrinkImage();
    getDrinkDescription();

    document.getElementsByClassName("selected")[0].className = "sliderButton unselected";
    document.getElementById(id).className = "sliderButton selected";
}

function createSliderItems() {
    drinksLength = Object.keys(data).length
    console.log(currMenu)

    for (let i = 0; i < drinksLength; i++) {

        var procreatedItem = document.createElement("button");
        procreatedItem.textContent = i+1;

        if (i == currMenu) {
            procreatedItem.className="sliderButton selected";
        } else {
            procreatedItem.className="sliderButton unselected";
        }

        procreatedItem.id = i;

        procreatedItem.onclick = () => {
            click(i);
        };

        var parent = document.getElementById('menuSlider');
        parent.appendChild(procreatedItem);
    }
}

