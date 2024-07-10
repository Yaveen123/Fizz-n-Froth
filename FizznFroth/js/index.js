data = {
    "0":{
        "Name":"Drink 1",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
        ],
        "Image":"images/DRINK1.png",
        "Price":4
    },
    "1":{
        "Name":"Drink 2",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",

        ],
        "Image":"images/DRINK2.png",
        "Price":2
    },
    "2":{
        "Name":"Drink 3",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
        ],
        "Image":"images/DRINK3.png",
        "Price":5
    },
    "3":{
        "Name":"Drink 4",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
        ],
        "Image":"images/DRINK4.png",
        "Price":5
    },
    "4":{
        "Name":"Drink 5",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
        ],
        "Image":"images/DRINK5.png",
        "Price":5
    },
    "5":{
        "Name":"Drink 6",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
        ],
        "Image":"images/DRINK6.png",
        "Price":5
    },
    "6":{
        "Name":"Drink 7",
        "Ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
        ],
        "Image":"images/DRINK7.png",
        "Price":5
    },
}

currMenu = 0
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
function getDrinkIngredients() {
    let array = data[String(currMenu)]["Ingredients"];
    let result = "";

    array.forEach((val, index) => {
        result += "<li>" + val + "</li>";
    });

    document.getElementById("p_main_drink_list").innerHTML = result;
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

function click(id) {
    currMenu = id;

    getDrinkHeader();
    getDrinkImage();
    getDrinkIngredients();

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

