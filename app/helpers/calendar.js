module.exports.register = function(Handlebars) {
  'use strict';



  var events = {

      _newWeek: function() {
          return [{}, {}, {}, {}, {}, {}, {}];
      },

      getMonthDetails: function(details) {
          var day = new Date(details.year, details.month, 1);
          var endDay = new Date(details.year, details.month + 1, 0);
          var daysInMonth = endDay.getDate();
          var dayInWeek = day.getDay();  // But 0 = Sun, want 0 = Monday
          dayInWeek = (dayInWeek === 0) ? 6: dayInWeek - 1;
          return {
              year: day.getFullYear(),
              month: day.getMonth(),
              daysInMonth: daysInMonth,
              dayInWeek: dayInWeek
          };
      },

      getMonthName: function(month) { // 0 based
          return [
              ['J', 'a', 'n'],
              ['F', 'e', 'b'],
              ['M', 'a', 'r'],
              ['A', 'p', 'r'],
              ['M', 'a', 'y'],
              ['J', 'u', 'n'],
              ['J', 'u', 'l'],
              ['A', 'u', 'g'],
              ['S', 'e', 'p'],
              ['O', 'c', 't'],
              ['N', 'o', 'v'],
              ['D', 'e', 'c']
          ][month];
      },

      getDateStr: function(year, month, day) {
          var monthStr = (month < 10) ? '0'+month: ''+month;
          var dayStr = (day < 10) ? '0'+day: ''+day;
          return `${year}-${monthStr}-${dayStr}`;
      },

      generate: function(year, month, nMonths) {
          console.log(year, month, nMonths);

          var months = [];
          var monthOfWeeks = [];

          var week = this._newWeek();
          var monthDetails = this.getMonthDetails({year: year, month: month});

          var dayInMonth = 1 - monthDetails.dayInWeek;
          var i;

          for(i = 0; i < 7; i++, dayInMonth++) {
              if (dayInMonth > 0) {
                  week[i].day = dayInMonth;
              }
          }
          monthOfWeeks.push(week);

          var changedMonth;
          var monthShade = true;
          for(var monthCount = 0; monthCount < 3; monthCount++) {
              changedMonth = false;
              var monthName = this.getMonthName(monthDetails.month);
              while (! changedMonth) {
                  week = this._newWeek();
                  for(i = 0; i < 7; i++, dayInMonth++) {
                      if (dayInMonth > monthDetails.daysInMonth) {
                          dayInMonth = 1;
                          monthDetails = this.getMonthDetails({year: monthDetails.year, month: monthDetails.month + 1});
                          changedMonth = true;
                          monthShade = ! monthShade;
                      }

                      var dateStr = this.getDateStr(monthDetails.year, monthDetails.month, dayInMonth);
                      console.log(dateStr);
                      console.log(this._eventMap.get(dateStr));

                      var eventDetails = this._eventMap.get(dateStr);

                      week[i] = {day: dayInMonth, shade: monthShade, eventDetails: eventDetails};
                  }
                  if (dayInMonth > monthDetails.daysInMonth) {
                      changedMonth = true;
                  }

                  monthOfWeeks.push(week);
              }
              months.push({ name: monthName,
              weeks: monthOfWeeks,
              numberOfWeeks: monthOfWeeks.length });
              monthOfWeeks = [];
          }

        /*  var i, j;
          for (j = 0; j < months.length; j++) {
              var month = months[j];
              console.log(month.name);
              for(i = 0; i < month.weeks.length; i++) {
                  var week = month.weeks[i].map(function(day) { return day.day; });
                  console.log(week.join(', '));
              }

          }*/

          return months;
      },

      calcCalendar: function() {

          var now = Date.now();
          var day = new Date(now);
          day.setDate(1);

      //    console.log(day);
          return this.generate(day.getFullYear(), day.getMonth(), 1);

  /*        var template = Handlebars.compile($('#calendar-month-template').html());
          var html = template({months: months});
          $('#calendar-table').html(html);*/
      },

      getMergedEvents: function(events) {
        console.log('getMergedEvents ' + this._mergedEvents);
        if (this._mergedEvents) {
          return this._mergedEvents;
        }

        events.events.forEach(function(event) {
          event.isBranch = true;
        });

        events.leeds_events.forEach(function(event) {
          event.isLocal= true;
        });
        events.special_events.forEach(function(event) {
          event.isSpecial = true;
        });

        events.weekend_events.forEach(function(event) {
          event.isWeekend = true;
        });

        this._mergedEvents = events.events.concat(events.leeds_events, events.special_events, events.weekend_events)
              .sort(function(event1, event2) {
                return event1.startdate.localeCompare(event2.startdate);
              });

        this._eventMap = new Map();
        this._mergedEvents.forEach(event => {
          var entry;
          var key = event.startdate.substr(0, 10);
          if (! this._eventMap.has(key)) {
            entry = {};
            this._eventMap.set(key, entry);
          } else {
            entry = this._eventMap.get(key);
          }
          if (event.isBranch) {
            entry.isBranch = true;
          }
          if (event.isLocal) {
            entry.isLocal = true;
          }
        });
      //  console.log(this._eventMap);

        return this._mergedEvents;
      }

  };


  console.log('loaded. .. ' + events);
//  calendar.init();

  /* Merge calendars */



  Handlebars.registerHelper('calendar', function(options) {
    //console.log(options);
    console.log('----*------------ ');
  /*  console.log(options.data_events);
  for(var t in options) {
    console.log(t);
  }
    console.log('++++++ ++++');
    for(var t in options.data) {
      console.log(t);
    }
    console.log('+++ +++ ++++');
    for(var t in options.data.root) {
      console.log(t);
    }
    console.log('+++ ++ + ++++');
    for(var t in options.data.root.data_events) {
      console.log(t);
    }*/
//    console.log(this.data.data_events.events.length);
    //console.log();  leeds_events
    var i;
    var html = '';
    //console.log(this);
    var allEvents = events.getMergedEvents(options.data.root.data_events);
//    console.log(allEvents);
    console.log(allEvents.length);

    var calendar = events.calcCalendar();
//    console.log(calendar);
    for(i = 0; i < calendar.length; i++) {
    //  console.log(i);
      html += options.fn(calendar[i]);
    }

	  return html;
  });


    Handlebars.registerHelper('calendarEvents', function(options) {
      var i;
      var html = '';
      var allEvents = events.getMergedEvents(options.data.root.data_events);
      for(i = 0; i < allEvents.length; i++) {
      //  console.log(i);
        html += options.fn(allEvents[i]);
      }

      return html;
    });
};
