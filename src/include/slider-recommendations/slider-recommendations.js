class SliderRecommendations {
    constructor(el, opts) {
        const self = this;
        self.DATA_KEY = 'SliderRecommendations';

        // опции
        self.$el = $(el);
        self.$el.data(self.DATA_KEY, self);
        self.opts = $.extend({}, self.$el.data(), opts);

        self.$slider = self.$el.find('.js-slider');

        self.setListeners();
        self.init();
    }

    setListeners() {
        const self = this;

        //...
    }

    init() {
        const self = this;
        self.$slider.slick({
            autoplay: true,
            autoplaySpeed: 3500,
            pauseOnHover: true,
            dots: true,
            arrows: false,
            infinite: true,
            speed: 250,
            fade: true,
            cssEase: 'linear'
        });
    }
}

$(() => {
    $('.js-slider-recommendations').each((i, item) => {
        new SliderRecommendations(item);
    });
});
