// function to add product to form with all necessary inputs
function make_product(number) {
    number++;
    document.getElementById('ad').value = number;
    let form = document.getElementById("product_form");
    let product = document.createElement("div")
    product.classList.add("product");
    product.id = `product${number}`;
    product.innerHTML = `
        <div class="product_name">
                <label for="product${number}">Produkt:</label>
                <input type="text" name="product${number}" id="product_input${number}" >
            </div>
            <div class="price">
                <label for="price${number}">Cena za kus:</label>
                <input type="number" name="price${number}" id="price${number}" >
            </div>
            <div class="quantity">
                <label for="quantity${number}">Množství:</label>
                <input type="number" name="quantity${number}" id="quantity${number}" >
            </div>
            <div class="total_price">
                <label for="total_price1">Celková cena</label>
                <input type="number" name="total_price${number}" id="total_price${number}" > 
            </div>
            <div class="dph">
                <label for="dph">DPH</label>
                <input type="checkbox" name="dph${number}" id="dph${number}">
            </div>
            <button id="del${number}" class="del" value="${number}" type="button"><i class="bi bi-trash"></i></button>
        </div>
    `
    form.appendChild(product);
    let del = document.getElementById(`del${number}`);

    // add event listener to delete button to remove product from form
    del.addEventListener("click", function (e) {
        e.preventDefault();
        product.remove();
        calculate_total();
    })
    // add event listener to all inputs to calculate total price of product
    let price = document.getElementById(`price${number}`);
    let quantity = document.getElementById(`quantity${number}`);
    let total_price = document.getElementById(`total_price${number}`);
    let dph = document.getElementById(`dph${number}`);

    price.addEventListener("change", function () {
        if (price.value && quantity.value && total_price.value) {
            total_price.value = "";
        }
        calculate(number);
    })
    quantity.addEventListener("change", function () {
        if (price.value && quantity.value && total_price.value) {
            total_price.value = "";
        }
        calculate(number);
    })
    total_price.addEventListener("change", function () {
        if (price.value && quantity.value && total_price.value) {
            price.value = "";
        }
        calculate(number);
    })
    dph.addEventListener("change", function () {
        calculate_total();
    })
}

// function to calcule missing input in product form
function calculate(number) {
    // console.log("calculating");
    let price = document.getElementById(`price${number}`);
    let quantity = document.getElementById(`quantity${number}`);
    let total_price = document.getElementById(`total_price${number}`);
    // let dph = document.getElementById(`dph${number}`);
    if (price.value && quantity.value && !total_price.value) {
        total_price.value = price.value * quantity.value;
    }
    if (total_price.value && quantity.value && !price.value) {
        price.value = total_price.value / quantity.value;
    }
    if (total_price.value && price.value && !quantity.value) {
        quantity.value = total_price.value / price.value;
    }
    calculate_total();
}

// function to calculate total price of all products
function calculate_total() {
    let total = document.getElementById("full_price");
    let total_dph = document.getElementById("full_price_dph");
    let products = document.getElementsByClassName("product");
    let sum = 0;
    for (let product of products) {
        let total_price = product.querySelector(".total_price").querySelector("input");
        let dph = product.querySelector(".dph").querySelector("input").checked;
        if (dph) {
            sum += Number(total_price.value) / 1.21;
        } else {
            sum += Number(total_price.value);
        }
    }
    total.innerHTML = sum.toFixed(2);
    total_dph.innerHTML = (sum * 1.21).toFixed(2);
}

// function to check if input in form is filled and if not, highlight it
function validate_input(input) {
    let value = input.value;
    if (value.length < 1) {
        input.style.border = "1px solid red";
        input.focus();
        return false;
    } else {
        input.style.border = "revert";
        return true;
    }
}

