var list_id_kelas=getData("list_id_kelas");
var ctx = null;
function gotoBuatEvent(){
	mainView.router.loadPage('buatEvent.html');
	myApp.closePanel();
}

function gotoLomba(){
	mainView.router.loadPage('lomba.html');
	getAllEventPost();
}

function ubahViewEventFilter()
{
	var id_kota = $('#show_filter_event').find(":selected").val();
	//console.log(id_kategori);
	getAllEventPost();
}

function getKotaBuatEvent() {
	if(globalKota.length == 0){
		myApp.showPreloader('Mengambil data...');
		var link=urlnya+'/api/kota/';
		$.ajax({ dataType: "jsonp",
			url: link,
			type: 'GET',
			contentType: false,
			processData: false
		}).done(function(z){
			globalKota = z;
			var myOptions = z;
			$.each(myOptions, function(i, el) 
			{ 
				$('#kota_buatEvent').append( new Option(el.nama,el.id) );
			});
			myApp.closeModal();
		}).fail(function(x){
			myApp.closeModal();
			myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
		}); 	
	}else{
		$.each(globalKota, function(i, el) 
		{ 
			$('#kota_buatEvent').append( new Option(el.nama,el.id) );
		});
		var id_kota = getData("active_user_kota");
		$("#kota_buatEvent").val(id_kota);
	}
}

function buatEventPost() {
	var id_user=getData("active_user_id");
	var namaEvent = document.getElementById("nama_buatEvent").value;
	var tanggal = document.getElementById("tanggal_buatEvent").value;
	var kelas = $('#kelas_buatEvent').find(":selected").val();
	var juara1 = document.getElementById("total_juara1Event").value;
	var juara2 = document.getElementById("total_juara2Event").value;
	var juara3 = document.getElementById("total_juara3Event").value;
	var ticket = document.getElementById("ticket_buatEvent").value;
	var kota = $('#kota_buatEvent').find(":selected").val();
	var lat = document.getElementById("lat_buatEvent").value;
	var lng = document.getElementById("lng_buatEvent").value;
	var lokasi = document.getElementById("lokasi_buatEvent").value;
	var deskripsi = document.getElementById("deskripsiBuatEvent").value;
	var fileinput = document.getElementById("file_buatEvent").value;

	juara1=juara1.split('.').join('');
	juara2=juara2.split('.').join('');
	juara3=juara3.split('.').join('');
	ticket=ticket.split('.').join('');
	
	if(namaEvent=="")
	{
		myApp.closeModal();
		myApp.alert('Silahkan isi nama Event', 'Perhatian!');
	}
	else
	{
		if(tanggal=="")
		{
			myApp.closeModal();
			myApp.alert('Silahkan isi tanggal Event', 'Perhatian!');
		}
		else
		{
			if(kelas=="" || kelas==0 || kelas=="0")
			{
				myApp.closeModal();
				myApp.alert('Silahkan pilih kelas Event', 'Perhatian!');
			}
			else
			{
				if(juara1=="" || juara1==0 || juara1=="0")
				{
					myApp.closeModal();
					myApp.alert('Silahkan isi total hadiah juara 1', 'Perhatian!');
				}
				else
				{
					if(ticket=="" || ticket==0 || ticket=="0")
					{
						myApp.closeModal();
						myApp.alert('Silahkan isi biaya ticket masuk', 'Perhatian!');
					}
					else
					{
						if(kota=="" || kota==0 || kota=="0")
						{
							myApp.closeModal();
							myApp.alert('Silahkan pilih kota Event', 'Perhatian!');
						}
						else
						{
							if(lat == "" || lng == "")
							{
								myApp.closeModal();
								myApp.alert('Silahkan pilih lokasi peta Event', 'Perhatian!');
							}
							else
							{
								if(lokasi=="")
								{
									myApp.closeModal();
									myApp.alert('Silahkan pilih lokasi Event', 'Perhatian!');
								}
								else
								{
									if(deskripsi=="")
									{
										myApp.closeModal();
										myApp.alert('Silahkan isi deskripsi event lomba', 'Perhatian!');
									}
									else
									{
										if(ctx === null && fileinput === "")
										{
											myApp.closeModal();
											myApp.alert('Silahkan pilih foto track event lomba', 'Perhatian!');
										}
										else
										{
											var blob=$("#file_buatEvent")[0].files[0];
											var formData = new FormData();
											formData.append("nama", namaEvent);
											formData.append("tanggal", tanggal);
											formData.append("tempat", lokasi);
											formData.append("hadiah1", juara1);
											formData.append("hadiah2", juara2);
											formData.append("hadiah3", juara3);
											formData.append("harga_tiket", ticket);
											formData.append("deskripsi", deskripsi);
											formData.append("lat", lat);
											formData.append("lng", lng);
											formData.append("id_user", id_user);
											formData.append("id_kota", kota);
											formData.append("id_kelas", kelas);
											formData.append('file',blob);
											if(ctx !== null){
												formData.append("canvas",ctx.canvas.toDataURL());
											}
											
											var link=urlnya+'/api/event/createEvent';
											myApp.showPreloader('Proses Data...');
											$.ajax({
												url: link,
												data: formData,
												type: 'POST',
												contentType: false,
												processData: false
											}).done(function(z){
												myApp.closeModal();
												myApp.alert('Event berhasil dibuat', 'Berhasil!');
												ctx = null;
												viewRouterBack();
												getAllEventPost();
												//myApp.closeModal();
											}).fail(function(x){
												myApp.closeModal();
												myApp.alert(x.message+" "+x.error, 'Perhatian!');
											});
										}
									}
								}
							}
						}
					}
				}		
			}
		}
	}
}

