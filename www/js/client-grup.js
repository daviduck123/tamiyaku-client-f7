//-----------------------------------------------------------------------------------------------------------------------------------------------------GRUP
var list_id_kelas=getData("list_id_kelas");
var currentLat = 0;
var currentLng = 0;
var allGrupUser = null;
function getNearbyGrup(){
	$(document).ready(function(){
		myApp.showPreloader('Mengambil data...');
		setDeviceOnGPS();
		if ( navigator.geolocation )
		{
			navigator.geolocation.getCurrentPosition(showPosition, onError, {enableHighAccuracy: true});
		}
		else
		{
			//tidak bisa ambil lat lng
			myApp.alert('Posisi anda tidak dapat diakses', 'Perhatian!');
		}

		function onError(error) {
	        alert('code: '    + error.code    + '\n' +
	                'message: ' + error.message + '\n');
	    }
		
		function showPosition(position) {
			//Get current data and User current Location
			var id_user = getData("active_user_id");
			var latKuSekarang = position.coords.latitude;
			var lngKuSekarang = position.coords.longitude;
			var kelas_dipilih = $('#kelas_dipilih').find(":selected").val();
		
			var link=urlnya+'/api/grup/getGrupNearBy?id_user='+id_user+'&lat='+latKuSekarang+'&lng='+lngKuSekarang+'&id_kelas='+kelas_dipilih;
			$.ajax({ dataType: "jsonp",
			    url: link,
			    type: 'GET',
			    contentType: false,
			    processData: false
			}).done(function(z){
				var dataLength=0;
				if(z.length == 0){
					myApp.alert("Tidak ada Grup di sekitar", 'Perhatian!');
					myApp.closeModal();
					return;
				}
				for (var ii = 0 ; ii < z.length ; ii++) {
					dataLength++;
				}
				
				$("#isi_list_grup_disekitar").remove();
				$("#list_grup_disekitar").append('<div id="isi_list_grup_disekitar"></div>');
				
				for(var i=0;i<dataLength;i++)
				{
					if(z[i]['id_kelas'] !== kelas_dipilih) continue;
					
					var jarak=parseFloat(z[i]['distance']);
					jarak = jarak.toFixed(1);
					var html =			'<li>';
					html += 				'<a href="#" onclick="gotoGroup('+z[i]['id']+');" id="grup_'+z[i]['id']+'" class="item-link">';
					html += 					'<div class="item-content">';
					html += 						'<div class="item-media"><img class="lazy" src="data:image/jpeg;base64,'+z[i]['foto']+'" style="width:35px; height:35px;"></div>';
					html += 						'<div class="item-inner">';
					html += 							'<div class="item-title">'+z[i]['nama']+'</div>';
					html += 							'<div class="item-after"><span class="badge">'+jarak+'km</span></div>';
					html += 						'</div>';
					html += 					'</div>';
					html += 				'</a>';
					html += 			'</li>';
					
					$("#isi_list_grup_disekitar").append(html);
				}
				myApp.closeModal();
			}).fail(function(x){
				myApp.alert("Pengambilan data grup disekitar gagal", 'Perhatian!');
				myApp.closeModal();
			});
		}
	});
}

function gotoNearbyGrup(){
	mainView.router.loadPage('nearbyGrup.html');
	myApp.closePanel();
}

function gotoCreateGroup(){
	currentLat = 0;
	currentLng = 0;
	$("#isi_latlng_buatGrup").html("Lokasi belum ditentukan..");
	mainView.router.loadPage('buatGrup.html');
	myApp.closePanel();
}

function gotoGroup(clickedId){
	eraseData("id_grup");
	saveData("id_grup",clickedId);
	mainView.router.loadPage('grup.html');
	mainView.router.refreshPage('grup.html');
	var id_user = getData("active_user_id");
	var id_grup = getData("id_grup");
	
	var link=urlnya+'/api/grup/checkJoinedGrup?id_user='+id_user+'&id_grup='+id_grup;
	console.log(link);
	$.ajax({ dataType: "jsonp",
	    url: link,
	    type: 'GET',
	    contentType: false,
	    processData: false
	}).done(function(z){
		var dataLength=0;
		for (var ii = 0 ; ii < z.length ; ii++) {
			dataLength++;
		}

		var notif_id=getData("notif_id");
		
		if(dataLength>0)
		{
			if(notif_id!=null)
			{
				getAllGrupPost(id_grup);
				eraseData("notif_id");
				eraseData("notif_komentar");
			}
			else
			{
				getAllGrupPost(id_grup);
				getInfoGrup(id_grup);
				showButtonLeaveGrup(id_grup);
			}
		}
		else
		{
			getInfoGrup(id_grup);
			showButtonJoinGrup(id_grup);
		}
	}).fail(function(x){
		myApp.alert("Pengambilan data grup disekitar gagal", 'Perhatian!');
	});
	
	//===========================
	myApp.closePanel();
}

