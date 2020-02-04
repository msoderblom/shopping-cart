//funktion som hämtar data från local storage om det finns någon

//Funktion som ritar ut alla produkter från en från json-filen i sina kort

$(document).ready(function() {
  let productList = [];
  let cartList = [];
  let p_container = $("#product_container");
  let shoppingCart = $("#shoppingCart");

  console.log(localStorage.cartList);

  if (typeof localStorage.cartList != "undefined") {
    cartList = JSON.parse(localStorage.getItem("cartList"));
    drawCart();
  }

  fetch("products.json")
    .then(resp => resp.json())
    .then(productsObj => {
      productList = productsObj.products;
      productList.forEach(product => {
        console.log(product.name);
        let product_card = `
        <div>
        <div class="uk-card uk-card-default" id="card">

        <div class="uk-card-media-top" id="img_container">
          <img src="${product.img}" alt="" id="img"/>
        </div>
        <div class="uk-card-body" id="card_body_container">
          <h3 class="uk-card-title" id="title">${product.name}</h3>
          <h2>${product.price} kr</h2>
          <p id="info">
            ${product.info}

          </p>
          <div class="uk-margin">
           <label class="uk-form-label" for="form-stacked-select">Select</label>
            <div class="uk-form-controls">
             <select class="uk-select" id="form-stacked-select">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
              </select>
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
    productList.forEach(product => {
      if (product.id == productId) {
        cartList.push(product);
        drawCart();
        updateLocalStorage();
      }
    });
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
  function drawCart() {
    shoppingCart[0].innerHTML = "";
    cartList.forEach(product => {
      let cartCard = `
  
  <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
    <div class="uk-card-media-left uk-cover-container">
        <img src="${product.img}" alt="" uk-cover>
        <canvas width="600" height="200"></canvas>
    </div>
    <div>
        <div class="uk-card-body">
        <span data-id="${product.id}" class="deleteBtn" uk-icon="icon: trash; ratio: 2"></span>
            <h3 class="uk-card-title">${product.name}</h3>
            <h2>${product.price} kr</h2>
        </div>
    </div>
  </div>
  `;

      shoppingCart.append(cartCard);
    });
    $(".deleteBtn").click(removeFromCart);
    console.log(cartList);
  }

  function updateLocalStorage() {
    localStorage.setItem("cartList", JSON.stringify(cartList));
    console.table(localStorage);
  }
});

//funtion som lägger till produkter i varukorgen
//eventlistener på alla knappar i korten
