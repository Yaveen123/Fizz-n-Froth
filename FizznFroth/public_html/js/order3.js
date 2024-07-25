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

    let nameElement = document.createElement("div");
    nameElement.className = "order1_name";
    nameElement.innerHTML = name;

    let quantityElement = document.createElement("div");
    quantityElement.className = "order1_quantity";
    quantityElement.innerHTML = "Qty: " + quantity;

    let priceElement = document.createElement("div");
    priceElement.className = "order1_price";
    priceElement.innerHTML = "$" + (price * quantity);

    table.appendChild(tr);

    tr.appendChild(td1);
    tr.appendChild(td2);

    td1.appendChild(nameElement);
    td1.appendChild(quantityElement);
    td2.appendChild(priceElement);

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

function getTotal(countedItems) {
    let result = 0;

    for (const [id, quantity] of Object.entries(countedItems)) {
        result += data[id]["price"] * quantity;
    }

    return result;
}

function checkoutError(details = null) {
    let text = "We apologise for the inconvenience, but your order could not be processed successfully. Any changes made could NOT be saved.";

    if (details) {
        text += "\n\n========== ERROR DETAILS ==========\n\n" + details;
    }

    alert(text);
}

function checkoutNext(order_key) {
    //sessionStorage.clear()
    window.location.href = 'order4.php?order_key=' + order_key;
}

function checkout(name, countedItems) {
    let qrContainer = document.getElementsByClassName("qrContainer")[0];
    let qrImage = qrContainer.getElementsByClassName("qrImage")[0];

    // Convert everything into a POST request.
    fetch("/api/sync_order.php", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({"name": name, "order": countedItems})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.success) {
            qrContainer.onclick = () => {
                alert("Your order code is: " + jsonResponse.order_key)
            }

            // Generate a QR code.
            fetch("/api/qr.php?order_key=" + jsonResponse.order_key)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    qrImage.outerHTML = `<p class="qrError">Couldn't get a QR code. :(<br><br>Your order code is:<br><span class="orderKey">${jsonResponse.order_key}</span></p>`;
					loadContentLoop(jsonResponse.order_key);
					throw new Error('Network response was not ok.');
                }
            })
            .then(textResponse => {
                qrImage.src = textResponse;
                loadContentLoop(jsonResponse.order_key);
            })
            .catch(error => {
                checkoutError(error);
            });
        } else if (jsonResponse.status) { // Check for statuses that aren't 0.
            checkoutNext(jsonResponse.order_key)
        } else {
            checkoutError(jsonResponse.message);
        }
      }).catch (error => {
        checkoutError(error);
      })

    qrContainer.style.display = "block";
}

function loadContentLoop(order_key) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/order_status.php?order_key=" + order_key);
    xhttp.responseType = 'json';
    xhttp.send();
    xhttp.onreadystatechange = (e) => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
			if (!xhttp.response.success) {
				throw new Error('Network response was not ok.');
			}

            if (xhttp.response.status) {
                checkoutNext(order_key);
			}
        }
    }

    setTimeout(loadContentLoop, 5000, order_key);
}

let list = document.getElementsByClassName("order1_list")[0];
let cart = getCart();
let customerName = sessionStorage.getItem("name") || "Anonymous"

document.getElementsByClassName("name2")[0].innerHTML = customerName

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

    checkout(customerName, countedItems); // Update information on server.
}
