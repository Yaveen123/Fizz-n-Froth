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

function generateOrderItem(name, quantity, price, id) {
    let item = document.createElement("div");
    item.className = "order1_list_itemqty";

    let table = document.createElement("table");
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    let nameElement = document.createElement("div");
    nameElement.className = "order1_name";
    nameElement.innerHTML = name;

    let quantityElement = document.createElement("div");
    quantityElement.className = "order1_quantity";
    quantityElement.innerHTML = "Qty: " + quantity;

    let removeElement = document.createElement("div");
    removeElement.className = "order1_remove";

    let removeLink = document.createElement("a");
    removeLink.innerHTML = "Remove";
    removeLink.href = "#";
    
    removeLink.onclick = () => {
        removeItem(id);
    }

    let priceElement = document.createElement("div");
    priceElement.className = "order1_price";
    priceElement.innerHTML = "$" + (price * quantity);

    table.appendChild(tr);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    removeElement.appendChild(removeLink);

    td1.appendChild(nameElement);
    td1.appendChild(quantityElement);
    td2.appendChild(removeElement);
    td3.appendChild(priceElement);

    item.appendChild(table);

    return item;
}

function generateOrderItemTotal(total) {
    let item = document.createElement("div");
    item.className = "order1_list_total";
    
    let table = document.createElement("table");
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");

    let p1 = document.createElement("div");
    p1.className = "order1_total";
    p1.innerHTML = "Total";

    let p2 = document.createElement("div");
    p2.className = "order1_total_price";
    p2.innerHTML = "$" + total;

    table.appendChild(tr);

    tr.appendChild(td1);
    tr.appendChild(td2);

    td1.appendChild(p1);
    td2.appendChild(p2);

    item.appendChild(table);

    return item;
}

function getCart() {
    let cart = sessionStorage.getItem("cart") || "";
    cart = cart.split(",");
    cart.shift(); // No idea why the first item is blank, so just remove it for now.
    return cart;
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

function removeItem(id) {
    let cart = sessionStorage.getItem("cart") || "";
    cart = cart.split(",");
    cart = removeItemAll(cart, id);

    sessionStorage.setItem("cart", cart);
    location.reload();
}

function getTotal(countedItems) {
    let result = 0;

    for (const [id, quantity] of Object.entries(countedItems)) {
        result += data[id]["Price"] * quantity;
    }

    return result;
}

let list = document.getElementsByClassName("order1_list")[0];
let cart = getCart();

if (!cart.length) {
    list.innerHTML = "You don't have any items in your cart. Add some before proceeding.";
} else {
    let countedItems = {};

    cart.forEach((val, index) => {
        countedItems[val] = countedItems[val] + 1 || 1;
    });

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [id, quantity] of Object.entries(countedItems)) {
        let orderItem = generateOrderItem(data[id]["Name"], quantity, data[id]["Price"], id); // CHANGE THIS IMMEDIATELY
        list.appendChild(orderItem);
    }

    let total = generateOrderItemTotal(getTotal(countedItems));
    list.appendChild(total);
}
