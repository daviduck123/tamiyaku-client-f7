// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false
});


var globalKota = [];
if(globalKota.length == 0){
	var link=urlnya+'/api/kota/';
	$.ajax({ dataType: "jsonp",
	    url: link,
	    type: 'GET',
	    contentType: false,
	    processData: false
	}).done(function(dataKota){
		globalKota = dataKota;
	}).fail(function(x){
		myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
	}); 	
}
myApp.onPageInit('detailEvent', function (page) {
	$(document).ready(function() 
	{ 
		var id_post = getData("id_lihat_detail_event");
		$("#isi_container_event").html("");
		
		var id = "";
		var nama = "";
		var user_nama = "";
		var created_at = "";
		var tanggal = "";
		var kota = "";
		var hadiah1 = "";
		var hadiah2 = "";
		var hadiah3 = "";
		var lat = "";
		var lng = "";
		var harga_tiket = "";
		var deskripsi = "";
		var foto = "";
		var user_foto="";
		var count_komentar = "";
		console.log(globalEvent.length);
		for(var i=0; i<globalEvent.length;i++)
		{
			if(globalEvent[i]["id"]==id_post)
			{
				console.log("globalEventUserFoto_"+i);
				id= globalEvent[i]["id"];
				nama = globalEvent[i]["nama"];
				user_nama = globalEvent[i]["user_nama"];
				created_at = globalEvent[i]["created_at"];
				tanggal = globalEvent[i]["tanggal"];
				kota = globalEvent[i]["kota"];
				hadiah1 = globalEvent[i]["hadiah1"];
				hadiah2 = globalEvent[i]["hadiah2"];
				hadiah3 = globalEvent[i]["hadiah3"];
				lat = globalEvent[i]["lat"];
				lng = globalEvent[i]["lng"];
				harga_tiket = globalEvent[i]["harga_tiket"];
				deskripsi = globalEvent[i]["deskripsi"];
				foto = getData("globalEventFoto_"+i);
				user_foto = getData("globalEventUserFoto_"+i);
				count_komentar = globalEvent[i]["count_komentar"];
			}
		}
		
		var html=	"<div id='posting_event_"+id+"' style='margin-bottom:50px;'>";
					html += 		"<table id='table_event_"+id+"' style='background-color:white;'  width='100%;'>";
					html += 			"<tr>";
					html += 				"<td rowspan='2' width='10%'>";
					if(user_nama==getData("active_user_nama"))
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+user_foto+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					else
					{
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+user_foto+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					}
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;'>"+user_nama+"</td>";
					if(user_nama==getData("active_user_nama"))
					{
						html += 				"<td style='font-weight:bold;'><i onclick='gotoUpdateEvent(this.id)' id='"+id+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
						html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusEventData(this.id)' id='"+id+"' class='fa fa-minus' aria-hidden='true'></i></td>";
					}
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				"<td style='font-size:10px;'>"+created_at+"</td>";
					html += 			"</tr>";
					html += 			"<tr>";
					html +=					'<td colspan="2" height="30px;" style="font-weight:bold;"><div style="width:100px;">Judul Lomba</div></td>';
					html +=					'<td>: </td>';
					html +=					'<td colspan="2" style="font-weight:bold;">'+nama+'</td>';
					html += 			"</tr>";
					html += 			"<tr>";
					html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Tanggal</div></td>';
					html +=					'<td>: </td>';
					html +=					'<td colspan="2">16/03/2016</td>';
					html += 			"</tr>";
					html += 			"<tr>";
					html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Tanggal</div></td>';
					html +=					'<td>: </td>';
					html +=					'<td colspan="2">'+tanggal+'</td>';
					html += 			"</tr>";
					html += 			"<tr>";
					html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Kota</div></td>';
					html +=					'<td>: </td>';
					html +=					'<td colspan="2">'+kota+'</td>';
					html += 			"</tr>";
					html += 			"<tr>";
					html +=					'<td colspan="12"><center><div id="petaEventDetail" style="width:250px; height:200px;"></div></center></td>';
					html += 			"</tr>";
					var tempIndeks=0;
					for (var indeks=0;indeks<3;indeks++)
					{
						if(indeks==0)
						{
							tempIndeks=tempIndeks+1;
							html += 			"<tr>";
							html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Hadiah</div> </td>';
							html +=					'<td>: </td>';
							html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
							html +=					'<td colspan="1">'+hadiah1+'</td>';
							html += 			"</tr>";
						}
						else if(indeks==1)
						{
							if(hadiah2!=0)
							{
								tempIndeks=tempIndeks+1;
								html += 			"<tr>";
								html +=					'<td colspan="2" width="100px;" height="30px;"</td>';
								html +=					'<td>: </td>';
								html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
								html +=					'<td colspan="1">'+hadiah2+'</td>';
								html += 			"</tr>";
							}
						}
						else
						{
							if( hadiah3!=0)
							{
								tempIndeks=tempIndeks+1;
								html += 			"<tr>";
								html +=					'<td colspan="2" width="100px;" height="30px;"</td>';
								html +=					'<td>: </td>';
								html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
								html +=					'<td colspan="1">'+hadiah3+'</td>';
								html += 			"</tr>";
							}
						}
					}
					html += 			"<tr>";
					html +=					'<td colspan="2" width="100px;" height="30px;"><div style="width:100px;font-weight:bold;">Tiket</div></td>';
					html +=					'<td>: </td>';
					html +=					'<td colspan="2">'+harga_tiket+'</td>';
					html += 			"</tr>";
					html += 			"<tr>";
					html += 				'<td colspan="5" class="q" >';
					html += 					"<img class='lazy' src='data:image/jpeg;base64,"+foto+"' style='width:100%;'>";
					html += 				"</td>";
					html += 			"</tr>";
					html += 		"</table>";
					html += 		"<div id='kolom_komentar_event_"+id+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_event_"+id+"'><p><a href='#' class='button' onclick='komentariEventPost(this.id);' id='"+id+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaEventKomentar(this.id);' id='"+id+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+count_komentar+" Komentar</a></p>";
					html += 	"</div>";
					$("#isi_detail_event").append(html);

				var map;
				$(document).ready(function(){

					map = new GMaps({
						div: '#petaEventDetail',
						lat: ﻿﻿lat,
						lng: lng,
					});	
					
					map.addMarker({

						lat: lat,
						lng: lng,
						draggable: false,
					});
					google.maps.event.trigger(map, 'resize');
				
			});	
	});
});

