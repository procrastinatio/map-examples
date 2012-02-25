OpenLayers.Format.GoogleFusion = OpenLayers.Class(OpenLayers.Format.GeoJSON, {
    read: function (json, type, filter) {
        type = (type) ? type : "FeatureCollection";
        var results = null;
        var obj = null;
        if (typeof json == "string") {
            obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json, filter]);
        } else {
            obj = json;
        }
        if (!obj) {
            OpenLayers.Console.error("Bad JSON: " + json);

        } else {

            /*var format = new OpenLayers.Format.GeoJSON({
                ignoreExtraDims: true,
                'internalProjection': new OpenLayers.Projection("EPSG:21781"),
                'externalProjection': new OpenLayers.Projection("EPSG:4326")
                });  */
            var table = json.table;
            var geom_idx = OpenLayers.Util.indexOf(table.cols, 'geometry');
            var cols_nb = table.cols.length;

            if (geom_idx > -1) {
                results = [];
                for (var i = 0, rows_nb = table.rows.length; i < rows_nb; i++) {
                    var row = table.rows[i];
                    var geom = row[geom_idx];
                    if (geom) {
                        var feature = new OpenLayers.Feature.Vector();
                        if (cols_nb > 1) {

                            for (var c = 0; c < cols_nb; c++) {
                                if (c != geom_idx) {
                                    feature.attributes[table.cols[c]] = row[c];
                                }

                            }
                        };
                        try {
                            feature.geometry = this.parseGeometry(geom);
                            // format.read(geom, "Geometry"); // //
                        } catch (err) {
                            OpenLayers.Console.error(err);
                        }

                        results.push(feature);


                    }
                }

            }
        }

        return results;

    },
    CLASS_NAME: "OpenLayers.Format.GoogleFusion"

});