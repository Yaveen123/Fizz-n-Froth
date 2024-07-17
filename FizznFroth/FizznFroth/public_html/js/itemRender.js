function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


function differenceToTime(difference) {
    let seconds = difference % 60;
    let minutes = ((difference - seconds) / 60).toString();

    seconds = seconds.toString();

    if (seconds.length < 2) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds
}

function status(difference) {
    if (difference < 60 * 2) {
        return "success";
    } else if (difference < 60 * 5) {
        return "warning";
    } else {
        return "danger"
    }
}


function timer() {
    let gridItem = document.getElementsByClassName("grid-item")

    for (let i = 0; i < gridItem.length; i++) {
        let time = gridItem[i].getElementsByClassName("time")[0];

        if (!time["stop"]) {
            time["data-difference"]++;
            time["innerHTML"] = differenceToTime(time["data-difference"]);
            gridItem[i].className = "grid-item " + status(time["data-difference"]);
        }
    }
}

class Item {
    static all = {};

    constructor(id, customerName, approvedOn, orderDetails, inProgress = false) {
        this.id = id;
        this.customerName = customerName;
        this.approvedOn = approvedOn;
        this.orderDetails = orderDetails;
        this.inProgress = inProgress;
        this.elem = {};

        this.firstRender();

        Item.all[id] = this;
    }

    getDifference() {
        return Math.floor(Date.now() / 1000) - this.approvedOn;
    }

    createDiv(className) {
        let div = document.createElement("div");
        div.className = className;
        return div
    }

    generateList() {
        let list = document.createElement("ul");

        this.orderDetails.forEach(element => {
            let listItem = document.createElement("li")
            listItem.innerHTML = `<b>${element.quantity}x</b> ${element.item_name}`;
            list.appendChild(listItem)
        });

        return list;
    }

    setInProgress() {
        this.inProgress = true;

        this.elem.gridItem.className = "grid-item prog";
        this.elem.time.innerHTML = "IN PROG";
        this.elem.time.stop = "1"

        this.elem.button.className = "card-button prog";
        this.elem.button.innerHTML = "FINISH";
        this.elem.button.onclick = () => {
            fetch("mcdonalds.php?mode=complete&order_id=" + this.id)
            .then(response => {
                if (!response.ok) {
                    alert("Network error occurred when trying to complete order. Error: " + response.status)
                } else {
                    return response.json()
                }
            })
            .then(jsonResponse => {
                if (!jsonResponse.success) {
                    alert("Server error occurred when trying to complete order.");
                }
            })

            delete Item.all[this.id];
            this.elem.gridItem.remove();
        }
    }

    firstRender() {
        let difference = this.getDifference();
        let status2 = status(difference);

        let gridItem = this.createDiv("grid-item " + status2);
        let cardHeader = this.createDiv("card-header");
        let cardBody = this.createDiv("card-body");
        let list = this.generateList();

        let orderID = this.createDiv("header-obj header-box order-id");
        orderID.innerHTML = this.id; 

        let time = this.createDiv("header-obj header-box time");
        time["data-difference"] = difference;
        time.innerHTML = differenceToTime(difference);

        let customerName = this.createDiv("header-obj name");
        customerName.innerHTML = escapeHtml(this.customerName);

        let button = document.createElement("button");
        button.className = "card-button start";
        button.innerHTML = "START";

        button.onclick = () => {
            this.setInProgress();
        }

        cardHeader.appendChild(orderID);
        cardHeader.appendChild(time);
        cardHeader.appendChild(customerName);

        cardBody.appendChild(list);

        gridItem.appendChild(cardHeader);
        gridItem.appendChild(cardBody);
        gridItem.appendChild(button);

        document.getElementsByClassName("grid-container")[0].appendChild(gridItem)

        this.elem = {gridItem, orderID, time, customerName, list, cardHeader, cardBody, button}

        setTimeout(timer, 1000);
    }

    static generate(object) {
        for (let i = 0; i < object.length; i++) {
            if (!Item.all[object[i]["id"]]) {
                new Item(object[i].id, object[i].name, object[i].approved_on, object[i].details);
            }
        }

        document.getElementById("itemCount").innerHTML = object.length;
    }
}


function loadContentLoop(order_key) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/mcdonalds.php?mode=update");
    xhttp.responseType = 'json';
    xhttp.send();
    xhttp.onreadystatechange = (e) => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.response.success) {
                Item.generate(xhttp.response.data);
            } else {
                alert(`Content update failed. - 1`);
            }
        }
    }

    const timeoutId = setTimeout(loadContentLoop, 5000);
}

loadContentLoop();
setInterval(timer, 1000);
