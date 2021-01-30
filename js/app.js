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
	getEthplorerInfo("0x5ac9e070d28f7d8f36dab4773dfffac2fa6548f0");
	
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
	$('#content')/*.html("")*/.append(text);
}


function readJson(data) {
	var text = "<div class='address'>Address: " + data.address + "</div>";
	text += "<div class='token ETH'><span id='name'>ETH</span>: <span id='balance'>" + cryptoRound(data.ETH.balance) + "</span> <span id='symbol'>ETH</span> | <span id='usd-balance'>$" + fiatRound(data.ETH.balance * data.ETH.price.rate) + "</span></div>";
	$.each(data.tokens, function (number, token) {
		text += "<div class='token "+token.tokenInfo.symbol+"'>";
		text += "<span id='name'>"+token.tokenInfo.name+"</span>";
		text += "<span id='balance'>"+ cryptoBalance(token.balance, token.tokenInfo.decimals) + "</span>";
		text += "<span id='symbol'>" + token.tokenInfo.symbol + "</span>";
		if(token.tokenInfo.price) {
		   text += " | <span id='usd-balance'>$" + fiatBalance(token.balance, token.tokenInfo.decimals, token.tokenInfo.price.rate) + "</span>";
		}
		text += "</div>";
	});
	return text;
}

function cryptoBalance(cryptoValue, cryptoDecimals) {
	return cryptoRound(cryptoValue * Math.pow(10, 0 - cryptoDecimals));
}

function fiatBalance(cryptoValue, cryptoDecimals, rate) {
	return fiatRound(cryptoValue * Math.pow(10, 0 - cryptoDecimals) * rate);
}

function cryptoRound(value) {
	return Math.round(value * 100000) / 100000;
}

function fiatRound(value) {
	return Math.round(value * 100) / 100;
}
