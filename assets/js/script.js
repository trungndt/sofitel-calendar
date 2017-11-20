$(function() {

  // COMMON
  $('.nice-select').niceSelect();

  // HEADER FORM
  var _DATEFORMAT = 'DD MMM';
  var _DATEFORMAT_2 = 'YYYY/MM/DD';
  var isCalendarOpen = false;

  var initDatePicker = function() {
    if (!$('#dateRange').length)
      return;
    $('#dateRange').dateRangePicker({
      // autoClose: false,
      format: _DATEFORMAT_2,
      separator: ' - ',
      container: '.date-container',
      extraClass: 'hotel-calendar',
      // alwaysOpen: true,
      startDate: moment(new Date()).format(_DATEFORMAT_2),
      minDays: 2,
      // singleMonth: true,
      showShortcuts: false,
      showTopbar: false,
      getValue: function() {
        return $(this).val();
      },
      setValue: function(res, _startDate, _endDate) {
        // this.innerHTML = res;
        var startObj = moment(_startDate);
        var endObj = moment(_endDate);
        this.innerHTML = '<div class="selected-dates"><span>' + startObj.format('DD') + '</span> ' 
        + startObj.format('MMM')
        + ' - '
        + '<span>' + endObj.format('DD') + '</span> '
        + endObj.format('MMM')
        + '</div>';
        // Count day
        var count = endObj.diff(startObj, 'days');
        var nightCount = count + ' night' + (count <= 1 ? '' : 's');
        $('.night-count').html(nightCount);
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

  // BOOTSTRAP COLLAPSE
  $(document).on('hide.bs.collapse', '.collapse', function (e) {
    var $lbl = $($(this).attr('aria-labelledby'));
    var collapseText = $lbl.attr('data-collapsetext');
    if (collapseText != undefined)
      $lbl.html(collapseText);
  });

  // BOOTSTRAP COLLAPSE
  $(document).on('show.bs.collapse', '.collapse', function () {
    var $lbl = $($(this).attr('aria-labelledby'));
    var expandText = $lbl.attr('data-expandtext');
    if (expandText != undefined)
      $lbl.html(expandText);
  });
  reloadpage_when_resize();
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

 function reloadpage_when_resize (){
    var current_width  = $(window).width();
    $(window).resize(function(){
      var new_width = $(window).width();
      var width_dif = Math.abs(new_width - current_width);
      if(width_dif > 20 ){
        location.reload();
        
      }
    })
    if(current_width < 768) {
      $('.room-list .block-info .collapse').removeClass('in');
    }
 }