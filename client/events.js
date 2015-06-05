Template.body.events({
  'click #addTransaction': function (event) {
    Meteor.call('insertTransaction', month(), function () {
      setTimeout(function () {
        var target = $("tr:last").find('.vendor').find('input[name=vendor]');
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
          target.focus();
      }, 0);
    });
  },
  'click .previous': function (event) {
    Session.set('month', moment(month(), 'MM/YY').subtract(1, 'month').format('MM/YY'));
  },
  'click .next': function (event) {
    Session.set('month', moment(month(), 'MM/YY').add(1, 'month').format('MM/YY'));
  }
});

Template.deleteRow.events({
  "click .delete": function (event, template) {
    console.log('event -> ', event);
    console.log('template -> ', template.lastNode);
    var undo = template.find('.undo-overlay');
    $(undo).addClass('show-overlay');
    $(undo).find("a").show('slow');
    var transId = $(event.currentTarget).data('trans-id');
    Meteor.call('tempDeleteTransaction', transId);
  },

  "click .undo": function (event, template) {
    var undo = template.find('.undo-overlay');
    $(undo).removeClass('show-overlay');
    $(undo).find("a").hide();
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
 
  // 'click .delete': function (event) {
    // var transId = $(event.currentTarget).data('trans-id');
    // var undo = $(event.target).closest("undo-overlay");
    // console.log("undo -> ", undo.html());
    // Meteor.call('tempDeleteTransaction', transId);
  // },

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
  }  
});