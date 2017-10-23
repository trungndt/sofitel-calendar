$(function() {
  var _DATEFORMAT = 'DD MMM';
  var _DATEFORMAT_2 = 'YYYY/MM/DD';
  var isCalendarOpen = false;
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
      this.innerHTML = startObj.format(_DATEFORMAT) + ' - ' + endObj.format(_DATEFORMAT);
      // Count day
      var count = endObj.diff(startObj, 'days');
      var nightCount = count + ' night' + (count <= 1 ? '' : 's');
      $('.night-count').html(nightCount);
    },
    beforeShowDay: function(t) {
      var _this = moment(t).format(_DATEFORMAT_2);
      var soldoutDate = [
        '2017/10/10',
        '2017/10/11',
        '2017/10/12',
        
        '2017/10/21',
        '2017/10/22',
      ];
      var eventDate = [
        '2017/10/19',
        '2017/10/20',
        '2017/10/21'
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

  $('.nice-select').niceSelect();
});