myApp.onPageInit('grup', function (page) {
	$("textarea[id^=deskripsi_]").each(function(e){
		$(this).remove();
	});
	/*var id_user = getData("active_user_id");
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
		
		if(dataLength>0)
		{
			getAllGrupPost(id_grup);
			getInfoGrup(id_grup);
			showButtonLeaveGrup(id_grup);
			setPullRefreshGrup();
		}
		else
		{
			getInfoGrup(id_grup);
			showButtonJoinGrup(id_grup);
		}
	}).fail(function(x){
		myApp.alert("Pengambilan data grup disekitar gagal", 'Perhatian!');
	});*/
	
});

myApp.onPageInit('nearbyGrup', function (page) {
	myApp.closePanel();
	getNearbyGrup();
});

myApp.onPageInit('updateEvent', function (page) {
	var tempIdPost=getData("idPostEvent");
	editEventPost(tempIdPost);
});

myApp.onPageInit('buatGrup', function (page) {
	getKotaBuatGrup();
	$(".select-list-kelas").empty();
	$.each(globalListKelas, function (id, text) {
		var key = Object.keys(text);
		var value = Object.values(text);
	    $(".select-list-kelas").append($('<option>', { 
	        value: key[0],
	        text : value[0]
	    }));
	});
});

myApp.onPageInit('editGrup', function (page) {
	var id_grup = document.getElementById("temp_id_grup").value;
	var nama = document.getElementById("temp_nama_grup").value;
	var id_kelas = document.getElementById("temp_kelas_grup").value;
	var id_kota = document.getElementById("temp_kota_grup").value;
	var alamat = document.getElementById("temp_alamat_grup").value;
	var foto = document.getElementById("temp_foto_grup").value;
	var lat = document.getElementById("temp_lat_grup").value;
	var lng = document.getElementById("temp_lng_grup").value;
	
	$('#id_editGrup').val(id_grup);
	$('#nama_editGrup').val(nama);
	$("#kelas_editGrup").empty();
	$.each(globalListKelas, function (id, text) {
		var key = Object.keys(text);
		var value = Object.values(text);
		if(id_kelas==key)
		{
			$("#kelas_editGrup").append($('<option>', { 
				selected:true,
				value: key[0],
				text : value[0]
			}));
		}
		else
		{
			$("#kelas_editGrup").append($('<option>', { 
				value: key[0],
				text : value[0]
			}));
		}
	});
	
	var arrKota=[];
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
	arrKota=globalKota;	
		
	$("#kota_editGrup").empty();
	$("#kota_editGrup").append('<option value="0">Pilih Kota</option>');
	
	for(var i=0;i<arrKota.length;i++)
	{
		var tempIdKota=1+i;
		if(arrKota[i]["id"]==id_kota)
		{
			$("#kota_editGrup").append('<option value="'+tempIdKota+'" selected>'+arrKota[i]["nama"]+'</option>');
		}
		else
		{
			$("#kota_editGrup").append('<option value="'+tempIdKota+'">'+arrKota[i]["nama"]+'</option>');
		}
	}
	
	$('#lokasi_editGrup').val(alamat);
	
	var html =	"<div id='isi_latlng_editGrup'>Latitude = "+lat+"<br>Longitude = "+lng;
	html	+=		"<input type='hidden' id='lat_editGrup' value='"+lat+"'>";
	html	+=		"<input type='hidden' id='lng_editGrup' value='"+lng+"'>";
	html	+=	"</div>"
	$("#isi_latlng_editGrup").remove();
	$("#latlng_editGrup").append(html);
	
	$("#isi_foto_editGrup").remove();
	$('#foto_editGrup').append('<img class="lazy" src="data:image/jpeg;base64,'+foto+'" style="width:240px; height:120px;">');
});

