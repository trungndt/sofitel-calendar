var KINGSMEN = window.KINGSMEN || {};
KINGSMEN.General = function() {
  $(function() {
    $('.nice-select').niceSelect();

    // CONTENT EXPAND COLLAPSE
    $(document).on('click', '[data-action="expand"]', function(e) {
      e.preventDefault();
      var $me = $(this);
      var $parent = $me.closest('.block-info');
      $parent.find('.expandable').toggleClass('expanding');
      $parent.toggleClass('expanding');
      $.each($parent.find('[data-action="expand"]'), function(i, e) {
        if ($parent.hasClass('expanding')) {
          $(e).html($(e).attr('data-expand'));
        } else {
          $(e).html($(e).attr('data-collapse'));
        }
      });
    });

    // BOOTSTRAP COLLAPSE
    $(document).on('hide.bs.collapse', '.collapse', function(e) {
      var $lbl = $($(this).attr('aria-labelledby'));
      var collapseText = $lbl.attr('data-collapsetext');
      if (collapseText != undefined)
        $lbl.html(collapseText);
    });

    // BOOTSTRAP COLLAPSE
    $(document).on('show.bs.collapse', '.collapse', function() {
      var $lbl = $($(this).attr('aria-labelledby'));
      var expandText = $lbl.attr('data-expandtext');
      if (expandText != undefined)
        $lbl.html(expandText);
    });

    reloadpage_when_resize();
  });
}();

