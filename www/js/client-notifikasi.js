function getAllNotif() {
	var id_user = getData("active_user_id");
	var link=urlnya+'/api/notifikasi/getNotifikasiByIdUser?id_user='+id_user;

	$.ajax({ dataType: "jsonp",
		url: link,
		type: 'GET',
		contentType: false,
		processData: false
	}).done(function(z){
		var coba="";
		var dataLength=0;
		for (var ii = 0 ; ii < z.length; ii++) {
			coba+=z[ii]['id']+"|"; 
			dataLength++;
		}
		$("#isi_container_notifikasi").html("");

			//munculkan semua post
			for(var i=0;i<dataLength;i++)
			{
				var id_tujuan=z[i]['id_tujuan'];
				var id_user=z[i]['id_user'];
				var komen=z[i]['komen'];
				var type=z[i]['type'];	
				
				if(type=="event")
				{
					var html=	'<a href="#" onClick="gotoFriendNotif('+id_user+','+id_tujuan+','+komen+','+"'"+'event'+"'"+')" style="color:white;">';
					html += 		'<li class="item-content" style="margin-bottom:-15px;">';
					html += 			'<div class="item-media"><i class="icon fa fa-circle" style="color:white; font-size: 0.3em;"></i></div>';
					html += 			'<div class="item-inner">';
					html += 				' <div class="item-title" style="font-size:11px;">'+z[i]['deskripsi']+'</div>';
					html += 			'</div>';
					html += 		'</li>';
					html += 	'</a>';

					$("#isi_container_notifikasi").append(html);
				}
				else if(type=="post")
				{
					var html=	'<a href="#" onClick="gotoFriendNotif('+id_user+','+id_tujuan+','+komen+','+"'"+'post'+"'"+')" style="color:white;">';
					html += 		'<li class="item-content" style="margin-bottom:-15px;">';
					html += 			'<div class="item-media"><i class="icon fa fa-circle" style="color:white; font-size: 0.3em;"></i></div>';
					html += 			'<div class="item-inner">';
					html += 				' <div class="item-title" style="font-size:11px;">'+z[i]['deskripsi']+'</div>';
					html += 			'</div>';
					html += 		'</li>';
					html += 	'</a>';

					$("#isi_container_notifikasi").append(html);
				}
				else if(type=="grup")
				{
					var html=	'<a href="#" onClick="gotoFriendNotif('+id_user+','+id_tujuan+','+komen+','+"'"+'grup'+"'"+')" style="color:white;">';
					html += 		'<li class="item-content" style="margin-bottom:-15px;">';
					html += 			'<div class="item-media"><i class="icon fa fa-circle" style="color:white; font-size: 0.3em;"></i></div>';
					html += 			'<div class="item-inner">';
					html += 				' <div class="item-title" style="font-size:11px;">'+z[i]['deskripsi']+'</div>';
					html += 			'</div>';
					html += 		'</li>';
					html += 	'</a>';

					$("#isi_container_notifikasi").append(html);
				}
				else if(type=="jualbeli")
				{
					var html=	'<a href="#" onClick="gotoFriendNotif('+id_user+','+id_tujuan+','+komen+','+"'"+'jualbeli'+"'"+')" style="color:white;">';
					html += 		'<li class="item-content" style="margin-bottom:-15px;">';
					html += 			'<div class="item-media"><i class="icon fa fa-circle" style="color:white; font-size: 0.3em;"></i></div>';
					html += 			'<div class="item-inner">';
					html += 				' <div class="item-title" style="font-size:11px;">'+z[i]['deskripsi']+'</div>';
					html += 			'</div>';
					html += 		'</li>';
					html += 	'</a>';

					$("#isi_container_notifikasi").append(html);
				}
				
			}
		}).fail(function(x){
			myApp.alert("Pengambilan postingan teman gagal", 'Perhatian!');
		}); 
	}

	function gotoFriendNotif(id_user,id,komentar,type) {
	//mainView.router.loadPage('notif.html');
	/*
	if(type=="post")
	{
		saveData( "notif_id_user",id_user);
		saveData( "notif_id",id);
		saveData( "notif_komentar",komentar);
		//console.log(getData("notif_id"));
		gotoProfilTeman(id_user);
	}
	else if(type.includes("grup"))
	{
		var temps =s.split('/');
		var id_grup =temps[1];
		saveData( "notif_id",id);
		saveData( "notif_komentar",komentar);
		gotoGroup(id_grup);
	}
	else if(type=="event")
	{
		saveData( "notif_komentar",komentar);
		detailEvent(id);
	}
	else if(type=="jualbeli")
	{
		saveData( "notif_id",id);
		saveData( "notif_komentar",komentar);
		gotoJualBeli();
	}*/
	//console.log("dipanggil");
	myApp.closePanel();
	saveData( "notif_id_user",id_user);
	saveData( "notif_id",id);
	saveData( "notif_komentar",komentar);
	saveData( "notif_type",type);
	var temps =type.split('/');
	var id_grup =temps[1];
	if(type.includes("grup"))
	{
		saveData( "notif_id_grup",id_grup);
	}
	mainView.router.reloadPage('notif.html');
	//mainView.router.loadPage('notif.html');
	//mainView.router.refreshPage('notif.html');
	/*
	if(type=="post")
	{
		myApp.showPreloader('Mengambil data...');
		mainView.router.loadPage('notif.html');
		var link=urlnya+'/api/post/getPostById?id='+id;
		$.ajax({ dataType: "jsonp",
			url: link,
			type: 'GET',
			contentType: false,
			processData: false
		}).done(function(z){
			myApp.closeModal();
			var dataLength=0;
			console.log(z);
			for (var ii = 0 ; ii < z.length; ii++) 
			{
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
					html += 				"<td rowspan='2' width='10%'>";
					html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
					html += 				"</td>";
					html += 				"<td style='font-weight:bold;'>"+z[i]['nama']+"</td>";
					if(z[i]['nama']==getData("active_user_nama"))
					{
						html += 				"<td style='font-weight:bold;'><i onclick='editPostProfile(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
						html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusDataProfile(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
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
					html += 		"<div id='kolom_komentar_teman_"+z[i]['id']+"'>";
					html += 		"</div>";
					html += 			"<div id='btn_komentari_teman_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariTemanPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
					html += 			"<p><a href='#' onclick='bacaTemanKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
					html += 	"</div>";
						//console.log(html);

						$(document).ready(function(){
							$("#isi_postingan_notif").append(html);
						});
					}
					else
					{

						var html=	"<div id='posting_teman_"+z[i]['id']+"' style='margin-bottom:50px;'>";
						html += 		"<table id='table_teman_"+z[i]['id']+"' style='background-color:white;'  width='100%;'>";
						html += 			"<tr>";
						html += 				"<td rowspan='2' width='10%'>";
						html += 					"<img class='lazy' src='data:image/jpeg;base64,"+z[i]['user_foto']+"' class='profilePicture' style='padding:0px; margin-right:-20px; margin-bottom:-10px; position:relative; top:-5px;' width='30'>";
						html += 				"</td>";
						html += 				"<td style='font-weight:bold;'>"+z[i]['nama']+"</td>";
						if(z[i]['nama']==getData("active_user_nama"))
						{
							html += 				"<td style='font-weight:bold;'><i onclick='editPostProfile(this.id)' id='"+z[i]['id']+"' class='fa fa-caret-square-o-down' aria-hidden='true'></i></td>";
							html += 				"<td style='font-weight:bold;'><i onclick='pilihanHapusDataProfile(this.id)' id='"+z[i]['id']+"' class='fa fa-minus' aria-hidden='true'></i></td>";
						}
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td style='font-size:10px;'>"+z[i]['created_at']+"</td>";
						html += 			"</tr>";
						html += 			"<tr>";
						html += 				"<td colspan='4'>"+z[i]['deskripsi']+"</td>";
						html += 			"</tr>";
						html += 		"</table>";
						html += 		"<div id='kolom_komentar_teman_"+z[i]['id']+"'>";
						html += 		"</div>";
						html += 			"<div id='btn_komentari_teman_"+z[i]['id']+"'><p><a href='#' class='button' onclick='komentariTemanPost(this.id);' id='"+z[i]['id']+"' style='margin-right:5%; margin-top:-10px; float:right; width:100px;'>Komentari</a></p></div>";
						html += 			"<p><a href='#' onclick='bacaTemanKomentar(this.id);' id='"+z[i]['id']+"' style='margin-top:-5px; float:right; margin-right:10px;'>"+z[i]["count_komentar"]+" Komentar</a></p>";
						html += 	"</div>";
						//console.log(html);
						$(document).ready(function(){
							$("#isi_postingan_notif").append(html);
						});
					}
				}
			}

		}).fail(function(x){
			myApp.closeModal();
			myApp.alert("Pengambilan postingan teman gagal", 'Perhatian!');
		}); 

	}
	else if(type.includes("grup"))
	{
	}
	else if(type=="event")
	{
	}
	else if(type=="jualbeli")
	{
	}
	*/
}