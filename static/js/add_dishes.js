/*jshint esversion: 8 */
/*global console*/
// eslint-disable-line no-console
let updated_item_quantity = 0;
let del_cookie = '{{ delete_cookie|safe }}';
let cart = {};

// window.onload = function () {
//     "use strict";
//     console.log(window.table_code);
//     console.log(del_cookie);
//     if (del_cookie === "True") {
//         console.log("inside delete");
//         deleteCookie("cart");
//     } else {
//         menu_status();
//     }


// };

const check_based_get_cartcookie = () => {
    "use strict";
    if (window.table_code === "default") {
        return getCookie("online_cart");
    } else {
        return getCookie("offline_cart");
    }
};

const check_based_set_cartcookie = (cart) => {
    "use strict";
    if (window.table_code === "default") {
        setCookie('online_cart', JSON.stringify(cart));
    } else {
        setCookie('offline_cart', JSON.stringify(cart));
    }
};

const get_key_of_cookie = () => {
    "use strict";
    if (window.table_code === "default") {
        return "online_cart";
    } else {
        return "offline_cart";
    }

};


const menu_status = () => {
    "use strict";
    let cart_string = check_based_get_cartcookie();
    // let cart_string = getCookie("offline_cart");
    console.log("cart string", cart_string);
    if (cart_string !== null) {
        let data = JSON.parse(cart_string);
        let button_exist;

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                console.log(data);
                console.log(document.body.contains(document.getElementById(`${key}_quantity_plus_minus_wrapper`)));
                button_exist = document.body.contains(document.getElementById(`${key}_quantity_plus_minus_wrapper`)) || document.body.contains(document.getElementById(`${key}_add`));
                console.log("button exists", button_exist);
                console.log("data[key].quantity", data[key].quantity);
                console.log("key", key);
                if (button_exist) {
                    console.log("in if of button exists");
                    if (data[key].quantity > 0) {
                        console.log("inside if");
                        document.getElementById(`${key}_quantity_plus_minus_wrapper`).style.display = 'block';
                        document.getElementById(`${key}_add`).style.display = 'none';
                        document.getElementById(`${key}_quantity`).innerText = data[key].quantity;
                    } else {
                        console.log("inside else")
                        document.getElementById(`${key}_quantity_plus_minus_wrapper`).style.display = 'none';
                        document.getElementById(`${key}_add`).style.display = 'block';
                        delete data[key];
                        check_based_set_cartcookie(cart);

                    }
                }
            }
        }
    }
};

const verify_cart = (data) => {
    "use strict";
    let csrf_token = getCookie('csrftoken');
    let response = fetch("/orders/django_session_cart/"+window.table_code+"/", {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token
        },
    }).then(resp => resp.json())
        .then((django_cart) => {
            console.log("in then");
            let obj1 = django_cart['django_cart'];
            let obj2 = JSON.parse(data);
            console.log("obj1", obj1);
            console.log(obj2);
            let flag = isEqual(obj1, obj2);
            console.log("flag", flag);
            if (flag === false) {
                var data1 = check_based_get_cartcookie();
                let json_input_field = document.getElementById("cart_json_field");
                let json_form = document.getElementById("cart_json_form");
                console.log("table code window", window.table_code);
                var f = window.table_code.toString();
                var cart_data_v = JSON.stringify({"table_code": f, "cart": JSON.parse(data1),"key":get_key_of_cookie()});
                json_input_field.value = cart_data_v;
                json_form.submit();
            }


        });
};

function isEqual(obj1, obj2) {
    "use strict";
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length !== props2.length) {
        return false;
    }
    for (var i = 0; i < props1.length; i++) {
        let val1 = obj1[props1[i]];
        let val2 = obj2[props1[i]];
        let isObjects = isObject(val1) && isObject(val2);
        if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}

function isObject(object) {
    "use strict";
    return object !== null && typeof object === 'object';
}