function getAllEventPost() {
	myApp.showPreloader('Mengambil data...');
	globalEvent=[];
	var id_user=getData("active_user_id");
	var kelas_dipilih = $('#kelas_dipilih').find(":selected").val();
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
		$("#isi_container_event").html("");
		
		if(id_kota_dipilih==0)
		{
			//munculkan semua post
			for(var i=0;i<dataLength;i++)
			{
				if(z[i]['id_kelas'] !== kelas_dipilih) continue;
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
				html += 				"<td style='font-weight:bold;'>"+z[i]['user_nama']+"</td>";
				if(z[i]['user_nama']==getData("active_user_nama"))
				{
					html += 				"<td style='font-weight:bold;'><i onclick='gotoUpdateEvent(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
					html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusEventData(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
				html +=					'<td colspan="2">'+z[i]['tanggal']+'</td>';
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
						globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:dataKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
						globalKota = dataKota;
						html +=					'<td colspan="2">'+dataKota[tempIndeks]['nama']+'</td>';
					}).fail(function(x){
						myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
					}); 	
				}else{
					globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:globalKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
					html +=					'<td colspan="2">'+globalKota[tempIndeks]['nama']+'</td>';
				}
				saveData("globalEventFoto_"+i,z[i]['foto']);
				saveData("globalEventUserFoto_"+i,z[i]['user_foto']);
				var test = z[i]['harga_tiket'].toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.");
				html += 			"<tr>";
				html +=					'<td colspan="2" width="100px;" height="30px;"><div style="width:100px;font-weight:bold;">Tiket</div></td>';
				html +=					'<td>: </td>';
				html +=					'<td colspan="2">Rp '+test+'</td>';
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

				$("#isi_container_event").append(html);
			}
		}
		else
		{
			//munculkan post sesuai kota dipilih
			for(var i=0;i<dataLength;i++)
			{
				if(id_kota_dipilih==z[i]['id_kota'])
				{
					if(z[i]['id_kelas'] !== kelas_dipilih) continue;
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
					html += 				"<td style='font-weight:bold;'>"+z[i]['user_nama']+"</td>";
					if(z[i]['user_nama']==getData("active_user_nama"))
					{
						html += 				"<td style='font-weight:bold;'><i onclick='gotoUpdateEvent(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
						html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusEventData(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
					html +=					'<td colspan="2">'+z[i]['tanggal']+'</td>';
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
							globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:dataKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
							globalKota = dataKota;
							html +=					'<td colspan="2">'+dataKota[tempIndeks]['nama']+'</td>';
						}).fail(function(x){
							myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
						}); 	
					}else{
						globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:globalKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
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

					$("#isi_container_event").append(html);
				}
			}
		}
		
	}).fail(function(x){
		myApp.closeModal();
		myApp.alert("Pengambilan postingan Event gagal", 'Perhatian!');
	});
}

