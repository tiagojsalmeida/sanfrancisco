/*
 * WEBSERVICE
 */

var webservice = {
	basePath: 'http://webservices.nextbus.com/service/publicXMLFeed?',
	agency: 'sf-muni',
	formatUrl: function( data ){
		return this.basePath + $.param(data);
	},
	serviceAjax: function ( url, storage, objectName, formatData ){
		var self = this;
		$.ajax({
			url: url,
			dataType: 'xml',
			async: false
		}).done( function( response ){
			if(response){
				var json = $.xml2json(response.documentElement);
				if( json.body ){
					if( typeof formatData === "function" )
						json.body = formatData( json.body );
					if(storage){
						if( objectName ){
							self[storage][objectName] = json.body;
						} else {
							self[storage] = json.body;
						}
					}

				}

			}
		});
	},
	routeConfigStorage: [],
	routeConfigUrl: function( routeTag ){
		var routeConfigData = {
			command: 'routeConfig',
			a: this.agency
		};
		if( routeTag ){
			routeConfigData['r'] = routeTag;
		}
		return this.formatUrl(routeConfigData);
	},
	routeConfigAjax: function( routeTag ){
		this.serviceAjax( this.routeConfigUrl( routeTag ), 'routeConfigStorage', routeTag, this.routeConfigAjaxFormat );
		return this.routeConfigStorage;

	},
	routeConfigAjaxFormat: function(data){
		if( data.route ){
			var auxData = {};
			$.each( data.route, function(k,v){
				auxData[ v.$.tag ] = v;
			});
			return auxData;
		}
		return data;
	},
	vehicleLocationsStorage: [],
	vehicleLocationsStorageToUpdate: [],
//	vehicleLocationsLastTime: new Date().valueOf() - 45000, //DEBUG
	vehicleLocationsLastTime: 0,
	vehicleLocationsUrl: function( routeTag, time ){
		var vehicleLocationslData = {
			command: 'vehicleLocations',
			a: this.agency,
			t: time
		};
		if( routeTag ){
			vehicleLocationslData['r'] = routeTag;
		}
		return this.formatUrl(vehicleLocationslData);
	},
	vehicleLocationsAjax: function( routeTag ){
		this.serviceAjax( this.vehicleLocationsUrl( routeTag, this.vehicleLocationsLastTime ), 'vehicleLocationsStorageToUpdate', null, this.vehicleLocationsAjaxFormat );
		this.vehicleLocationsLastTime = new Date().valueOf();
//		if(routeTag){
//			return this.vehicleLocationsStorage[ routeTag ];
//		}
		return this.vehicleLocationsStorage;
	},
	vehicleLocationsAjaxFormat: function( data ){
		if( data.vehicle ){
			$.each( data.vehicle, function(k,v){
				var storageKey = false;
				if( !v || !v.$ )
					return false;
				$.grep(webservice.vehicleLocationsStorage, function(storage, key){
					if( !storage || !storage.$ )
						return false;
					var equal = storage.$.id == v.$.id;
					if(equal)
						storageKey = key;
					return equal;
				});
				if( storageKey !== false ){
					webservice.vehicleLocationsStorage[storageKey] = v;
				} else {
					webservice.vehicleLocationsStorage.push( v );
				}
			});
		}
		return webservice.vehicleLocationsStorage;
	}
};