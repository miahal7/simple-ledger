total = function (collection) {
  var total = 0;
  var amount;
  
  collection.map(function(transaction) {
    amount = Number(transaction.amount);

    if(transaction.deposit){
      total += amount;
    } else {
      total -= amount;
    } 
  });

  return accounting.formatMoney(total);
};

month = function () {
  return Session.get('month') || moment().format('MM/YY');
}