function getAllEventPostVar(id_post) {
	myApp.showPreloader('Mengambil data...');
	globalEvent=[];
	var id_user=getData("active_user_id");
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
		$("#isi_container_event").html("");
		
		if(id_kota_dipilih==0)
		{
			//munculkan semua post
			for(var i=0;i<dataLength;i++)
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
				html += 				"<td style='font-weight:bold;'>"+z[i]['user_nama']+"</td>";
				if(z[i]['user_nama']==getData("active_user_nama"))
				{
					html += 				"<td style='font-weight:bold;'><i onclick='gotoUpdateEvent(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
					html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusEventData(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
						globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:dataKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
						globalKota = dataKota;
						html +=					'<td colspan="2">'+dataKota[tempIndeks]['nama']+'</td>';
					}).fail(function(x){
						myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
					}); 	
				}else{
					globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:globalKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
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
				
				$("#isi_container_event").append(html);
			}
			mainView.router.refreshPage('lomba.html');
			bacaEventKomentar(id_post);
			myApp.closeModal();
		}
		else
		{
			//munculkan post sesuai filter kota
			for(var i=0;i<dataLength;i++)
			{
				if(id_kota_dipilih==z[i]['id_kota'])
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
					html += 				"<td style='font-weight:bold;'>"+z[i]['user_nama']+"</td>";
					if(z[i]['user_nama']==getData("active_user_nama"))
					{
						html += 				"<td style='font-weight:bold;'><i onclick='gotoUpdateEvent(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
						html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusEventData(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
							globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:dataKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
							globalKota = dataKota;
							html +=					'<td colspan="2">'+dataKota[tempIndeks]['nama']+'</td>';
						}).fail(function(x){
							myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
						}); 	
					}else{
						globalEvent.push({id:z[i]['id'], count_komentar:z[i]['count_komentar'], user_nama:z[i]['user_nama'], created_at:z[i]['created_at'], nama:z[i]['nama'], tanggal:z[i]['tanggal'], kota:globalKota[tempIndeks]['nama'], hadiah1:z[i]['hadiah1'], hadiah2:z[i]['hadiah2'], hadiah3:z[i]['hadiah3'], harga_tiket:z[i]['harga_tiket'], deskripsi:z[i]['deskripsi'], lat:z[i]['lat'], lng:z[i]['lng']});
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
					
					$("#isi_container_event").append(html);
				}
			}
			mainView.router.refreshPage('lomba.html');
			bacaEventKomentar(id_post);
			myApp.closeModal();
		}
	}).fail(function(x){
		myApp.alert("Pengambilan postingan Event gagal", 'Perhatian!');
	}); 		
}

function detailEvent(id_post) {

	mainView.router.loadPage('detailEvent.html');
	saveData("id_lihat_detail_event",id_post);
}

function gotoPetaEventDetail(latData, lngData){
	//myApp.popup('.popup-grup');
	var popupHTML = '<div class="popup">'+
	'<div class="content-block">'+
	'<p>Letak lokasi lomba.</p>'+
	'<div id="petaLokasiEventDetail" style="width:330px; height:500px;"></div>'+
	"<div><p><a href='#' onClick='gotoGooleMapDevice("+latData+","+lngData+");' class='button' style='margin-right:5%; margin-top:-10px; float:right;'>Buka di Google Maps</a></p></div>"+
	"<p><a href='#' class='close-popup' style='margin-top:-5px; float:left; margin-right:10px;'>Kembali</a></p>"+
	'</div>'+
	'</div>'
	myApp.popup(popupHTML);

	$(document).ready(function(){	
		var map = new GMaps({
			div: '#petaLokasiEventDetail',
			lat: latData,
			lng: lngData,
		});

		//tidak bisa ambil lat lng
		map.addMarker({
			lat: latData,
			lng: lngData,
			draggable: false
		});
		google.maps.event.trigger(map, 'resize');

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

	});
}