function gotoPetaGrup(latData, lngData){
	//myApp.popup('.popup-grup');
	var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
                      '<p>Letak lokasi grup.</p>'+
					  '<div id="petaLokasiGrup" style="width:330px; height:500px;"></div>'+
					  	"<div><p><a href='#' class='button' onclick='gotoGooleMapDevice("+latData+","+lngData+");' style='margin-right:5%; margin-top:-10px; float:right;'>Buka di Google Map</a></p></div>"+
						"<p><a href='#' class='close-popup' style='margin-top:-5px; float:left; margin-right:10px;'>Kembali</a></p>"+
                    '</div>'+
                  '</div>'
	myApp.popup(popupHTML);
	
	var map = new GMaps({
		div: '#petaLokasiGrup',
		lat: latData,
		lng: lngData,
	});
	setDeviceOnGPS();
	if ( navigator.geolocation )
    {
		navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
	{
		//tidak bisa ambil lat lng
		map.addMarker({
			lat: latData,
			lng: lngData,
			draggable: false,
			infoWindow: {
			  content: '<p>Tidak bisa menghitung jarak dikarenakan posisi anda sekarang tidak dapat diambil</p>'
			}
		});
		google.maps.event.trigger(map, 'resize');
	}
	
	function showPosition(position) {
		console.log("lat:"+position.coords.latitude+"\nlng:"+position.coords.longitude);
        var latKuSekarang = position.coords.latitude;
		var lngKuSekarang = position.coords.longitude;
		
		var dist = Haversine( latData, lngData, latKuSekarang, lngKuSekarang );
		map.addMarker({
			lat: latData,
			lng: lngData,
			draggable: false,
			infoWindow: {
			  content: '<p>Posisi anda sekarang ke lokasi grup '+ dist.toFixed(2)+' km'
			}
		});
		google.maps.event.trigger(map, 'resize');
	}

    // Convert Degress to Radians
    function Deg2Rad( deg ) {
       return deg * Math.PI / 180;
    }

    // Get Distance between two lat/lng points using the Haversine function
    // First published by Roger Sinnott in Sky & Telescope magazine in 1984 (“Virtues of the Haversine”)
    //
    function Haversine( lat1, lon1, lat2, lon2 )
    {
        var R = 6372.8; // Earth Radius in Kilometers

        var dLat = Deg2Rad(lat2-lat1);  
        var dLon = Deg2Rad(lon2-lon1);  

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                        Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2);  
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; 

        // Return Distance in Kilometers
        return d;
    }
}

function recenterGrupMap()
{
	var map;
	function showPosition(position) {
		//console.log("lat:"+position.coords.latitude+"\nlng:"+position.coords.longitude);
		var id_kota = $("#kota_buatGrup").val();
		if(globalKota.length > 0){
			for(var xx = 0 ; xx < globalKota.length; xx++){
				if(globalKota[xx].id === id_kota){
					currentLat = position.coords.latitude;
					currentLng = position.coords.longitude;
					//currentLat = globalKota[xx].lat;
					//currentLng = globalKota[xx].lng;
					break;
				}
			}
		}
		map = new GMaps({
			div: '#petaku',
			lat: currentLat,
			lng: currentLng,
			click: function(e) {
			  },
		});
			
		var lat = currentLat;
		var lng = currentLng;
		
		if(lat != null && lng != null)
		{
			var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
			html	+=	"</div>"
			$("#isi_latlng_buatGrup").remove();
			$("#lat_buatGrup").val(lat);
			$("#lng_buatGrup").val(lng);
			$("#latlng_buatGrup").append(html);
		}
		
		map.addMarker({

			lat: currentLat,
			lng: currentLng,
			draggable: true,
			dragend: function(event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				//myApp.alert('Latitude = '+lat+"\nLongitude = "+lng, 'Lokasi');
				currentLat = lat;
				currentLng = lng;
				if(lat != null && lng != null)
				{
					var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
					html	+=	"</div>"
					$("#isi_latlng_buatGrup").remove();
					$("#lat_buatGrup").val(lat);
					$("#lng_buatGrup").val(lng);
					$("#latlng_buatGrup").append(html);
				}
			}
		});
		google.maps.event.trigger(map, 'resize');
	}
    
	$(document).ready(function(){
		setDeviceOnGPS();
		if (navigator.geolocation) 
		{
			navigator.geolocation.getCurrentPosition(showPosition);
		} 
		else 
		{ 
			var lat = -7.2582548000000005;
			var lng = 112.76117359999999;
			
			if(lat != null && lng != null)
			{
				var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
				html	+=	"</div>"
				$("#isi_latlng_buatGrup").remove();
				$("#lat_buatGrup").val(lat);
				$("#lng_buatGrup").val(lng);
				$("#latlng_buatGrup").append(html);
			}
			
			map = new GMaps({
				div: '#petaku',
				lat: ﻿﻿-7.2582548000000005,
				lng: 112.76117359999999,
				click: function(e) {
					alert('Silahkan geser marker ke lokasi yang anda inginkan!');
				  },
			});	
			
			map.addMarker({

				lat:  ﻿-7.2582548000000005,
				lng: 112.76117359999999,
				draggable: true,
				dragend: function(event) {
					var lat = event.latLng.lat();
					var lng = event.latLng.lng();
					//myApp.alert('Latitude = '+lat+"\nLongitude = "+lng, 'Lokasi');
					
					if(lat != null && lng != null)
					{
						var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
						html	+=	"</div>"
						$("#isi_latlng_buatGrup").remove();
						$("#lat_buatGrup").val(lat);
						$("#lng_buatGrup").val(lng);
						$("#latlng_buatGrup").append(html);
					}
				}
			});
			google.maps.event.trigger(map, 'resize');
		}
	});	
}

