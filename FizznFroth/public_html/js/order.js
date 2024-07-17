function get(url){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(null);
    return xhttp.responseText;
}

let data = JSON.parse(get("/api/items.php"));

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
        result += data[id]["price"] * quantity;
    }

    return result;
}

let list = document.getElementsByClassName("order1_list")[0];
let cart = getCart();

if (!cart.length) {
    document.getElementsByClassName("order1container")[0].innerHTML = "<br><br><br><br><br><p class='instruction'>You don't have any items in your cart. Add some before proceeding.</p>";
} else {
    let countedItems = {};

    cart.forEach((val, index) => {
        countedItems[val] = countedItems[val] + 1 || 1;
    });

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [id, quantity] of Object.entries(countedItems)) {
        let orderItem = generateOrderItem(data[id]["name"], quantity, data[id]["price"], id);
        list.appendChild(orderItem);
    }

    let total = generateOrderItemTotal(getTotal(countedItems));
    list.appendChild(total);

    let continueButton = document.getElementsByClassName("continue")[0];
    continueButton.style.display = "block";
}