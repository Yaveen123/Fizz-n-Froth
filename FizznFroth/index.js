data = {
    "0":{
        "Name":"Finland",
        "Ingredients": [
            "1 asdfasdf",
            "4 FINALLDNDD RAHH",
            "saldfasdf",
            "asdfkalsd;fjkh"
        ],
        "Image":"images/DEMO.png",
        "Price":2
    },
    "1":{
        "Name":"Australia",
        "Ingredients": [
            "1 something",
            "4 soetasdf juice",
            "2 uwu cream",
            "1x man juice"
        ],
        "Image":"images/DEMO2.png",
        "Price":5
    },
    "2":{
        "Name":"Australia",
        "Ingredients": [
            "1 something",
            "4 soetasdf juice",
            "2 uwu cream",
            "1x man juice"
        ],
        "Image":"images/DEMO.png",
        "Price":5
    }
}

currMenu = 2
if (sessionStorage.getItem("cart") == null) {
    sessionStorage.setItem("cart", "[]")
}


// Returns the name of the drink
function getDrinkHeader() {
    document.getElementById("p_main_drink_header").textContent = data[String(currMenu)]["Name"].toUpperCase() 
}



// Returns the image to display for that item
function getDrinkImage() {
    document.getElementById("img_main_drink").src = data[String(currMenu)]["Image"].toUpperCase()
}



// Returns list of ingredients
function getDrinkIngredients(){

    // Loop over elements https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
    // Loop over elements and return doc ID https://stackoverflow.com/questions/35108777/displaying-list-of-javascript-objects-as-html-list-items 

    arrayLength = data[String(currMenu)]["Ingredients"].length;

    for (var i=0; i < arrayLength; i++) {
        document.getElementById("p_main_drink_list").innerHTML += '<li>' + data[String(currMenu)]["Ingredients"][i] + '</li>';
    }
}

function addItemToCart() {
    let cart = sessionStorage.getItem("cart");
    console.log(cart)

    cart = cart.split(",");
    cart.push(String(currMenu));
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





function createSliderItems() {
    drinksLength = Object.keys(data).length
    console.log(currMenu)

    for (var i=0; i<drinksLength; i++) {

        var procreatedItem = document.createElement("button");
        procreatedItem.textContent = i+1;

        if (i == currMenu) {
            procreatedItem.className="sliderButton selected";
        } else {
            procreatedItem.className="sliderButton unselected";
        }

        procreatedItem.id = i;
        var parent = document.getElementById('menuSlider')
        parent.appendChild(procreatedItem);
    }
}

