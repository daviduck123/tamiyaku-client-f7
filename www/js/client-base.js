//var urlnya="http://localhost/tamiyaku-server";
var urlnya="http://server.neoalitcahya.com";
//var urlnya = "http://192.168.1.7:80/tamiyaku-server"
var globalListKelas = [];
var globalCookie = [];
var globalLapak = [];
var globalEvent = [];
var pictureSource;
var	destinationType;

function logout() {
	myApp.closePanel();
	mainView.router.loadPage('login.html');
	eraseData("active_user_id");
	eraseData("active_user_nama");
	eraseData("active_user_email");
	eraseData("active_user_kota");
	eraseData("active_user_jenis_kelamin");
	eraseData("expires");
}

function saveData(dataName, dataValue) {

    localStorage.setItem(dataName, dataValue);
}

function getData(dataName) {
	return localStorage.getItem(dataName);
}

function eraseData(dataName){
	localStorage.removeItem(dataName);
}
	
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function storeImage(profilePicData, imageName) {

    localStorage.setItem(imageName,profilePicData);
}

function getImage(imageName) {

  if ( localStorage.getItem(imageName)) 
  {
    return localStorage.getItem(imageName);
  }
  else 
  {
	return "kosong.png";
  }
}

function gotoGooleMapDevice(latData,lngData)
{
	var url="geo:"+latData+","+lngData;
	window.open(url, '_system');
}

function onDeviceReady() {

    document.addEventListener("backbutton", onBackKeyDown, false);
	console.log(navigator.camera);
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}
function capturePhoto() {
	alert("Capture Photo");
	navigator.camera.getPicture(onPhotoDataSuccess, onPhotoDataFail, { quality: 50,
	destinationType: destinationType.DATA_URL });
	alert("Capture Done");
}

function onPhotoDataSuccess(imageData) {
	alert("Capture Success");
    var image = document.getElementById('photoImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoDataFail(message) {
    alert('Failed because: ' + message);
}

function onBackKeyDown() {

	if (typeof myApp.closeModal() != 'undefined')
		return;
	
	var activepage = mainView.activePage.name;
	if(activepage=="home" || activepage == "index" || activepage == "login")
	{
		myApp.modal({
	    title:  'Pilihan',
	    text: 'Apakah anda keluar dari aplikasi?',
	    buttons: [
	      {
	        text: 'Tidak',
	        onClick: function() {
	          //myApp.alert('You clicked first button!')
	        }
	      },
	      {
	        text: 'Ya',
			bold: true,
	        onClick: function() {
				navigator.app.exitApp();
	        }
	      },
	    ]
	  })
	}
	else
	{
		myApp.closeModal();
		viewRouterBack();
		var activepage = mainView.activePage.name;
		if(activepage=="home")
		{
			mainView.router.refreshPage('home.html');
		}
	}
	
}

function setDeviceOnGPS(){
	cordova.plugins.locationAccuracy.canRequest(function(canRequest){
	    if(canRequest){
	        cordova.plugins.locationAccuracy.request(function(){
	            console.log("Request successful");
	        }, function (error){
	            console.error("Request failed");
	            if(error){
	                // Android only
	                console.error("error code="+error.code+"; error message="+error.message);
	                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
	                    if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
	                        cordova.plugins.diagnostic.switchToLocationSettings();
	                    }
	                }
	            }
	        }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
	        );
	    }
	});
}