function recenterEventMap()
{
	var map;
	function showPosition(position) {
		//console.log("lat:"+position.coords.latitude+"\nlng:"+position.coords.longitude);
		var id_kota = $("#kota_buatEvent").val();
		if(globalKota.length > 0){
			for(var xx = 0 ; xx < globalKota.length; xx++){
				if(globalKota[xx].id === id_kota){
					currentLat = position.coords.latitude;
					currentLng = position.coords.longitude;
					break;
				}
			}
		}
		map = new GMaps({
			div: '#petakuEvent',
			lat: currentLat,
			lng: currentLng,
			click: function(e) {
			},
		});

		var lat = currentLat;
		var lng = currentLng;
		
		if(lat != null && lng != null)
		{
			var html =	"<div id='isi_latlng_buatEvent'>Latitude = "+lat+"<br>Longitude = "+lng;
			html	+=	"</div>"
			$("#isi_latlng_buatEvent").remove();
			$("#lat_buatEvent").val(lat);
			$("#lng_buatEvent").val(lng);
			$("#latlng_buatEvent").append(html);
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
					var html =	"<div id='isi_latlng_buatEvent'>Latitude = "+lat+"<br>Longitude = "+lng;
					html	+=	"</div>"
					$("#isi_latlng_buatEvent").remove();
					$("#lat_buatEvent").val(lat);
					$("#lng_buatEvent").val(lng);
					$("#latlng_buatEvent").append(html);
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
				div: '#petakuEvent',
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
function gotoGmapEvent(){
	//myApp.popup('.popup-about');
	var popupHTML = '<div class="popup">'+
	'<div class="content-block">'+
	'<p>Silahkan pilih peta letak lokasi grup.</p>'+
	'<div id="petakuEvent" style="width:330px; height:500px;"></div>'+
	"<p><a href='#' class='close-popup button' style='margin-top:-5px; margin-left:10px; width:75%; float:left;'>Simpan</a></p>"+
	"<p><a href='#'  class='button' onclick='recenterEventMap();' style='margin-top:-5px; float:right; margin-right:10px;'><i class='icon fa fa-compass fa-4'></i></a></p>"+
	'</div>'+
	'</div>'
	myApp.popup(popupHTML);
	
	var map;
	function showPosition(position) {
		//console.log("lat:"+position.coords.latitude+"\nlng:"+position.coords.longitude);
		var id_kota = $("#kota_buatEvent").val();
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
			div: '#petakuEvent',
			lat: currentLat,
			lng: currentLng,
			click: function(e) {
			},
		});

		var lat = currentLat;
		var lng = currentLng;
		
		if(lat != null && lng != null)
		{
			var html =	"<div id='isi_latlng_buatEvent'>Latitude = "+lat+"<br>Longitude = "+lng;
			html	+=	"</div>"
			$("#isi_latlng_buatEvent").remove();
			$("#lat_buatEvent").val(lat);
			$("#lng_buatEvent").val(lng);
			$("#latlng_buatEvent").append(html);
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
					var html =	"<div id='isi_latlng_buatEvent'>Latitude = "+lat+"<br>Longitude = "+lng;
					html	+=	"</div>"
					$("#isi_latlng_buatEvent").remove();
					$("#lat_buatEvent").val(lat);
					$("#lng_buatEvent").val(lng);
					$("#latlng_buatEvent").append(html);
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
				div: '#petakuEvent',
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

function bacaEventKomentar(clicked_id) {
	myApp.showPreloader('Mengambil data...');
	//ON PROGRESS
	var id_post = clicked_id;
	
	if($("#isi_komentar_event_"+id_post).length == 0) 
	{
		$(document).ready(function(){
			var link=urlnya+'/api/komentar?id_event='+id_post;

			$.ajax({ dataType: "jsonp",
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){

				var vardeksripsi="deskripsi_event_"+id_post;
				var vartable="table_event_"+id_post;
				
				var table = document.getElementById(vartable).value;
				
				//console.log(vartable);
				
				if($("#" + vardeksripsi).length == 0) {
					$("textarea[id^=deskripsi_event_]").each(function(e){
						$(this).remove();
					});
					$("#kolom_komentar_event_"+id_post).after(" <tr> <td colspan='5'><textarea id='"+vardeksripsi+"' style='resize:none; margin-top:10px; margin-left:10px; width:90%; height:60px;' placeholder='Tulis Komentar Anda..'></textarea> </td></tr>.");
					
					$("#btn_komentari_event_"+id_post).html("");
					
					var html = "<p><a href='#' class='button' onclick='komentariEventPost(this.id);' id='"+id_post+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Send</a></p>";
					
					$("#btn_komentari_event_"+id_post).append(html);
				} 
				
				if(z.length>0)
				{
					var html= "<div  id='isi_komentar_event_"+id_post+"'>";
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
							html += 				"<td style='font-weight:bold;'>"+z[i]['nama']+"</td>";
							if(z[i]['nama']==getData("active_user_nama"))
							{
								html += 				"<td style='font-weight:bold;'><i onclick='editKomentarKuEvent("+clicked_id+",this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
								html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusKomentarEvent("+clicked_id+",this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
					$("#kolom_komentar_event_"+clicked_id).append(html);
				}
				else
				{
					//nggak ada yang komentar
					

				}
				myApp.closeModal();
			}).fail(function(x){
				myApp.alert('Maaf tidak dapat mengomentari status, silahkan coba lagi', 'Perhatian!');
			});
			
		});
	} 
	else 
	{
		var vardeksripsi="deskripsi_event_"+id_post;
		$("#"+vardeksripsi).remove();
		$("#isi_komentar_event_"+id_post).remove();
		myApp.closeModal();
	}
}

function komentariEventPost(clicked_id) {
	//ON PROGRESS
	bacaEventKomentar(clicked_id);
	var id_user = getData("active_user_id");
	var id_post = "";
	$(document).ready(function(){
		
		id_post=clicked_id;
		var vardeksripsi="deskripsi_event_"+id_post;
		var vartable="table_event_"+id_post;
		
		var table = document.getElementById(vartable).value;
		
		//console.log(vartable);
		
		if($("#" + vardeksripsi).length == 0) {
			$("textarea[id^=deskripsi_event_]").each(function(e){
				$(this).remove();
			});
			$("#kolom_komentar_event_"+id_post).after(" <tr> <td colspan='5'><textarea id='"+vardeksripsi+"' style='resize:none; margin-top:10px; margin-left:10px; width:90%; height:60px;' placeholder='Tulis Komentar Anda..'></textarea> </td></tr>.");
			
			$("#btn_komentari_event_"+id_post).html("");
			
			var html = "<p><a href='#' class='button' onclick='komentariEventPost(this.id);' id='"+id_post+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Send</a></p>";
			
			$("#btn_komentari_event_"+id_post).append(html);
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
					id_event:id_post,
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
					//mainView.router.loadPage('lomba.html');
					
					getAllEventPostVar(id_post);
					//myApp.alert('Komentar dibuat', 'Berhasil!');
				}).fail(function(x){
					myApp.alert('Maaf tidak dapat mengomentari status, silahkan coba lagi (line 1945)', 'Perhatian!');
				});
			}
		}
	});
}

function pilihanTrack(){
	myApp.modal({
		title:  'Pilihan',
		text: 'Anda bisa membuat track sendiri (Create) atau mengambil dari gambar yang sudah ada (Load).',
		buttons: [
		{
			text: 'Cancel',
			onClick: function() {
          //myApp.alert('You clicked first button!')
      }
  },
  {
  	text: 'Load',
  	bold: true,
  	onClick: function() {
  		chooseFile_buatEvent();
  	}
  },
  {
  	text: 'Create',
  	bold: true,
  	onClick: function() {
  		mainView.router.loadPage('createTrack.html');
  	}
  },
  ]
})
}

function pilihanTrackEdit(){
	myApp.modal({
		title:  'Pilihan',
		text: 'Anda bisa membuat track sendiri (Create) atau mengambil dari gambar yang sudah ada (Load).',
		buttons: [
		{
			text: 'Cancel',
			onClick: function() {
          //myApp.alert('You clicked first button!')
      }
  },
  {
  	text: 'Load',
  	bold: true,
  	onClick: function() {
  		chooseFile_buatEventEdit();
  	}
  },
  {
  	text: 'Create',
  	bold: true,
  	onClick: function() {
  		mainView.router.loadPage('createTrack.html');
  	}
  },
  ]
})
}

function gotoUpdateEvent(clicked_id)
{
	saveData("idPostEvent",clicked_id);
	mainView.router.loadPage('updateEvent.html');
}

function editEventPost(clicked_id)
{
	myApp.showPreloader('Mengambil data...');
	var id_user = getData("active_user_id");
	
	var link=urlnya+'/api/event/getAllEvent?id_user='+id_user;

	$.ajax({
		url: link,
		type: 'GET',
		contentType: false,
		processData: false
	}).done(function(z){
		var myOptions = null;
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
				myOptions = dataKota;
			}).fail(function(x){
				myApp.alert("Pengambilan data kota gagal", 'Perhatian!');
			}); 	
		}else{
			myOptions = globalKota;
		}
		
		var dataLengthKota=0;
		for (var aaa = 0 ; aaa < globalKota.length ; aaa++) {
			dataLengthKota++;
		}

		var coba="";
		var dataLength=0;
		for (var ii = 0 ; ii < z.length ; ii++) {
			coba+=z[ii]['id']+"|"; 
			dataLength++;
		}
		var popupHTML="";
		$("#isiDataUpdateEvent").append("");
		for(var i=0;i<dataLength;i++)
		{
			if(clicked_id==z[i]['id'])
			{
			//myApp.popup('.popup-editEvent');
			popupHTML=	'<div class="content-block">'+
			'<table style="margin-top:-0px;">'+
			'<tr>'+
			'<td><p>Nama Event Lomba</p></td>'+
			'<td><input id="nama_buatEventEdit" type="text" required value="'+z[i]['nama']+'"></td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Tanggal</p></td>'+
			'<td><input type="date" id="tanggal_buatEventEdit" name="tanggal_buatEventEdit"  value="'+z[i]['tanggal']+'"></td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Kelas</p></td>'+
			'<td>'+
			'<select name="kelas_buatEventEdit" id="kelas_buatEventEdit"  class="select-list-kelas">'+
			'<option value="0">Pilih Kelas</option>'+
			'<option value="1">STB</option>'+
			'<option value="2">STO</option>'+
			'<option value="3">Speed</option>'+
			'</select>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Hadiah</p></td>'+
			'<td>'+
			'1. Rp<input id="total_juara1EventEdit" onkeyup="ubahFormat('+"'"+'total_juara1EventEdit'+"'"+');" type="text" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  required value="'+z[i]['hadiah1']+'"></td>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td height="48"></td>'+
			'<td>'+
			'2. Rp<input id="total_juara2EventEdit" onkeyup="ubahFormat('+"'"+'total_juara2EventEdit'+"'"+');" type="text" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  required value="'+z[i]['hadiah2']+'"></td>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td height="48"></td>'+
			'<td>'+
			'3. Rp<input id="total_juara3EventEdit" onkeyup="ubahFormat('+"'"+'total_juara3EventEdit'+"'"+');" type="text" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  required value="'+z[i]['hadiah3']+'"></td>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Harga Tiket</p></td>'+
			'<td>&nbsp;&nbsp;&nbsp;&nbsp;Rp<input id="ticket_buatEventEdit" onkeyup="ubahFormat('+"'"+'ticket_buatEventEdit'+"'"+');" type="text" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required value="'+z[i]['harga_tiket']+'"></td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Kota</p></td>'+
			'<td>'+
			'<select name="kota_buatEventEdit" id="kota_buatEventEdit">'+
			'<option value="0">Pilih Kota</option>';
			for(var indeksKota=0;indeksKota<globalKota.length;indeksKota++)
			{
				var tempIdKota=globalKota[indeksKota]['id'];
				if(tempIdKota==z[i]['id_kota'])
				{
					popupHTML+=	'<option value="'+globalKota[indeksKota]['id']+'" selected>'+globalKota[indeksKota]['nama']+'</option>';
				}
				else
				{
					popupHTML+=	'<option value="'+globalKota[indeksKota]['id']+'">'+globalKota[indeksKota]['nama']+'</option>';
				}
			}
			popupHTML+=	'			</select>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Detil Lokasi</p></td>'+
			'<td><input id="lokasi_buatEventEdit" type="text" required value="'+z[i]['tempat']+'"></td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Track</p></td>'+
			'<div style="height:0px;overflow:hidden">'+
			'<input type="file" id="file_buatEventEdit" accept="image/*"/>'+
			'</div>'+
			'<td>'+
			"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['foto']+"' style='width:100%; height:100%;'>"+

			'<p><a href="#" class="button" onclick="pilihanTrackEdit();" style="width:150px;">Pilih Track..</a></p>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td><p>Deskripsi</p></td>'+
			'<td><textarea id="deskripsiBuatEventEdit" style="resize:none; margin-top:10px; height:60px;">'+z[i]['deskripsi']+'</textarea></td>'+
			'</tr>'+
			'</table>'+
			'<center><td><p><a href="#" class="button"  onclick="saveEventEditPost('+z[i]['id']+');" style="width:250px;">Update</a></p></td></center>'+
			'</div>';
		}
	}	
	$("#isiDataUpdateEvent").append(popupHTML);
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
		$(document).ready(function() 
		{ 
			document.addEventListener('load', checkPastDate("tanggal_buatEventEdit"), false);
		});
		myApp.closeModal();
	}).fail(function(x){
		myApp.alert("Pengambilan status user gagal", 'Perhatian!');
	}); 
}

