/**
 * Function responsible for calculating available hours for provider
 */

const { format, isEqual, isAfter, isBefore } = require('date-fns');
const hour = require('./hours');

const hours = [];

module.exports = (
  appointment,
  hour_start,
  hour_break,
  hour_restart,
  hour_end
) => {
  hour.forEach(item => {
    if (
      isEqual(
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${item}`
        ),
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${hour_start}`
        )
      ) &&
      !appointment.find(hh => format(hh.date, 'HH:mm:ss') === item)
    ) {
      hours.push(item);
    } else if (
      isAfter(
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${item}`
        ),
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${hour_start}`
        )
      ) &&
      isBefore(
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${item}`
        ),
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${hour_break}`
        )
      ) &&
      !appointment.find(hh => format(hh.date, 'HH:mm:ss') === item)
    ) {
      hours.push(item);
    } else if (
      isAfter(
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${item}`
        ),
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${hour_restart}`
        )
      ) &&
      isBefore(
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${item}`
        ),
        new Date(
          `${new Date().getFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()} ${hour_end}`
        )
      ) &&
      !appointment.find(hh => format(hh.date, 'HH:mm:ss') === item)
    ) {
      hours.push(item);
    }
  });

  return hours;
};
