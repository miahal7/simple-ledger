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

Template.vendor.helpers({
  vendors: function() {
    var datasource = Vendors.find().fetch().map(function(vendor){ return vendor.name; });
    return datasource;
  }
});

Template.category.helpers({
  categories: function() {
    var datasource = Categories.find().fetch().map(function(category){ return category.name; });
    return datasource;
  }
});

Template.amount.helpers({
  formattedAmount: function () {
    return accounting.formatNumber(this.amount, 2);
  }
});

