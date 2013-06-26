var ul = {};
ul.enc = encodeURIComponent;
ul.dec = decodeURIComponent;
ul.store = function(key, value) {
	if (!key) {
		var d = {};
		for (var i = 0; i < localStorage.length; i ++) {
			var k = localStorage.key(i);
			d[k] = JSON.parse(localStorage.getItem(k));
		}
		return d;
	}
	else if (value === undefined) {
		return JSON.parse(localStorage.getItem(key) || null);
	}
	else if (value === null) {
		localStorage.removeItem(key);
	}
	else {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
ul.name = function(name, obj) {
	var s = name.split("/");
	var o = obj, i = 0;
	while (i < s.length && o) {
		if (s[i].substr(0, 1) == ':') {
			var a = s[i++].substr(1);
			if (!ul.name[a]) // check if this mathod has been cached
				ul.name[a] = Function("o", "return "+a+"(o)");
			o = ul.name[a](o);
		}
		else
			o = o[s[i++]];
	}
	return o || "";
}
ul.format = function(str, obj, cb) {
	var reg = /{([^{}]+)}/gm;
	return str.replace(reg, function(match, name) {
		return ul.name(name, obj);
	});
}
ul.join = function(ls, str, conn) {
	var s = "", c = conn ? conn.toString() : '';
	for (var i in ls) {
		var t = ul.format(str, {k:i, v:ls[i]});
		s += s ? c + t : t;
	}
	return s;
}
ul.index = function(ls, value, name) {
	for (var i in ls) {
		var v = name ? ul.name(name, ls[i]) : ls[i];
		if (v == value) return ls.length ? parseInt(i) : i;
	}
	return -1;
}