myApp.onPageInit('editProfile', function (page) {
	var nama = getData("active_user_nama");
	var id_kota =  getData("active_user_kota");
	var foto =getImage('profilePic')
	var gender = getData("active_user_jenis_kelamin");
	$('#nama_editProfile').val(nama);
	var arrKota=[];
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
	arrKota=globalKota;	
	
	$("#kota_editProfile").empty();
	$("#kota_editProfile").append('<option value="0">Pilih Kota</option>');
	
	for(var i=0;i<arrKota.length;i++)
	{
		var tempIdKota=1+i;
		if(arrKota[i]["id"]==id_kota)
		{
			$("#kota_editProfile").append('<option value="'+tempIdKota+'" selected>'+arrKota[i]["nama"]+'</option>');
		}
		else
		{
			$("#kota_editProfile").append('<option value="'+tempIdKota+'">'+arrKota[i]["nama"]+'</option>');
		}
	}
	
	$("#isi_foto_editProfile").remove();
	$('#foto_editProfile').append('<img class="lazy" src="data:image/jpeg;base64,'+foto+'" style="width:100%; height:100%;">');
	
	if(gender=="Laki-laki")
	{
		$("#laki_editProfile").attr('checked', 'checked');
	}
	else
	{
		$("#perempuan_editProfile").attr('checked', 'checked');
	}
});

myApp.onPageInit('buatEvent', function (page) {
	$("textarea[id^=deskripsi_]").each(function(e){
		$(this).remove();
	});
	getKotaBuatEvent();
	$(".select-list-kelas").empty();
	$.each(globalListKelas, function (id, text) {
		var key = Object.keys(text);
		var value = Object.values(text);
	    $(".select-list-kelas").append($('<option>', { 
	        value: key[0],
	        text : value[0]
	    }));
	});
});

myApp.onPageInit('home', function (page) {
	$("textarea[id^=deskripsi_]").each(function(e){
		$(this).remove();
	});
	getAllPost();
    setPullRefreshHome();
    $(".select-list-kelas").empty();
	$.each(globalListKelas, function (id, text) {
		var key = Object.keys(text);
		var value = Object.values(text);
	    $(".select-list-kelas").append($('<option>', { 
	        value: key[0],
	        text : value[0]
	    }));
	});
});

myApp.onPageInit('daftar', function (page) {
	getKota();
});

myApp.onPageInit('lomba', function (page) {
	getAllEventPost();
	myApp.closePanel();
});

myApp.onPageInit('teman', function (page) {
	getAllTeman();
	myApp.closePanel();
});

