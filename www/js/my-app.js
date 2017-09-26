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
	console.log("masuk");
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
		//console.log(globalEvent.length);
		for(var i=0; i<globalEvent.length;i++)
		{
			if(globalEvent[i]["id"]==id_post)
			{
				//console.log("globalEventUserFoto_"+i);
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
				foto = globalEvent[i]["foto"];
				user_foto = globalEvent[i]["user_foto"];
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
		html += 				"<td style='font-weight:bold;' colspan='3'>"+user_nama+"</td>";
		if(user_nama==getData("active_user_nama"))
		{
			html += 				"<td class='text-right'><i onclick='gotoUpdateEvent(this.id)' id='"+id+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusEventData(this.id)' id='"+id+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
		html +=					'<td colspan="2">'+tanggal+'</td>';
		html += 			"</tr>";
		html += 			"<tr>";
		html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Kota</div></td>';
		html +=					'<td>: </td>';
		html +=					'<td colspan="2">'+kota+'</td>';
		html += 			"</tr>";
		html += 			"<tr>";
		html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;"></div></td>';
		html +=					'<td></td>';
		html +=					'<td colspan="2"><a href="#" onclick="gotoPetaEventDetail('+lat+','+lng+');"><i class="icon fa fa-map"></i><span style="margin:10px;"> Lihat peta</span></a></td>';
		html += 			"</tr>";
		//html += 			"<tr>";
		//html +=					'<td colspan="12"><center><div id="petaEventDetail" style="width:250px; height:200px;"></div></center></td>';
		//html += 			"</tr>";
		var tempIndeks=0;
		for (var indeks=0;indeks<3;indeks++)
		{
			if(indeks==0)
			{
				var test = hadiah1.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.")
				tempIndeks=tempIndeks+1;
				html += 			"<tr>";
				html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Hadiah</div> </td>';
				html +=					'<td>: </td>';
				html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
				html +=					'<td colspan="1">Rp '+test+'</td>';
				html += 			"</tr>";
			}
			else if(indeks==1)
			{
				if(hadiah2!=0)
				{
					var test = hadiah2.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.")
					tempIndeks=tempIndeks+1;
					html += 			"<tr>";
					html +=					'<td colspan="2" width="100px;" height="30px;"</td>';
					html +=					'<td>: </td>';
					html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
					html +=					'<td colspan="1">Rp '+test+'</td>';
					html += 			"</tr>";
				}
			}
			else
			{
				if( hadiah3!=0)
				{
					var test = hadiah3.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.")
					tempIndeks=tempIndeks+1;
					html += 			"<tr>";
					html +=					'<td colspan="2" width="100px;" height="30px;"</td>';
					html +=					'<td>: </td>';
					html +=					'<td width="20px;" style="font-weight:bold;">'+tempIndeks+'. </td>';
					html +=					'<td colspan="1">Rp '+test+'</td>';
					html += 			"</tr>";
				}
			}
		}
		var test = harga_tiket.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.")
		html += 			"<tr>";
		html +=					'<td colspan="2" width="100px;" height="30px;"><div style="width:100px;font-weight:bold;">Tiket</div></td>';
		html +=					'<td>: </td>';
		html +=					'<td colspan="2">Rp '+test+'</td>';
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
		html += 			"<p><a href='#' onclick='bacaEventKomentar(this.id);' id='"+id+"' style='margin-top:-5px; float:right; margin-right:10px;' class='count_komentar_edit'>"+count_komentar+" Komentar</a></p>";
		html += 	"</div>";
		$("#isi_detail_event").append(html);

		var komentar = getData("notif_komentar");
		if (komentar != null)
		{
			komentariEventPost(komentar);
		}
	});

});

myApp.onPageInit('grup', function (page) {
	setPullRefreshGrup();
	$("textarea[id^=deskripsi_]").each(function(e){
		$(this).remove();
	});	
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
	$('#foto_editGrup').append('<img class="lazy" src="data:image/jpeg;base64,'+foto+'" style="max-width: 120px; max-height:120px;">');



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

	var kelas = document.getElementsByName('kelas_editProfile');
	var i, j;
	for (i = 0; i < kelas.length; i++) {
		for(j = 0 ; j < globalListKelas.length; j++){
			if (kelas[i].value === Object.values(globalListKelas[j])[0]) 
			{
				$(kelas[i]).attr('checked', 'checked');
				break;
			}
		}
	}

});

