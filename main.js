//funktion som hämtar data från local storage om det finns någon

//Funktion som ritar ut alla produkter från en från json-filen i sina kort

$(document).ready(function() {
  let productList = [];
  let cartList = [];
  let p_container = $("#product_container");
  let shoppingCart = $("#shoppingCart");

  $("#emptyCartBtn").click(emptyCart);

  const cartListText = localStorage.getItem("cartList");

  if (cartListText) {
    cartList = JSON.parse(cartListText);
    drawCart();
  }

  // if (
  //   typeof localStorage.cartList != "undefined" &&
  //   localStorage.cartList.length != 0
  // ) {
  //   cartList = JSON.parse(localStorage.getItem("cartList"));
  //   drawCart();
  // }

  totalAmount();

  fetch("./products.json")
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
        
              <div class="uk-form-controls">
              <label class="uk-form-label" for="qty">Quantity: </label>
                  <input id="qty" data-inputid="${product.id}" class="uk-number qtyInput" min="1" max="10"type="number" value="1">
                
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

    if (!checkDuplicate(productId)) {
      console.log("Finns inte redan");
      const productToAdd = productList.find(p => p.id === Number(productId));
      productToAdd.qty = qty;
      productToAdd.totalPrice = productToAdd.unitPrice * productToAdd.qty;

      cartList.push(productToAdd);

      drawCart();
      updateLocalStorage();
    } else {
      console.log("finns redan");
      UIkit.notification(
        "<span ></span> This product is already in your cart. Please change the quantity in the cart."
      );
    }

    //   productList.forEach(product => {
    //     if (product.id == productId) {
    //       // console.log(cartList);
    //       // console.log(productId);

    //       if (checkDuplicate(productId) === false) {
    //         cartList.push(product);
    //         cartList.forEach(p => {
    //           if (p.id == productId) {
    //             p.qty = qty;

    //             // console.log("produktens gty-egenskap: " + product.qty);

    //             p.totalPrice = p.unitPrice * p.qty;
    //             // console.log("produktens pris: " + product.price);

    //             console.log("finns inte redan");
    //           }
    //         });
    //       } else {
    //         console.log("finns redan");
    //         UIkit.notification(
    //           "<span ></span> This product is already in your cart. Please change the quantity in the cart."
    //         );
    //       }

    //       drawCart();

    //       updateLocalStorage();
    //     }
    //   });

    //   totalAmount();
  }
  function removeFromCart(event) {
    let productId = event.currentTarget.dataset.id;
    cartList.forEach(product => {
      if (product.id == productId) {
        cartList.splice(cartList.indexOf(product), 1);
        drawCart();
        updateLocalStorage();
      }
    });
  }
  //

  function drawCart() {
    cartCounter();
    totalAmount();
    shoppingCart[0].innerHTML = "";
    cartList.forEach(product => {
      let cartCard = `
      <div class="card-product">
      <img src="${product.img}" />
      <div class="card-product-infos">
        <h2>${product.name}</h2>
      
        <span data-id="${product.id}" class="deleteBtn" uk-icon="icon: trash; ratio: 0.8"></span>
        <label>Qty: </label>
        <input data-pid="${product.id}" class="uk-number cartQty" min="1" max="10" type="number" value="${product.qty}">
        <h2>${product.totalPrice} kr</h2>
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

    // Nollställer alla inputs för antal produkter
    let inputArr = $.makeArray($(".qtyInput"));
    inputArr.forEach(input => {
      input.value = 1;
    });
  }

  function checkDuplicate(productId) {
    console.log(cartList);
    console.log(productId);

    const foundProduct = cartList.find(p => {
      return p.id === Number(productId);
    });
    console.log(foundProduct);

    if (foundProduct) {
      console.log("duplicate= " + true);

      return true;
    } else {
      console.log("duplicate= " + false);
      return false;
    }

    // if (cartList.includes(product)) {
    //   console.log("duplicate= " + true);

    //   return true;
    // } else {
    //   console.log("duplicate= " + false);
    //   return false;
    // }
  }

  function changeQty(event) {
    let cartProductId = event.currentTarget.dataset.pid;
    let qty = parseInt(event.currentTarget.value);

    cartList.forEach(product => {
      if (product.id == cartProductId) {
        product.qty = qty;

        product.totalPrice = product.unitPrice * product.qty;

        updateLocalStorage();
        drawCart();
      }
    });
  }

  function cartCounter(params) {
    let counts = 0;

    cartList.forEach(product => {
      counts += product.qty;
    });
    $(".cart-counter").animate(
      {
        //show span with number
        opacity: 1
      },
      300,
      function() {
        //write number of counts into span
        $(this).text(counts);
      }
    );
    console.log("cart count: " + counts);
  }
});

//funtion som lägger till produkter i varukorgen
//eventlistener på alla knappar i korten
