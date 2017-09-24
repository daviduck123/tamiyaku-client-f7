function editProfileSimpan()
{
	//myApp.showPreloader('Mengambil data...');
	var id_user = getData("active_user_id");
	
	var nama = document.getElementById("nama_editProfile").value;
	var password = document.getElementById("password_editProfile").value;
	var con_password = document.getElementById("con_password_editProfile").value;
	var id_kota = $('#kota_editProfile').find(":selected").val();
	var fileinput = document.getElementById("file_editProfile").value;
	
	
	var gender = "";
	var radios = document.getElementsByName('gender_editProfile') ;
	for (var i = 0, length = radios.length; i < length; i++) 
	{
		if (radios[i].checked) 
		{
			gender =radios[i].value;
			break;
		}
		else
		{
			gender="";
		}
	}
	
	if(nama=="")
	{
		myApp.alert('Silahkan isi nama anda', 'Perhatian!');
	}
	else
	{
		if(id_kota=="" || id_kota==0 || id_kota=="0")
		{
			myApp.alert('Silahkan pilih kota anda', 'Perhatian!');
		}
		else
		{
			if(password.length < 8 && password.length >=1)
			{
				myApp.alert('Password mininal 8 karakter', 'Perhatian!');
			}
			else
			{
				if(con_password!=password)
				{
					myApp.alert('Password dan Konfirmasi Password tidak sama', 'Perhatian!');
				}
				else
				{
					if(gender=="")
					{
						myApp.alert('Silahkan pilih gender anda', 'Perhatian!');
					}
					else
					{
						var kelas = document.getElementsByName('kelas_editProfile');
						var i;
						var update = false;
						var id_kelas = [];
						for (i = 0; i < kelas.length; i++) {
							if (kelas[i].checked) 
							{
								if(i == 0){
									id_kelas.push(1);
								}
								else if(i == 1){
									id_kelas.push(2);
								}else if(i == 2){
									id_kelas.push(3);
								}
								update = true;
							}
						}
						if(!update){
							myApp.alert('Silahkan pilih kelas anda', 'Perhatian!');
							return;
						}

						var blob=$("#file_editProfile")[0].files[0];
						var formData = new FormData();
						formData.append("nama", nama);
						formData.append("jenis_kelamin", gender);
						if(password.length>0)
						{
							console.log(password);
							formData.append("password", password);
						}
						formData.append("id_kota", id_kota);
						formData.append("id_kelas", id_kelas);
						formData.append("id_user", id_user);
						formData.append("file", blob);
						
						var link=urlnya+'/api/user/updateUser';
						//console.log(formData);
						
						//for (var z[ii] of formData.entries()) {
						//	console.log(z[ii][0]+ ', ' + z[ii][1]); 
						//}
						myApp.showPreloader('Update profile...');
						$.ajax({
							url: link,
						data: formData,
								type: 'POST',
						contentType: false,
							processData: false
						}).done(function(z){
							saveData("active_user_kelas",id_kelas[0]);
							saveData("active_user_nama",nama);
							saveData("active_user_kota",id_kota);
							saveData("active_user_jenis_kelamin",gender);

							globalListKelas = [];
							$.ajax({ dataType: "jsonp",
								url: urlnya+'/api/kelas/getAllByUserId?id_user='+id_user,
								type: 'GET',
								contentType: false,
								processData: false
							}).done(function(data){
								if(data.length > 0){
									for(var zzz = 0 ; zzz < data.length ; zzz++){
										if(data[zzz]['id_kelas'] === "1"){
											globalListKelas.push({"1":"STB"});
										}else if(data[zzz]['id_kelas'] === "2"){
											globalListKelas.push({"2":"STO"});
										}else if(data[zzz]['id_kelas'] === "3"){
											globalListKelas.push({"3":"Speed"});
										}
									}
								}else{
									globalListKelas = [];
								}
								$(".profilePicture").attr('src','data:image/jpeg;base64,'+getImage('profilePic'));
								myApp.closeModal();
							});
							
							var link=urlnya+'/api/user/getUserByIdUser?id_user='+id_user;
							console.log(link);
							$.ajax({ dataType: "jsonp",
								url: link,
								type: 'GET',
								contentType: false,
								processData: false
							}).done(function(z){
								myApp.closeModal();
								saveData("profilePic",z.foto);
								myApp.closeModal();
								mainView.router.loadPage('home.html');
								myApp.alert('Profil berhasil diubah', 'Berhasil!');
							}).fail(function(x){
								myApp.alert("Pengambilan profile gagal", 'Perhatian!');
							}); 
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