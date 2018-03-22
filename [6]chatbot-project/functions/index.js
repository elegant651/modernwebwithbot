const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const DialogflowApp = require('actions-on-google').DialogflowApp;


exports.assistant = functions.https
.onRequest((request, response) => {

	const app = new DialogflowApp({request: request, response: response});  	
	app.handleRequest(handlerRequest);


	function handlerRequest(assistant) {	  	 
	  const location = assistant.getArgument('location');
	  const time = assistant.getArgument('time');
	  const info = assistant.getArgument('info');
	  const speakers = assistant.getArgument('speakers');

	  let message,	      
	      statements = [];

	  getGroupInfo({
	    onSuccess: function(data) {	      

	      if(location && location.length>0){
	      	statements.push("행사 주소는 "+data.info.location + " 입니다.");
	      }

	      if(time && time.length>0) {
	      	statements.push("행사 시작 시간은 "+data.info.time + " 입니다.");
	      }

	      if(info && info.length>0) {
	      	statements.push("이 행사는 "+data.info.info + " 입니다.");
	      }

	      if(speakers && speakers.length>0){
	      	statements.push("행사 스피커 리스트는 "+data.info.speakers + " 입니다.");
	      }

		  message = statements.join(" ");	      
	      
	      response.json({ 'speech': message, 'displayText': message });
	    }
	  });
	}
});


function getGroupInfo(options) {   
    admin.database().ref('/group-info')
    .once('value')
    .then(function(snapshot){
    	const info = snapshot.val();
    	options.onSuccess({info: info});
    });
}
