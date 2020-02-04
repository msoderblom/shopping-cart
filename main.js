//funktion som hämtar data från local storage om det finns någon

//Funktion som ritar ut alla produkter från en från json-filen i sina kort

$(document).ready(function() {
  let p_container = $("#product_container");

  fetch("products.json")
    .then(resp => resp.json())
    .then(productsObj => {
      const products = productsObj.products;
      products.forEach(product => {
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
          <button class="uk-button uk-button-default addBtn">Add To Cart</button>
        </div>
      </div>
      </div>
        `;
        p_container.append(product_card);
      });

      $(".addBtn").click(function() {});
    });
});

//funtion som lägger till produkter i varukorgen
//eventlistener på alla knappar i korten
