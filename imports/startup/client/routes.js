import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/ledger/ledger.js';

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { main: 'app_rootRedirector', month: moment().format("MMM_YYYY") });
    },
});

FlowRouter.route('/transactions/:month', {
    name: 'month.transactions',
    action() {
        BlazeLayout.render('App_body', { main: 'app_rootRedirector' });
    },
});