function gotoGoogleMap(){
	//myApp.popup('.popup-about');
	var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
                      '<p>Silahkan pilih peta letak lokasi grup.</p>'+
					  '<div id="petaku" style="width:330px; height:500px;"></div>'+
                      "<p><a href='#' class='close-popup button' style='margin-top:-5px; margin-left:10px; width:75%; float:left;'>Simpan</a></p>"+
					  "<p><a href='#'  class='button' onclick='recenterGrupMap();' style='margin-top:-5px; float:right; margin-right:10px;'><i class='icon fa fa-compass fa-4'></i></a></p>"+
                    '</div>'+
                  '</div>'
	myApp.popup(popupHTML);
	
	var map;
	function showPosition(position) {
		//console.log("lat:"+position.coords.latitude+"\nlng:"+position.coords.longitude);
		var id_kota = $("#kota_buatGrup").val();
		if(globalKota.length > 0){
			for(var xx = 0 ; xx < globalKota.length; xx++){
				if(globalKota[xx].id === id_kota){
					//currentLat = position.coords.latitude;
					//currentLng = position.coords.longitude;
					currentLat = globalKota[xx].lat;
					currentLng = globalKota[xx].lng;
					break;
				}
			}
		}
		map = new GMaps({
			div: '#petaku',
			lat: currentLat,
			lng: currentLng,
			click: function(e) {
			  },
		});
			
		var lat = currentLat;
		var lng = currentLng;
		
		if(lat != null && lng != null)
		{
			var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
			html	+=	"</div>"
			$("#isi_latlng_buatGrup").remove();
			$("#lat_buatGrup").val(lat);
			$("#lng_buatGrup").val(lng);
			$("#latlng_buatGrup").append(html);
		}
		
		map.addMarker({

			lat: currentLat,
			lng: currentLng,
			draggable: true,
			dragend: function(event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				//myApp.alert('Latitude = '+lat+"\nLongitude = "+lng, 'Lokasi');
				currentLat = lat;
				currentLng = lng;
				if(lat != null && lng != null)
				{
					var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
					html	+=	"</div>"
					$("#isi_latlng_buatGrup").remove();
					$("#lat_buatGrup").val(lat);
					$("#lng_buatGrup").val(lng);
					$("#latlng_buatGrup").append(html);
				}
			}
		});
		google.maps.event.trigger(map, 'resize');
	}
    
	$(document).ready(function(){
		setDeviceOnGPS();
		if (navigator.geolocation) 
		{
			navigator.geolocation.getCurrentPosition(showPosition);
		} 
		else 
		{ 
			var lat = -7.2582548000000005;
			var lng = 112.76117359999999;
			
			if(lat != null && lng != null)
			{
				var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
				html	+=	"</div>"
				$("#isi_latlng_buatGrup").remove();
				$("#lat_buatGrup").val(lat);
				$("#lng_buatGrup").val(lng);
				$("#latlng_buatGrup").append(html);
			}
			
			map = new GMaps({
				div: '#petaku',
				lat: ﻿﻿-7.2582548000000005,
				lng: 112.76117359999999,
				click: function(e) {
					alert('Silahkan geser marker ke lokasi yang anda inginkan!');
				  },
			});	
			
			map.addMarker({

				lat:  ﻿-7.2582548000000005,
				lng: 112.76117359999999,
				draggable: true,
				dragend: function(event) {
					var lat = event.latLng.lat();
					var lng = event.latLng.lng();
					//myApp.alert('Latitude = '+lat+"\nLongitude = "+lng, 'Lokasi');
					
					if(lat != null && lng != null)
					{
						var html =	"<div id='isi_latlng_buatGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
						html	+=	"</div>"
						$("#isi_latlng_buatGrup").remove();
						$("#lat_buatGrup").val(lat);
						$("#lng_buatGrup").val(lng);
						$("#latlng_buatGrup").append(html);
					}
				}
			});
			google.maps.event.trigger(map, 'resize');
		}
	});	
}

function getKotaBuatGrup() {
	if(globalKota.length == 0){
		myApp.showPreloader('Mengambil data...');
		var link=urlnya+'/api/kota/';
		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(dataKota){
			globalKota = dataKota;
			myApp.closeModal();
			$.each(dataKota, function(i, el) 
			{ 
			   $('#kota_buatGrup').append(new Option(el.nama,el.id) );
			});
			var id_kota = getData("active_user_kota");
			$("#kota_buatGrup").val(id_kota);
		}).fail(function(x){
			myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
		}); 	
	}else{
		$.each(globalKota, function(i, el) 
		{ 
		   $('#kota_buatGrup').append(new Option(el.nama,el.id) );
		});
		var id_kota = getData("active_user_kota");
		$("#kota_buatGrup").val(id_kota);
	}
}

function buatGrupPost() {
	var namaGrup = document.getElementById("nama_buatGrup").value;
	var kota = $('#kota_buatGrup').find(":selected").val();
	var kelas = $('#kelas_buatGrup').find(":selected").val();
	var lokasi = document.getElementById("lokasi_buatGrup").value;
	var lat = document.getElementById("lat_buatGrup").value;
	var lng = document.getElementById("lng_buatGrup").value;
	var id_user = getData("active_user_id");
	var fileinput = document.getElementById("file_buatGrup").value;
	
	if(namaGrup=="")
	{
		myApp.alert('Silahkan isi nama grup', 'Perhatian!');
	}
	else
	{
		if(kota=="" || kota==0 || kota=="0")
		{
			myApp.alert('Silahkan pilih kota grup', 'Perhatian!');
		}
		else
		{
			if(kelas=="" || kelas==0 || kelas=="0")
			{
				myApp.alert('Silahkan pilih kelas grup', 'Perhatian!');
			}
			else
			{
				if(lokasi=="")
				{
					myApp.alert('Silahkan pilih lokasi grup', 'Perhatian!');
				}
				else
				{
					if(lat == "" || lng == "")
					{
						myApp.alert('Silahkan pilih lokasi peta grup', 'Perhatian!');
					}
					else
					{
						if(fileinput=="")
						{
							myApp.alert('Silahkan pilih foto anda', 'Perhatian!');
						}
						else
						{
							var blob=$("#file_buatGrup")[0].files[0];
							var formData = new FormData();
							formData.append("nama", namaGrup);
							formData.append("lokasi", lokasi);
							formData.append("lat", lat);
							formData.append("lng", lng);
							formData.append("id_kota", kota);
							formData.append("id_user", id_user);
							formData.append("id_kelas", kelas);
							formData.append("file", blob);
							
							var link=urlnya+'/api/grup/createGrup';
							//console.log(formData);
							
							//for (var z[ii] of formData.entries()) {
							//	console.log(z[ii][0]+ ', ' + z[ii][1]); 
							//}
							$.ajax({
								url: link,
								data: formData,
								type: 'POST',
								contentType: false,
								processData: false
							}).done(function(z){
								mainView.router.loadPage('home.html');
								myApp.alert('Grup berhasil dibuat', 'Berhasil!');
								$(".file-selected").hide();
								allGrupUser = null;
							}).fail(function(x){
								myApp.alert(x.message+" "+x.error, 'Perhatian!');
							});
						}
					}
				}
			}		
		}
	}
}

