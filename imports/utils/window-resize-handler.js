window.onresize = () => {
    const width = $(window).width() - 50;

    $('.show-overlay').width(width);
};
