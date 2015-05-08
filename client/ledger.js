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

Template.amount.helpers({
  formattedAmount: function () {
    return accounting.formatNumber(this.amount, 2);
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
      }, {
        key: 'category',
        label: 'Category',
        tmpl: Template.category
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
  'change .vendor': function (event) {
    var tr = $(event.currentTarget).closest('tr');
    var categoryField = tr.find('.category');
    var vendor = event.target.value;      

    Meteor.call('upsertVendor', vendor);
  },
  'change .category': function (event) {
    var tr = $(event.currentTarget).closest('tr');
    var vendorField = tr.find('.vendor');
    var category = event.target.value;      

    Meteor.call('upsertCategory', category);
  },
  'click .delete': function (event) {
    var transId = $(event.currentTarget).data('trans-id');
    Meteor.call('tempDeleteTransaction', transId);
  }
});

Template.body.events({
  'click #addTransaction': function (event) {
    Meteor.call('insertTransaction');
  }
});
