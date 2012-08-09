
var iv= null;
function init() {
        iv= Geoportal.load(

            'map',  // div's Id

            ['eea9jrs62eft16v6ndgnc5bn'], // API's keys:
            {// map's center :

                lon:6.44,

                lat:46.81
            },14,
	    {language:'fr',
	       layers:[ 'GEOGRAPHICALGRIDSYSTEMS.MAPS']
	    }
        );
    };