function getAllGrup() {
	if(allGrupUser == null){
		myApp.showPreloader('Mengambil data...');
		var id_user = getData("active_user_id");
		var link=urlnya+'/api/grup?id_user='+id_user;
		var kelas_dipilih = $('#kelas_dipilih').find(":selected").val();
		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			myApp.closeModal();
			$("#isi_kumpulan_grup").remove();
			$("#kumpulan_grup").append('<div id="isi_kumpulan_grup"></div>');
			
			var dataLength=0;
			for (var ii = 0 ; ii < z.length ; ii++) {
							dataLength++;
			}
			
			if(dataLength!=0)
			{
				for(var i=0;i<dataLength;i++)
				{
					if(z[i]['id_kelas'] !== kelas_dipilih) continue;
					var html =	'<a href="#" onclick="gotoGroup('+z[i]['id']+');" id="grup_'+z[i]['id']+'" style="color:white;">';
					html += 				'<li class="item-content">';
					html += 					'<div class="item-media">';
					html += 						"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='padding:0px; margin-right:10px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					html += 					'</div>';
					html += 					'<div class="item-inner">';
					html += 					'<div class="item-title">'+z[i]['nama']+'</div>';
					html += 					'</div>';
					html += 				'</li>';
					html += 			'</a>';
					$("#isi_kumpulan_grup").append(html);
					if(allGrupUser == null){
						allGrupUser = [];
					}
					allGrupUser.push(z[i]);
				}
			}
		}).fail(function(x){
			myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
		}); 
	}else{
		$("#isi_kumpulan_grup").remove();
		$("#kumpulan_grup").append('<div id="isi_kumpulan_grup"></div>');
		
		var dataLength=0;
		for (var ii = 0 ; ii < allGrupUser.length ; ii++) {
			dataLength++;
		}
		
		if(dataLength!=0)
		{
			for(var i=0;i<dataLength;i++)
			{
				var html =	'<a href="#" onclick="gotoGroup('+allGrupUser[i]['id']+');" id="grup_'+allGrupUser[i]['id']+'" style="color:white;">';
				html += 		'<li class="item-content">';
				html += 			'<div class="item-media">';
				html += 				"<img class='lazy' src='data:image/jpeg;base64,"+allGrupUser[i]['foto']+"' style='padding:0px; margin-right:10px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
				html += 			'</div>';
				html += 			'<div class="item-inner">';
				html += 			'<div class="item-title">'+allGrupUser[i]['nama']+'</div>';
				html += 			'</div>';
				html += 		'</li>';
				html += 	'</a>';
				$("#isi_kumpulan_grup").append(html);
			}
		}
	}
}

function showButtonJoinGrup(id){
	
	$("#isi_form_komentari_grup").remove();
	$("#form_komentari_grup").append('<div id="isi_form_komentari_grup"></div>');
			
	var html =	'<p><a href="#" id="joinGrup" class="button active" onclick="joinThisGrup('+id+');" type="submit" style="width:100px; float:right; margin-right:5%;">Join Grup</a></p>';
	
	//jika sudah ada tidak perlu bikin lagi
	if($("#joinGrup").length == 0) {
		$("#isi_form_komentari_grup").append(html);
	}
}

function showButtonLeaveGrup(id){
	var link=urlnya+'/api/grup/getGrupInfo?id_grup='+id;
		
	$.ajax({ dataType: "jsonp",
	    url: link,
	    type: 'GET',
	    contentType: false,
	    processData: false
	}).done(function(z){
		var active_user_id = getData("active_user_id");
		if(active_user_id==z[0]["id_user"])
		{
			$("#isi_leaveGrup").remove();
			$("#leaveGrup").append('<div id="isi_leaveGrup"></div>');
					
			var html =	'<a href="#" id="hapusGrup" class ="badge" onclick="pilihanHapusGrup('+id+');" type="submit">Hapus Grup</a><br><br>';
			html +=	'<a href="#" id="gotoEditProfileGrup" class ="badge" onclick="gotoEditProfileGrup();" type="submit">Edit Grup</a>';
			
			//jika sudah ada tidak perlu bikin lagi
			//if($("#keluarGrup").length == 0) {
				$("#isi_leaveGrup").append(html);
			//}
		}
		else
		{
			$("#isi_leaveGrup").remove();
			$("#leaveGrup").append('<div id="isi_leaveGrup"></div>');
					
			var html =	'<a href="#" id="keluarGrup" class ="badge" onclick="pilihanKeluarGrup('+id+');" type="submit">Keluar grup</a>';
			
			//jika sudah ada tidak perlu bikin lagi
			//if($("#keluarGrup").length == 0) {
				$("#isi_leaveGrup").append(html);
			//}
		}
	
	}).fail(function(x){
		myApp.alert("Pengambilan data grup gagal", 'Perhatian!');
	}); 
}

function gotoEditProfileGrup(){
	mainView.router.loadPage('editGrup.html');
}

function pilihanHapusGrup(id_grup){
  myApp.modal({
    title:  'Pilihan',
    text: 'Apakah anda ingin menghapus grup ini?',
    buttons: [
      {
        text: 'Tidak',
        onClick: function() {
        }
      },
      {
        text: 'Ya',
		bold: true,
        onClick: function() {
			hapusGrupTrue(id_grup);
			allGrupUser = null;
        }
      },
    ]
  })
}

function hapusGrupTrue(clickedId){
	myApp.showPreloader('Mengambil data...');
	var id_grup=clickedId;
	var id_user = getData("active_user_id");
	
	var link=urlnya+'/api/grup/deleteGrup?id_grup='+id_grup;

		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			myApp.closeModal();
			console.log(z.status);
			if(z.status==true)
			{
				$("#isi_leaveGrup").remove();
				$("#isi_postingan_grup").remove();
				mainView.router.loadPage('home.html');
				myApp.alert("Anda telah menghapus grup dari grup", 'Perhatian!');
			}
		}).fail(function(x){
			myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
		}); 
}

function pilihanKeluarGrup(id_grup){
  myApp.modal({
    title:  'Pilihan',
    text: 'Apakah anda ingin kelaur grup ini?',
    buttons: [
      {
        text: 'Tidak',
        onClick: function() {
        }
      },
      {
        text: 'Ya',
		bold: true,
        onClick: function() {
			leaveThisGrup(id_grup);
			allGrupUser = null;
        }
      },
    ]
  })
}

