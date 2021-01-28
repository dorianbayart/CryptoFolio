window.addEventListener('load', function () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js')
			.then(function (reg) {
				console.log('[ServiceWorker] Registered', reg);
			}).catch(function (error) {
				console.error('[ServiceWorker] Not registered', error);
			});
	
	}
	handleStateChange();
	
	document.getElementById("addButton").addEventListener("click", function(){
		add();
	});
	
	$.ajax({
		url: "https://api.ethplorer.io/getAddressInfo/0x0255c9d3850caca1152aeb20425c264787661692?apiKey=freekey",
		dataType: 'json',
		success: function (data) {
			console.log(data);
			generateContent(data);
		},
		error: function (e) {
			console.log(e);
		}
	});
});

window.addEventListener('online', handleStateChange);
window.addEventListener('offline', handleStateChange);

function handleStateChange() {
	var connexionStatusTarget = document.getElementById('connexion_status');
	var materialIcon = navigator.onLine ? 'signal_cellular_4_bar' : 'signal_cellular_connected_no_internet_4_bar';
	var label = navigator.onLine ? 'Online' : 'Offline';
	var color = navigator.onLine ? 'color-green' : 'color-red';
	connexionStatusTarget.innerHTML = '<i class="material-icons ' + color + '">' + materialIcon + '</i><span class="label">' + label + '</span>';
}

function add() {
	console.log('Add button clicked');
}

function generateContent(data) {
	var text = $(readJson(data));
	$('#content').html("").append(text);
}


function readJson(data) {
	var text = "";
	$.each(data, function (key, val) {
		if (typeof val == 'object') {
			text += "<div class='" + key + "'>" + readJson(val) + "</div>";
		} else {
			if (val !== null && val != "") text += "<span id='" + key + "'>" + val + "</span>";
		}
	});
	return text;
}