myApp.onPageInit('buatEvent', function (page) {
	document.addEventListener('load', checkPastDate("tanggal_buatEvent"), false);
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
	//console.log("masuk");
	$(document).ready(function(){
		var id_kota=getData("active_user_kota");
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

		$("#show_filter_event").empty();
		$("#show_filter_event").append('<option value="0">Semua Kota</option>');

		for(var i=0;i<arrKota.length;i++)
		{
			var tempIdKota=1+i;
			if(arrKota[i]["id"]==id_kota)
			{
				$("#show_filter_event").append('<option value="'+arrKota[i]["id"]+'" selected>'+arrKota[i]["nama"]+'</option>');
			}
			else
			{
				$("#show_filter_event").append('<option value="'+arrKota[i]["id"]+'">'+arrKota[i]["nama"]+'</option>');
			}
		}

		getAllEventPost();
		setPullRefreshEvent();
		myApp.closePanel();
	});
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
	setPullRefreshProfilTeman();
});

myApp.onPageInit('notif', function (page) {

	$(document).ready(function()
	{
		var id_user = getData("notif_id_user");
		var id = getData("notif_id");
		var komentar =  getData("notif_komentar");
		var type =  getData("notif_type");
		var id_grup =  getData("notif_id_grup");

		if(type=="post")
		{
			var link=urlnya+'/api/post/getPostById?id='+id;
			//console.log(link);
			$.ajax({ dataType: "jsonp",
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){
				//console.log(z);
				var coba="";
				var dataLength=0;
				for (var ii = 0 ; ii < z.length; ii++) 
				{
					coba+=z['id']+"|"; 
					dataLength++;
				}

				$("#isi_postingan_notif").html("");
				$("#isi_komentari_notif").html("");
				for(var i=0;i<dataLength;i++)
				{
					if(z[i]['foto']!="")
					{
						var html=	"<div id='posting_teman_"+z[i]['id']+"' style='margin-bottom:50px;'>";
						html += 		"<table id='table_teman_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
						html += 			"<tr>";
						html += 				"<td rowspan='2'>";
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
						html += 				"</td>";
						html += 				"<td style='font-weight:bold;'>"+z[i]['nama']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td colspan='2'>"+z[i]['deskripsi']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td colspan='2' >";
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%; height:100%;'>";
						html += 				"</td>";
						html += 			"</tr>";
						html += 		"</table>";
						html += 		"<div id='kolom_komentar_teman_"+z[i]['id']+"'>";
						html += 		"</div>";
						html += 			"<div id='btn_komentari_teman_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariTemanPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
						html += 			"<p><a href='#' onclick='bacaTemanKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
						html += 	"</div>";

						//console.log(html);
						$("#isi_postingan_notif").append(html);
					}
					else
					{

						var html=	"<div id='posting_teman_"+z[i]['id']+"' style='margin-bottom:50px;'>";
						html += 		"<table id='table_teman_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
						html += 			"<tr>";
						html += 				"<td rowspan='2'>";
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
						html += 				"</td>";
						html += 				"<td style='font-weight:bold;'>"+z[i]['nama']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td colspan='2'>"+z[i]['deskripsi']+"</td>";
						html += 			"</tr>";
						html += 		"</table>";
						html += 		"<div id='kolom_komentar_teman_"+z[i]['id']+"'>";
						html += 		"</div>";
						html += 			"<div id='btn_komentari_teman_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariTemanPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
						html += 			"<p><a href='#' onclick='bacaTemanKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
						html += 	"</div>";

						//console.log(html);
						$("#isi_postingan_notif").append(html);
					}
				}

				if(komentar==1)
				{
					bacaTemanKomentar(id);
				}


			}).fail(function(x){
				myApp.alert("Pengambilan postingan teman gagal", 'Perhatian!');
			}); 
		}
		else if(type.includes("grup"))
		{
			//notif grup masuk pada post
		}
		else if(type=="event")
		{
			var id_user = getData("notif_id_user");
			var id = getData("notif_id");
			var komentar =  getData("notif_komentar");
			var type =  getData("notif_type");
			var id_grup =  getData("notif_id_grup");

			var link=urlnya+'/api/event/getAllEvent?id_user='+id_user;
			var id_kota_dipilih = $('#show_filter_event').find(":selected").val();
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
				
				$("#isi_postingan_notif").html("");
				$("#isi_komentari_notif").html("");

				//munculkan semua post
				for(var i=0;i<dataLength;i++)
				{
					if(id==z[i]['id'])
					{
						var html=	"<div id='posting_event_"+z[i]['id']+"' style='margin-bottom:50px;'>";
						html += 		"<table id='table_event_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
						html += 			"<tr>";
						html += 				"<td rowspan='2' width='10%'>";
						html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
						if(z[i]['user_nama']==getData("active_user_nama"))
						{
							html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
						}
						else
						{
							html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
						}
						html +=                     "</a>";
						html += 				"</td>";
						html += 				"<td style='font-weight:bold;' colspan='3'>"+z[i]['user_nama']+"</td>";
						if(z[i]['user_nama']==getData("active_user_nama"))
						{
							html += 				"<td class='text-right'><i onclick='gotoUpdateEvent(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusEventData(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
						}
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html +=					'<td colspan="2" height="30px;" style="font-weight:bold;"><div style="width:100px;">Judul Lomba</div></td>';
						html +=					'<td>: </td>';
						html +=					'<td colspan="2" style="font-weight:bold;">'+z[i]['nama']+'</td>';
						html += 			"</tr>";
						html += 			"<tr>";
						html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Tanggal</div></td>';
						html +=					'<td>: </td>';
						html +=					'<td colspan="2">16/03/2016</td>';
						html += 			"</tr>";
						html += 			"<tr>";
						html +=					'<td colspan="2" height="30px;"style="font-weight:bold;"><div style="width:100px;">Kota</div></td>';
						html +=					'<td>: </td>';
						tempIndeks=z[i]['id_kota']-1;
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
								globalEvent.push({
									id:z[i]['id'], 
									count_komentar:z[i]['count_komentar'], 
									user_nama:z[i]['user_nama'], 
									created_at:z[i]['created_at'],
									nama:z[i]['nama'], 
									tanggal:z[i]['tanggal'], 
									kota:globalKota[tempIndeks]['nama'], 
									hadiah1:z[i]['hadiah1'], 
									hadiah2:z[i]['hadiah2'], 
									hadiah3:z[i]['hadiah3'], 
									harga_tiket:z[i]['harga_tiket'], 
									deskripsi:z[i]['deskripsi'], 
									lat:z[i]['lat'], 
									lng:z[i]['lng'],
									user_foto:z[i]['user_foto'],
									foto: z[i]["foto"]			
								});
								html +=					'<td colspan="2">'+dataKota[tempIndeks]['nama']+'</td>';
							}).fail(function(x){
								myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
							}); 	
						}else{
							globalEvent.push({
									id:z[i]['id'], 
									count_komentar:z[i]['count_komentar'], 
									user_nama:z[i]['user_nama'], 
									created_at:z[i]['created_at'],
									nama:z[i]['nama'], 
									tanggal:z[i]['tanggal'], 
									kota:globalKota[tempIndeks]['nama'], 
									hadiah1:z[i]['hadiah1'], 
									hadiah2:z[i]['hadiah2'], 
									hadiah3:z[i]['hadiah3'], 
									harga_tiket:z[i]['harga_tiket'], 
									deskripsi:z[i]['deskripsi'], 
									lat:z[i]['lat'], 
									lng:z[i]['lng'],
									user_foto:z[i]['user_foto'],
									foto: z[i]["foto"]			
								});
							html +=					'<td colspan="2">'+globalKota[tempIndeks]['nama']+'</td>';
						}
						saveData("globalEventFoto_"+i,z[i]['foto']);
						saveData("globalEventUserFoto_"+i,z[i]['user_foto']);
						var test = z[i]['harga_tiket'].toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.");
						html += 			"<tr>";
						html +=					'<td colspan="2" width="100px;" height="30px;"><div style="width:100px;font-weight:bold;">Tiket</div></td>';
						html +=					'<td>: </td>';
						html +=					'<td colspan="2">'+test+'</td>';
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				'<td colspan="5" class="q" >';
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%;'>";
						html += 				"</td>";
						html += 			"</tr>";
						html += 		"</table>";
						html += 		"<div id='kolom_komentar_event_"+z[i]['id']+"'>";
						html += 		"</div>";
						html += 			"<div id='btn_detail_event_"+z[i]['id']+"'><p><a href='#' class='button' onclick='detailEvent(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Detail</a></p></div>";
						html += 	"</div>";

						$("#isi_postingan_notif").append(html);
					}
				}
				//mainView.router.refreshPage('lomba.html');

				//if(komentar==1)
				//{
				//	console.log("masuk buka komentar");
				//	bacaEventKomentar(id);
				//}
				myApp.closeModal();

			}).fail(function(x){
				myApp.alert("Pengambilan postingan Event gagal", 'Perhatian!');
			});

		}
		else if(type=="jualbeli")
		{
			/*
			saveData( "notif_id",id);
			saveData( "notif_komentar",komentar);
			gotoJualBeli();
			*/
			var id_user = getData("notif_id_user");
			var id = getData("notif_id");
			var komentar =  getData("notif_komentar");
			var type =  getData("notif_type");
			var id_grup =  getData("notif_id_grup");

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
					arrKota = globalKota;
				}).fail(function(x){
					myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
				}); 	
			}
			arrKota=globalKota;	
			link=urlnya+'/api/jualBeli/getAllJualBeli?id_user='+id_user;
			$.ajax({ 
				dataType: "jsonp",
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){

				var link=urlnya+'/api/kategori/';
				$.ajax({ dataType: "jsonp",
					url: link,
					type: 'GET',
					contentType: false,
					processData: false
				}).done(function(dataKategori){
					var dataLengthKategori=0;
					for (var aaa = 0 ; aaa < dataKategori.length ; aaa++) {
						dataLengthKategori++;
					}

					myApp.closeModal();
					var coba="";
					var dataLength=0;
					for (var ii = 0 ; ii < z.length; ii++) {
						coba+=z[ii]['id']+"|"; 
						dataLength++;
					}

					$("#isi_postingan_notif").html("");
					$("#isi_komentari_notif").html("");
					//munculkan semua post
					for(var i=0;i<dataLength;i++)
					{
						if(id==z[i]['id'])
						{
							var tempIdKota=z[i]['id_kota'];
							tempIdKota -=1;
							var html=	"<div id='posting_jualBeli_"+z[i]['id']+"' style='margin-bottom:50px;'>";
							html += 		"<table id='table_jualBeli_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
							html += 			"<tr>";
							html += 				"<td rowspan='2' width='10%'>";
							html +=                     "<a href='#'' onclick='gotoProfilTeman("+z[i]['id_user']+");' class='item-link'>";
							if(z[i]['user_foto']==getData("active_user_nama"))
							{
								html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px;  margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
							}
							else
							{
								html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' style='padding:0px;  margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
							}
							html +=                     "</a>";
							html += 				"</td>";
							html += 				"<td colspan='3' style='font-weight:bold;'>"+z[i]['user_nama']+"</td>";
							if(z[i]['user_nama']==getData("active_user_nama"))
							{
								html += 				"<td class='text-right'><i onclick='editPostJualBeli(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i><i onclick='pilihanHapusJualBeli(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
							}
							html += 			"</tr>";
							html += 			"<tr>";
							html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
							html += 			"</tr>";
							html += 			"<tr>";
							html +=					'<td colspan="5" height="30px;" style="font-weight:bold;"><div>'+z[i]['nama']+'</div></td>';
							html += 			"</tr>";
							html += 			"<tr>";
							var test = z[i]['harga'].toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.");
							html +=					'<td colspan="5" height="30px;" style="font-weight:bold;"><div>Rp '+test+',-</div></td>';
							html += 			"</tr>";
							html += 			"<tr>";
							html +=					'<td colspan="2" height="30px;"><div style="width:100px;">Kategori</div></td>';
							html +=					'<td>: </td>';
							html +=					'<td colspan="2">'+dataKategori[z[i]['id_kategori']-1]["nama"]+'</td>';
							html += 			"</tr>";
							html += 			"<tr>";
							html +=					'<td colspan="2" height="30px;"><div style="width:100px;">Kelas</div></td>';
							html +=					'<td>: </td>';
							if(z[i]['id_kelas']==1)
								html +=					'<td colspan="2" value="1">STB</td>';
							else if(z[i]['id_kelas']==2)
								html +=					'<td colspan="2" value="2">STO</td>';
							else if(z[i]['id_kelas']==3)
								html +=					'<td colspan="2" value="3">SPEED</td>';
							html += 			"</tr>";
							html += 			"<tr>";
							html +=					'<td colspan="2" height="30px;"><div style="width:100px;">Kota</div></td>';
							html +=					'<td>: </td>';
							html +=					'<td colspan="2">'+arrKota[tempIdKota]['nama']+'</td>';
							html += 			"</tr>";
							html +=					'<td colspan="2" height="30px;" style="vertical-align: top;"><div style="width:100px;">Deskripsi</div></td>';
							html +=					'<td style="vertical-align: top;">: </td>';
							html +=					'<td colspan="2">'+z[i]['deskripsi']+'</td>';
							html += 			"</tr>";
							html += 			"</tr>";
							html +=					'<td colspan="2" height="30px;"><div style="width:100px;">Email</div></td>';
							html +=					'<td>: </td>';
							html +=					'<td colspan="2"><a href="mailto:'+z[i]['user_email']+'?subject='+z[i]['nama']+'" data-rel="external" class="external">'+z[i]['user_email']+'</a></td>';
							html += 			"</tr>";
							html += 			"<tr>";
							html += 				'<td colspan="5" class="q" >';
							html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%;'>";
							html += 				"</td>";
							html += 			"</tr>";
							html += 		"</table>";
							html += 		"<div id='kolom_komentar_jualBeli_"+z[i]['id']+"'>";
							html += 		"</div>";
							html += 			"<div id='btn_komentari_jualBeli_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariJualBeliPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
							html += 			"<p><a href='#' onclick='bacaJualBeliKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
							html += 	"</div>";

							$("#isi_postingan_notif").append(html);
						}
					}

					if(komentar==1)
					{
						console.log("masuk buka komentar");
						bacaJualBeliKomentar(id);
					}
					myApp.closeModal();
				}).fail(function(x){
					myApp.closeModal();
					myApp.alert("Pengambilan data kategori gagal", 'Perhatian!');
				}); 
			}).fail(function(x){
				myApp.closeModal();
				myApp.alert("Pengambilan postingan Jual Beli barang gagal", 'Perhatian!');
			}); 
		}

		eraseData("notif_id_user");
		eraseData("notif_id");
		eraseData("notif_komentar");
		eraseData("notif_type");
		eraseData("notif_id_grup");

	});
});

