(() => {
    // аттрибуты к тегам, взяты с https://jqueryvalidation.org/documentation/
    // required – Makes the element required.
    // remote – Requests a resource to check the element for validity.
    // minlength – Makes the element require a given minimum length.
    // maxlength – Makes the element require a given maximum length.
    // rangelength – Makes the element require a given value range.
    // min – Makes the element require a given minimum.
    // max – Makes the element require a given maximum.
    // range – Makes the element require a given value range.
    // step – Makes the element require a given step.
    // email – Makes the element require a valid email
    // url – Makes the element require a valid url
    // date – Makes the element require a date.
    // dateISO – Makes the element require an ISO date.
    // number – Makes the element require a decimal number.
    // digits – Makes the element require digits only.
    // equalTo – Requires the element to be the same as another one
    // описание работы атррибутов https://jqueryvalidation.org/category/methods/

    // полезные методы
    // Validator.form() – Validates the form.
    // Validator.element() – Validates a single element.
    // Validator.resetForm() – Resets the controlled form.
    // Validator.showErrors() – Show the specified messages.
    // Validator.numberOfInvalids() – Returns the number of invalid fields.

    // глобальные команды
    // jQuery.validator.addMethod() – Add a custom validation method.
    // jQuery.validator.format() – Replaces {n} placeholders with arguments.
    // jQuery.validator.setDefaults() – Modify default settings for validation.
    // jQuery.validator.addClassRules() – Add a compound class method.

    $.extend($.validator.messages, {
        required: "поле необходимо заполнить",
        remote: "пожалуйста, введите правильное значение",
        email: "пожалуйста, введите корректный адрес электронной почты",
        url: "пожалуйста, введите корректный URL",
        date: "пожалуйста, введите корректную дату",
        dateISO: "пожалуйста, введите корректную дату в формате ISO",
        number: "пожалуйста, введите число",
        digits: "пожалуйста, вводите только цифры",
        creditcard: "пожалуйста, введите правильный номер кредитной карты",
        equalTo: "пожалуйста, введите такое же значение ещё раз",
        extension: "пожалуйста, выберите файл с правильным расширением",
        maxlength: $.validator.format("пожалуйста, введите не больше {0} символов"),
        minlength: $.validator.format("не менее {0} символов"),
        rangelength: $.validator.format("пожалуйста, введите значение длиной от {0} до {1} символов"),
        range: $.validator.format("пожалуйста, введите число от {0} до {1}"),
        max: $.validator.format("пожалуйста, введите число, меньшее или равное {0}"),
        min: $.validator.format("пожалуйста, введите число, большее или равное {0}")
    });

    $.validator.setDefaults({
        rules: {
            password: {
                required: true,
                minlength: [6],
                latin: true
            },
            password_new: {
                required: true,
                minlength: [6],
                latin: true
            },
            password_retry: {
                required: true,
                equalTo: '[name=password_new]',
                latin: true
            }
        },
        messages: {
            password_retry: {
                equalTo: 'Пароли не совпадают'
            }
        }
    });

    $.validator.addMethod('realemail',
        (value, element) => {
            return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i.test(value);
        },
        'некорректная почта'
    );
    $.validator.addMethod('realphone',
        (value, element) => {
            if (value === '') return true;

            return value.replace(/\D/g, '').length === 10;
        },
        'укажите корректный телефон'
    );
    $.validator.addMethod('latin',
        (value, element) => {
            return !(/[а-яА-ЯЁё]/ig).test(value);
        },
        'только латинские символы'
    );


    const DATA_KEY = 'formValidate';
    
    class FormValidate {
        constructor(element, options) {
            const self = this;

            // опции
            self.$form = $(element);
            self.defaults = {
                errorClass: 'is-error',
                validClass: 'is-valid',
                errorElement: 'div',
                errorTextElement: 'span',
                submitSelector: '.js-submit',
                submitSelectors: '.js-submit, .js-fake-submit',
                ignoreSelector: '.is-validate-ignore',
                parentForErrorSelector: '.js-parent-input-error',
                errorSelector: '.error-message',
                dataToSend: {},
                onCallback: null // функция
            };
            self.options = $.extend({}, self.defaults, $(element).data(), options);

            // создаем переменные


            // функции инициализации
            self.$form.validate({
                ignore: self.options.ignoreSelector,
                invalidHandler: (form, validator) => {
                    const errors = validator.numberOfInvalids();

                    if (errors) {
                        // сфокусируемся на первом проблемном инпате и проскроллим к нему
                        validator.errorList[0].element.focus();
                        let $scrollingElement;

                        if (iOS) {
                            $scrollingElement = $('html, body');
                        } else {
                            $scrollingElement = $(window);
                        }

                        // проскроллим к инпату
                        // (если input скрыт, проскроллим к его родителю)
                        if ($(validator.errorList[0].element).is(':hidden')) {
                            $scrollingElement.scrollTop($(validator.errorList[0].element).parent().offset().top - 150);
                        } else {
                            $scrollingElement.scrollTop($(validator.errorList[0].element).offset().top - 150);
                        }
                    }
                },
                errorClass: self.options.errorClass,
                validClass: self.options.validClass,
                errorElement: self.options.errorElement,
                errorPlacement: ($error, element) => {
                    self.errorPlacement($error, element);
                },
                success: ($element_with_error_message, element) => {
                    $element_with_error_message.addClass('is-valid');
                },
                submitHandler: (form, event) => {
                    self.submitHandler();
                }
            });
            self.setListeners();
        }

        // вешаем события
        setListeners() {
            const self = this;
            const selfOptions = self.options;

            // событие на кнопках отравки формы
            self.$form.on('click', selfOptions.submitSelector, (e) => {
                e.preventDefault();

                self.$form.submit();
            });
        }

        // установка callback-функции
        setCallback(callback) {
            this.options.onCallback = callback;
        }

        // установка
        setDataToSend(obj) {
            this.options.dataToSend = obj || {};
        }

        // прелоадер action = start или stop
        preloader(action) {
            const self = this;
            const selfOptions = self.options;

            if ($.fn.preloader) {
                self.$form.find(selfOptions.submitSelectors).preloader(action);
            }
        }

        // отправка запроса на сервер
        submitHandler() {
            const self = this;
            const selfOptions = self.options;

            if (self.$form.valid()) {
                self.preloader('start');

                const data = new FormData(self.$form[0]);

                // добавил принудительно чекбоксы
                self.$form.find('input[type=checkbox]').each(function (i, input) {
                    data.append(input.name, input.checked); // перезатираем значение если было
                });

                // допишем к отправляемым данным нужные параменты
                $.each(selfOptions.dataToSend, function (key, value) {
                    data.append(key, value); // перезатираем значение если было
                });

                for (var pair of data.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }

                // отправляем ajax
                $.ajax({
                    method: self.$form.attr('method') || 'post',
                    dataType: 'json',
                    url: self.$form.attr('action'),
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        self.preloader('stop');

                        if (response.success) {
                            // обрабатываем ошибки
                            if (response.data.formErrors) {
                                self.parseErrors(response.data.formErrors);
                            } else {
                                // вызываем callback-функцию
                                if (selfOptions.onCallback != null && typeof selfOptions.onCallback == 'function') {
                                    selfOptions.onCallback(response);
                                } else if (response.data.redirectUrl) {
                                    // иначе редиректим
                                    window.location.href = response.data.redirectUrl;
                                } else {
                                    // иначе обновляем страницу
                                    window.location.reload();
                                }
                            }
                        } else {
                            console.error(response.error); // обработка исключения
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.preloader('stop');

                        console.error('Error 500: ' + errorThrown);
                    }
                });
            }
        }

        // подставновка ошибок на форму
        errorPlacement($error, element) {
            const self = this;
            const selfOptions = self.options;

            // положим сообщение об ошибке в нужное место
            var $parent = $(element).parents(selfOptions.parentForErrorSelector);
            if ($parent.length > 0) {
                var $err = $parent.find(selfOptions.errorSelector);
                if ($err.length > 0) {
                    $err.empty().append($error);
                }
            }
        }

        // парсим ошибки от сервера
        parseErrors(errors) {
            const self = this;
            const selfOptions = self.options;

            $.each(errors, function (key, value) {
                var $input = self.$form.find('[name=' + key + ']');

                if ($input.length > 0) {
                    $input.addClass(selfOptions.errorClass).removeClass(selfOptions.validClass);

                    var $error = $('<' + errorTextElement + '>');
                    $error.addClass(selfOptions.errorClass);
                    $error.html(value);

                    self.errorPlacement($error, $input[0]);
                }
            });
        }

        static _interface(options) {
            return this.each((i, item) => {
                let data = $(item).data(DATA_KEY);

                const _options = typeof options === 'object' ? options : {};
                const _method = typeof options === 'string' ? options : null;

                if (!data) {
                    data = new FormValidate(item, _options);
                    $(item).data(DATA_KEY, data);
                }

                if (_method) {
                    if (typeof data[_method] === 'undefined') {
                        throw new Error('No method named ' + _method);
                    } else if (typeof data[_method] === 'function') {
                        data[_method]();
                    }
                }
            });
        }
    }

    $.fn[DATA_KEY] = FormValidate._interface; // инициализация

    $('.js-validate').formValidate();

})();