myApp.onPageInit('createTrack', function (page) {
	bindDraggableTrack();
	myApp.closePanel();
});

myApp.onPageInit('profilTeman', function (page) {
	//var id_teman = getData("id_profilTeman");
	//getProfilTeman(id_teman);
});

myApp.onPageInit('searchTemanGrup', function (page) {
	myApp.closePanel();
});

myApp.onPageInit('jualBeli', function (page) {
	$("textarea[id^=deskripsi_]").each(function(e){
		$(this).remove();
	});
	var link=urlnya+'/api/kategori/';
	$.ajax({ dataType: "jsonp",
		url: link,
		type: 'GET',
		contentType: false,
		processData: false
	}).done(function(dataKategori){
		console.log("masuk");
		var dataLengthKategori=0;
		for (var aaa = 0 ; aaa < dataKategori.length ; aaa++) {
			var tempA=aaa+1;
			 $('#show_kategori_jualBeli').append('<option value="'+tempA+'">'+dataKategori[aaa]["nama"]+'</option>');
		}
	}).fail(function(x){
		myApp.closePanel();
		myApp.alert("Pengambilan data kategori gagal", 'Perhatian!');
	});	
	
});

myApp.onPageInit('buatJualBarang', function (page) {
	getKotaBuatJualBarang();
	$(".select-list-kelas").empty();
	$.each(globalListKelas, function (id, text) {
		var key = Object.keys(text);
		var value = Object.values(text);
	    $(".select-list-kelas").append($('<option>', { 
	        value: key[0],
	        text : value[0]
	    }));
	});
	$(".active_user_email").empty();
	$email=getData("active_user_email");
	$data='<input id="email_buatJualBarang" type="text" value="'+$email+'" disabled>';
	$(".active_user_email").append($data);
	
	var link=urlnya+'/api/kategori/';
	$.ajax({ dataType: "jsonp",
		url: link,
		type: 'GET',
		contentType: false,
		processData: false
	}).done(function(dataKategori){
		var myOptions = dataKategori;
		//var lengthKategori=0;
		//for (var dataI = 0 ; dataI < arrKategori.length; dataI++) {
		//	lengthKategori++;
		//}
		$.each(myOptions, function(i, el) 
		{ 
		   $('#kategori_buatJualBarang').append( new Option(el.nama,el.id) );
		});
		mainView.router.loadPage('buatJualBarang.html');
		myApp.closePanel();
	}).fail(function(x){
			myApp.alert("Pengambilan data kota gagal (line 28)", 'Perhatian!');
	}); 
});

myApp.onPageInit('lapakSaya', function (page) {

});

$$('.panel-left').on('panel:opened', function () {
	getAllGrup();
	var username = getData("active_user_nama");
	var idUser=getData("active_user_id");
	$("#index_name").html("");
	$("#index_name").append(username);
	
	
	
	$(".profilePicture").attr('src','data:image/jpeg;base64,'+getImage('profilePic'));
	
	document.getElementById("masukProfileKu").setAttribute("onclick", "gotoProfilTeman("+idUser+");");
	var kelas_dipilih = $('#kelas_dipilih').find(":selected").val();
	if(kelas_dipilih==""||kelas_dipilih==null)
	{
		//ubah kelas=========================
		$(".select-list-kelas").empty();
		$.each(globalListKelas, function (id, text) {
			var key = Object.keys(text);
			var value = Object.values(text);
			$(".select-list-kelas").append($('<option>', { 
				value: key[0],
				text : value[0]
			}));
		});
	//==============================================
	}
});

$$('.panel-right').on('panel:opened', function () {
	var id_user = getData("active_user_id");
	getAllNotif(id_user);
});

function setPullRefreshHome(){
    var ptrContent = $$('#pullToRefreshHome');
    ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
                getAllPost();
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function setPullRefreshGrup(){
    var ptrContent = $$('#pullToRefreshGrup');
    ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
                var id_grup = getData("id_grup");
                getAllGrupPost(id_grup);
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function setPullRefreshProfilTeman(){
    var ptrContent = $$('#pullToRefreshProfileTeman');
    ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
				//var id_teman=document.getElementById('#id_teman_temp').value;
				var id_teman = getData("id_teman");
				console.log(id_teman+"aaa");
                getAllTemanPost(id_teman);
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function viewRouterBack(){
	mainView.router.back();
}