$(function() {
    // Get the form.
    var form = $('form#newsletter-subscribe');

    // Get the messages div.
    var formMessages = $('#form-messages');

    var submitButton = $('form#newsletter-subscribe').find('button[type="submit"]');

    var errorTextElem = $('#mbc-newsletter-error p');

    // Get the from wrapper
    var formWrapper = $('.mbc-newsletter-wrapper');


    /*
    * Initialize Icheck
    *
    */
    function initIcheck () {
        form.find('input').iCheck({
            cursor: true
        });
        // $('.list_ids').iCheck('check');
        if(config.isIframe) {
            form.find('#mbc-list-ids li').eq(0).insertBefore(form.find('#mbc-list-ids li').eq(1));
        } else {
            form.find('#mbc-list-ids li').eq(1).insertBefore(form.find('#mbc-list-ids li').eq(0));
        }
    }

    if(form.length > 0) {
        initIcheck();
    }


    /**
     * Summarizes form data
     *
     * @returns {string}
     */
    function prepareFormData() {
        var formData = $(form).serialize();

        var listIds = "";
        $('#mbc-list-ids li div.icheckbox.checked input[type=checkbox]').each(function(index, elem) {
            listIds += "&list_ids[]=" + $(elem).attr('value');
        });

        return formData + listIds;
    }


    function showErrorMessages(error_fields, error_message) {
        $.each(error_fields, function(index, field_id) {
            var errorElem = $('form#newsletter-subscribe input[name="'+field_id+'"], select[name="'+field_id+'"], input.' + field_id);
            var errorDescr = $('form#newsletter-subscribe .descr_' + field_id);

            if ($(errorElem).css('opacity') == '0' || $(errorElem).css('display') == 'none') {
                errorElem = $(errorElem).parent('div');
            }

            $(errorElem).addClass('error');
            $(errorDescr).addClass('error-text');
        });

        $('#form-messages').html(error_message);
    }

    $(form).submit(function(e) {
        e.preventDefault();


        wpmbcom.helper.preloader.show(true);
        submitButton.attr('disabled', 'disabled');

        // reset form
        $('form#newsletter-subscribe .error').removeClass('error');
        $('form#newsletter-subscribe .error-text').removeClass('error-text');
        $('#form-messages').html('');

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: config.ajaxurl_soundcloud,
            data: {
                action: 'subscribe',
                data: prepareFormData()
            },
            success: function(responseData) {

                wpmbcom.helper.preloader.hide();
                submitButton.removeAttr('disabled');

                responseData = $.parseJSON(responseData);

                if (responseData.valid == true) {
                    var hasListErrors = false;
                    // validation was successful - check if request was successful
                    wpmbcom.helper.preloader.show();
                    $.each(responseData.response, function(listId, listResponse) {
                        /**
                         * if response code is 214, recipient is already registered. no failure!
                         */
                        if (listResponse.success != true && listResponse.response.code != 214) {
                            hasListErrors = true;
                        }
                    });

                    if (hasListErrors) {
                        formWrapper.hide();
                        $('#mbc-newsletter-error').removeClass('hide');
                        $('#mbc-newsletter-error .mbc-hover.mbc-button').attr('href',window.location.href);
                    } else {
                        formWrapper.hide();
                        $('#mbc-newsletter-success').removeClass('hide');
                    }
                } else {
                    var error_fields = responseData.error_fields;
                    var error_message = responseData.message;
                    showErrorMessages(error_fields, error_message);
                }
            }
        });
    });

});
