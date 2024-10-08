<?php
// get info from cnb.cz and return value in NOK or in random currency if NOK is not found in response
function get_curse($value)
{
    // get data from cnb.cz
    $url = "https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        echo 'Curl error: ' . curl_error($ch);
        exit();
    }

    // parse data
    $lines = explode("\n", $response);
    foreach ($lines as $line) {
        // find NOK
        if (strpos($line, "NOK") === false) {
            continue;
        }
        $data = explode("|", $line);
        $name = $data[3];
        $multiple = floatval($data[2]);
        $rate = floatval($data[4]);

        // convert value to NOK
        $value = ($value * $multiple) / $rate;
        return  round($value, 2). " kr ($name)";
    }
    // if NOK is not found, return random currency
    $random = rand(0, count($lines));
    $line = explode("|", $lines[$random]);
    $name = $line[3];
    $multiple = $line[2];
    $rate = $line[4];
    $value = ($value * $multiple) / $rate;
    return round($value, 2) . " " . $name;
}

?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.9.1/font/bootstrap-icons.min.css">
    <script src="js.js"></script>
    <title>Ukol</title>
</head>

<body>
    <?php
    // if form is submitted, show order details
    if (isset($_POST["user"])) {
        echo "<h1>Objednávka byla odeslána</h1>";
        $user = json_decode($_POST["user"], true);
        $products = json_decode($_POST["products"], true);
        $name = $user["name"];
        $surname = $user["surname"];
        $email = $user["email"];
        $phone = $user["phone"];
        $street = $user["street"];
        $streetNumber = $user["streetNumber"];
        $city = $user["city"];
        $zip = $user["zip"];
        $state = $user["state"];

        echo "<div action='post' id='user'>
        <div class='form_part'>
            <div>
                Jméno: <span class='fill'>$name</span>
            </div>
            <div>
                Příjmení: <span class='fill'>$surname</span>
            </div>
            <div>
                Email: <span class='fill'>$email</span>
            </div>
            <div>
                Telefon: <span class='fill'>$phone</span>
            </div>
        </div>
        <div class='form_part'>
            <div>
                Ulice: <span class='fill'>$street</span>
            </div>
            <div>
                Číslo popisné: <span class='fill'>$streetNumber</span>
            </div>
            <div>
                Město: <span class='fill'>$city</span>
            </div>
            <div>
                PSČ: <span class='fill'>$zip</span>
            </div>
            <div>
                Stát: <span class='fill'>$state</span>
            </div>
        </div>
    </div>";
        // print_r($_POST);
        echo "<h2>Položky objednávky</h2>";
        echo "<div id='product_form_div'>
        <div id='product_form'>";
        $full_price = 0;

        // print products with DPH and without DPH
        foreach ($products as $product) {
            echo "<div class='product'>
            <div class='product_name'>
                " . $product['name'] . "
            </div>";
            if ($product["dph"]) {
                $full_price += $product["total_price"];
                $price = $product["price"] / 1.21;
                $total_price = $product["total_price"] / 1.21;
            } else {
                $full_price += $product["total_price"] * 1.21;
                $price = $product["price"];
                $total_price = $product["total_price"];
            }
            echo "<div class='price'>
                ".round($price, 2). "Kč / ks
            </div>";
            echo "<div class='quantity'>
                " . $product['quantity'] . " ks
            </div>";
            echo "<div class='total_price'>
                ".round($total_price,2)." Kč  bez DPH
            </div>";
            echo "<div>
                 " . round($total_price * 1.21, 2). " Kč s DPH
            </div>";
            echo "</div>";
        }
        // print total price in CZK and in NOK
        echo '<div id="full_price_div">
        Celková cena: <span id="full_price">' . round($full_price, 2) . '</span> Kč
     </div>';
        echo '<div id="full_price_div">
        Celková cena: <span id="full_price">' . get_curse($full_price) . '</span>
     </div>';
        echo "</div>
        </div>";
    } else {
        // if form is not submitted, show order form
        echo '<h1>Objednávkový formulář</h1>
    <form action="post" id="user">
        <div class="form_part">
            <div>
                <label for="name">Jméno:</label>
                <input type="text" name="name" id="name">
            </div>
            <div>
                <label for="surname">Příjmení:</label>
                <input type="text" name="surname" id="surname">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" name="email" id="email">
            </div>
            <div>
                <label for="phone">Telefon:</label>
                <input type="tel" name="phone" id="phone">
            </div>
        </div>
        <div class="form_part">
            <div>
                <label for="street">Ulice</label>
                <input type="text" name="street" id="street">
            </div>
            <div>
                <label for="streetNumber">Číslo popisné:</label>
                <input type="text" name="streetNumber" id="streetNumber">
            </div>
            <div>
                <label for="city">Město:</label>
                <input type="text" name="city" id="city">
            </div>
            <div>
                <label for="zip">PSČ:</label>
                <input type="text" name="zip" id="zip">
            </div>
            <div>
                <label for="state">Stát:</label>
                <input type="text" name="state" id="state">
            </div>
        </div>
    </form>
    <div id="product_form_div">
        <form action="" id="product_form">
            <!-- <div class="product">
            <div class="product_name">
                <label for="product1">Produkt:</label>
                <input type="text" name="product1" id="product_input1" >
            </div>
            <div class="price">
                <label for="price1">Cena za kus:</label>
                <input type="number" name="price1" id="price1" >
            </div>
            <div class="quantity">
                <label for="quantity1">Množství:</label>
                <input type="number" name="quantity1" id="quantity1" >
            </div>
            <div class="total_price">
                <label for="total_price1">Celková cena</label>
                <input type="number" name="total_price1" id="total_price1" >
            </div>
            <button action="button" id="del1" class="del" value="1"><i class="bi bi-trash"></i></button>
        </div> -->
        <!-- <div>
            <label for="dph">DPH</label>
            <input type="checkbox" name="dph" id="dph1">
        </div> -->
        </form>
        <button id="ad" value="1" type="button">Přidat produkt</button>
        <div id="full_price_div">
       Celková cena bez DPH: <span id="full_price">0</span> Kč
       <br>
       <br>
       Celková cena s DPH: <span id="full_price_dph">0</span> Kč
    </div>
    </div>
    <div>
        <button id="send" type="button">Odeslat</button>
    </div>';
        // script for prevent submit form 
        echo '<script>
        make_product(0);
        document.getElementById("product_form").addEventListener("submit", function (e) {
            e.preventDefault();
        });';
        // script for add product
        echo '
        document.getElementById("ad").addEventListener("click", function (e) {
            let buttonValue = parseInt(e.target.value);
            make_product(buttonValue);
            // e.target.value = buttonValue + 1;
        });';
        // script for prevent submit form by enter
        echo '
        document.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                event.preventDefault(); return;
            }});';
        // script for send data to server as json in post method
        echo '
        document.getElementById("send").addEventListener("click", function (e) {
            let true_user = validate_user();
            // let true_user = false;
            let true_product = validate_product();
            console.log(true_user);
            console.log(true_product);
            console.log(!(true_user && true_product));
            if (!(true_user && true_product)) {
                console.log("dont send");
               return;
            }
            let user = get_user();
            let products = get_products();
            console.log(user);
            console.log(products);
            send_data(user, products);
        });
    </script>
        ';
    }
    ?>

</body>

</html>