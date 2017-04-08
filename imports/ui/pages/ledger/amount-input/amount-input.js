import { Template } from 'meteor/templating';

import './amount-input.html';

Template.amountInput.helpers({
    formattedAmount() {
        return accounting.formatNumber(this.amount, 2);
    },
    credit() {
        return (this.deposit) ? 'green-text' : '';
    },
});
