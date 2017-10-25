$(function() {

  // COMMON
  $('.nice-select').niceSelect();

  // HEADER FORM
  var _DATEFORMAT = 'DD MMM';
  var _DATEFORMAT_2 = 'YYYY/MM/DD';
  var isCalendarOpen = false;

  var initDatePicker = function() {
    $('#dateRange').dateRangePicker({
      // autoClose: false,
      format: _DATEFORMAT_2,
      separator: ' - ',
      container: '.date-container',
      extraClass: 'hotel-calendar',
      // alwaysOpen: true,
      startDate: moment(new Date()).format(_DATEFORMAT_2),
      minDays: 2,
      singleMonth: true,
      showShortcuts: false,
      showTopbar: false,
      getValue: function() {
        return $(this).val();
      },
      setValue: function(res, _startDate, _endDate) {
        // this.innerHTML = res;
        var startObj = moment(_startDate);
        var endObj = moment(_endDate);
        this.innerHTML = '<span>' + startObj.format(_DATEFORMAT) + ' - ' + endObj.format(_DATEFORMAT) + '</span>';
        // Count day
        var count = endObj.diff(startObj, 'days');
        var nightCount = count + ' night' + (count <= 1 ? '' : 's');
        $('.night-count').html(nightCount);
      },
      beforeShowDay: function(t) {
        var _this = moment(t).format(_DATEFORMAT_2);
        var soldoutDate = [
          '2017/10/10',
          '2017/10/27',
          '2017/10/28',
          
          '2017/10/21',
          '2017/10/22',
        ];
        var eventDate = [
          '2017/10/24',
          '2017/10/25',
          '2017/10/26',
        ];
        var valid = soldoutDate.indexOf(_this) < 0;

        var _class = '';
        if (eventDate.indexOf(_this) >= 0) {
          _class += ' event-date';
        }
        if (soldoutDate.indexOf(_this) >= 0) {
          _class += ' soldout-date';
        }
        // var _tooltip = valid ? '' : 'disabled';
        return [valid, _class];
      }
    })
    .bind('datepicker-open',function(){
  		var $footer = $('.hotel-calendar .footer');
  		$footer.html($('#tmpLegend').html().trim());
  		// console.log('before open');
  	})
    .bind('datepicker-opened',function(){
      var $footer = $('.hotel-calendar .footer');
      isCalendarOpen = true;
    })
    .bind('datepicker-closed',function(){
      isCalendarOpen = false;
    });

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
    var count = parseInt($('[data-select="adults"]').val()) + parseInt($('[data-select="children"]').val());
    if (count < 10) count = '0' + count;
    $('.guest-display').html(count);
  }

  // CONTENT EXPAND COLLAPSE
  $(document).on('click', '[data-action="expand"]', function(e) {
    e.preventDefault();
    var $me = $(this);
    var $parent = $me.closest('.block-info');
    $parent.find('.expandable').toggleClass('expanding');
    $parent.toggleClass('expanding');
    $.each($parent.find('[data-action="expand"]'), function(i,e) {
      if ($parent.hasClass('expanding')) {
        $(e).html($(e).attr('data-expand'));
      } else {
        $(e).html($(e).attr('data-collapse'));
      }
    });
    
  });

});

function initMap() {
  var mapElem = document.getElementById('map');
  if (mapElem == null)
    return;
  var centerPoint = {lat: 1.2757783, lng: 103.8457845};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: centerPoint
  });
}