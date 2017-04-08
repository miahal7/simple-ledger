export const parseMonthURI = (monthURI) => {
    return moment(monthURI, 'MMM_YYYY').format('MM/YY');
};