function leaveThisGrup(clickedId){
	myApp.showPreloader('Mengambil data...');
	var id_grup=clickedId;
	var id_user = getData("active_user_id");
	
	var link=urlnya+'/api/grup/leaveGrup?id_grup='+id_grup+'&id_user='+id_user;

	$.ajax({ dataType: "jsonp",
	    url: link,
	    type: 'GET',
	    contentType: false,
	    processData: false
	}).done(function(z){
		myApp.closeModal();
		console.log(z.status);
		if(z.status==true)
		{
			$("#isi_leaveGrup").remove();
			$("#isi_postingan_grup").remove();
			myApp.alert("Anda telah keluar dari grup", 'Perhatian!');
			showButtonJoinGrup(clickedId);
			allGrupUser = null;
		}
	}).fail(function(x){
		myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
	}); 
}

function joinThisGrup(clickedId){
	myApp.showPreloader('Mengambil data...');
	var id_grup=clickedId;
	var id_user = getData("active_user_id");
	
	var link=urlnya+'/api/grup/joinGrup?id_grup='+id_grup+'&id_user='+id_user;

	$.ajax({ dataType: "jsonp",
	    url: link,
	    type: 'GET',
	    contentType: false,
	    processData: false
	}).done(function(z){
		myApp.closeModal();
		if(z.status==true)
		{
			myApp.alert("Join grup berhasil", 'Perhatian!');
			showButtonLeaveGrup(clickedId);
			getAllGrupPost(clickedId);
			myApp.closeModal();
		}
		allGrupUser = null;
	}).fail(function(x){
		myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
		allGrupUser = null;
	}); 
}

function getAllGrupPost(clickedId) {
	myApp.showPreloader('Mengambil data...');
	var id_grup = clickedId;
	var link=urlnya+'/api/post/getAllPostByGrup?id_grup='+id_grup;

		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			myApp.closeModal();
			var coba="";
			var dataLength=0;
			for (var ii = 0 ; ii < z.length ; ii++) {
				coba+=z[ii]['id']+"|"; 
				dataLength++;
			}
			$("#isi_postingan_grup").html("");
			$("#isi_form_komentari_grup").html("");
			
			var html2= '<form action="/action_page.php">';
			html2 +=	'<div class="item-content">';
			html2 +=		'<div class="item-inner">';
			html2 +=			'<div class="item-input">';
			html2 +=				'<center><textarea id="status_grup" style="resize:none; margin-top:10px; width:90%; height:60px;" ';
			html2 +=					'placeholder="Tulis apa yang ingin anda bahas.."></textarea>';
			html2 +=				'</center>';
			html2 +=			'</div>';
			html2 +=		'</div>';
			html2 +=	' </div>';
			html2 +=	'<div class="item-content" style="margin-top:-10px;">';
			html2 +=	'<div class="item-inner" >';
			html2 +=	'<div style="height:0px;overflow:hidden">';
			html2 +=	'<input type="file" id="file_grup" accept="image/*"/>';
			html2 +=	'</div>';
			html2 +=	'<p><a href="#" class="button active" onclick="statusGrupPost();" type="submit" style="width:70px; float:right; margin-right:5%;">Kirim</a></p>';
			html2 +=	'<p><a href="#" class="button"  onclick="chooseFile_grup();" style=" float:right; margin-right:10px; width:85px;">Gambar..</a></p>';
			html2 +=	'<small class="file-selected">file selected</small>';
			html2 +=	'</form>';
			
			
			$("#isi_form_komentari_grup").append(html2);
			
			//munculkan semua post
			for(var i=0;i<dataLength;i++)
			{
				if(z[i]['foto']!="")
				{
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4' >";
					html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%; height:100%;'>";
					html += 				"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
				else
				{
					
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
			}
		}).fail(function(x){
			myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
		}); 
}

function getAllGrupPost(clickedId) {
	myApp.showPreloader('Mengambil data...');
	var id_grup = clickedId;
	var link=urlnya+'/api/post/getAllPostByGrup?id_grup='+id_grup;

		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			myApp.closeModal();
			var coba="";
			var dataLength=0;
			for (var ii = 0 ; ii < z.length ; ii++) {
				coba+=z[ii]['id']+"|"; 
				dataLength++;
			}
			$("#isi_postingan_grup").html("");
			$("#isi_form_komentari_grup").html("");
			
			var html2= '<form action="/action_page.php">';
			html2 +=	'<div class="item-content">';
			html2 +=		'<div class="item-inner">';
			html2 +=			'<div class="item-input">';
			html2 +=				'<center><textarea id="status_grup" style="resize:none; margin-top:10px; width:90%; height:60px;" ';
			html2 +=					'placeholder="Tulis apa yang ingin anda bahas.."></textarea>';
			html2 +=				'</center>';
			html2 +=			'</div>';
			html2 +=		'</div>';
			html2 +=	' </div>';
			html2 +=	'<div class="item-content" style="margin-top:-10px;">';
			html2 +=	'<div class="item-inner" >';
			html2 +=	'<div style="height:0px;overflow:hidden">';
			html2 +=	'<input type="file" id="file_grup" accept="image/*"/>';
			html2 +=	'</div>';
			html2 +=	'<p><a href="#" class="button active" onclick="statusGrupPost();" type="submit" style="width:70px; float:right; margin-right:5%;">Kirim</a></p>';
			html2 +=	'<p><a href="#" class="button"  onclick="chooseFile_grup();" style=" float:right; margin-right:10px; width:85px;">Gambar..</a></p>';
			html2 +=	'<small class="file-selected">file selected</small>';
			html2 +=	'</form>';
			
			
			$("#isi_form_komentari_grup").append(html2);
			
			//munculkan semua post
			for(var i=0;i<dataLength;i++)
			{
				if(z[i]['foto']!="")
				{
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4' >";
					html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%; height:100%;'>";
					html += 				"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
				else
				{
					
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
			}
		}).fail(function(x){
			myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
		}); 
}

