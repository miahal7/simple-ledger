import '/imports/startup/client';
import '/imports/startup/both';

month = function () {
  return Session.get('month') || moment().format('MM/YY');
}