myApp.onPageInit('updateEvent', function (page) {
	
});

myApp.onPageInit('searchTemanGrup', function (page) {
	myApp.closePanel();
});


myApp.onPageInit('jualBeli', function (page) {
	setPullRefreshJualBeli();
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
		//console.log("masuk");
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
	var username = getData("active_user_nama");
	var idUser=getData("active_user_id");
	$("#index_name").html("");
	$("#index_name").append(username);
	$('#kelas_dipilih').val(id_kelas);
	
	
	
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
var id_kelas=getData("active_user_kelas");
if(id_kelas != null && id_kelas != "")
	$('#kelas_dipilih').val(id_kelas);

getAllGrup();
});

$$('.panel-right').on('panel:opened', function () {
	var id_user = getData("active_user_id");
	getAllNotif(id_user);
});

function saveKelas(el){
	var id_kelas = $('#kelas_dipilih').find(":selected").val();
	saveData( "active_user_kelas",id_kelas);
	allGrupUser = null;
	getAllGrup();
	var activePage = mainView.activePage.name;

	if(activePage === "jualBeli"){
		getAllJualBeliPost();
	}else if(activePage === "lomba"){
		getAllEventPost();
	}
}

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
				getAllTemanPost(id_teman);
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function setPullRefreshEvent(){
	var ptrContent = $$('#pullToRefreshLomba');
	ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
				//var id_teman=document.getElementById('#id_teman_temp').value;
				getAllEventPost();
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function setPullRefreshJualBeli(){
	var ptrContent = $$('#pullToRefreshJualBeli');
	ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
				//var id_teman=document.getElementById('#id_teman_temp').value;
				getAllJualBeliPost();
                myApp.pullToRefreshDone(); // After we refreshed page content, we need to reset pull to refresh component to let user pull it again:
            }, 2000);
        });
}

function viewRouterBack(){
	mainView.router.back();
}

function balik(){
	mainView.router.reloadPage('lomba.html');
}