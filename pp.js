var errorText = {
	20: "Text Too Long",
	30: "Can not Translate this text",
	40: "Unknown Language",
	50: "Invalid Key"
}

function trans() {
	var t = $("#text"), r = $("#result").html("<h4><center>loading...</center></h4>"),
		v = t.val().replace(/^\s*/, "").replace(/\s*$/, "");
	function load(d) {
		r.html(d.errorCode > 0 ?
			"translate error: "+(errorText[d.errorCode] || "Unknown Error")+"(code "+d.errorCode+")" :
			ul.format('<div class="basic"><h3>{translation/:ul.join(o, ul.dec("'+ul.enc('{v}')+'"), ", ");} '+
						'<span class="phonetic">{basic/phonetic/:"&frasl;"+o+"&frasl;";}</span>'+
					'</h3>'+
					'<p>{basic/explains/:ul.join(o, ul.dec("'+ul.enc('<div>{v}</div>')+'"), "");}</p>'+
				'</div>'+
				'<div class="ext"><h4>{web/:"Web Explainations ("+o.length+")";}</h4>'+
					'{web/:ul.join(o, ul.dec("'+ul.enc('<p class="web"><strong>{v/key}</strong>: {v/value}</p>')+'"), "");}'+
				'</div>', d));
	}
	if (v) return v == ul.store("last-value") ?
		load(ul.store("last-data")) :
		$.getJSON("http://fanyi.youdao.com/openapi.do", {
			keyfrom: "exDict",
			key: 1290470647,
			type: "data",
			doctype: "json",
			version: 1.1,
			q: v
		}, function(d) {
			ul.store("last-value", v);
			ul.store("last-data", d);
			load(d);
		});
}
function wait(t) {
	if (window.timeOut) clearTimeout(window.timeOut);
	if (window.xhr) window.xhr.abort() && (window.xhr = null);
	window.timeOut = setTimeout(function() {
		window.timeOut = 0;
		window.xhr = trans();
	}, t);
}
$(document).ready(function(e) {
	$("form").bind("submit", function(e){wait(0)});
	$("#text").bind("keyup", function(e){wait(500)}).focus().select();
	$("#paste").click(function(e){
		$("#text").focus().select();
		document.execCommand("paste") && wait(0)
		$("#text").focus().select();
	}).trigger("click");
	if (!location.hash) // used in popup, should cancel last notify
		chrome.extension.sendMessage("cancelNotify");
})
