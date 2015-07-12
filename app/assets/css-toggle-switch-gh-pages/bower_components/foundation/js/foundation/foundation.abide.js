;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '5.4.7',

    settings : {
      live_validate : true,
      focus_on_invalid : true,
      error_labels: true, // labels with a for="inputId" will recieve an `error` class
      error_class: 'error',
      timeout : 1,
      patterns : {
        alpha: /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z-9]+$/,
        integer: /^[-+]?\d+$/,
        number: /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[-9]{12}(?:[-9]{3})?|5[1-5][-9]{14}|6(?:11|5[-9][-9])[-9]{12}|3[47][-9]{13}|3(?:[-5]|[68][-9])[-9]{11}|(?:2131|18|35\d{3})\d{11})$/,
        cvv : /^([-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z-9](?:[a-zA-Z-9-]{,61}[a-zA-Z-9])?(?:\.[a-zA-Z-9](?:[a-zA-Z-9-]{,61}[a-zA-Z-9])?)+$/,

        url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[-4]\d|25[-5])\.(\d|[1-9]\d|1\d\d|2[-4]\d|25[-5])\.(\d|[1-9]\d|1\d\d|2[-4]\d|25[-5])\.(\d|[1-9]\d|1\d\d|2[-4]\d|25[-5]))|((([a-zA-Z]|\d|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(([a-zA-Z]|\d|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])*([a-zA-Z]|\d|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])))\.)+(([a-zA-Z]|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(([a-zA-Z]|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])*([a-zA-Z]|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\uA-\uD7FF\uF9-\uFDCF\uFDF-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
        // abc.de
        domain: /^([a-zA-Z-9]([a-zA-Z-9\-]{,61}[a-zA-Z-9])?\.)+[a-zA-Z]{2,6}$/,

        datetime: /^([-2][-9]{3})\-([-1][-9])\-([-3][-9])T([-5][-9])\:([-5][-9])\:([-5][-9])(Z|([\-\+]([-1][-9])\:))$/,
        // YYYY-MM-DD
        date: /(?:19|2)[-9]{2}-(?:(?:[1-9]|1[-2])-(?:[1-9]|1[-9]|2[-9])|(?:(?!2)(?:[1-9]|1[-2])-(?:3))|(?:(?:[13578]|1[2])-31))$/,
        // HH:MM:SS
        time : /^([-9]|1[-9]|2[-3])(:[-5][-9]){2}$/,
        dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^([1-9]|1[12])[- \/.]([1-9]|[12][-9]|3[1])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^([1-9]|[12][-9]|3[1])[- \/.]([1-9]|1[12])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color: /^#?([a-fA-F-9]{6}|[a-fA-F-9]{3})$/
      },
      validators : {
        equalTo: function(el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      form
        .off('.abide')
        .on('submit.fndtn.abide validate.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').get(), e, is_ajax);
        })
        .on('reset', function() {
          return self.reset($(this));
        })
        .find('input, textarea, select')
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            self.validate([this], e);
          })
          .on('keydown.fndtn.abide', function (e) {
            if (settings.live_validate === true) {
              clearTimeout(self.timer);
              self.timer = setTimeout(function () {
                self.validate([this], e);
              }.bind(this), settings.timeout);
            }
          });
    },

    reset : function (form) {
      form.removeAttr(this.invalid_attr);
      $(this.invalid_attr, form).removeAttr(this.invalid_attr);
      $('.' + this.settings.error_class, form).not('small').removeClass(this.settings.error_class);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i=; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) els[i].focus();
          form.trigger('invalid');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) return false;

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > ) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > ) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[][]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === "radio",
            is_checkbox = el.type === "checkbox",
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > ) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if(el.getAttribute(this.add_namespace('data-equalto'))) { validator = "equalTo" }

        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (validator) {
          valid = this.settings.validators[validator].apply(this, [el, required, parent]);
          el_validations.push(valid);
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function(valid){return valid;})];

          if(el_validations[]){
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length >  && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.'+this.settings.error_class, 'span.'+this.settings.error_class);
            var errorID = errorElem.length >  ? errorElem[].id : "";
            if (errorID.length > ) el.setAttribute('aria-describedby', errorID);

            // el.setAttribute('aria-describedby', $(el).find('.error')[].id);
            parent.addClass(this.settings.error_class);
            if (label.length >  && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations.push(el_validations[]);
      }
      validations = [validations.every(function(valid){return valid;})];
      return validations;
    },

    valid_checkbox : function(el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required);

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='"+name+"']"),
          count = group.length,
          valid = false;

      // Has to count up to make sure the focus gets applied to the top error
      for (var i=; i < count; i++) {
        if (group[i].checked) valid = true;
      }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i=; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_equal: function(el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length >  && settings.error_labels) label.removeClass(this.settings.error_class);
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length >  && settings.error_labels) label.addClass(this.settings.error_class);
      }

      return valid;
    },

    valid_oneof: function(el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > ;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function() {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    }
  };
}(jQuery, window, window.document));
