(function () {
  jQuery(document).ready(function () {
    jQuery('#web_services_error').css('display', 'block')
    /* ajax loading gif */
    var ajaxLoad = "<span class='ajax'></span>"
    /* path to the admin ajax file */
    /* url of the blog */
    var blogUrl = jQuery('#blogUrl').attr('ajax')

    jQuery('#api_update').click(function (event) {
      var apikey = jQuery('#idx_broker_apikey').val()
      var submit = apikey_check()
      if (submit === true) {
        event.preventDefault()
        jQuery('[name=action]').val('idx_refresh_api')
        jQuery('#action_mode').val('refresh_mode')
        var status = jQuery('.refresh_status')
        var params = jQuery('#idx_broker_apikey').serialize()
        status.fadeIn('fast').html(ajaxLoad + 'Refreshing API...')
        save_form_options(params, function () {
          status.fadeIn('fast').html(ajaxLoad + 'Refreshing Links...')
          setTimeout(window.location.reload(), 1000)
        })
      }
    })

    if (jQuery('#idx_broker_dynamic_wrapper_page_name').val() !== '') {
      var linkData = jQuery('#page_link').val().split('/*')
      var protocol = linkData[0]
      var link = linkData[1]
      jQuery('#protocol').text(protocol + '/*')
      jQuery('#page_link').val(link)
      jQuery('#dynamic_page_url').show()
    }

    jQuery('#idx_broker_create_wrapper_page').click(function (event) {
      event.preventDefault()
      var post_title = jQuery('#idx_broker_dynamic_wrapper_page_name').val()
      var wrapper_page_id = jQuery('#idx_broker_dynamic_wrapper_page_id').val()
      jQuery('#idx_broker_dynamic_wrapper_page_name').removeClass('error')
      jQuery('#dynamic_page > p.error').hide()
      if (post_title === '') {
        jQuery('#idx_broker_dynamic_wrapper_page_name').addClass('error')
        jQuery('#dynamic_page > p.error').show()
        return
      }
      jQuery.post(
        ajaxurl, {
          action: 'create_dynamic_page',
          post_title: post_title,
          wrapper_page_id: wrapper_page_id,
          idx_broker_admin_page_tab: jQuery('#tabs li.active a').attr('href'),
          nonce: IDXAdminAjax.wrapper_create_nonce
        }).done(function (response) {
        setTimeout(window.location.reload(), 1000)
      })
    })

    jQuery('#idx_broker_delete_wrapper_page').click(function (event) {
      event.preventDefault()
      var wrapper_page_id = jQuery('#idx_broker_dynamic_wrapper_page_id').val()
      jQuery.post(
        ajaxurl, {
          action: 'delete_dynamic_page',
          wrapper_page_id: wrapper_page_id,
          idx_broker_admin_page_tab: jQuery('#tabs li.active a').attr('href'),
          nonce: IDXAdminAjax.wrapper_delete_nonce
        }
      ).done(function () {
        /* save form */
        var status = jQuery('.wrapper_status')
        status.fadeIn('fast').html(ajaxLoad + 'Deleting IDX Wrapper Page...')
        save_form_options('', function () {
          status.fadeIn('fast').html(ajaxLoad + ' Refreshing Page...')
          setTimeout(window.location.reload(), 1000)
        })
      })
    })

    // Unhide dev partner API key option if URL parameter is present.
    if (window.location.search.includes('idxdev')) {
      document.getElementById('devSettings').classList.remove('hide')
    }

  })

  /**
   *  return true or false for form submission
   */
  function apikey_check () {
    var apikey = jQuery('#idx_broker_apikey').val()
    if (apikey === '') {
      jQuery('#idx_broker_apikey').focus()
      jQuery('#idx_broker_apikey').parent('div').css('background', '#FDB7B7')
      jQuery('#idx_broker_apikey_error').show()
      return false
    } else {
      jQuery('#idx_broker_apikey').parents('div').css('background', 'none')
      jQuery('#idx_broker_apikey_error').hide()
      return true
    }
  }

  function save_form_options (params, callback) {
    var curentTab = jQuery('#tabs li.active a').attr('href')
    jQuery('#currentTab').val(curentTab)
    params = params || jQuery('#idx_broker_options').serialize()
    params += '&' + jQuery('#currentTab').serialize()
    params += '&' + jQuery('[name=action]').serialize()
    params += '&' + 'nonce=' + IDXAdminAjax.refresh_api_nonce
    return jQuery.ajax({
      type: 'POST',
      url: ajaxurl,
      data: params,
      success: function (data) {
        jQuery('[name=action]').val('update')
        callback()
      }
    })
  }
})(window, undefined)

function updateRecaptchaSetting (element) {
  jQuery.post(
    ajaxurl, {
      action: 'idx_update_recaptcha_setting',
      nonce: IDXAdminAjax['google_recaptcha_nonce'],
      enable_recaptcha: (element.checked ? 1 : 0)
    }, function (response) {
      if (response !== 'success') {
        window.location.reload()
      }
    }
  )
}

function updateOptoutSetting (element) {
  jQuery.post(
    ajaxurl, {
      action: 'idx_update_data_optout_setting',
      nonce: IDXAdminAjax['data_optout_nonce'],
      optout: element.checked
    }, function (response) {
      if ( response !== 'success') {
        window.location.reload()
      }
    }
  )
}

function updateDevPartnerKey () {
  var loadingIcon = "<span class='dashicons dashicons-update spin' style='color: #007cba;'></span>"
  var successIcon = "<span class='dashicons dashicons-yes-alt' style='color:#bada55;'></span>"
  var failIcon = "<span class='dashicons dashicons-dismiss' style='color: tomato;'></span>"
  var statusContainer = jQuery('.idx-dev-key-refresh-status')
  statusContainer.fadeIn('fast').html(loadingIcon + 'Saving Developer Partner API key...')
  jQuery.post(
    ajaxurl, {
      action: 'idx_update_dev_partner_key',
      nonce: IDXAdminAjax.dev_key_update_nonce,
      key: document.getElementById('idx-broker-dev-partner-key').value
    }, function (response) {
      if ( response !== 'success') {
        setTimeout(function () {
          statusContainer.fadeIn('slow').html(failIcon + 'Save Failed! ' + response)
        }, 700)
      } else {
        setTimeout(function () {
          statusContainer.fadeIn('slow').html(successIcon + 'Saved!')
        }, 700)
      }
      setTimeout(function () {
        statusContainer.fadeOut('slow')
      }, 2000)
    }
  )
}
