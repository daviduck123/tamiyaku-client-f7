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
	}
}