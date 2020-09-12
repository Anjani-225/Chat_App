const moment = require('moment');
//convert the message from plain string to an obeject with qualities such as date/time and all
function formatMessage(username, text){
	return{
		username,
		text,
		time: moment().format('h:m a')
	}
}

module.exports = formatMessage;