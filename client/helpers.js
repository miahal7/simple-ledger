Template.body.helpers({
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
    if(this.cleared === true) { return ""; }
    if(this.cleared === false){ return "yellow-text"; }
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
  },
  credit: function () {
    if(this.deposit === true) { return "green-text"; }
  }
});
