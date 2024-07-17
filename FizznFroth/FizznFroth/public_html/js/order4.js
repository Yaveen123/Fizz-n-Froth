function checkoutError(details = null) {
    let text = "We apologise for the inconvenience, but your order could not be processed successfully. Any changes made could NOT be saved.";

    if (details) {
        text += "\n\n========== ERROR DETAILS ==========\n\n" + details;
    }

    alert(text);
}

function loadContentLoop(order_key) {
    const header = document.getElementsByClassName("order1_header")[0];
    const container = document.getElementsByClassName("order1container2")[0];

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/order_status.php?order_key=" + order_key);
    xhttp.responseType = 'json';
    xhttp.send();
    xhttp.onreadystatechange = (e) => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (!xhttp.response.success) {
                throw new Error('Network response was not ok.');
            }

            if (xhttp.response.status === 2) {
                header.innerHTML = 'SUCCESS!'
                container.innerHTML = `
                    <p class="instruction">
                        Your order number:
                    </p>
                    <div class="box">
                        <span class="orderNumber">${xhttp.response.order_id}</span>
                    </div>
                    <br>
                    <p class="instruction">
                        Please don't close this page until you've received your drink.
                        <br>
                        <br>
                        You may be asked to show this screen upon picking up your order.
                    </p>
                `;
                // Clear the timeout to stop further requests
                clearTimeout(timeoutId);
            }
        }
    }

    const timeoutId = setTimeout(loadContentLoop, 5000, order_key);
}


// Any other way throws an error.
try {
    loadContentLoop(order_key);
} 
catch {
    checkoutError("Error: No order code.")
}