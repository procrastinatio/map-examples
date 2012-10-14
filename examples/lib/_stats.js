var _gauges = _gauges || [];

(function() {
    
   // clicky
   document.write('<scr' + 'ipt type="text/javascript" src="//static.getclicky.com/js"></scr' + 'ipt>');
    document.write(
        '<scr' + 'ipt>' +
            'try{ clicky.init(100534977); ' +
                '}catch(e){};' +
        '</scr' + 'ipt>');
    
    //gaug.es
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', '50734336f5a1f54dbb000033');
    t.src = '//secure.gaug.es/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
    
})();