function getAllGrupPostWithIdPost(clickedId, id_post) {
	myApp.showPreloader('Mengambil data...');
	var id_grup = clickedId;
	var link=urlnya+'/api/post/getAllPostByGrup?id_grup='+id_grup;

		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			myApp.closeModal();
			$(".modal-overlay-visible").remove();
			var coba="";
			var dataLength=0;
			for (var ii = 0 ; ii < z.length ; ii++) {
				coba+=z[ii]['id']+"|"; 
				dataLength++;
			}
			$("#isi_postingan_grup").html("");
			$("#isi_form_komentari_grup").html("");
			
			var html2= '<form action="/action_page.php">';
			html2 +=	'<div class="item-content">';
			html2 +=		'<div class="item-inner">';
			html2 +=			'<div class="item-input">';
			html2 +=				'<center><textarea id="status_grup" style="resize:none; margin-top:10px; width:90%; height:60px;" ';
			html2 +=					'placeholder="Tulis apa yang ingin anda bahas.."></textarea>';
			html2 +=				'</center>';
			html2 +=			'</div>';
			html2 +=		'</div>';
			html2 +=	' </div>';
			html2 +=	'<div class="item-content" style="margin-top:-10px;">';
			html2 +=	'<div class="item-inner" >';
			html2 +=	'<div style="height:0px;overflow:hidden">';
			html2 +=	'<input type="file" id="file_grup" accept="image/*"/>';
			html2 +=	'</div>';
			html2 +=	'<p><a href="#" class="button active" onclick="statusGrupPost();" type="submit" style="width:70px; float:right; margin-right:5%;">Kirim</a></p>';
			html2 +=	'<p><a href="#" class="button"  onclick="chooseFile_grup();" style=" float:right; margin-right:10px; width:85px;">Gambar..</a></p>';
			html2 +=	'<small class="file-selected">file selected</small>';
			html2 +=	'</form>';
			
			
			$("#isi_form_komentari_grup").append(html2);
			
			//munculkan semua post
			for(var i=0;i<dataLength;i++)
			{
				if(z[i]['foto']!="")
				{
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4' >";
					html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%; height:100%;'>";
					html += 				"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
				else
				{
					
					var html=	"<div id='posting_grup_"+z[i]['id']+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_grup_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html +=                     "</a>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td class='text-right'><i onclick='editGrupPost(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusGrupData(this.id,"+id_grup+")' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_grup_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_grup_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaGrupKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
					
					$("#isi_postingan_grup").append(html);
				}
			}
			bacaGrupKomentar(id_post);
		}).fail(function(x){
			myApp.alert("Pengambilan postingan grup gagal", 'Perhatian!');
		}); 
}

function getInfoGrup(clickedId){
	myApp.showPreloader('Mengambil data...');
	var id_grup = clickedId;
	var link=urlnya+'/api/grup/getGrupInfo?id_grup='+id_grup;
		
		$.ajax({ dataType: "jsonp",
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){

			var dataLength=0;
			for (var ii = 0 ; ii < z.length ; ii++) {
				dataLength++;
			}
			var indeks=0;
			$("#isi_detil_grup").html("");
			
			for(var i=0;i<dataLength;i++)
			{
				var nama=z[i]['nama'];
				var foto=z[i]['foto'];
				var lat=z[i]['lat'];
				var lng=z[i]['lng'];
				var lokasi=z[i]['lokasi'];
				var kelas=z[i]['id_kelas'];
				var id_kota=z[i]['id_kota'];
				id_kota-=1;
				if(globalKota.length == 0){
					var link=urlnya+'/api/kota/';
					$.ajax({ dataType: "jsonp",
					    url: link,
					    type: 'GET',
				  	  	async: false,
					    contentType: false,
					    processData: false
					}).done(function(dataKota){
						globalKota = dataKota;
					}).fail(function(x){
						myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
					}); 	
				}
				if(indeks==0)
				{
					indeks++;
					var html=	'<input type="hidden" id="id_grup_temp" value="'+id_grup+'">';
					html +=	'<table id="detil_grup" style="margin-top:20px;">';
					html += 		'<tr>';
					html += 			'<input id="temp_id_grup" type="hidden" value="'+id_grup+'">';
					html += 			'<td rowspan="4"><img class="lazy" src="data:image/jpeg;base64,'+foto+'" style="max-width: 100px; max-height: 100px; margin-right:10px"></td>';
					html += 			'<input id="temp_foto_grup" type="hidden" value="'+foto+'">';
					html += 			'<td style="font-weight:bold;"><b id="nama_grup">'+nama+'</b></td>';
					html += 			'<input id="temp_nama_grup" type="hidden" value="'+nama+'">';
					html += 		'</tr>';
					html += 		'<tr>';
					html += 			'<td style="font-weight:bold;"><b id="kota_grup">'+globalKota[id_kota]['nama']+'</b></td>';
					html += 			'<input id="temp_kota_grup" type="hidden" value="'+globalKota[id_kota]['id']+'">';
					html += 			'<input id="temp_kelas_grup" type="hidden" value="'+kelas+'">';
					html += 		'</tr>';
					html += 		'<tr>';
					html += 			' <td colspan="2"><b id="alamat_grup"><i class="icon fa fa-map-marker"></i><span style="margin:10px;">'+lokasi+'</span></b></td>';
					html += 			'<input id="temp_alamat_grup" type="hidden" value="'+lokasi+'">';
					html += 		'</tr>';
					html += 		'<tr>';
					html += 			'<td colspan="2"><a href="#" onclick="gotoPetaGrup('+lat+','+lng+');"><i class="icon fa fa-map"></i><span style="margin:10px;">Tap disini untuk melihat peta</span></a></td>';
					html += 			'<input id="temp_lat_grup" type="hidden" value="'+lat+'">';
					html += 			'<input id="temp_lng_grup" type="hidden" value="'+lng+'">';
					html += 		'</tr>';
					html += 	'</table';
					
					//jika sudah ada tidak perlu bikin lagi
					if($("#detil_grup").length == 0) {
						$("#isi_detil_grup").append(html);
					}
				}	
			}
			myApp.closeModal();
		}).fail(function(x){
			myApp.alert("Pengambilan informasi grup gagal", 'Perhatian!');
		}); 
}

