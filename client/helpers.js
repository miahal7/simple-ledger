Template.body.helpers({
  bankTotal: function () {
    var transactions = Transactions.find({deleted: false, cleared: true});
    return total(transactions);
  },
  predictedTotal: function () {
    var transactions = Transactions.find({deleted: false});
    return total(transactions);
  },
  month: function () {
    var fmtdMonth = moment(month(), 'MM/YY').format("MMM 'YY"); //Phone is default
    
    if(Meteor.Device.isTablet()) {
      fmtdMonth = moment(month(), 'MM/YY').format('MMM YYYY');
    } else if(!Meteor.Device.isPhone()){
      fmtdMonth = moment(month(), 'MM/YY').format('MMMM YYYY');
    }

    return fmtdMonth;
  },
  prevMonth: function () {
    var fmtdMonth = ""; //Phone is default

    if(Meteor.Device.isTablet()) {
      fmtdMonth = moment(month(), 'MM/YY').subtract(1, 'month').format('MMM');
    }
    else if(!Meteor.Device.isPhone()) {
      fmtdMonth = moment(month(), 'MM/YY').subtract(1, 'month').format('MMMM');
    }

    return fmtdMonth;
  },
  nextMonth: function () {
    var fmtdMonth = ""; //Phone is default

    if(Meteor.Device.isTablet()) {
      fmtdMonth = moment(month(), 'MM/YY').add(1, 'month').format('MMM');
    }
    else if(!Meteor.Device.isPhone()) {
      fmtdMonth = moment(month(), 'MM/YY').add(1, 'month').format('MMMM');
    }

    return fmtdMonth;
  },
  notPhone: function () {
    return !Meteor.Device.isPhone();
  }
});

Template.ledger.helpers({
  transactions: function () {
    var query = Session.get('query') || '';
    var regex = { $regex: new RegExp(query, 'ig') };

    return Transactions.find({month: month(),
      $or: [
        { vendor:   regex },
        { category: regex },
        { $where: "/" + query + "/.test(this.amount)" },
        { date:     regex }
      ]},
      { sort: {createdAt: 1, recurring: -1 }}).fetch();
  },
  rowClass: function () {
    console.log("this -> ", this);

    if(this.cleared === true) { return ""; }
    // if(this.deposit === true) { return "green-text"; } 
    if(this.cleared === false){ return "red-text"; }
  }

//   tableSettings: function () {
//     var fields = [{key: 'createAt', label: 'Created At', hidden: true, hideToggle: true, sort: 'ascending', sortable: false},
//                   {key: 'vendor', label: 'Vendor', tmpl: Template.vendor, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                   {key: 'amount', label: 'Amount', tmpl: Template.amount, fn: function(value){return Number(value)*100;}, sortByValue: true, sortable: false},
//                   {key: 'cleared', label: '', tmpl: Template.crd,
//                   fn: function(value, object){
//                    var sortOnVal = (object.cleared === true)? "1" : "0";
//                    sortOnVal += (object.recurring === true)? "1" : "0";
//                    sortOnVal += (object.deposit === true)? "1" : "0";        
      
//                    return sortOnVal;
//                   },
//                   sortByValue: true, sortable: false},
//                   {key: '', label: '', tmpl: Template.deleteRow}];

//     if(Meteor.Device.isTablet()) {
//       fields = [{key: 'createAt', label: 'Created At', hidden: true, hideToggle: true, sort: 'ascending', sortable: false},
//                 {key: 'vendor', label: 'Vendor', tmpl: Template.vendor, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'category', label: 'Category', tmpl: Template.category, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'amount', label: 'Amount', tmpl: Template.amount, fn: function(value){return Number(value)*100;}, sortByValue: true, sortable: false},
//                 {key: 'date', label: 'Date', tmpl: Template.date, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'cleared', label: '', tmpl: Template.crd,
//                 fn: function(value, object){
//                  var sortOnVal = (object.cleared === true)? "1" : "0";
//                  sortOnVal += (object.recurring === true)? "1" : "0";
//                  sortOnVal += (object.deposit === true)? "1" : "0";        
 
//                  return sortOnVal;
//                 },
//                 sortByValue: true, sortable: false},
//                 {key: '', label: '', tmpl: Template.deleteRow}];
//     } else if(!Meteor.Device.isPhone()) {
//       fields = [{key: 'createAt', label: 'Created At', hidden: true, hideToggle: true, sort: 'ascending', sortable: false},
//                 {key: 'vendor', label: 'Vendor', tmpl: Template.vendor, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'category', label: 'Category', tmpl: Template.category, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'amount', label: 'Amount', tmpl: Template.amount, fn: function(value){return Number(value)*100;}, sortByValue: true, sortable: false},
//                 {key: 'date', label: 'Date', tmpl: Template.date, fn: function(value){return value;}, sortByValue: true, sortable: false},
//                 {key: 'cleared', label: '', tmpl: Template.crd,
//                 fn: function(value, object){
//                  var sortOnVal = (object.cleared === true)? "1" : "0";
//                  sortOnVal += (object.recurring === true)? "1" : "0";
//                  sortOnVal += (object.deposit === true)? "1" : "0";        
      
//                  return sortOnVal;
//                 },
//                 sortByValue: true, sortable: false},
//                 {key: '', label: '', tmpl: Template.deleteRow}];
//     }


//     return {
//       rowsPerPage: 999,
//       showFilter: false,
//       showNavigation: "never",
//       rowClass: function (item) { 
//         if(item.cleared === true) {return "";}
//         if(item.deposit === true) {return "success";} 
//         if(item.cleared === false){return "danger";} 
//       },
//       class: "table table-condensed table-hover table-striped",
//       id: 'ledger-table',
//       fields: fields
//     };
//   }
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
  },
  credit: function () {
    console.log("this -> ", this);
    if(this.deposit === true) { return "green-text"; } 


  }
});
