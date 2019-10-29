import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

function App() {
  // If the initially set date and the selected date are in different timezones, e.g. summer time versus standard time, the time returned in onChanged will NOT be midnight (It will be 1 hour later or earlier), and it might be the wrong date.
  //
  // Set the default date to a date in "summer time", then change it in the picker to a date in "standard time" to see the issue
  // e.g. in Australia, in 2019, April 7 was Australian Eastern Standard Time (+10), but April 6 was Australian Eastern Daylight Time (+11)
  const defaultDate = new Date("2019-04-07"); // try "2019-04-06" to see the problem the other way
  //
  // Initialising the DatePicker as above, the value starts out correctly as "2019-04-07T00:00:00.000Z" but selecting 6 April will give you "2019-04-05T23:00:00.000Z" which has the wrong hour (should be midnight) and is the WRONG DAY altogether
  //
  // A quick look at the Moment (or DateFns date) reported I think explains it (_i: Sun Apr 07 2019 10:00:00 GMT+1000, _d: Sat Apr 06 2019 10:00:00 GMT+1100). It looks like the setting of the hour is only done initially (midnight UTC becomes 10:00 in +10), then the selected date has its date and timezone changed but the time stays the same (it becomes 10:00 in +11, which is 23:00 UTC the day before)
  // I guess that only the date part is changed by the picker, but what needs to happen is the datetime needs to be reset to midnight UTC again on the new date (to account for the new timezone) so it can be 11:00 in +11 in local time

  const [selectedDateMoment, handleDateChangeMoment] = useState(defaultDate);
  const [selectedDateDateFns, handleDateChangeDateFns] = useState(defaultDate);

  return (
    <div>
      <div>
        {
          "This example works in Australia, if you are not in Australia you'll have to modify the dates you try to span a timezone change."
        }
      </div>
      <br />
      <div>{`Initial Date: ${defaultDate}`}</div>
      <div>{`Current Date: ${selectedDateMoment}`}</div>
      <br />
      <div>{"Set the date to April 6th to see the issue."}</div>
      <br />
      <br />
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div>{"Moment"}</div>
          <DatePicker
            value={selectedDateMoment}
            onChange={(...rest) => {
              console.log(...rest);
              return handleDateChangeMoment(...rest);
            }}
          />
        </MuiPickersUtilsProvider>
        <div>{JSON.stringify(selectedDateMoment)}</div>
      </div>
      <br />
      <br />
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>{"DateFns"}</div>
          <DatePicker
            value={selectedDateDateFns}
            onChange={(...rest) => {
              console.log(...rest);
              return handleDateChangeDateFns(...rest);
            }}
          />
        </MuiPickersUtilsProvider>
        <div>{JSON.stringify(selectedDateDateFns)}</div>
      </div>
    </div>
  );
}

export default App;
