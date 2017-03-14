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
          month++;
          var monthStr = (month < 10) ? '0'+month: ''+month;
          var dayStr = (day < 10) ? '0'+day: ''+day;
          return `${year}-${monthStr}-${dayStr}`;
      },

      getEventDetails: function(year, month, dayInMonth) {
        var dateStr = this.getDateStr(year, month, dayInMonth);
        return this._eventMap.get(dateStr);
      },

      generate: function(year, month, nMonths) {
          var months = [];
          var monthOfWeeks = [];

          var week = this._newWeek();
          var monthDetails = this.getMonthDetails({year: year, month: month});

          var dayInMonth = 1 - monthDetails.dayInWeek;
          var i;

          // First week
          var monthShade = true;
          for(i = 0; i < 7; i++, dayInMonth++, monthDetails.dayInWeek++) {
              if (monthDetails.dayInWeek > 6) {
                monthDetails.dayInWeek = 0;
              }
              if (dayInMonth > 0) {
                  var eventDetails = this.getEventDetails(monthDetails.year, monthDetails.month, dayInMonth);
                  var dayId = `day-${dayInMonth}-${monthDetails.month+1}`;
                  if (eventDetails) {
                    eventDetails.dow = dayInMonth;
                  }
                  week[i] = {day: dayInMonth, dayId: dayId, shade: monthShade, eventDetails: eventDetails};
              }
              console.log(`--pre-- ${dayInMonth}`);
          }
          monthOfWeeks.push(week);

          var changedMonth;

          for(var monthCount = 0; monthCount < 3; monthCount++) {
              console.log(`month ${monthCount}`);
              changedMonth = false;
              var monthName = this.getMonthName(monthDetails.month);
              while (! changedMonth) {
                  week = this._newWeek();
                  for(i = 0; i < 7; i++, dayInMonth++, monthDetails.dayInWeek++) {
                      if (monthDetails.dayInWeek++ > 6) {
                        monthDetails.dayInWeek = 0;
                      }
                      /*console.log(`--main-- ${dayInMonth}`);*/
                      if (dayInMonth > monthDetails.daysInMonth) {
                          dayInMonth = 1;
                          monthDetails = this.getMonthDetails({year: monthDetails.year, month: monthDetails.month + 1});
                          changedMonth = true;
                          monthShade = ! monthShade;
                      }

                      var eventDetails = this.getEventDetails(monthDetails.year, monthDetails.month, dayInMonth);
                      if (eventDetails) {
                        eventDetails.dow = dayInMonth;
                      }
                      var dayId = `day-${dayInMonth}-${monthDetails.month+1}`;
                      week[i] = {day: dayInMonth, dayId: dayId, shade: monthShade, eventDetails: eventDetails};
                  }
                  monthOfWeeks.push(week);
              }
              months.push({ name: monthName,
                  weeks: monthOfWeeks,
                  numberOfWeeks: monthOfWeeks.length });
              monthOfWeeks = [];
          }

          return months;
      },

      calcCalendar: function() {
          var now = /*new Date(2017, 4, 1); */  Date.now();
          var day = new Date(now);
          day.setDate(1);

          return this.generate(day.getFullYear(), day.getMonth(), 1);
      },

      copyFlag: function(entry, event, field) {
        if (event[field]) {
          entry[field] = true;
        }
      },
      copyFlags: function(entry, event) {
          this.copyFlag(entry, event, 'isBranch');
          this.copyFlag(entry, event, 'isLocal');
          this.copyFlag(entry, event, 'isSpecial');
          this.copyFlag(entry, event, 'isWeekend');
          entry.hasEvent = true; // event.isBranch || event.isLocal || event.isSpecial || event.isWeekend;
      },

      getEventMapEntry: function(key) {
        var entry;
        if (! this._eventMap.has(key)) {
          entry = { details: [] };
          this._eventMap.set(key, entry);
        } else {
          entry = this._eventMap.get(key);
        }
        entry.key = key;
        return entry;
      },

      setWeekend: function(event) {
        var year = parseInt(event.startdate.substr(0, 4));
        var month = parseInt(event.startdate.substr(5, 2)) - 1;
        var day = parseInt(event.startdate.substr(8, 2)) + 1;
        for (var i = 1; i < event.days; i++) {
          var key = this.getDateStr(year, month, day);
          var entry = this.getEventMapEntry(key);
          entry.isWeekend = true;
          entry.hasEvent = true;
          entry.details.push({name: event.event});
          day++;
        }
      },

      getMergedEvents: function(events) {
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
          var key = event.startdate.substr(0, 10);
          var entry = this.getEventMapEntry(key);
          entry.details.push({name: event.event});
          console.log(entry);
          this.copyFlags(entry, event);
          if (event.isWeekend) {
            this.setWeekend(event);
          }
        });
        return this._mergedEvents;
      }
  };


  console.log('loaded. .. ' + events);

  Handlebars.registerHelper('calendar', function(options) {
    var i;
    var html = '';
    var allEvents = events.getMergedEvents(options.data.root.data_events);

    var calendar = events.calcCalendar();
    for(i = 0; i < calendar.length; i++) {
      html += options.fn(calendar[i]);
    }

	  return html;
  });

//
  Handlebars.registerHelper('eventsData', function(options) {
    console.log('aaa');
    /*for(var i=0; i < events._eventMap.length; i++) {
      console.log(events._eventMap[i]);
    }*/
    /*for(var ev of events._eventMap) {
      console.log(ev);
      console.log(ev.key);
      console.log(ev.value);
    }*/
    var eventList = [];
    console.log('-----');
    events._eventMap.forEach((value, key) => {
    //  var list = value.reduce((acc, val) => acc);
      console.log(value);
      var jsonValue = JSON.stringify(value.details);
      eventList.push(`'${key}': ${jsonValue}`);
    });
    var eventListList = eventList.join();
    var script = `<script>var events = { ${eventListList} }; </script>`;
    console.log(script);
    return script;
  });


    Handlebars.registerHelper('calendarEvents', function(options) {
      var i;
      var html = '';
      var allEvents = events.getMergedEvents(options.data.root.data_events);
      for(i = 0; i < allEvents.length; i++) {
        html += options.fn(allEvents[i]);
      }

      return html;
    });
};