const quantityHandler = async (e, user_type) => {
    "use strict";
    e.preventDefault();
    if (user_type === "waiter") {

    } else {
        let cart_string = check_based_get_cartcookie();
        if (cart_string === null) {
            cart = {};
        } else {
            cart = JSON.parse(cart_string);
        }
    }
    let target_id = e.target.id;
    console.log(target_id, target_id.split("_", 2));
    let target_id_split = target_id.split("_", 2);
    let item_id = target_id_split[0];
    let item_quantity = document.getElementById(`${item_id}_quantity`);
    let cart_item_quantity = document.getElementById(`${item_id}_item_quantity`);
    let cart_item_total = document.getElementById(`${item_id}_item_total`);
    let cart_item_price = document.getElementById(`${item_id}_item_price`);
    let total_payable_amount = document.getElementById('total_payable_amount');
    console.log(document.body.contains(document.getElementById(`${item_id}_quantity_plus_minus_wrapper`)));
    console.log(target_id_split);
    if (target_id_split[1] === 'minus') {
        console.log("check....", item_quantity.innerHTML, "....", item_id);
        updated_item_quantity = parseInt(item_quantity.innerHTML) - 1;
        if (updated_item_quantity < 1) {
            document.getElementById(`${item_id}_quantity_plus_minus_wrapper`).style.display = 'none';
            document.getElementById(`${item_id}_add`).style.display = 'inline-block';
        }
    } else if (target_id_split[1] === 'plus' || target_id_split[1] === 'add') {
        console.log("check....", item_quantity.innerHTML, "....", item_id);

        if (check_stock(item_id, parseInt(item_quantity.innerHTML) + 1)) {
            updated_item_quantity = parseInt(item_quantity.innerHTML) + 1;
            if (updated_item_quantity > 0) {
                document.getElementById(`${item_id}_quantity_plus_minus_wrapper`).style.display = 'inline-block';
                document.getElementById(`${item_id}_add`).style.display = 'none';
            } else {
                updated_item_quantity = parseInt(item_quantity.innerHTML);
            }
        } else {
            updated_item_quantity = parseInt(item_quantity.innerHTML);
            console.log("No stock left");
        }
    }
    item_quantity.innerHTML = updated_item_quantity;
    // let quantity;
    // if (target_id_split[1] === 'plus' || target_id_split[1] === 'add') {
    //     quantity = 1;
    // } else if (target_id_split[1] === 'minus') {
    //     quantity = -1;
    // }


    console.log(item_id in cart);
    console.log(cart);
    if (item_id in cart) {
        cart[item_id].quantity = updated_item_quantity;
    } else {
        cart[item_id] = {"quantity": updated_item_quantity};
    }

    for (var key in cart) {
        if (cart[key].quantity <= 0) {
            delete cart[key];
        }
    }
    console.log("cart", cart);
    if (check_dom_element(cart_item_quantity, cart_item_total, total_payable_amount)) {
        console.log("hello check");
        cart_item_quantity.innerHTML = cart[item_id].quantity;
        let old_item_price = cart_item_total.innerHTML;
        cart_item_total.innerHTML = (parseFloat(cart_item_quantity.innerHTML) * parseFloat(cart_item_price.innerText)).toString();
        total_payable_amount.innerHTML = ((parseFloat(total_payable_amount.innerHTML) - old_item_price) + parseFloat(cart_item_total.innerHTML)).toString();
    }
    console.log("user_type", user_type);
    if (user_type === "Customer") {
        console.log("came inside customer");
        check_based_set_cartcookie(cart);
    }


};


function check_dom_element(e1, e2, e3) {
    "use strict";
    if (document.body.contains(e1) && document.body.contains(e2) && document.body.contains(e3)) {
        return true;
    }
    return false;
}

function setCookie(cname, cvalue) {
    "use strict";
    document.cookie = cname + "=" + cvalue + ";" + "path=/";
}


function getCookie(name) {
    "use strict";
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function deleteCookie(name) {
    "use strict";
    document.cookie = name + "=" + ";path=/;" + "expires = Thu, 01 Jan 2000 00:00:00 GMT";
}

function check_stock(id, needed_quantity) {
    "use strict";
    let available = document.getElementById(id + "_available_stock").value;
    console.log(parseInt(available) - parseInt(needed_quantity));
    if ((parseInt(available) - parseInt(needed_quantity)) < 0) {
        return false;
    }
    return true;

}

const viewCart = () => {
    "use strict";
    let csrf_token = getCookie('csrftoken');
    var data = check_based_get_cartcookie();
    var f = window.table_code.toString();
    var cart_data = JSON.stringify({"table_code": f, "cart": JSON.parse(data),"key":get_key_of_cookie()});

    let response = fetch("/orders/view_cart_api/", {
        method: 'POST', body: cart_data, headers: {
            'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/html', 'X-CSRFToken': csrf_token

        },
    });

};
const viewCart1 = (user_type) => {
    "use strict";
    let data;
    if (user_type === "waiter") {
        data = JSON.stringify(cart);
    } else {
        data = check_based_get_cartcookie();
    }
    console.log("data in view_cart", data);
    let json_input_field = document.getElementById("cart_json_field");
    let json_form = document.getElementById("cart_json_form");
    var f = window.table_code.toString();
    let cart_data = JSON.stringify({"table_code": f, "cart": JSON.parse(data),"key":get_key_of_cookie()});
    json_input_field.value = cart_data;
    json_form.submit();
};

const removeFromCart = (dish_id) => {
    "use strict";
    console.log("dish_id_remove", dish_id);
    var cookie_data = JSON.parse(check_based_get_cartcookie());
    console.log("data is", cookie_data);
    delete cookie_data[dish_id];
    console.log("data is", cookie_data);
    console.log("after deletion", cookie_data);
    check_based_set_cartcookie(cookie_data);
    verify_cart(check_based_get_cartcookie());


};
