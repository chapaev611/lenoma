class Slider {
    constructor(el, opts) {
        const self = this;
        self.DATA_KEY = 'Slider';

        // опции
        self.$el = $(el);
        self.$el.data(self.DATA_KEY, self);
        self.opts = $.extend({}, self.$el.data(), opts);

        self.$slider = self.$el.find('.js-slider');
        self.$slider_content = self.$slider.find('.js-slider-content');
        self.$slider__title = self.$slider_content.find('.js-slider-title');

        self.setListeners();
    }

    setListeners() {
        const self = this;

        self.init();
        self.blockInnerHeight(self.$slider__title);
    }

    init() {
        const self = this;
        self.$slider.slick({
            lazyLoad: 'ondemand',
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: false,
            arrows: true,   
        });
    }

    blockInnerHeight(elements) {
        let maxColHeight = 0;
        let element;

        $(elements).each(function(){
            element = $(this);
            if(element.height() > maxColHeight) maxColHeight = element.height();
        });
        $(elements).height(maxColHeight);
    }
}

$(() => {
    $('.js-slider-hits').each((i, item) => {
        new Slider(item);
    });
});
