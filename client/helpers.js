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
    return Transactions.find({month: month()}, {sort: {recurring: -1, createdAt: 1}}).fetch();
  },
  month: function () {
    return moment(month(), 'MM/YY').format('MMMM YYYY');
  },
  tableSettings: function () {
    var self = this;
    return {
      rowsPerPage: 999,
      showFilter: true,
      showNavigation: "never",
      rowClass: function (item) { 
        if(item.cleared === true) {return "";}
        if(item.deposit === true) {return "success";} 
        if(item.cleared === false){return "danger";} 
      },
      class: "table table-condensed table-hover table-striped",
      id: 'ledger-table',
      fields: [{key: 'createAt', label: 'Created At', hidden: true, hideToggle: true, sort: 'ascending', sortable: false},
               {key: 'vendor', label: 'Vendor', tmpl: Template.vendor, fn: function(value){return value;}, sortByValue: true, sortable: false},
               {key: 'category', label: 'Category', tmpl: Template.category, fn: function(value){return value;}, sortByValue: true, sortable: false},
               {key: 'amount', label: 'Amount', tmpl: Template.amount, fn: function(value){return Number(value)*100;}, sortByValue: true, sortable: false},
               {key: 'date', label: 'Date', tmpl: Template.date, fn: function(value){return value;}, sortByValue: true, sortable: false},
               {key: 'cleared', label: '', tmpl: Template.crd,
               fn: function(value, object){
                var sortOnVal = (object.cleared === true)? "1" : "0";
                sortOnVal += (object.recurring === true)? "1" : "0";
                sortOnVal += (object.deposit === true)? "1" : "0";        

                return sortOnVal;
               },
               sortByValue: true, sortable: false},
               {key: '', label: '', tmpl: Template.deleteRow}]
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
