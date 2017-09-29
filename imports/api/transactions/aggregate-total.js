import { Transactions } from './transactions.js';

export const aggregateTotal = (query) => {
    // query = {cleared: true} for bankTotal and {} for userTotal
    const creditPipeline = pipeline(_.extend({ deposit: true }, query));
    const debitPipeline = pipeline(_.extend({ deposit: false }, query));
    let credits = Transactions.aggregate(creditPipeline);
    let debits = Transactions.aggregate(debitPipeline);
    let total = 0;

    credits = parseResults(credits);
    debits = parseResults(debits);
    total = credits - debits;

    return total;
};

const pipeline = (query) => {
    const mergedQuery = _.extend({ userId: Meteor.userId(), deleted: false }, query);
    return [
        {
            $match: mergedQuery,
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ];
};

// result is Transations object
const parseResults = (result) => {
    let total = 0;

    if (!_.isEmpty(result)) {
        if (result[0].total) {
            total = result[0].total;
        }
    }

    return total;
};
