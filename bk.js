var menuId = "exDict-select";

chrome.contextMenus.create({
	id: menuId,
	title: "translate '%s'",
	contexts: ['selection']
});
chrome.extension.onMessage.addListener(function(m, s) {
/*
	if (m == 'Rmousedown') setTimeout(function() {
		chrome.contextMenus.update(menuId, {
			title: "translating '%s'" + (new Date()).getTime()
		})
	}, 1000);
*/
	if (m == 'cancelNotify') window.notify && window.notify.cancel();
});
chrome.contextMenus.onClicked.addListener(function(d, t) {
	var i = document.getElementById("input");
	if (!i) i = document.createElement("input");
	if (!i.parentNode) document.body.appendChild(i);
	i.value = d.selectionText;
	i.select();
	document.execCommand('copy', false, null);

	window.notify = webkitNotifications.createHTMLNotification("nt.html#result");
	window.notify.replaceId = menuId;
	window.notify.show();
/*
	window.timeout = setTimeout(function() {
		window.notify.close();
		window.notify = null;
		window.timeout = 0;
	}, 10000);
*/
/*
	if (window.xhr) window.xhr.abort();
	window.xhr = $.getJSON("http://fanyi.youdao.com/openapi.do", {
		keyfrom: "exDict",
		key: 1290470647,
		type: "data",
		doctype: "json",
		version: 1.1,
		q: d.selectionText
	}, function(d) {
		window.xhr = null;
		webkitNotifications.createNotification('',
			ul.format('{translation/:ul.join(o, ul.dec("'+ul.enc('{v}')+'"), ", ");} '+
						'<small>{basic/phonetic/:"&frasl;"+o+"&frasl;";}</small>', d),
			ul.format('{basic/explains/:ul.join(o, ul.dec("'+ul.enc('<div>{v}</div>')+'"), "");}', d)).show();
	});
*/
/*
	chrome.extension.sendMessage("Rmousedown");
	var e = document.createEvent("KeyboardEvent");
	e.initKeyboardEvent("keypress", // event type : keydown, keyup, keypress
		true, // bubbles
		true, // cancelable
		window, // viewArg: should be window
		true, // ctrlKeyArg
		false, // altKeyArg
		true, // shiftKeyArg
		false, // metaKeyArg
		0, // keyCodeArg : unsigned long the virtual key code, else 0
		80 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
	);
	document.dispatchEvent(e);
	var e = new KeyboardEvent("keypress", {"char": "p", shiftKey: true});

	document.execCommand("copy");
	setTimeout(function() {
		chrome.contextMenus.update(menuId, {title: 'translated'});
	}, 1000)
*/
})
/*
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	$.getJSON("http://fanyi.youdao.com/openapi.do", {
		keyfrom: "exDict",
		key: 1290470647,
		type: "data",
		doctype: "json",
		version: 1.1,
		q: text
	}, function(d) {
		suggest([
			{content: text + " one", description: "the first one: " + d.errorCode},
			{content: text + " number two", description: "the second entry" + text}
		]);
	});
});
chrome.omnibox.onInputEntered.addListener(function(text) {
	$.getJSON("http://fanyi.youdao.com/openapi.do", {
		keyfrom: "exDict",
		key: 1290470647,
		type: "data",
		doctype: "json",
		version: 1.1,
		q: text
	}, function(d) {
		alert('You just typed "' + text + '"(' + d.errorCode + ')');
	});
});
*/