// function to validate user data are filled in form and in correct format
function validate_user() {
    let name = document.getElementById("name");
    let surname = document.getElementById("surname");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let street = document.getElementById("street");
    let streetNumber = document.getElementById("streetNumber");
    let city = document.getElementById("city");
    let zip = document.getElementById("zip");
    let state = document.getElementById("state");

    if (!validate_input(name)) {
        alert("Vyplňte jméno");
    } else if (!validate_input(surname)) {
        alert("Vyplňte příjmení");
    }
    else if (!validate_input(email)) {
        alert("Vyplňte email");
    }
    else if (!email.value.includes("@")) {
        alert("Email není ve správném formátu");
    }
    else if (!validate_input(phone)) {
        alert("Vyplňte telefon");
    }
    else if (isNaN(phone.value)) {
        alert("Telefon musí být číslo");
    }
    else if (!validate_input(street)) {
        alert("Vyplňte ulici");
    }
    else if (!validate_input(streetNumber)) {
        alert("Vyplňte číslo popisné");
    }
    else if (!validate_input(city)) {
        alert("Vyplňte město");
    }
    else if (!validate_input(zip)) {
        alert("Vyplňte PSČ");
    }
    else if (isNaN(zip.value)) {
        alert("PSČ musí být číslo");
    }
    else if (!validate_input(state)) {
        alert("Vyplňte stát");
    }
    else {
        return true;
    }
    return false;
}

// function to validate products data are filled in form and in correct format
function validate_product() {
    let products = document.getElementsByClassName("product");
    if (products.length < 1) {
        alert("Přidejte alespoň jeden produkt");
        make_product(0);
        return false;
    }
    let correct = 0;
    let i = 0;
    for (let product of products) {
        // console.log(product);
        i = product.querySelector(".del").value;
        let product_name = document.getElementById("product_input" + i);
        let price = document.getElementById("price" + i);
        let quantity = document.getElementById("quantity" + i);
        let total_price = document.getElementById("total_price" + i);

        if (!validate_input(product_name) && (validate_input_product(price) || validate_input_product(quantity) || validate_input_product(total_price))) {
            alert("Vyplňte název produktu");
            return false;
        }
        if (!validate_input(price) && (validate_input_product(product_name) || validate_input_product(quantity) || validate_input_product(total_price))) {
            alert("Vyplňte cenu produktu");
            return false;
        }
        if (!validate_input(quantity) && (validate_input_product(price) || validate_input_product(product_name) || validate_input_product(total_price))) {
            alert("Vyplňte množství produktu");
            return false;
        }
        if (!validate_input(total_price) && (validate_input_product(price) || validate_input_product(quantity) || validate_input_product(product_name))) {
            alert("Vyplňte celkovou cenu produktu");
            return false;
        }
        if (validate_input_product(product_name) || validate_input_product(price) || validate_input_product(quantity) || validate_input_product(total_price)) {
            correct++;
        }
    }
    if (correct < 1) {
        alert("Vyplňte alespoň jednu položku produktu");
        return false;
    }
    return true;
}

// function to check if input in form is filled
function validate_input_product(input) {
    let value = input.value;
    if (value.length < 1 || isNaN(value) || value == 0) {
        return false;
    } else {
        return true;
    }
}

// function to get user data from form as object 
function get_user() {
    let user = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        street: document.getElementById("street").value,
        streetNumber: document.getElementById("streetNumber").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value
    }
    return user;
}

// function to get products data from form as array of objects
function get_products() {
    let products = [];
    let product = {};
    let i = 0;
    let products_div = document.getElementsByClassName("product");
    for (let product_div of products_div) {
        i = product_div.querySelector(".del").value;
        product = {
            name: document.getElementById("product_input" + i).value,
            price: document.getElementById("price" + i).value,
            quantity: document.getElementById("quantity" + i).value,
            total_price: document.getElementById("total_price" + i).value,
            dph: document.getElementById("dph" + i).checked
        }
        products.push(product);
    }
    return products;
}

// function to send user and products data to server
function send_data(user, products) {
    let form = document.createElement("form");
    form.method = "POST";
    let user_input = document.createElement("input");
    user_input.type = "hidden";
    user_input.name = "user";
    user_input.value = JSON.stringify(user);
    form.appendChild(user_input);
    let products_input = document.createElement("input");
    products_input.type = "hidden";
    products_input.name = "products";
    products_input.value = JSON.stringify(products);
    form.appendChild(products_input);

    document.body.appendChild(form);
    form.submit();
}