KINGSMEN.Calendar = function() {
  $(function() {

    // HEADER FORM
    var _DATEFORMAT = 'DD MMM';
    var _DATEFORMAT_2 = 'YYYY/MM/DD';
    var isCalendarOpen = false;

    var initDatePicker = function() {
      if (!$('#dateRange').length)
        return;
      var isAlwaysShow = window.innerWidth < 992;
      $('#dateRange').dateRangePicker({
        // autoClose: false,
        format: _DATEFORMAT_2,
        separator: ' - ',
        container: '.picker-container',
        extraClass: 'hotel-calendar',
        // alwaysOpen: true,
        startDate: moment(new Date()).format(_DATEFORMAT_2),
        minDays: 2,
        singleMonth: true,
        showShortcuts: false,
        showTopbar: false,
        alwaysOpen: isAlwaysShow,
        getValue: function() {
          return $(this).val();
        },
        setValue: function(res, _startDate, _endDate) {
          // this.innerHTML = res;
          var startObj = moment(_startDate);
          var endObj = moment(_endDate);
          var dateStr = '<span>' + startObj.format('DD') + '</span> ' +
            startObj.format('MMM') +
            ' - ' +
            '<span>' + endObj.format('DD') + '</span> ' +
            endObj.format('MMM')

          this.innerHTML = '<div class="selected-dates">' + dateStr + '</div>';
          // Count day
          var count = endObj.diff(startObj, 'days');
          var nightCount = count + ' night' + (count <= 1 ? '' : 's');
          $('.night-count').html(nightCount);
          // Update to shortpicker
          $('.short-picker .selected-dates').html(dateStr);
        },
        beforeShowDay: function(t) {
          var _this = moment(t).format(_DATEFORMAT_2);
          // console.log(_this);
          var soldoutDate = [
            '2017/10/10',
            '2017/10/27',
            '2017/10/28',

            '2017/10/21',
            '2017/10/22',
          ];
          var eventDate = [
            '2017/11/05',
            '2017/11/06',
            '2017/11/07',
          ];
          var valid = soldoutDate.indexOf(_this) < 0;

          var _class = '';
          if (eventDate.indexOf(_this) >= 0) {
            _class += ' event-date';
          }
          if (soldoutDate.indexOf(_this) >= 0) {
            _class += ' soldout-date';
          }
          // Detect end of month or start of month
          if (moment(t).startOf('month').format(_DATEFORMAT_2) == _this) {
            _class += 'start-of-month';
          }
          if (moment(t).endOf('month').format(_DATEFORMAT_2) == _this) {
            _class += 'end-of-month';
          }
          return [valid, _class];
        }
      })
      .bind('datepicker-open', function(e) {
        console.log('datepicker-open');
        $(this).parent().addClass('open');
        var $footer = $('.picker-container');
        if ($footer.find('.calendar-legend').length <= 0)
          $footer.append($('#tmpLegend').html().trim());
      })
      .bind('datepicker-opened', function() {
        console.log('datepicker-opened');
        isCalendarOpen = true;
      })
      .bind('datepicker-closed', function() {
        isCalendarOpen = false;
        $(this).parent().removeClass('open');
      });

      // var $footer = $('.hotel-calendar .footer');
      // $footer.html($('#tmpLegend').html().trim());
      var $footer = $('.picker-container');
      if ($footer.find('.calendar-legend').length <= 0)
        $footer.append($('#tmpLegend').html().trim());

      $(document).on('click', '.date-range', function() {
        if (isCalendarOpen) {
          $('#dateRange').data('dateRangePicker').close();
        }
      });
    }();

    $(document).on('click', '.guest-display', function() {
      $('.guest-dropdown-backdrop').toggle();
      $('.guest-dropdown').slideToggle(100);
    });

    $(document).on('click', '.guest-dropdown-backdrop', function() {
      $(this).hide();
      $('.guest-dropdown').slideToggle(100);
    });

    $(document).on('change', '.nice-select', function() {
      // Sync to incrementor
      var $me = $(this);
      $me.siblings('.incrementor').find('input').val($me.val());
      checkIncrementorStatus();
    });

    $(document).on('change', '[data-select="adults"]', function() {
      updateGuestCount();
    });

    $(document).on('change', '[data-select="children"]', function() {
      updateGuestCount();
      var $me = $(this);
      var count = parseInt($me.val());
      var $container = $('#guestGroupChildren');
      $container.empty();
      for (var i = 1; i <= count; i++) {
        var $guest = $($('#tmpGuestSelect').html().trim());
        $guest.find('p').html('CHILD ' + i + ' AGE');
        $guest.find('.nice-select').niceSelect();
        $container.append($guest);
      }
    });

    var updateGuestCount = function() {
      var adultsCount = parseInt($('[data-select="adults"]').val()),
          childrenCount = parseInt($('[data-select="children"]').val());
      var count = adultsCount + childrenCount;
      if (count < 10) count = '0' + count;
      $('.guest-display').html(count);
      $('.short-picker .selected-guests .count').html(adultsCount);
    }

    var updateRoomCount = function() {
      var roomCount = parseInt($('[data-select="rooms"]').val());
      console.log(roomCount);
      $('.short-picker .selected-rooms .count').html(roomCount);
    }

    /*
     * method: [MOBILE] Open filter panel
     */
    $(document).on('click', '[data-action="filter-open"]', function() {
      $('.filter-panel').fadeIn().addClass('open');
      $('body').addClass('calendar-open');
    });

    /*
     * method: [MOBILE] Close filter panel
     */
    $(document).on('click', '[data-action="filter-close"]', function() {
      $('.filter-panel').fadeOut().removeClass('open');
      $('body').removeClass('calendar-open');

      // Update count
      updateRoomCount();
      updateGuestCount();

      // Back to page 1
      $('[data-action="filter-prev"]').trigger('click');
    });

    /*
     * method: [MOBILE] To next filter page
     */
    $(document).on('click', '[data-action="filter-next"]', function(e) {
      $('.group-calendar').hide();
      $('.group-counter').show();
      $('[data-action="filter-prev"]').show();
    });

    /*
     * method: [MOBILE] To prev filter page
     */
    $(document).on('click', '[data-action="filter-prev"]', function(e) {
      $('.group-calendar').show();
      $('.group-counter').hide();
      $('[data-action="filter-prev"]').hide();
    });

    // Incrementor
    $(document).on('click', '.incrementor button:not(.disabled)', function(e) {
      var $me = $(e.currentTarget);
      var $input = $me.siblings('input');
      var currVal = parseInt($input.val());

      var minVal = parseInt($input.attr('data-min') || '1');
      var maxVal = parseInt($input.attr('data-max') || '10');

      if ($me.hasClass('btn-inc') && currVal < maxVal) {
        currVal++;
      } else if ($me.hasClass('btn-dec') && currVal > minVal) {
        currVal--;
      }
      $input.val(currVal);

      // Sync with dropdown
      $dropdown = $me.parent().siblings('select');
      $dropdown.val(currVal);
      $dropdown.niceSelect('update');
      $dropdown.trigger('change');
      checkIncrementorStatus();
    });

    // Incrementor
    var checkIncrementorStatus = function() {
      $.each($('.incrementor'), function(i, e) {
        var $input = $(e).find('input'), 
            $btnDec = $(e).find('.btn-dec'),
            $btnInc = $(e).find('.btn-inc');

        var currVal = parseInt($input.val()),
            minVal = parseInt($input.attr('data-min') || '1'),
            maxVal = parseInt($input.attr('data-max') || '10');

        if (currVal <= minVal) {
          $btnDec.addClass('disabled')
        } else {
          $btnDec.removeClass('disabled')
        }
        
        if (currVal >= maxVal) {
          $btnInc.addClass('disabled')
        } else {
          $btnInc.removeClass('disabled')
        }

      });
    };

    checkIncrementorStatus();
  });
}();


function initMap() {
  var mapElem = document.getElementById('map');
  if (mapElem == null)
    return;
  var centerPoint = { lat: 1.2757783, lng: 103.8457845 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: centerPoint
  });
}

function reloadpage_when_resize() {
  var current_width = $(window).width();
  $(window).resize(function() {
    var new_width = $(window).width();
    var width_dif = Math.abs(new_width - current_width);
    if (width_dif > 20) {
      location.reload();

    }
  })
  if (current_width < 768) {
    $('.room-list .block-info .collapse').removeClass('in');
  }
}