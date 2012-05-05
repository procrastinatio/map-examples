OpenLayers.Format.Panoramio = OpenLayers.Class(OpenLayers.Format.JSON, {
                read: function(json) { 
                    var obj = null;
                    if (typeof json == "string") {
                        obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json]);
        } else { 
            obj = json;
        }    
                    if(!obj.count) {
                        throw new Error('Panoramio failure response');
                    }
                    if(!obj || !obj.photos ||
                       !OpenLayers.Util.isArray(obj.photos)) {
                        throw new Error(
                            'Unexpected Panoramio response');
                    }
                    var photos = obj.photos, photo,
                        x, y, point,
                        feature, features = [];
                    for(var i=0,l=photos.length; i<l; i++) {
                        photo = photos[i];
                        x = photo.longitude;
                        y = photo.latitude;
                        point = new OpenLayers.Geometry.Point(x, y);
                        feature = new OpenLayers.Feature.Vector(point, {
                            title: photo.photo_title,
                            img_url: photo.photo_file_url
                        });
                        features.push(feature);
                    }
                    return features;
                }
            });