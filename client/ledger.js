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

var month = function () {
  return Session.get('month') || moment().format('MM/YY');
}

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
    return Transactions.find({month: month(), deleted: false}, {sort: {recurring: -1, createdAt: 1}}).fetch();
  },
  month: function () {
    return moment(month(), 'MM/YY').format('MMM YYYY');
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
    return datasource;
  }
});

Template.vendor.helpers({
  vendors: function() {
    var datasource = Vendors.find().fetch().map(function(vendor){ return vendor.name; });
    return datasource;
  }
});

Template.category.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.vendor.onRendered(function () {
    Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.date.onRendered(function () {
  // if(! $(".datepicker").hasClass("datepicker")){
    $(".datepicker").datepicker();
    // $(".date").addClass('datepicker');
  // }
});

Template.amount.helpers({
  formattedAmount: function () {
    return accounting.formatNumber(this.amount, 2);
  }
});

Template.body.events({
  'click #addTransaction': function (event) {
    Meteor.call('insertTransaction', month());
  },
  'click .previous': function (event) {
    Session.set('month', moment(month(), 'MM/YY').subtract(1, 'month').format('MM/YY'));
  },
  'click .next': function (event) {
    Session.set('month', moment(month(), 'MM/YY').add(1, 'month').format('MM/YY'));
  }
});

Template.ledger.events({
  'click .vendor, click .category, click .amount': function (event) {
    $(event.target).select();
  },
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
  'change .category, typeahead:selected .category, typeahead:autocompleted .category': function (event) {
    var tr = $(event.currentTarget).closest('tr');
    var vendorField = tr.find('.vendor');
    var category = $(event.target).typeahead('val'); 
    var formEl = $(event.target);
    var transUpdate = {category: category, updatedAt: moment().format()};
    var transId = formEl.data('trans-id');

    if(category !== "" && category.length >= 2){
      console.log("Updating user's category collection", category);
      Meteor.call('updateTransaction', transId, transUpdate);    
      Meteor.call('upsertCategory', category);
    }
  },
  'click .delete': function (event) {
    var transId = $(event.currentTarget).data('trans-id');
    Meteor.call('tempDeleteTransaction', transId);
  }
});

