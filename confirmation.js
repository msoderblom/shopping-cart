$("document").ready(function() {
  let tBody = $("#tBody");
  let tFoot = $("#tFoot");

  let orderList = JSON.parse(localStorage.cartList);
  localStorage.cartList = "";

  let output;
  orderList.forEach(product => {
    output += ` 
    <tr>
      <td><img src="${product.img} alt="${product.name}"></td>
      <td>${product.name}</td>
      <td>${product.unitPrice}</td>
      <td>${product.qty}</td>
      <td>${product.totalPrice}</td>
    </tr>`;
  });

  let outputFooter = `
    <tr>
      <td>Total:</td>
      <td></td>
      <td></td>
      <td>${totalQty()} PCS</td>
      <td>${totalSum()} kr</td>
    </tr>
  `;

  tBody.html(output);
  tFoot.html(outputFooter);

  function totalSum() {
    let sum = 0;
    orderList.forEach(product => {
      sum += product.totalPrice;
    });
    return sum;
  }
  function totalQty() {
    let totalQty = 0;
    orderList.forEach(product => {
      totalQty += product.qty;
    });
    return totalQty;
  }
});
