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
	
	getEthplorerInfo("0x0255c9d3850caca1152aeb20425c264787661692");
	
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

function getEthplorerInfo(address) {
	$.ajax({
		url: "https://api.ethplorer.io/getAddressInfo/" + address + "?apiKey=freekey",
		dataType: 'json',
		success: function (data) {
			console.log(data);
			generateContent(address, data);
		},
		error: function (e) {
			console.log(e);
		}
	});
}

function generateContent(address, data) {
	var text = "<div id='"+address+"'>" + readJson(data) + "</div>";
	$('#content').html("").append(text);
}


function readJson(data) {
	var text = "<div class='address'>Address: " + data.address + "</div>";
	text += "<div class='balance'><span id='eth-balance'>ETH: " + data.ETH.balance + "</span> | <span id='usd-balance'>$" + data.ETH.balance * data.ETH.price.rate + "</span></div>";
	$.each(data.tokens, function (number, token) {
		text += "<div class='"+token.tokenInfo.symbol+"'>";
		text += "<span id='"+token.tokenInfo.symbol+"-balance'>"+token.tokenInfo.name+": " + token.balance * Math.pow(10, 0 - token.tokenInfo.decimals) + "</span>";
		if(token.tokenInfo.price) {
		   text += " | <span id='usd-balance'>$" + token.balance * Math.pow(10, 0 - token.tokenInfo.decimals) * token.tokenInfo.price.rate + "</span>";
		}
		text += "</div>";
	});
	return text;
}
