//funktion som hämtar data från local storage om det finns någon

//Funktion som ritar ut alla produkter från en från json-filen i sina kort

$(document).ready(function() {
  let productList = [];
  let cartList = [];
  let p_container = $("#product_container");
  let shoppingCart = $("#shoppingCart");

  $("#emptyCartBtn").click(emptyCart);

  // console.log(localStorage.cartList);

  if (
    typeof localStorage.cartList != "undefined" &&
    localStorage.cartList.length != 0
  ) {
    cartList = JSON.parse(localStorage.getItem("cartList"));
    drawCart();
  }

  totalAmount();

  fetch("products.json")
    .then(resp => resp.json())
    .then(productsObj => {
      productList = productsObj.products;
      productList.forEach(product => {
        // console.log(product.name);
        let product_card = `
        <div>
        <div class="uk-card uk-card-default" id="card">

        <div class="uk-card-media-top" id="img_container">
          <img src="${product.img}" alt="" id="img"/>
        </div>
        <div class="uk-card-body" id="card_body_container">
          <h3 class="uk-card-title" id="title">${product.name}</h3>
          <h2>${product.unitPrice} kr</h2>
          <p id="info">
            ${product.info}

          </p>
          <div class="uk-margin">
           <label class="uk-form-label" for="form-stacked-select">Quantity</label>
            <div class="uk-form-controls">
       
              <div class="uk-margin">
                <input data-inputid="${product.id}" class="uk-number" min="1" max="10"type="number" value="1">
              </div>
              
            </div>
          </div>
          <button data-product-id="${product.id}"class="uk-button uk-button-default addBtn">Add To Cart</button>
        </div>
      </div>
      </div>
        `;
        p_container.append(product_card);
      });

      $(".addBtn").click(addToCart);
    });

  function addToCart(event) {
    let productId = event.currentTarget.dataset.productId;
    let qtyInput = $(`[data-inputid= '${productId}']`)[0];
    let qty = parseInt(qtyInput.value);

    // console.log(qtyInput.dataset.inputid);
    console.log("värdet från input: " + qtyInput.value);

    productList.forEach(product => {
      if (product.id == productId) {
        // console.log(cartList);
        // console.log(productId);

        if (checkDuplicate(product) === false) {
          cartList.push(product);
          cartList.forEach(p => {
            if (p.id == productId) {
              p.qty = qty;

              // console.log("produktens gty-egenskap: " + product.qty);

              p.totalPrice = p.unitPrice * p.qty;
              // console.log("produktens pris: " + product.price);

              console.log("finns inte redan");
            }
          });
        } else {
          console.log("finns redan");
        }

        drawCart();
        updateLocalStorage();
      }
    });

    totalAmount();
  }
  function removeFromCart(event) {
    let productId = event.currentTarget.dataset.id;
    cartList.forEach(product => {
      if (product.id == productId) {
        cartList.splice(cartList.indexOf(product), 1);
        drawCart();
        updateLocalStorage();
        totalAmount();
      }
    });
  }
  //
  function drawCart() {
    shoppingCart[0].innerHTML = "";
    cartList.forEach(product => {
      let cartCard = `
      
  <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
    <div class="uk-card-media-left uk-cover-container">
    <canvas width="150" height="150"></canvas>
        <img src="${product.img}" alt="" uk-cover>
        
    </div>
    <div>
        <div class="uk-card-body">
        <span data-id="${product.id}" class="deleteBtn" uk-icon="icon: trash; ratio: 2"></span>
            <h3 class="uk-card-title">${product.name}</h3>
            <h2>Qty: </h2>
            <input data-pid="${product.id}" class="uk-number cartQty" min="1" max="10" type="number" value="${product.qty}">
            <h2>${product.totalPrice} kr</h2>
        </div>
    </div>
  </div>
  `;

      shoppingCart.append(cartCard);
    });
    $(".deleteBtn").click(removeFromCart);
    $(".cartQty").change(changeQty);
    // console.log(cartList);
  }

  function totalAmount() {
    let totalAmount = 0;

    if (cartList.length != 0) {
      cartList.forEach(product => {
        totalAmount += product.totalPrice;
      });
    }

    $("#totalAmount").text(totalAmount + " kr");
  }

  function updateLocalStorage() {
    localStorage.setItem("cartList", JSON.stringify(cartList));
    // console.table(localStorage);
  }

  function emptyCart() {
    localStorage.cartList = "";
    cartList = [];
    drawCart();
    totalAmount();
  }

  function checkDuplicate(product) {
    if (cartList.includes(product)) {
      return true;
    } else {
      return false;
    }

    //   cartList.forEach(product => {
    //     console.log(product.id);

    //     if (product.id == id) {
    //       return true;
    //     }
    //   });
    //   return false;
  }

  function changeQty(event) {
    let cartProductId = event.currentTarget.dataset.pid;
    let qty = parseInt(event.currentTarget.value);

    cartList.forEach(product => {
      if (product.id == cartProductId) {
        product.qty = qty;

        product.totalPrice = product.unitPrice * product.qty;

        totalAmount();
        updateLocalStorage();
        drawCart();
      }
    });
  }
});

//funtion som lägger till produkter i varukorgen
//eventlistener på alla knappar i korten
