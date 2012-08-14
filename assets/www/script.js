function DOMLoaded(){
	//document.addEventListener("deviceready", phonegapLoaded, false);
}

function phonegapLoaded(){
	//onDeviceReady();
}

var selectedemployee;
var selectedphone;

function validateCredential() {
	vibrate();
	var employeeCode = document.getElementById("employeecode").value;
	var password = document.getElementById("password").value;
	console.log(
            "Retrieving records for " + employeeCode + "...",  // message
            'Search Result',      // title
            'OK'                  // buttonName
    );
	
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET", "http://192.168.1.148:8881/wam/wamservices/wamuserlogin/" + employeeCode + "/" + password, false);
	//xmlhttp.open("GET", "http://117.239.145.214:8881/wam/wamservices/wamuserlogin/" + employeeCode + "/" + password, false);
	
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	if(xmlDoc == null){
		document.getElementById("loginButton").href="#";
		navigator.notification.alert(
				"Invalid credential",
				"",
				"Login",
				"OK"				
		);
		return false;
	}else{
		var x = xmlDoc.getElementsByTagName("employeecode");		
		console.log("X: " + x);
		x = xmlDoc.getElementsByTagName("firstname");
		var employeeName = x[0].childNodes[0].nodeValue;
		x = xmlDoc.getElementsByTagName("lastname");
		employeeName = employeeName + x[0].childNodes[0].nodeValue;
		x = xmlDoc.getElementsByTagName("designation");
		x = xmlDoc.getElementsByTagName("email");
		document.getElementById("loginButton").href="#search";
	}	
}

var employees;
function searchEmployee() {
	vibrate();
	
	var employeeName = document.getElementById("employeenamesearchtext").value;
	
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET", "http://192.168.1.148:8881/wam/wamservices/employees/" + employeeName, false);
	
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	var innerEmployeesHTML = ""; // for generating employee list...
	
	document.getElementById("employeeList").innerHTML = "";
	
	if(xmlDoc == null){
		document.getElementById("searchButton").href="#";
		navigator.notification.alert(
				"We don't have records for your search. Please try again.",
				"",
				"Search result",
				"OK"				
		);
		return false;
	}else{
		document.getElementById("searchForLabel").innerHTML = "Search result for '" + employeeName + "'.";
		document.getElementById("searchButton").href="#searchresult";
		employees = xmlDoc.getElementsByTagName("employee");
		
		for (var i = 0; i < employees.length; i++){ 
			$('#employeeList').append("<li onclick='displayDetailDialog(" + i + ");'><a><img class='thumb' src='http://192.168.1.148:8881/wam/EmployeeImages/" + employees[i].getElementsByTagName("employeecode")[0].childNodes[0].nodeValue + ".jpg' style='border-radius: 3px; box-shadow: 0px 0px 10px #000; height: 125px; margin-left: 10px; margin-top: 22px;'>"
			+ "<h3>"+ employees[i].getElementsByTagName("firstname")[0].childNodes[0].nodeValue + " " + employees[i].getElementsByTagName("lastname")[0].childNodes[0].nodeValue + "</h3>"
			+ "<p style='font-size: .8em'>" + employees[i].getElementsByTagName("designation")[0].childNodes[0].nodeValue + "</p>"
			+ "<p style='font-size: .8em'>" + employees[i].getElementsByTagName("module")[0].childNodes[0].nodeValue + "</p>"
			+ "<p style='font-size: .8em'>" + employees[i].getElementsByTagName("email")[0].childNodes[0].nodeValue + "</p>"
			+ "<p style='font-size: .8em'>" + employees[i].getElementsByTagName("mobile")[0].childNodes[0].nodeValue + "</p>"
			+ "</img></a></li>");
		}
	}

	$('ul').listview('refresh');
}

function displayDetailDialog(i){
	var innerEmployeeHTML = "";
	innerEmployeeHTML = "<h3 class='ui-title'>" + employees[i].getElementsByTagName("firstname")[0].childNodes[0].nodeValue + " " + employees[i].getElementsByTagName("lastname")[0].childNodes[0].nodeValue + "</h3>" + 
							"<p>" + employees[i].getElementsByTagName("designation")[0].childNodes[0].nodeValue + "</p>" + 
							"<p>" + employees[i].getElementsByTagName("module")[0].childNodes[0].nodeValue + "</p>" + 
							"<p>" + employees[i].getElementsByTagName("email")[0].childNodes[0].nodeValue + "</p>" + 
							"<p>" + employees[i].getElementsByTagName("mobile")[0].childNodes[0].nodeValue + "</p>";
	document.getElementById("employeeinfo").innerHTML = innerEmployeeHTML;
	
	$("#searchresult").show();
							
}

function confirmation(){
	navigator.notification.confirm(
			"Do you want to save the contact on your mobile?",
			onConfirm,
			"Contacts",
			"Yes, No"			
	);
}

function onConfirm(button){
	if(button == 1){
		var contact = navigator.contacts.create();
		contact.displayName = document.getElementById("employeeName").innerHTML;
		contact.nickname = document.getElementById("employeeName").innerHTML;       //specify both to support all devices

		// populate some fields
		var name = new ContactName();
		name.givenName = document.getElementById("employeeName").innerHTML;
		name.familyName = document.getElementById("employeeName").innerHTML;
		contact.name = name;
		
        // store contact phone numbers in ContactField[]
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', selectedphone, true); // preferred number
        
        contact.phoneNumbers = phoneNumbers;

        //var images = [];
        //images[0] = new ContactField('url', "http://192.168.1.148:8881/wam/EmployeeImages/" + selectedemployee + ".jpg", true); // preferred number
        //images[0] = new ContactField('url', "http://117.239.145.214:8881/wam/EmployeeImages/" + selectedemployee + ".jpg", true); // preferred number
        //contact.photos = images;
        
		// save to device
		contact.save(onSuccess, onError);	
	}	
}


function onSuccess(){
	navigator.notification.alert(
			"Contact saved.",
			onConfirm,
			"Contacts",
			"OK"			
	);	
}

function onError(){
	navigator.notification.alert(
			"Failed to save contact.",
			onConfirm,
			"Contacts",
			"OK"			
	);
}


function beep(){
	navigator.notification.beep(1);
}

function vibrate(){
	navigator.notification.vibrate(100);
}

