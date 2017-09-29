import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import { Transactions } from '/imports/api/transactions/transactions.js';
import { parseMonthURI } from '/imports/ui/lib/ledger-month.js';
import './vendor-input/vendor-input.js';
import './category-input/category-input.js';
import './date-input/date-input.js';
import './amount-input/amount-input.js';
import './delete-row-btn/delete-row-btn.js';
import './crd/crd-btn-group.html';
import './ledger.html';

const LedgerSubs = new SubsManager();

Template.ledger.onCreated(function () {
    const _this = this;
    _this.ready = new ReactiveVar();
    LedgerSubs.subscribe('vendors');
    LedgerSubs.subscribe('categories');

    Tracker.autorun(() => {
        const month = parseMonthURI(FlowRouter.getParam('month'));
        LedgerSubs.subscribe('transactions', month);

        _this.ready.set(LedgerSubs.ready());
    });
});

Template.ledger.onRendered(function () {

});

Template.ledger.helpers({
    transactions() {
        const month = parseMonthURI(FlowRouter.getParam('month'));
        return Transactions.find({ month });
    },
    rowClass() {
        return (this.cleared) ? '' : 'yellow-text';
    },
    subsReady() {
        return Template.instance().ready.get();
    },
});

Template.ledger.events({
    'click .vendor, click .category, click .amount'(event) {
        try {
            $(event.target).get(0).setSelectionRange(0, 9999);
        } catch (e) {
            $(event.target).select();
        }
    },
    'change input.trans-form, click button.trans-form'(event) {
        const formEl = $(event.currentTarget);
        const transId = formEl.data('trans-id');
        const field = formEl.data('field');
        const value = (event.type === 'click') ? !formEl.hasClass("active") : formEl.val();
        const transUpdate = {
            updatedAt: moment().format(),
        };

        transUpdate[field] = value;

        Meteor.call('updateTransaction', transId, transUpdate);
    },
    'change .vendor, typeahead:selected .vendor, typeahead:autocompleted .vendor'(event) {
        const vendor = $(event.target).typeahead('val').trim();
        const formEl = $(event.target);
        const transUpdate = {
            vendor: vendor,
            updatedAt: moment().format(),
        };
        const transId = formEl.data('trans-id');

        if (vendor !== "" && vendor.length >= 2) {
            Meteor.call('updateTransaction', transId, transUpdate);
            Meteor.call('upsertVendor', vendor);
        }
    },
    'change .category, typeahead:selected .category, typeahead:autocompleted .category'(event) {
        const category = $(event.target).typeahead('val').trim();
        const formEl = $(event.target);
        const transUpdate = {
            category: category,
            updatedAt: moment().format(),
        };
        const transId = formEl.data('trans-id');

        if (category !== "" && category.length >= 2) {
            Meteor.call('updateTransaction', transId, transUpdate);
            Meteor.call('upsertCategory', category);
        }
    },
});
