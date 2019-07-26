class Brands {
    constructor(el, opts) {
        const self = this;
        self.DATA_KEY = 'Brands';

        // опции
        self.$el = $(el);
        self.$el.data(self.DATA_KEY, self);
        self.opts = $.extend({}, self.$el.data(), opts);

        self.$link = self.$el.find('.js-btn');
        self.$hiddenPreview  = self.$el.find('.js-hidden-preview');
        self.$slider = self.$el.find('.js-slider');

        self.setListeners();
    }

    setListeners() {
        const self = this;

        self.init();
        self.initSlick();
    }

    initSlick() {
        const self = this;
        self.$slider.slick({
            lazyLoad: 'ondemand',
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            arrows: true,   
        });
    }

    init() {
        const self = this;
        
        self.$link.on('click', function() {

            if(self.$hiddenPreview.is(':visible') == true) {
                self.$link.text($(this).attr('data-open'));
                self.$hiddenPreview.slideUp();
            }else {
                self.$link.text($(this).attr('data-close'));
                self.$hiddenPreview.slideDown();
            }
        });
    }
}

$(() => {
    $('.js-top-brands').each((i, item) => {
        new Brands(item);
    });
});
