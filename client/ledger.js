var total = function (collection) {
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

Template.body.helpers({
  bankTotal: function () {
    var transactions = Transactions.find({deleted: false, cleared: true});
    return total(transactions);
  },
  predictedTotal: function () {
    var transactions = Transactions.find({deleted: false});
    return total(transactions);
  }
});


Template.ledger.helpers({
  transactions: function () {
    return Transactions.find({deleted: false}, {sort: {recurring: -1, createdAt: 1}}).fetch();
  },
  tableSettings: function () {
    return {
      rowsPerPage: 10,
      showFilter: true,
      showNavigation: "auto",
      class: "table table-condensed table-hover table-striped",
      id: 'ledger-table',
      fields: [{
        key: 'createAt',
        label: 'Created At',
        hidden: true,
        hideToggle: true,
        sort: 'ascending'
      }, {
        key: 'vendor',
        label: 'Vendor',
        tmpl: Template.vendor
        // Add typeahead to template
      }, {
        key: 'category',
        label: 'Category',
        tmpl: Template.category
        // Add typeahead to template
      }, {
        key: 'amount',
        label: 'Amount',
        tmpl: Template.amount
      }, {
        key: 'date',
        label: 'Date',
        tmpl: Template.date
        }, {
        key: '',
        label: '',
        tmpl: Template.crd
      }, {
        key: '',
        label: '',
        tmpl: Template.deleteRow
      }]
    };
  }
});

Template.category.helpers({
  categories: function() {
    var datasource = Categories.find().fetch().map(function(category){ return category.name; });

    console.log("category datasource -> ", datasource);

    return datasource;
  }
});

Template.vendor.helpers({
  vendors: function() {
    var datasource = Vendors.find().fetch().map(function(vendor){ return vendor.name; });

    console.log("vendor datasource -> ", datasource);

    return datasource;
  }
});

Template.category.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.vendor.onRendered(function () {
    Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.amount.helpers({
  formattedAmount: function () {
    return accounting.formatNumber(this.amount, 2);
  }
});

Template.body.events({
  'click #addTransaction': function (event) {
    Meteor.call('insertTransaction');
  }
});

Template.ledger.events({
  'change input.trans-form, click button.trans-form': function (event) {
    var formEl = $(event.currentTarget);
    var transId = formEl.data('trans-id');
    var field = formEl.data('field');
    var value = (event.type === 'click')? !formEl.hasClass("active") : formEl.val();
    var transUpdate = {updatedAt: moment().format()};

    transUpdate[field] = value;
    Meteor.call('updateTransaction', transId, transUpdate);
  },
  'change .vendor, typeahead:selected .vendor, typeahead:autocompleted .vendor': function (event){
    var tr = $(event.currentTarget).closest('tr');
    var categoryField = tr.find('.category');
    var vendor = $(event.target).typeahead('val'); 
    var formEl = $(event.target);
    var transUpdate = {vendor: vendor, updatedAt: moment().format()};
    var transId = formEl.data('trans-id');

    if(vendor !== "" && vendor.length >= 2){
      console.log("Updating user's vendor collection", vendor);
      Meteor.call('updateTransaction', transId, transUpdate);    
      Meteor.call('upsertVendor', vendor);
    }
  },
  // 'change .vendor': function (event) {

  //   var tr = $(event.currentTarget).closest('tr');
  //   var categoryField = tr.find('.category');
  //   var vendor = event.target.value.trim();      
    
  //   console.log(".vendor change-> ", vendor);  
  //   console.log(".vendor .typeahead change -> ", vendor);    

    // if(vendor !== "" && vendor.length >= 2){
    //   Meteor.call('upsertVendor', vendor);
    // }
    // upsert should return the document, but if not:
    // var vendor = Vendors.findOne({name: vendor, userId: userId});
    // if(vendor.suggestedCategory){
    //   set Transaction.category to vendor.suggestedCatory  
    // } 
  // },
  'change .category': function (event) {
    var tr = $(event.currentTarget).closest('tr');
    var vendorField = tr.find('.vendor');
    var category = event.target.value.trim();      
    
    if(vendor !== ""){
      Meteor.call('upsertCategory', category);
    }
    // var vendor = Vendor.find({name: vendor, userId: userId});
    // if(!vendor.suggestedCategory) {
    //   vendor.suggestedCategory = category; 
    //   vendor.save
    // }
  },
  'click .delete': function (event) {
    var transId = $(event.currentTarget).data('trans-id');
    Meteor.call('tempDeleteTransaction', transId);
  }
});