function statusGrupPost() {
	myApp.showPreloader('Mengambil data...');
	//ON PROGRESS
	var id_user = getData("active_user_id");
	var status = document.getElementById("status_grup").value;
	var id_grup = getData("id_grup");
	
	var link=urlnya+'/api/post/createPost/';
	
	if(status=="")
	{
		myApp.closeModal();
		myApp.alert('Anda belum mengisi isi postingan anda', 'Perhatian!');
	}
	else
	{
		var blob=$("#file_grup")[0].files[0];
		var formData = new FormData();
		formData.append("id_user", id_user);
		formData.append("id_grup", id_grup);
		formData.append("deskripsi", status);
		formData.append("file", blob);


		$.ajax({
		    url: link,
		    data: formData,
		    type: 'POST',
		    contentType: false,
		    processData: false
		}).done(function(z){
			mainView.router.loadPage('grup.html');
			$("#status_grup").val("");
			$("#file_grup").val("");
			$(".file-selected").hide();	
			getAllGrupPost(id_grup);
			$("#status_grup").val("");
			myApp.closeModal();
		}).fail(function(x){
			myApp.alert('Maaf tidak dapat menambah status, silahkan coba lagi', 'Perhatian!');
			var coba="";
			for (var ii = 0 ; ii < formData.entries().length; ii++) {
							coba+=formData.entries()[ii][0]+ ', ' + formData.entries()[ii][1]; 
			}
			myApp.closeModal();
			console.log(coba);
		});
		
	}
}

function bacaGrupKomentar(clicked_id) {
	//ON PROGRESS
	var id_post = clicked_id;
	
	if($("#isi_komentar_grup_"+id_post).length == 0) 
	{
			$(document).ready(function(){
			var link=urlnya+'/api/komentar?id_post='+id_post;
				
			$.ajax({ dataType: "jsonp",
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){

				var vardeksripsi="deskripsi_grup_"+id_post;
				var vartable="table_grup_"+id_post;
				
				var table = document.getElementById(vartable).value;
				//console.log(vartable);
				
				if($("#" + vardeksripsi).length == 0) {
					$("textarea[id^=deskripsi_grup_]").each(function(e){
						$(this).remove();
					});
					$("#kolom_komentar_grup_"+id_post).after(" <tr> <td colspan='5'><textarea id='"+vardeksripsi+"' style='resize:none; margin-top:10px; margin-left:10px; width:90%; height:60px;' placeholder='Tulis Komentar Anda..'></textarea> </td></tr>.");
					
					$("#btn_komentari_grup_"+id_post).html("");
					
					var html = 			"<p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+id_post+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Send</a></p>";
					
					$("#btn_komentari_grup_"+id_post).append(html);
				} 
				
				if(z.length>0)
				{
					var html= "<div  id='isi_komentar_grup_"+id_post+"'>";
					for(var i=0;i<z.length;i++)
					{
						//if(z[i]['foto']!="")
						//{
							html += 		"<table style='background-color:#e6e6e6;'  width='100%;'>";
							html += 			"<tr>";
							html += 				"<td rowspan='2' width='10%'>";
							html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
							html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
							html +=                     "</a>";
							html += 				"</td>";
							html += 				"<td style='font-weight:bold;' colspan='2'>"+z[i]['nama']+"</td>";
							if(z[i]['nama']==getData("active_user_nama"))
							{
								html += 				"<td class='text-right'><i onclick='editKomentarGrup("+clicked_id+",this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusKomentarGrup("+clicked_id+",this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
							}
							html += 			"</tr>";
							html += 			"<tr>";
							html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
							html += 			"</tr>";
							html += 			"<tr>";
							html += 				"<td colspan='5'>"+z[i]['deskripsi']+"</td>";
							html += 			"</tr>";
							html += 		"</table>";
							
							//$("#kolom_komentar_"+clicked_id).append(html);
						//}
						//else
						//{																													
							
						//}
					}
					html +=  "</div>";
					//console.log(html);
					$("#kolom_komentar_grup_"+clicked_id).append(html);
				}
				else
				{
					//nggak ada yang komentar
				}
			}).fail(function(x){
				myApp.alert('Maaf tidak dapat mengomentari status, silahkan coba lagi', 'Perhatian!');
			});
			
		});
	} 
	else 
	{
		var vardeksripsi="deskripsi_grup_"+id_post;
		$("#"+vardeksripsi).remove();
		$("#isi_komentar_grup_"+id_post).remove();
		myApp.closeModal();
	}
}

function komentariGrupPost(clicked_id) {
	//ON PROGRESS
	if($("#deskripsi_grup_"+clicked_id).length == 0){
		bacaGrupKomentar(clicked_id);
	}
	var id_user = getData("active_user_id");
	var id_post = "";
	$(document).ready(function(){
		
		id_post=clicked_id;
		var vardeksripsi="deskripsi_grup_"+id_post;
		var vartable="table_grup_"+id_post;
		
		var table = document.getElementById(vartable).value;
		
		//console.log(vartable);
		
		if($("#" + vardeksripsi).length == 0) {
			$("textarea[id^=deskripsi_grup_]").each(function(e){
				$(this).remove();
			});
			$("#kolom_komentar_grup_"+id_post).after(" <tr> <td colspan='5'><textarea id='"+vardeksripsi+"' style='resize:none; margin-top:10px; margin-left:10px; width:90%; height:60px;' placeholder='Tulis Komentar Anda..'></textarea> </td></tr>.");
			
			$("#btn_komentari_grup_"+id_post).html("");
			
			var html = 			"<p><a href='#' class='button' onclick='komentariGrupPost(this.id);' id='"+id_post+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Send</a></p>";
			
			$("#btn_komentari_grup_"+id_post).append(html);
		} 
		else 
		{
			var deskripsi = document.getElementById(vardeksripsi).value;
			if(deskripsi=="")
			{
				myApp.alert('Anda belum mengisi komentar', 'Perhatian!');
			}
			else
			{
				var link=urlnya+'/api/komentar/';
				var formData=JSON.stringify({
					id_user:id_user,
					id_post:id_post,
					deskripsi:deskripsi,
				});
				//myApp.alert(formData, 'Data Dikirim!');
				
				$.ajax({
					url: link,
					data: formData,
					type: 'POST',
					contentType: false,
					processData: false
				}).done(function(z){
					//mainView.router.loadPage('grup.html');
					var id_grup = document.getElementById("id_grup_temp").value;
					getAllGrupPostWithIdPost(id_grup,id_post);
					//myApp.alert('Komentar dibuat', 'Berhasil!');
				}).fail(function(x){
					myApp.alert('Maaf tidak dapat mengomentari status, silahkan coba lagi', 'Perhatian!');
				});
			}
		}
	});
}