function pilihanHapusEventData(clicked_id){
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
  		hapusEventData(clicked_id);
  	}
  },
  ]
})
}

function hapusEventData(clicked_id)
{
	myApp.showPreloader('Mengambil data...');
	var link=urlnya+'/api/event/deleteEvent?id_event='+clicked_id;
	$.ajax({
		url: link,
		type: 'GET',
		contentType: false,
		processData: false
	}).done(function(z){
		getAllEventPost();
		$("#status").val("");
		$("#file_home").val("");
		myApp.closeModal();
	}).fail(function(x){
		myApp.alert('Maaf tidak dapat menghapus kiriman, silahkan coba lagi', 'Perhatian!');

		console.log(x);
	});
}

function saveEventEditPost(clicked_id) {
	//ON PROGRESS
	var id_user = getData("active_user_id");
	
	var id_event = clicked_id;
	var namaEvent = document.getElementById("nama_buatEventEdit").value;
	var tanggal = document.getElementById("tanggal_buatEventEdit").value;
	var kelas = $('#kelas_buatEventEdit').find(":selected").val();
	var juara1 = document.getElementById("total_juara1EventEdit").value;
	var juara2 = document.getElementById("total_juara2EventEdit").value;
	var juara3 = document.getElementById("total_juara3EventEdit").value;
	var ticket = document.getElementById("ticket_buatEventEdit").value;
	var kota = $('#kota_buatEventEdit').find(":selected").val();
	var lokasi = document.getElementById("lokasi_buatEventEdit").value;
	var deskripsi = document.getElementById("deskripsiBuatEventEdit").value;
	var fileinput = document.getElementById("file_buatEventEdit").value;

	juara1=juara1.split('.').join('');
	juara2=juara2.split('.').join('');
	juara3=juara3.split('.').join('');
	ticket=ticket.split('.').join('');
	
	if(namaEvent=="")
	{
		myApp.alert('Silahkan isi nama Event', 'Perhatian!');
	}
	else
	{
		if(tanggal=="")
		{
			myApp.alert('Silahkan isi tanggal Event', 'Perhatian!');
		}
		else
		{
			if(kelas=="" || kelas==0 || kelas=="0")
			{
				myApp.alert('Silahkan pilih kelas Event', 'Perhatian!');
			}
			else
			{
				if(juara1=="" || juara1==0 || juara1=="0")
				{
					myApp.alert('Silahkan isi total hadiah juara 1', 'Perhatian!');
				}
				else
				{
					if(ticket=="" || ticket==0 || ticket=="0")
					{
						myApp.alert('Silahkan isi biaya ticket masuk', 'Perhatian!');
					}
					else
					{
						if(kota=="" || kota==0 || kota=="0")
						{
							myApp.alert('Silahkan pilih kota Event', 'Perhatian!');
						}
						else
						{
							if(lokasi=="")
							{
								myApp.alert('Silahkan pilih lokasi Event', 'Perhatian!');
							}
							else
							{
								if(deskripsi=="")
								{
									myApp.alert('Silahkan isi deskripsi event lomba', 'Perhatian!');
								}
								else
								{
											//if(ctx === null && fileinput === "")
											//{
											//	myApp.alert('Silahkan pilih foto track event lomba', 'Perhatian!');
											//}
											//else
											//{
												var blob=$("#file_buatEventEdit")[0].files[0];
												
												
												formData = new FormData();
												formData.append("id_event", id_event);
												formData.append("nama", namaEvent);
												formData.append("tanggal", tanggal);
												formData.append("tempat", lokasi);
												formData.append("hadiah1", juara1);
												formData.append("hadiah2", juara2);
												formData.append("hadiah3", juara3);
												formData.append("harga_tiket", ticket);
												formData.append("deskripsi", deskripsi);
												formData.append("id_user", id_user);
												formData.append("id_kota", kota);
												formData.append("id_kelas", kelas);
												formData.append("file", blob);
												if(ctx !== null){
													formData.append("canvas",ctx.canvas.toDataURL());
												}
												console.log(formData);
												var link=urlnya+'/api/event/updateEvent/';
												myApp.showPreloader('Update Data...');
												$.ajax({
													url: link,
													data: formData,
													type: 'POST',
													contentType: false,
													processData: false
												}).done(function(z){
													viewRouterBack();
													//tutupModalEvent();
													getAllEventPost();
													myApp.alert('Event berhasil diubah!', 'Berhasil!');
													ctx = null;
													myApp.closeModal();
												}).fail(function(x){
													myApp.alert(x.message+" "+x.error, 'Perhatian!');
												});
											//}
										}
									}
								}
							}
						}		
					}
				}
			}
		}

		function editKomentarKuEvent(id_event,clicked_id)
		{
			myApp.showPreloader('Mengambil data...');
			var id_user = getData("active_user_id");
			var id_komentar = clicked_id;

			$(document).ready(function(){
				var link=urlnya+'/api/komentar?id_event='+id_event;
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
								myApp.popup('.popup-editKomentarKuEvent');
								var popupHTML=	'<div class="popup">'+
								'<div class="content-block">'+
								'<p>Edit Kiriman</p>'+
								'<div class="page-content">'+
								'<center><textarea id="komentarEventEdit" style="resize:none; margin-top:10px; width:90%; height:60px;" '+
								'placeholder="Tulis Komentar Anda..">'+z[i]['deskripsi']+'</textarea>'+
								'</center>'+
								'<div style="height:0px;overflow:hidden">'+
								'</div>'+
								'<p><a href="#" class="button active close-popup" onclick="simpanKomentarEvent('+id_event+',this.id);" id='+clicked_id+' type="submit" style="width:70px; float:right; margin-right:5%;">Update</a></p>'+
								' </div>'+
								'<p><a href="#" class="close-popup">Kembali</a></p>'+
								'</div>'+
								'</div>';
								myApp.popup(popupHTML);
							}
						}
					}
				}).fail(function(x){
					myApp.alert('Maaf update komentar gaga, coba lagi!', 'Perhatian!');
				});

			});
		}

		function simpanKomentarEvent(id_event, clicked_id)
		{
			myApp.showPreloader('Mengambil data...');
			var id_user = getData("active_user_id");
			var id_komentar = clicked_id;
			var deskripsi=document.getElementById("komentarEventEdit").value;


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
				bacaEventKomentar(id_event);
				bacaEventKomentar(id_event);
				myApp.closeModal();
			}).fail(function(x){
				myApp.alert('Maaf terjadi kesalahan, silahkan coba lagi', 'Perhatian!');
			});
		}

		function tutupModalEvent()
		{
			myApp.closeModal();
		}

		function pilihanHapusKomentarEvent(clicked_id, id_komentar){
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
						hapusKomentarEventTrue(clicked_id, id_komentar);
					}
				},
				]
			})
		}

		function hapusKomentarEventTrue(clicked_id, id_komentar)
		{
			myApp.showPreloader('Mengambil data...');
			var link=urlnya+'/api/komentar/deleteKomentar?id_komentar='+id_komentar;
			$.ajax({
				url: link,
				type: 'GET',
				contentType: false,
				processData: false
			}).done(function(z){
				getAllEventPostVar(clicked_id);
				myApp.closeModal();
			}).fail(function(x){
				myApp.alert('Maaf tidak dapat menghapus komentar, silahkan coba lagi', 'Perhatian!');
				console.log(x);
			});
		}