function editKomentarGrup(id_grup,clicked_id)
{
	myApp.showPreloader('Mengambil data...');
	var id_user = getData("active_user_id");
	var id_komentar = clicked_id;
	
	$(document).ready(function(){
			var link=urlnya+'/api/komentar?id_post='+id_grup;
			console.log(link);
			$.ajax({ dataType: "jsonp",
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){
				
				myApp.closeModal();
				if(z.length>0)
				{
					for(var i=0;i<z.length;i++)
					{
						if(clicked_id==z[i]['id'])
						{
							//myApp.popup('.popup-editKomentarGrup');
								var popupHTML=	'<div class="popup">'+
											'<div class="content-block">'+
											'<p>Edit Kiriman</p>'+
														'<div class="page-content">'+
														'<center><textarea id="komentarGrupEdit" style="resize:none; margin-top:10px; width:90%; height:60px;" '+
														'placeholder="Tulis Komentar Anda..">'+z[i]['deskripsi']+'</textarea>'+
														'</center>'+
													'<div style="height:0px;overflow:hidden">'+
													'</div>'+
													'<p><a href="#" class="button active close-popup" onclick="simpanKomentarGrup('+id_grup+',this.id);" id='+clicked_id+' type="submit" style="width:70px; float:right; margin-right:5%;">Update</a></p>'+
										   ' </div>'+
										   '<p><a href="#" class="close-popup">Kembali</a></p>'+
									'</div>'+
								'</div>';
							myApp.popup(popupHTML);
						}
					}
				}
			}).fail(function(x){
				myApp.alert('Maaf update komentar gagal, coba lagi!', 'Perhatian!');
			});
			
		});
}

function simpanKomentarGrup(id_grup, clicked_id)
{
	myApp.showPreloader('Mengambil data...');
	var id_user = getData("active_user_id");
	var id_komentar = clicked_id;
	var deskripsi=document.getElementById("komentarGrupEdit").value;
	
	
	var formData = JSON.stringify({
					id_user:id_user,
					id_komentar:id_komentar,
					deskripsi:deskripsi
				});
	
	var link=urlnya+'/api/komentar/updateKomentar/';
	
	$.ajax({
	    url: link,
	    data: formData,
	    type: 'POST',
	    contentType: false,
	    processData: false
	}).done(function(z){
		myApp.closeModal();
		bacaGrupKomentar(id_grup);
		bacaGrupKomentar(id_grup);
		myApp.closeModal();
	}).fail(function(x){
		myApp.alert('Maaf terjadi kesalahan, silahkan coba lagi', 'Perhatian!');
	});
}

function simpanEditPost(clicked_id, id_grup) {
	var id_user = getData("active_user_id");
	var status = document.getElementById("statusGrupEdit").value;
	
	var link=urlnya+'/api/post/updatePost/';
	
	if(status=="")
	{
		myApp.alert('Kiriman tidak boleh kosong', 'Perhatian!');
	}
	else
	{
		var blob=$("#file_editGrup")[0].files[0];
		var formData = new FormData();
		formData.append("id_user", id_user);
		formData.append("deskripsi", status);
		formData.append("id_post", clicked_id);
		formData.append("id_grup", id_grup);
		formData.append("file", blob);

		$.ajax({
		    url: link,
		    data: formData,
		    type: 'POST',
		    contentType: false,
		    processData: false
		}).done(function(z){
			getAllGrupPost(id_grup);
		}).fail(function(x){
			myApp.alert('Maaf tidak dapat menambah status, silahkan coba lagi', 'Perhatian!');
			var coba="";
			for (var ii = 0 ; ii < formData.entries().length; ii++) {
				coba+=formData.entries()[ii][0]+ ', '; 
			}
			console.log(coba);
		});
		
	}
}

function pilihanHapusGrupData(clicked_id, id_grup){
  myApp.modal({
    title:  'Pilihan',
    text: 'Apakah anda ingin menghapus kiriman ini?',
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
			hapusGrupData(clicked_id, id_grup);
        }
      },
    ]
  })
}

function hapusGrupData(clicked_id, id_grup)
{
	myApp.showPreloader('Mengambil data...');
	var link=urlnya+'/api/post/deletePost?id_post='+clicked_id;
	$.ajax({
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			getAllGrupPost(id_grup);
			myApp.closeModal();
		}).fail(function(x){
			myApp.alert('Maaf tidak dapat menghapus kiriman, silahkan coba lagi', 'Perhatian!');
			var coba="";
			for (var ii = 0 ; ii < formData.entries().length; ii++) {
				coba+=formData.entries()[ii][0]+ ', '; 
			}
			console.log(coba);
		});
}

function pilihanHapusKomentarGrup(clicked_id, id_komentar){
  myApp.modal({
    title:  'Pilihan',
    text: 'Apakah anda ingin menghapus komentar ini?',
    buttons: [
      {
        text: 'Tidak',
        onClick: function() {
        }
      },
      {
        text: 'Ya',
		bold: true,
        onClick: function() {
			hapusKomentarGrupTrue(clicked_id, id_komentar);
        }
      },
    ]
  })
}

function hapusKomentarGrupTrue(clicked_id, id_komentar)
{
	var link=urlnya+'/api/komentar/deleteKomentar?id_komentar='+id_komentar;
	$.ajax({
		    url: link,
		    type: 'GET',
		    contentType: false,
		    processData: false
		}).done(function(z){
			var id_grup = document.getElementById("id_grup_temp").value;
			getAllGrupPostWithIdPost(id_grup,clicked_id);
		}).fail(function(x){
			myApp.alert('Maaf tidak dapat menghapus komentar, silahkan coba lagi', 'Perhatian!');
			console.log(x);
		});
}