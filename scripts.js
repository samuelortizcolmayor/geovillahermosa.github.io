// =============================
// MAPA INICIAL
// =============================
var map = L.map('map', { zoomControl: true }).setView([6.24, -75.58], 13);

// =============================
// MAPAS BASE
// =============================
var baseLayers = {
    imagery: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
    ),
    dark: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20 }
    ),
    streets: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; OpenStreetMap', maxZoom: 20 }
    ),
    topo: L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; OpenTopoMap', maxZoom: 17 }
    ),
    light: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20 }
    ),
    voyager: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20 }
    ),
    esriTopo: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 20 }
    ),
    esriGray: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 16 }
    )
};

var activeBaseLayer = baseLayers.imagery;
activeBaseLayer.addTo(map);

// =============================
// CONFIGURACIÓN DE CAPAS
// =============================
var capasConfig = [
    { key: 'barrio_villahermosa',     nombre: 'barrio villahermosa',     url: 'data/barrio_villahermosa.json' },
    { key: 'construcciones_bvh',      nombre: 'construcciones',      url: 'data/construcciones_bvh.json' },
    { key: 'viviendas_totales__proyec',nombre: 'viviendas totales proyectadas',url: 'data/viviendas_totales__proyec.json' },
    { key: 'estrato_SE',              nombre: 'estrato economico',              url: 'data/estrato_SE.json' },
    { key: 'estadistica_manzana_vh',  nombre: 'estadistica por manzana',  url: 'data/estadistica_manzana_vh.json' },
    { key: 'red_hidrica',             nombre: 'red hidrica',             url: 'data/red_hidrica.json' },
    { key: 'redhidrica_buffer',      nombre: 'red hidrica buffer',        url: 'data/redhidrica_buffer.json' },
    { key: 'pot48_usos_generales',    nombre: 'POT 48 usos generales',    url: 'data/pot48_usos_generales.json' },
    { key: 'usos_del_predio',         nombre: 'usos del predio',          url: 'data/usos_del_predio.json' },
    { key: 'establecimientos_industria_comercio', nombre: 'establecimientos industria y comercio', url: 'data/establecimientos_industria_comercio.json' },
    { key: 'zonas_geoeconomicas',      nombre: 'zonas geoeconomicas',      url: 'data/zonas_geoeconomicas.json' },
    { key: 'lotes_samu',               nombre: 'lotes',                    url: 'data/Lotes_Samu.geojson' }
];

var estilosCapas = {
    barrio_villahermosa:      { color: '#FF3B3B', fillColor: '#FF3B3B', weight: 2, fillOpacity: 0.2, opacity: 1, dashArray: '' },
    construcciones_bvh:       { color: '#00FF88', fillColor: '#00FF88', weight: 2, fillOpacity: 0.2, opacity: 1, dashArray: '' },
    viviendas_totales__proyec:{ color: '#00D4FF', fillColor: '#00D4FF', weight: 2, fillOpacity: 0.2, opacity: 1, dashArray: '' },
    estrato_SE:               { color: '#FFD700', fillColor: '#FFD700', weight: 2, fillOpacity: 0.2, opacity: 1, dashArray: '' },
    estadistica_manzana_vh:   { color: '#FF6BFF', fillColor: '#FF6BFF', weight: 2, fillOpacity: 0.2, opacity: 1, dashArray: '' },
    red_hidrica:              { color: '#2EA8FF', fillColor: '#2EA8FF', weight: 2, fillOpacity: 0.12, opacity: 1, dashArray: '' },
    redhidrica_buffer:        { color: '#4CD3FF', fillColor: '#4CD3FF', weight: 1.5, fillOpacity: 0.16, opacity: 0.9, dashArray: '' },
    pot48_usos_generales:     { color: '#F6C445', fillColor: '#F6C445', weight: 2, fillOpacity: 0.22, opacity: 1, dashArray: '' },
    usos_del_predio:          { color: '#29F19C', fillColor: '#29F19C', weight: 2, fillOpacity: 0.75, opacity: 1, dashArray: '' },
    establecimientos_industria_comercio: { color: '#FF7A45', fillColor: '#FF7A45', weight: 2, fillOpacity: 0.75, opacity: 1, dashArray: '' },
    zonas_geoeconomicas:      { color: '#A77CFF', fillColor: '#A77CFF', weight: 2, fillOpacity: 0.24, opacity: 1, dashArray: '' },
    lotes_samu:               { color: '#F7FF4A', fillColor: '#F7FF4A', weight: 1.2, fillOpacity: 0.12, opacity: 0.95, dashArray: '' }
    


};

var estilosOriginales = JSON.parse(JSON.stringify(estilosCapas));

var capasGeoJSON   = {};
var capasLeaflet   = {};
var capasVisibles  = {};
var popupCampos    = {}; // campos activos por capa para popup
var etiquetasConfig = {};
var elementoSeleccionado = null;
var estiloSeleccionPrevio = null;
var capaTablaActual = null;

var GOOGLE_STREET_VIEW_API_KEY = ''; // Configura aqui tu API key de Google Maps Embed API.

var ICONOS_MARKER = [
    { id: 'pin', nombre: 'Pin', simbolo: '•', color: '#00d4ff' },
    { id: 'casa', nombre: 'Casa', simbolo: 'H', color: '#00ff88' },
    { id: 'alerta', nombre: 'Alerta', simbolo: '!', color: '#ff3b3b' },
    { id: 'agua', nombre: 'Agua', simbolo: '~', color: '#00a8ff' },
    { id: 'obra', nombre: 'Obra', simbolo: '+', color: '#ffaa00' },
    { id: 'servicio', nombre: 'Servicio', simbolo: 'S', color: '#cc44ff' }
];
var iconoMarkerActivo = ICONOS_MARKER[0].id;
var capasCreadas = {};
var contadorCapasCreadas = 0;
var CAPAS_CREADAS_KEY = 'capas_creadas';
var graficaAtributosChart = null;
var ultimoAnalisisEstadistico = null;
var categoriasGeneradas = {};
var categorizacionesGuardadas = [];
var capasAnalisis = {};
var contadorCapasAnalisis = 0;
var casosObservacion = [];
var capaFiltroResultados = null;
var capaAlertasResultados = null;
var alertaResultados = [];
var alertaCategoriaActiva = null;
var capasPuntosLivianos = {
    usos_del_predio: true,
    establecimientos_industria_comercio: true
};

// =============================
// RELOJ
// =============================
function actualizarReloj() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clockDisplay').textContent = h + ':' + m + ':' + s;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// =============================
// STATS TOPBAR
// =============================
map.on('zoomend', function() {
    document.getElementById('statZoom').textContent = map.getZoom();
});

map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(4);
    var lng = e.latlng.lng.toFixed(4);
    document.getElementById('statCoords').textContent = lat + ', ' + lng;
});

function actualizarStatCapas() {
    var total = Object.keys(capasLeaflet).length;
    document.getElementById('statCapas').textContent = total;
}

var streetViewFrameInicial = document.getElementById('streetViewFrame');
if (streetViewFrameInicial && streetViewFrameInicial.getAttribute('src')) {
    document.getElementById('streetViewPanel').classList.add('has-view');
}

// =============================
// POPUP DESDE ATRIBUTOS (con filtro de campos)
// =============================
function popupDesdeAtributos(feature, capaKey) {
    if (!feature.properties) return '<div class="popup-inner"><p>Sin atributos</p></div>';

    var campos = popupCampos[capaKey];
    var usarCampos = campos && campos.length > 0;

    var html = '<div class="popup-inner">';
    html += '<div class="popup-header">' + htmlSeguro(nombreCapaPorKey(capaKey).toUpperCase()) + '</div>';

    for (var campo in feature.properties) {
        if (usarCampos && campos.indexOf(campo) === -1) continue;
        var val = feature.properties[campo];
        if (val === null || val === undefined) val = '—';
        html += '<div class="popup-row"><span class="popup-key">' + campo + '</span><span class="popup-val">' + val + '</span></div>';
    }

    html += '</div>';
    return html;
}

function htmlSeguro(valor) {
    return String(valor === null || valor === undefined ? '' : valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function nombreCapaPorKey(key) {
    var cfg = capasConfig.find(function(c) { return c.key === key; });
    return cfg ? cfg.nombre : key;
}

function obtenerTipoLayer(layer) {
    if (layer instanceof L.Marker) return 'marker';
    if (layer instanceof L.Circle) return 'circle';
    if (layer instanceof L.Rectangle) return 'rectangle';
    if (layer instanceof L.Polygon) return 'polygon';
    if (layer instanceof L.Polyline) return 'polyline';
    return 'feature';
}

function obtenerCamposCapa(key) {
    var geojson = obtenerGeoJSONCapa(key);
    if (!geojson || !geojson.features || !geojson.features[0] || !geojson.features[0].properties) return [];
    return Object.keys(geojson.features[0].properties);
}

function obtenerCentroLayer(layer) {
    if (layer.getLatLng) return layer.getLatLng();
    if (layer.getBounds) return layer.getBounds().getCenter();
    return map.getCenter();
}

function obtenerGeoJSONCapa(key) {
    if (key === CAPAS_CREADAS_KEY) return construirGeoJSONCapasCreadas();
    return capasGeoJSON[key];
}

function obtenerNombreSelector(key) {
    if (key === CAPAS_CREADAS_KEY) return 'Capas creadas';
    return nombreCapaPorKey(key);
}

function calcularMetricasLayer(layer, tipo) {
    var metricas = {
        area_m2: null,
        longitud_m: null,
        perimetro_m: null,
        radio_m: null
    };

    if (tipo === 'polyline') {
        metricas.longitud_m = calcularLongitud(layer.getLatLngs());
    }
    if (tipo === 'polygon' || tipo === 'rectangle') {
        var lls = layer.getLatLngs()[0] || [];
        metricas.area_m2 = calcularAreaGeodesica(lls);
        metricas.perimetro_m = calcularPerimetro(lls);
    }
    if (tipo === 'circle') {
        var r = layer.getRadius();
        metricas.radio_m = r;
        metricas.area_m2 = Math.PI * r * r;
        metricas.perimetro_m = 2 * Math.PI * r;
    }
    return metricas;
}

function actualizarAtributosCapaCreada(id) {
    var reg = capasCreadas[id];
    if (!reg) return;
    var metricas = calcularMetricasLayer(reg.layer, reg.tipo);
    reg.atributos = Object.assign({}, reg.atributos || {}, metricas, {
        id: id,
        nombre: reg.nombre,
        descripcion: reg.descripcion || '',
        tipo: reg.tipo
    });
    if (reg.layer) reg.layer.feature = { type: 'Feature', properties: reg.atributos };
}

function construirGeoJSONCapasCreadas() {
    return {
        type: 'FeatureCollection',
        features: Object.keys(capasCreadas).map(function(id) {
            actualizarAtributosCapaCreada(id);
            var reg = capasCreadas[id];
            var geo = reg.layer.toGeoJSON ? reg.layer.toGeoJSON() : { type: 'Feature', geometry: null };
            geo.properties = Object.assign({}, reg.atributos, { _createdId: id });
            return geo;
        })
    };
}

function hayCapasCreadas() {
    return Object.keys(capasCreadas).length > 0;
}

// =============================
// CARGAR CAPA GEOJSON
// =============================
function cargarCapa(config) {
    fetch(config.url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            capasGeoJSON[config.key] = data;

            var estilo = estilosCapas[config.key] || { color: '#FFFFFF', weight: 2, fillOpacity: 0.2 };

            var layer = L.geoJSON(data, {
                style: function() { return Object.assign({}, estilosCapas[config.key]); },
                pointToLayer: function(feature, latlng) {
                    if (!capasPuntosLivianos[config.key]) return L.marker(latlng);
                    var estiloPunto = estilosCapas[config.key] || {};
                    return L.circleMarker(latlng, {
                        radius: 2.5,
                        color: estiloPunto.color || '#ffffff',
                        weight: 0.5,
                        opacity: 0.85,
                        fillColor: estiloPunto.fillColor || estiloPunto.color || '#ffffff',
                        fillOpacity: 0.75,
                        interactive: true
                    });
                },
                onEachFeature: function(feature, lyr) {
                    lyr._capaKey = config.key;
                    lyr._featureIndex = data.features.indexOf(feature);
                    lyr.bindPopup(function() {
                        return popupDesdeAtributos(feature, config.key);
                    });
                    lyr.on('click', function() {
                        seleccionarElemento(lyr, {
                            capaKey: config.key,
                            featureIndex: lyr._featureIndex,
                            origen: 'geojson',
                            nombre: nombreCapaPorKey(config.key)
                        });
                    });
                }
            });

            capasLeaflet[config.key] = layer;
            capasVisibles[config.key] = false;

            actualizarListaCapas();
            actualizarSelectores();
            actualizarStatCapas();
            actualizarStatFeatures();
        })
        .catch(function(err) {
            console.error('Error al cargar ' + config.url + ':', err);
        });
}

function actualizarStatFeatures() {
    var total = 0;
    Object.keys(capasGeoJSON).forEach(function(k) {
        if (capasVisibles[k] && capasGeoJSON[k] && capasGeoJSON[k].features) {
            total += capasGeoJSON[k].features.length;
        }
    });
    document.getElementById('statFeatures').textContent = total.toLocaleString();
}

// =============================
// LISTA DE CAPAS (sidebar)
// =============================
function actualizarListaCapas() {
    var contenedor = document.getElementById('listaCapas');
    contenedor.innerHTML = '';

    capasConfig.forEach(function(capa) {
        if (!capasLeaflet[capa.key]) return;

        var estilo = estilosCapas[capa.key] || {};
        var color = estilo.color || '#fff';
        var visible = capasVisibles[capa.key] !== false;

        var item = document.createElement('div');
        item.className = 'layer-item';
        item.id = 'layerItem_' + capa.key;

        item.innerHTML =
            '<div class="layer-row">' +
            '  <input type="checkbox" class="layer-checkbox" id="chk_' + capa.key + '" ' + (visible ? 'checked' : '') + '>' +
            '  <div class="layer-color-dot" style="background:' + color + '; color:' + color + '"></div>' +
            '  <span class="layer-name">' + capa.nombre + '</span>' +
            '</div>' +
            '<div class="layer-actions">' +
            '  <button class="layer-action-btn" onclick="irAEstilo(\'' + capa.key + '\')">ESTILO</button>' +
            '  <button class="layer-action-btn" onclick="irAPopup(\'' + capa.key + '\')">POPUP</button>' +
            '  <button class="layer-action-btn" onclick="irADatos(\'' + capa.key + '\')">DATOS</button>' +
            '  <button class="layer-action-btn" onclick="irACategorias(\'' + capa.key + '\')">CAT</button>' +
            '</div>';

        // Toggle visibilidad
        item.querySelector('#chk_' + capa.key).addEventListener('change', function(e) {
            toggleCapa(capa.key, e.target.checked);
        });

        contenedor.appendChild(item);
    });

    var creadasKeys = Object.keys(capasCreadas);
    var bloque = document.createElement('div');
    bloque.className = 'created-layer-list';
    bloque.innerHTML = '<div class="panel-title" style="margin-top:10px">CAPAS CREADAS</div>';
    if (creadasKeys.length === 0) {
        bloque.innerHTML += '<p class="hint-text">Aun no hay geometrías creadas.</p>';
    } else {
        creadasKeys.forEach(function(id) {
            var reg = capasCreadas[id];
            var visibleCreada = reg.visible !== false;
            var itemCreado = document.createElement('div');
            itemCreado.className = 'created-layer-item' + (elementoSeleccionado && elementoSeleccionado.id === id ? ' selected' : '');
            itemCreado.innerHTML =
                '<div class="created-layer-meta">' +
                '  <input type="checkbox" class="layer-checkbox" ' + (visibleCreada ? 'checked' : '') + ' data-created-toggle="' + id + '">' +
                '  <span>' + reg.tipo.toUpperCase() + '</span>' +
                '  <span>' + htmlSeguro(reg.nombre) + '</span>' +
                '</div>' +
                '<div class="created-layer-actions">' +
                '  <button class="layer-action-btn" data-created-select="' + id + '">SEL</button>' +
                '  <button class="layer-action-btn" data-created-zoom="' + id + '">ZOOM</button>' +
                '  <button class="layer-action-btn" data-created-delete="' + id + '">BORRAR</button>' +
                '</div>';
            bloque.appendChild(itemCreado);
        });
    }
    contenedor.appendChild(bloque);

    contenedor.querySelectorAll('[data-created-toggle]').forEach(function(cb) {
        cb.addEventListener('change', function(e) {
            toggleCapaCreada(e.target.dataset.createdToggle, e.target.checked);
        });
    });
    contenedor.querySelectorAll('[data-created-select]').forEach(function(btn) {
        btn.addEventListener('click', function() { seleccionarCapaCreada(btn.dataset.createdSelect); });
    });
    contenedor.querySelectorAll('[data-created-zoom]').forEach(function(btn) {
        btn.addEventListener('click', function() { zoomACapaCreada(btn.dataset.createdZoom); });
    });
    contenedor.querySelectorAll('[data-created-delete]').forEach(function(btn) {
        btn.addEventListener('click', function() { eliminarCapaCreada(btn.dataset.createdDelete); });
    });
}

function toggleCapa(key, visible) {
    capasVisibles[key] = visible;
    if (visible) {
        if (!map.hasLayer(capasLeaflet[key])) capasLeaflet[key].addTo(map);
    } else {
        if (map.hasLayer(capasLeaflet[key])) map.removeLayer(capasLeaflet[key]);
    }
    actualizarStatFeatures();
}

function zoomACapa(key) {
    if (capasLeaflet[key]) {
        map.fitBounds(capasLeaflet[key].getBounds(), { padding: [40, 40] });
    }
}

// =============================
// SELECTORES EN PANELES
// =============================
function actualizarSelectores() {
    var ids = ['estiloSelectorCapa', 'popupSelectorCapa', 'datosSelectorCapa', 'etiquetaSelectorCapa', 'categoriaSelectorCapa', 'filtroSelectorCapa'];
    ids.forEach(function(id) {
        var sel = document.getElementById(id);
        if (!sel) return;
        var prev = sel.value;
        sel.innerHTML = '';
        capasConfig.forEach(function(c) {
            if (!capasLeaflet[c.key]) return;
            var opt = document.createElement('option');
            opt.value = c.key;
            opt.textContent = c.nombre;
            sel.appendChild(opt);
        });
        if ((id === 'datosSelectorCapa' || id === 'etiquetaSelectorCapa' || id === 'categoriaSelectorCapa') && hayCapasCreadas()) {
            var optCreadas = document.createElement('option');
            optCreadas.value = CAPAS_CREADAS_KEY;
            optCreadas.textContent = 'Capas creadas';
            sel.appendChild(optCreadas);
        }
        if (prev) sel.value = prev;
    });
    var etiquetaSel = document.getElementById('etiquetaSelectorCapa');
    if (etiquetaSel && etiquetaSel.value) cargarCamposEtiqueta(etiquetaSel.value);
    var categoriaSel = document.getElementById('categoriaSelectorCapa');
    if (categoriaSel && categoriaSel.value) cargarCamposCategoria(categoriaSel.value);
    var filtroSel = document.getElementById('filtroSelectorCapa');
    if (filtroSel && filtroSel.value) actualizarCamposFiltros(filtroSel.value);
    var alertaSel = document.getElementById('alertaSelectorCapa');
    if (alertaSel && alertaSel.value) actualizarCamposAlertas(alertaSel.value);
    if (document.getElementById('datosSelectorCapa')) actualizarCamposGrafica(document.getElementById('datosSelectorCapa').value);
}

// =============================
// NAVEGACIÓN DE SIDEBAR
// =============================
document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('collapsed');
        var panelId = btn.dataset.panel;
        document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.side-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(panelId).classList.add('active');
    });
});

document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var targetId = btn.dataset.tabTarget;
        var group = btn.closest('.side-panel');
        if (!targetId || !group) return;
        var target = document.getElementById(targetId);
        if (btn.dataset.collapsibleTab === 'true' && btn.classList.contains('active')) {
            btn.classList.remove('active');
            if (target) target.classList.remove('active');
            return;
        }
        group.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        group.querySelectorAll('.tab-content').forEach(function(tab) { tab.classList.remove('active'); });
        btn.classList.add('active');
        if (target) target.classList.add('active');
    });
});

if (document.getElementById('btnToggleSidebar')) {
    document.getElementById('btnToggleSidebar').addEventListener('click', function() {
        var sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        this.textContent = sidebar.classList.contains('collapsed') ? 'ABRIR' : 'PANEL';
    });
}

function irAPanel(panelId) {
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.side-panel').forEach(function(p) { p.classList.remove('active'); });
    var btn = document.querySelector('[data-panel="' + panelId + '"]');
    if (btn) btn.classList.add('active');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
}

function irAEstilo(key) {
    irAPanel('panelEstilos');
    document.getElementById('estiloSelectorCapa').value = key;
    cargarEstiloEnPanel(key);
}

function irAPopup(key) {
    irAPanel('panelPopup');
    document.getElementById('popupSelectorCapa').value = key;
    cargarCamposPopup(key);
}

function irADatos(key) {
    irAPanel('panelDatos');
    document.getElementById('datosSelectorCapa').value = key;
    mostrarResumenDatos(key);
}

function irACategorias(key) {
    irAPanel('panelCategorias');
    document.getElementById('categoriaSelectorCapa').value = key;
    cargarCamposCategoria(key);
}

// =============================
// PANEL DE MAPAS BASE
// =============================
document.querySelectorAll('.basemap-card').forEach(function(card) {
    card.addEventListener('click', function() {
        var bm = card.dataset.bm;
        if (!baseLayers[bm]) return;
        if (activeBaseLayer) map.removeLayer(activeBaseLayer);
        activeBaseLayer = baseLayers[bm];
        activeBaseLayer.addTo(map);
        activeBaseLayer.bringToBack();
        document.querySelectorAll('.basemap-card').forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');
    });
});

// =============================
// PANEL DE ESTILOS
// =============================
var estiloSel = document.getElementById('estiloSelectorCapa');
estiloSel.addEventListener('change', function() { cargarEstiloEnPanel(estiloSel.value); });

function cargarEstiloEnPanel(key) {
    var e = estilosCapas[key];
    if (!e) return;
    document.getElementById('estiloColor').value = e.color || '#ffffff';
    document.getElementById('estiloColorHex').textContent = e.color || '#ffffff';
    document.getElementById('estiloFillColor').value = e.fillColor || e.color || '#ffffff';
    document.getElementById('estiloFillHex').textContent = e.fillColor || e.color || '#ffffff';
    document.getElementById('estiloWeight').value = e.weight || 2;
    document.getElementById('weightVal').textContent = e.weight || 2;
    document.getElementById('estiloFillOpacity').value = Math.round((e.fillOpacity || 0.2) * 100);
    document.getElementById('fillOpVal').textContent = Math.round((e.fillOpacity || 0.2) * 100) + '%';
    document.getElementById('estiloOpacity').value = Math.round((e.opacity !== undefined ? e.opacity : 1) * 100);
    document.getElementById('opacityVal').textContent = Math.round((e.opacity !== undefined ? e.opacity : 1) * 100) + '%';
    document.getElementById('estiloDash').value = e.dashArray || '';
}

// Live preview de rangos
document.getElementById('estiloWeight').addEventListener('input', function() {
    document.getElementById('weightVal').textContent = this.value;
});
document.getElementById('estiloFillOpacity').addEventListener('input', function() {
    document.getElementById('fillOpVal').textContent = this.value + '%';
});
document.getElementById('estiloOpacity').addEventListener('input', function() {
    document.getElementById('opacityVal').textContent = this.value + '%';
});
document.getElementById('estiloColor').addEventListener('input', function() {
    document.getElementById('estiloColorHex').textContent = this.value;
});
document.getElementById('estiloFillColor').addEventListener('input', function() {
    document.getElementById('estiloFillHex').textContent = this.value;
});

document.getElementById('btnAplicarEstilo').addEventListener('click', function() {
    var key = document.getElementById('estiloSelectorCapa').value;
    if (!key || !capasLeaflet[key]) return;

    var nuevoEstilo = {
        color: document.getElementById('estiloColor').value,
        fillColor: document.getElementById('estiloFillColor').value,
        weight: parseFloat(document.getElementById('estiloWeight').value),
        fillOpacity: parseInt(document.getElementById('estiloFillOpacity').value) / 100,
        opacity: parseInt(document.getElementById('estiloOpacity').value) / 100,
        dashArray: document.getElementById('estiloDash').value || null
    };

    estilosCapas[key] = nuevoEstilo;
    capasLeaflet[key].setStyle(nuevoEstilo);
    actualizarListaCapas();
});

document.getElementById('btnResetEstilo').addEventListener('click', function() {
    var key = document.getElementById('estiloSelectorCapa').value;
    if (!key) return;
    estilosCapas[key] = JSON.parse(JSON.stringify(estilosOriginales[key]));
    capasLeaflet[key].setStyle(estilosCapas[key]);
    cargarEstiloEnPanel(key);
    actualizarListaCapas();
});

// =============================
// PANEL POPUP
// =============================
var popupSel = document.getElementById('popupSelectorCapa');
popupSel.addEventListener('change', function() { cargarCamposPopup(popupSel.value); });

function cargarCamposPopup(key) {
    var contenedor = document.getElementById('popupFields');
    contenedor.innerHTML = '';

    if (!capasGeoJSON[key] || !capasGeoJSON[key].features || !capasGeoJSON[key].features[0]) {
        contenedor.innerHTML = '<p class="hint-text">No hay datos cargados.</p>';
        return;
    }

    var props = capasGeoJSON[key].features[0].properties;
    if (!props) {
        contenedor.innerHTML = '<p class="hint-text">Sin atributos.</p>';
        return;
    }

    var camposActivos = popupCampos[key] || Object.keys(props);

    Object.keys(props).forEach(function(campo) {
        var checked = camposActivos.indexOf(campo) !== -1;
        var item = document.createElement('div');
        item.className = 'popup-field-item';
        item.innerHTML =
            '<input type="checkbox" id="pf_' + campo + '" ' + (checked ? 'checked' : '') + '>' +
            '<label for="pf_' + campo + '">' + campo + '</label>';
        contenedor.appendChild(item);
    });
}

document.getElementById('btnAplicarPopup').addEventListener('click', function() {
    var key = document.getElementById('popupSelectorCapa').value;
    if (!key) return;

    var campos = [];
    document.querySelectorAll('#popupFields input[type="checkbox"]:checked').forEach(function(cb) {
        campos.push(cb.id.replace('pf_', ''));
    });

    popupCampos[key] = campos;

    // Refrescar popups en la capa
    if (capasLeaflet[key]) {
        capasLeaflet[key].eachLayer(function(lyr) {
            var feature = lyr.feature;
            lyr.bindPopup(function() {
                return popupDesdeAtributos(feature, key);
            });
        });
    }
});

// =============================
// PANEL ETIQUETAS
// =============================
var etiquetaSel = document.getElementById('etiquetaSelectorCapa');
var etiquetaCampoSel = document.getElementById('etiquetaCampo');
var etiquetaActiva = document.getElementById('etiquetaActiva');

if (etiquetaSel) {
    etiquetaSel.addEventListener('change', function() { cargarCamposEtiqueta(etiquetaSel.value); });
}

function cargarCamposEtiqueta(key) {
    if (!etiquetaCampoSel || !etiquetaActiva) return;
    var campos = obtenerCamposCapa(key);
    var cfg = etiquetasConfig[key] || {};
    etiquetaCampoSel.innerHTML = '';

    if (campos.length === 0) {
        etiquetaCampoSel.innerHTML = '<option value="">Sin campos</option>';
        etiquetaActiva.checked = false;
        return;
    }

    campos.forEach(function(campo) {
        var opt = document.createElement('option');
        opt.value = campo;
        opt.textContent = campo;
        etiquetaCampoSel.appendChild(opt);
    });

    etiquetaCampoSel.value = cfg.campo || campos[0];
    etiquetaActiva.checked = !!cfg.activo;
}

function aplicarEtiquetasCapa(key) {
    var cfg = etiquetasConfig[key];
    if (!cfg || !capasLeaflet[key]) return;

    capasLeaflet[key].eachLayer(function(lyr) {
        if (lyr.unbindTooltip) lyr.unbindTooltip();
        if (!cfg.activo || !cfg.campo || !lyr.feature || !lyr.feature.properties) return;

        var valor = lyr.feature.properties[cfg.campo];
        if (valor === null || valor === undefined || valor === '') return;

        lyr.bindTooltip(htmlSeguro(valor), {
            permanent: true,
            direction: 'center',
            className: 'map-label'
        });
    });
}

if (document.getElementById('btnAplicarEtiquetas')) {
    document.getElementById('btnAplicarEtiquetas').addEventListener('click', function() {
        var key = etiquetaSel.value;
        if (!key) return;
        etiquetasConfig[key] = {
            activo: etiquetaActiva.checked,
            campo: etiquetaCampoSel.value,
            estilo: { color: '#e0f4ff', size: 11 }
        };
        aplicarEtiquetasCapa(key);
    });
}

// =============================
// SELECCION Y EDICION INDIVIDUAL
// =============================
function seleccionarElemento(layer, meta) {
    limpiarSeleccion(false);
    elementoSeleccionado = Object.assign({ layer: layer, tipo: obtenerTipoLayer(layer) }, meta || {});

    if (layer.setStyle) {
        estiloSeleccionPrevio = Object.assign({}, layer.options || {});
        layer.setStyle({
            color: '#ffea00',
            fillColor: layer.options.fillColor || '#ffea00',
            weight: Math.max(parseFloat(layer.options.weight || 2) + 2, 4),
            opacity: 1,
            fillOpacity: Math.max(layer.options.fillOpacity || 0.2, 0.35)
        });
    }

    if (layer instanceof L.Marker) {
        layer.setIcon(crearIconoMarker((layer._iconoId || iconoMarkerActivo), true));
    }

    actualizarPanelSeleccion();
    actualizarListaCapas();
    actualizarListaCapasCreadas();
}

function limpiarSeleccion(actualizarPanel) {
    if (elementoSeleccionado && elementoSeleccionado.layer) {
        var layer = elementoSeleccionado.layer;
        if (layer.setStyle && estiloSeleccionPrevio) {
            layer.setStyle(estiloSeleccionPrevio);
        }
        if (layer instanceof L.Marker) {
            layer.setIcon(crearIconoMarker(layer._iconoId || iconoMarkerActivo, false));
        }
    }
    elementoSeleccionado = null;
    estiloSeleccionPrevio = null;
    document.querySelectorAll('.attr-table tr.selected-row').forEach(function(tr) {
        tr.classList.remove('selected-row');
    });
    if (actualizarPanel !== false) actualizarPanelSeleccion();
}

function actualizarPanelSeleccion() {
    var info = document.getElementById('selectedInfo');
    var markerFields = document.getElementById('markerEditFields');
    if (!info) return;

    if (!elementoSeleccionado) {
        info.innerHTML = '<p class="hint-text">Selecciona un elemento desde el mapa, una capa creada o la tabla.</p>';
        if (markerFields) markerFields.classList.remove('visible');
        return;
    }

    var layer = elementoSeleccionado.layer;
    var tipo = elementoSeleccionado.tipo || obtenerTipoLayer(layer);
    var nombre = elementoSeleccionado.nombre || elementoSeleccionado.id || 'Elemento';
    info.innerHTML =
        '<div class="d-row"><span class="d-key">TIPO</span><span class="d-val">' + htmlSeguro(tipo) + '</span></div>' +
        '<div class="d-row"><span class="d-key">ORIGEN</span><span class="d-val">' + htmlSeguro(nombre) + '</span></div>';

    var opts = layer.options || {};
    document.getElementById('selColor').value = opts.color || opts.fillColor || '#00d4ff';
    document.getElementById('selColorHex').textContent = document.getElementById('selColor').value;
    document.getElementById('selWeight').value = opts.weight || 3;
    document.getElementById('selWeightVal').textContent = document.getElementById('selWeight').value;
    document.getElementById('selOpacity').value = Math.round((opts.opacity !== undefined ? opts.opacity : 1) * 100);
    document.getElementById('selOpacityVal').textContent = document.getElementById('selOpacity').value + '%';

    if (markerFields) {
        var esCreada = elementoSeleccionado.origen === 'creada';
        markerFields.classList.toggle('visible', esCreada || layer instanceof L.Marker);
        if (esCreada || layer instanceof L.Marker) {
            document.getElementById('selMarkerDescripcion').value = layer._descripcion || '';
            document.getElementById('selMarkerIcono').value = layer._iconoId || iconoMarkerActivo;
            document.getElementById('selMarkerIcono').closest('.select-row').style.display = layer instanceof L.Marker ? 'flex' : 'none';
        }
    }
}

function aplicarEstiloSeleccionado() {
    if (!elementoSeleccionado || !elementoSeleccionado.layer) return;
    var layer = elementoSeleccionado.layer;
    var color = document.getElementById('selColor').value;
    var weight = parseFloat(document.getElementById('selWeight').value);
    var opacity = parseInt(document.getElementById('selOpacity').value, 10) / 100;

    if (layer.setStyle) {
        layer.setStyle({
            color: color,
            fillColor: layer.options.fillColor || color,
            weight: weight,
            opacity: opacity,
            fillOpacity: Math.min(opacity, layer.options.fillOpacity !== undefined ? layer.options.fillOpacity : opacity)
        });
        estiloSeleccionPrevio = Object.assign({}, layer.options || {});
    }

    if (elementoSeleccionado.origen === 'creada') {
        var nuevaDescripcion = document.getElementById('selMarkerDescripcion').value;
        layer._descripcion = nuevaDescripcion;
        if (capasCreadas[elementoSeleccionado.id]) {
            capasCreadas[elementoSeleccionado.id].nombre = nuevaDescripcion || capasCreadas[elementoSeleccionado.id].nombre;
            capasCreadas[elementoSeleccionado.id].descripcion = nuevaDescripcion;
            actualizarAtributosCapaCreada(elementoSeleccionado.id);
        }
        agregarPopup(layer, obtenerTipoLayer(layer));
    }

    if (layer instanceof L.Marker) {
        layer.setOpacity(opacity);
        layer._descripcion = document.getElementById('selMarkerDescripcion').value;
        layer._iconoId = document.getElementById('selMarkerIcono').value;
        layer.setIcon(crearIconoMarker(layer._iconoId, true));
        agregarPopup(layer, 'marker');
    }
    actualizarListaCapasCreadas();
}

['selWeight', 'selOpacity'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
        if (id === 'selWeight') document.getElementById('selWeightVal').textContent = el.value;
        if (id === 'selOpacity') document.getElementById('selOpacityVal').textContent = el.value + '%';
    });
});
if (document.getElementById('selColor')) {
    document.getElementById('selColor').addEventListener('input', function() {
        document.getElementById('selColorHex').textContent = this.value;
    });
}
if (document.getElementById('btnAplicarSeleccion')) {
    document.getElementById('btnAplicarSeleccion').addEventListener('click', aplicarEstiloSeleccionado);
}
if (document.getElementById('btnLimpiarSeleccion')) {
    document.getElementById('btnLimpiarSeleccion').addEventListener('click', function() {
        limpiarSeleccion();
        actualizarListaCapas();
        actualizarListaCapasCreadas();
    });
}

// =============================
// CATEGORIZACIÓN TIPO QGIS
// =============================
if (document.getElementById('categoriaSelectorCapa')) {
    document.getElementById('categoriaSelectorCapa').addEventListener('change', function() {
        cargarCamposCategoria(this.value);
    });
}

function cargarCamposCategoria(key) {
    var sel = document.getElementById('categoriaCampo');
    if (!sel) return;
    var campos = obtenerCamposCapa(key);
    sel.innerHTML = '';
    if (campos.length === 0) {
        sel.innerHTML = '<option value="">Sin campos</option>';
        return;
    }
    campos.forEach(function(campo) {
        var opt = document.createElement('option');
        opt.value = campo;
        opt.textContent = campo;
        sel.appendChild(opt);
    });
}

function colorCategoria(indice, total) {
    var hue = Math.round((indice * 360) / Math.max(total, 1));
    return 'hsl(' + hue + ', 82%, 55%)';
}

function obtenerValoresUnicos(key, campo) {
    var geojson = obtenerGeoJSONCapa(key);
    var conteo = {};
    if (!geojson || !geojson.features) return conteo;
    geojson.features.forEach(function(f) {
        var valor = f.properties ? f.properties[campo] : null;
        if (valor === null || valor === undefined || valor === '') valor = 'Sin dato';
        conteo[valor] = (conteo[valor] || 0) + 1;
    });
    return conteo;
}

function generarCategorias() {
    var key = document.getElementById('categoriaSelectorCapa').value;
    var campo = document.getElementById('categoriaCampo').value;
    var cont = document.getElementById('categoriaLista');
    if (!key || !campo || !cont) return;

    var conteo = obtenerValoresUnicos(key, campo);
    var valores = Object.keys(conteo);
    categoriasGeneradas[key] = {
        campo: campo,
        categorias: valores.map(function(valor, i) {
            return { valor: valor, color: colorCategoria(i, valores.length), total: conteo[valor], visible: true };
        })
    };

    if (valores.length === 0) {
        cont.innerHTML = '<p class="hint-text">No se encontraron valores.</p>';
        return;
    }

    cont.innerHTML = '';
    categoriasGeneradas[key].categorias.forEach(function(cat, i) {
        var item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML =
            '<input type="checkbox" checked data-cat-visible="' + i + '" title="Prender o apagar valor">' +
            '<input type="color" value="' + convertirHslAHex(cat.color) + '" data-cat-index="' + i + '">' +
            '<span class="category-name" title="' + htmlSeguro(cat.valor) + '">' + htmlSeguro(cat.valor) + '</span>' +
            '<span class="category-count">' + cat.total + '</span>';
        cont.appendChild(item);
    });

    cont.querySelectorAll('input[type="color"]').forEach(function(input) {
        input.addEventListener('input', function() {
            categoriasGeneradas[key].categorias[parseInt(input.dataset.catIndex, 10)].color = input.value;
        });
    });
    cont.querySelectorAll('[data-cat-visible]').forEach(function(input) {
        input.addEventListener('change', function() {
            categoriasGeneradas[key].categorias[parseInt(input.dataset.catVisible, 10)].visible = input.checked;
        });
    });
}

function convertirHslAHex(hsl) {
    var match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(hsl);
    if (!match) return hsl;
    var h = Number(match[1]) / 360;
    var s = Number(match[2]) / 100;
    var l = Number(match[3]) / 100;
    var hue2rgb = function(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    var r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    var g = Math.round(hue2rgb(p, q, h) * 255);
    var b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    return '#' + [r, g, b].map(function(v) { return v.toString(16).padStart(2, '0'); }).join('');
}

function aplicarCategorias() {
    var key = document.getElementById('categoriaSelectorCapa').value;
    var cfg = categoriasGeneradas[key];
    if (!cfg) return;
    var mapaColor = {};
    cfg.categorias.forEach(function(cat) {
        mapaColor[String(cat.valor)] = { color: cat.color, visible: cat.visible !== false };
    });

    var pintar = function(layer, props) {
        var valor = props ? props[cfg.campo] : null;
        if (valor === null || valor === undefined || valor === '') valor = 'Sin dato';
        var catCfg = mapaColor[String(valor)] || { color: '#00d4ff', visible: true };
        var color = catCfg.color;
        if (catCfg.visible === false) {
            if (layer.setStyle) layer.setStyle({ opacity: 0, fillOpacity: 0, interactive: false });
            return;
        }
        if (layer.setStyle) layer.setStyle({ interactive: true });
        if (layer.setStyle) {
            layer.setStyle({ color: color, fillColor: color, fillOpacity: 0.35, opacity: 1, weight: layer.options.weight || 2 });
        }
        if (layer instanceof L.Marker) {
            layer.setIcon(L.divIcon({
                className: '',
                html: '<div class="user-marker-icon" style="background:' + color + '">•</div>',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                popupAnchor: [0, -16]
            }));
        }
    };

    if (key === CAPAS_CREADAS_KEY) {
        Object.keys(capasCreadas).forEach(function(id) {
            actualizarAtributosCapaCreada(id);
            pintar(capasCreadas[id].layer, capasCreadas[id].atributos);
        });
    } else if (capasLeaflet[key]) {
        capasLeaflet[key].eachLayer(function(lyr) {
            pintar(lyr, lyr.feature ? lyr.feature.properties : {});
        });
    }
}

function desclasificarCategorias() {
    var key = document.getElementById('categoriaSelectorCapa').value;
    if (!key) return;
    restaurarEstiloCapa(key);
    delete categoriasGeneradas[key];
    var cont = document.getElementById('categoriaLista');
    if (cont) cont.innerHTML = '<p class="hint-text">Selecciona una capa y campo para generar categorias.</p>';
}

function restaurarEstiloCapa(key) {
    if (key === CAPAS_CREADAS_KEY) {
        Object.keys(capasCreadas).forEach(function(id) {
            var reg = capasCreadas[id];
            aplicarEstilo(reg.layer, reg.tipo);
        });
    } else if (capasLeaflet[key]) {
        var estilo = estilosCapas[key] || estilosOriginales[key] || {};
        capasLeaflet[key].eachLayer(function(lyr) {
            if (lyr.setStyle) lyr.setStyle(Object.assign({}, estilo));
        });
    }
}

function guardarCategoriasEnBiblioteca() {
    var key = document.getElementById('categoriaSelectorCapa').value;
    var cfg = categoriasGeneradas[key];
    if (!cfg) return;
    var nombreInput = document.getElementById('categoriaNombre');
    var nombre = nombreInput && nombreInput.value.trim() ? nombreInput.value.trim() : 'Categorizacion ' + obtenerNombreSelector(key);
    categorizacionesGuardadas.push({
        id: 'cat_' + Date.now(),
        nombre: nombre,
        capaKey: key,
        campo: cfg.campo,
        categorias: JSON.parse(JSON.stringify(cfg.categorias)),
        visible: true
    });
    actualizarBibliotecas();
}

if (document.getElementById('btnGenerarCategorias')) {
    document.getElementById('btnGenerarCategorias').addEventListener('click', generarCategorias);
}
if (document.getElementById('btnAplicarCategorias')) {
    document.getElementById('btnAplicarCategorias').addEventListener('click', aplicarCategorias);
}
if (document.getElementById('btnGuardarCategorias')) {
    document.getElementById('btnGuardarCategorias').addEventListener('click', guardarCategoriasEnBiblioteca);
}
if (document.getElementById('btnDesclasificarCategorias')) {
    document.getElementById('btnDesclasificarCategorias').addEventListener('click', desclasificarCategorias);
}

// =============================
// GRÁFICAS Y CONCLUSIONES
// =============================
function actualizarCamposGrafica(key) {
    var sel = document.getElementById('graficaCampoSelector');
    if (!sel) return;
    var prev = sel.value;
    var campos = obtenerCamposCapa(key);
    sel.innerHTML = '';
    if (campos.length === 0) {
        sel.innerHTML = '<option value="">Sin campos</option>';
        return;
    }
    campos.forEach(function(campo) {
        var opt = document.createElement('option');
        opt.value = campo;
        opt.textContent = campo;
        sel.appendChild(opt);
    });
    if (prev && campos.indexOf(prev) !== -1) sel.value = prev;
}

function analizarCampo(key, campo, tipoAnalisis) {
    var geojson = obtenerGeoJSONCapa(key);
    var resultado = {
        key: key,
        campo: campo,
        tipo: tipoAnalisis,
        total: 0,
        conteo: {},
        porcentajes: {},
        numeros: [],
        promedio: null,
        minimo: null,
        maximo: null,
        atipicos: []
    };
    if (!geojson || !geojson.features) return resultado;

    geojson.features.forEach(function(f) {
        var valor = f.properties ? f.properties[campo] : null;
        if (valor === null || valor === undefined || valor === '') valor = 'Sin dato';
        resultado.total += 1;
        resultado.conteo[valor] = (resultado.conteo[valor] || 0) + 1;
        if (!isNaN(Number(valor)) && valor !== 'Sin dato') resultado.numeros.push(Number(valor));
    });

    Object.keys(resultado.conteo).forEach(function(k) {
        resultado.porcentajes[k] = resultado.total ? (resultado.conteo[k] / resultado.total) * 100 : 0;
    });

    if (resultado.numeros.length > 0) {
        var suma = resultado.numeros.reduce(function(a, b) { return a + b; }, 0);
        resultado.promedio = suma / resultado.numeros.length;
        resultado.minimo = Math.min.apply(null, resultado.numeros);
        resultado.maximo = Math.max.apply(null, resultado.numeros);
        var ordenados = resultado.numeros.slice().sort(function(a, b) { return a - b; });
        var q1 = ordenados[Math.floor((ordenados.length - 1) * 0.25)];
        var q3 = ordenados[Math.floor((ordenados.length - 1) * 0.75)];
        var iqr = q3 - q1;
        var limInf = q1 - 1.5 * iqr;
        var limSup = q3 + 1.5 * iqr;
        resultado.atipicos = resultado.numeros.filter(function(v) { return v < limInf || v > limSup; });
    }
    return resultado;
}

function generarGraficaAtributos() {
    var key = document.getElementById('datosSelectorCapa').value;
    var campo = document.getElementById('graficaCampoSelector').value;
    var tipo = document.getElementById('graficaTipoAnalisis').value;
    if (!key || !campo || typeof Chart === 'undefined') return;

    ultimoAnalisisEstadistico = analizarCampo(key, campo, tipo);
    var ctx = document.getElementById('graficaAtributos');
    if (!ctx) return;
    if (graficaAtributosChart) graficaAtributosChart.destroy();

    var labels;
    var data;
    var chartType = 'bar';
    if (tipo === 'numerico') {
        labels = ['Promedio', 'Mínimo', 'Máximo', 'Atípicos'];
        data = [
            ultimoAnalisisEstadistico.promedio || 0,
            ultimoAnalisisEstadistico.minimo || 0,
            ultimoAnalisisEstadistico.maximo || 0,
            ultimoAnalisisEstadistico.atipicos.length
        ];
    } else {
        labels = Object.keys(ultimoAnalisisEstadistico.conteo);
        data = labels.map(function(k) {
            return tipo === 'porcentaje' ? ultimoAnalisisEstadistico.porcentajes[k] : ultimoAnalisisEstadistico.conteo[k];
        });
        chartType = tipo === 'porcentaje' ? 'doughnut' : 'bar';
    }

    graficaAtributosChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: campo,
                data: data,
                backgroundColor: labels.map(function(_, i) { return colorCategoria(i, labels.length); }),
                borderColor: '#00d4ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#e0f4ff', font: { family: 'Rajdhani' } } },
                title: { display: true, text: campo + ' - ' + obtenerNombreSelector(key), color: '#e0f4ff' }
            },
            scales: chartType === 'bar' ? {
                x: { ticks: { color: '#6fa8c8' }, grid: { color: 'rgba(15,42,63,0.55)' } },
                y: { ticks: { color: '#6fa8c8' }, grid: { color: 'rgba(15,42,63,0.55)' } }
            } : {}
        }
    });

    mostrarResumenAnalisis(ultimoAnalisisEstadistico);
}

function mostrarResumenAnalisis(r) {
    var div = document.getElementById('resumenEstadistico');
    if (!div || !r) return;
    var top = Object.keys(r.conteo).sort(function(a, b) { return r.conteo[b] - r.conteo[a]; })[0] || 'Sin dato';
    var html =
        '<div class="d-row"><span class="d-key">REGISTROS</span><span class="d-val">' + r.total + '</span></div>' +
        '<div class="d-row"><span class="d-key">MÁS FRECUENTE</span><span class="d-val">' + htmlSeguro(top) + '</span></div>';
    if (r.numeros.length > 0) {
        html +=
            '<div class="d-row"><span class="d-key">PROMEDIO</span><span class="d-val">' + formatearNumero(r.promedio) + '</span></div>' +
            '<div class="d-row"><span class="d-key">MÍN / MÁX</span><span class="d-val">' + formatearNumero(r.minimo) + ' / ' + formatearNumero(r.maximo) + '</span></div>' +
            '<div class="d-row"><span class="d-key">ATÍPICOS</span><span class="d-val">' + r.atipicos.length + '</span></div>';
    }
    div.innerHTML = html;
}

function generarConclusionEstadistica() {
    var div = document.getElementById('conclusionEstadistica');
    if (!div) return;
    if (!ultimoAnalisisEstadistico) {
        div.textContent = 'Primero genera una gráfica para calcular la estadística base.';
        return;
    }
    var r = ultimoAnalisisEstadistico;
    var orden = Object.keys(r.conteo).sort(function(a, b) { return r.conteo[b] - r.conteo[a]; });
    var principal = orden[0] || 'Sin dato';
    var pct = r.porcentajes[principal] || 0;
    var texto = 'Conclusión automática: en la capa ' + obtenerNombreSelector(r.key) + ', el campo "' + r.campo + '" tiene ' + r.total + ' registros analizados. ';
    texto += 'La categoría con mayor concentración es "' + principal + '", con ' + r.conteo[principal] + ' registros (' + pct.toFixed(1) + '%). ';
    if (r.numeros.length > 0) {
        texto += 'El promedio es ' + formatearNumero(r.promedio) + ', con mínimo de ' + formatearNumero(r.minimo) + ' y máximo de ' + formatearNumero(r.maximo) + '. ';
        texto += r.atipicos.length > 0 ? 'Se detectan ' + r.atipicos.length + ' valores atípicos que conviene revisar.' : 'No se detectan valores atípicos relevantes con el criterio IQR.';
    } else {
        texto += orden.length > 1 ? 'La distribución permite comparar concentración entre categorías y priorizar las de mayor frecuencia.' : 'El campo no presenta suficiente variación categórica para un análisis comparativo amplio.';
    }
    div.textContent = texto;
}

if (document.getElementById('btnGenerarGrafica')) {
    document.getElementById('btnGenerarGrafica').addEventListener('click', generarGraficaAtributos);
}
if (document.getElementById('btnGenerarConclusion')) {
    document.getElementById('btnGenerarConclusion').addEventListener('click', generarConclusionEstadistica);
}

// =============================
// PANEL DATOS
// =============================
var datosSel = document.getElementById('datosSelectorCapa');
datosSel.addEventListener('change', function() {
    mostrarResumenDatos(datosSel.value);
    actualizarCamposGrafica(datosSel.value);
});

function mostrarResumenDatos(key) {
    var div = document.getElementById('datosResumen');
    var geojson = obtenerGeoJSONCapa(key);
    if (!geojson || !geojson.features) {
        div.innerHTML = '<p class="hint-text">Sin datos.</p>';
        return;
    }

    var total = geojson.features.length;
    var campos = 0;
    if (geojson.features[0] && geojson.features[0].properties) {
        campos = Object.keys(geojson.features[0].properties).length;
    }

    var tipos = {};
    geojson.features.forEach(function(f) {
        var t = f.geometry ? f.geometry.type : 'Unknown';
        tipos[t] = (tipos[t] || 0) + 1;
    });

    var tipoStr = Object.keys(tipos).map(function(t) { return t + ': ' + tipos[t]; }).join(', ');

    div.innerHTML =
        '<div class="d-row"><span class="d-key">FEATURES</span><span class="d-val">' + total + '</span></div>' +
        '<div class="d-row"><span class="d-key">CAMPOS</span><span class="d-val">' + campos + '</span></div>' +
        '<div class="d-row"><span class="d-key">GEOMETRÍA</span><span class="d-val">' + tipoStr + '</span></div>';
}

// =============================
// DASHBOARD
// =============================
function abrirDashboard() {
    var key = document.getElementById('datosSelectorCapa').value;
    var geojson = obtenerGeoJSONCapa(key);

    var overlay = document.getElementById('modalDashboard');
    overlay.classList.add('open');

    document.getElementById('dashboardTitle').textContent = 'DASHBOARD — ' + obtenerNombreSelector(key).toUpperCase();

    var contenedor = document.getElementById('dashboardContenido');

    if (!geojson || !geojson.features || geojson.features.length === 0) {
        contenedor.innerHTML = '<p class="hint-text">No hay datos.</p>';
        return;
    }

    var total = geojson.features.length;
    var campos = geojson.features[0].properties ? Object.keys(geojson.features[0].properties).length : 0;

    var tipos = {};
    geojson.features.forEach(function(f) {
        var t = f.geometry ? f.geometry.type : 'Unknown';
        tipos[t] = (tipos[t] || 0) + 1;
    });
    var tipoStr = Object.keys(tipos)[0] || '—';

    var html = '<div class="dashboard-grid">';
    html += '<div class="dash-card"><span class="dash-card-val">' + total + '</span><span class="dash-card-label">Features</span></div>';
    html += '<div class="dash-card"><span class="dash-card-val">' + campos + '</span><span class="dash-card-label">Campos</span></div>';
    html += '<div class="dash-card"><span class="dash-card-val">' + tipoStr + '</span><span class="dash-card-label">Geometría</span></div>';
    html += '</div>';

    // Stats numéricas por campo
    if (geojson.features[0] && geojson.features[0].properties) {
        var props = geojson.features[0].properties;
        html += '<div class="dash-field-list">';
        Object.keys(props).forEach(function(campo) {
            var vals = geojson.features
                .map(function(f) { return f.properties ? f.properties[campo] : null; })
                .filter(function(v) { return v !== null && v !== undefined && v !== ''; });

            var numVals = vals.filter(function(v) { return !isNaN(Number(v)); }).map(Number);

            var display;
            if (numVals.length > 0) {
                var sum = numVals.reduce(function(a, b) { return a + b; }, 0);
                var avg = (sum / numVals.length).toFixed(2);
                var min = Math.min.apply(null, numVals).toFixed(2);
                var max = Math.max.apply(null, numVals).toFixed(2);
                display = 'min:' + min + ' avg:' + avg + ' max:' + max;
            } else {
                var uniq = [...new Set(vals)].slice(0, 3).join(', ');
                display = vals.length + ' valores · ' + uniq + (vals.length > 3 ? '...' : '');
            }

            html += '<div class="dash-field-row"><span class="dash-field-key">' + campo + '</span><span class="dash-field-val">' + display + '</span></div>';
        });
        html += '</div>';
    }

    contenedor.innerHTML = html;
}

// =============================
// TABLA
// =============================
function abrirTabla() {
    var key = document.getElementById('datosSelectorCapa').value;
    var geojson = obtenerGeoJSONCapa(key);
    capaTablaActual = key;

    var overlay = document.getElementById('modalTabla');
    overlay.classList.add('open');

    document.getElementById('tablaTitle').textContent = 'TABLA — ' + obtenerNombreSelector(key).toUpperCase();

    var contenedor = document.getElementById('tablaContenido');

    if (!geojson || !geojson.features || geojson.features.length === 0) {
        contenedor.innerHTML = '<p class="hint-text">No hay datos.</p>';
        return;
    }

    if (!geojson.features[0].properties) {
        contenedor.innerHTML = '<p class="hint-text">Sin atributos.</p>';
        return;
    }

    var campos = Object.keys(geojson.features[0].properties);
    var html = '<table class="attr-table"><thead><tr><th>SEL</th>';
    campos.forEach(function(c) { html += '<th>' + c + '</th>'; });
    html += '</tr></thead><tbody>';

    geojson.features.forEach(function(f, idx) {
        html += '<tr data-feature-index="' + idx + '"><td><button class="layer-action-btn" data-table-select="' + idx + '">SEL</button></td>';
        campos.forEach(function(c) {
            var v = f.properties && f.properties[c] !== null && f.properties[c] !== undefined ? f.properties[c] : '—';
            html += '<td>' + htmlSeguro(v) + '</td>';
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    contenedor.innerHTML = html;

    contenedor.querySelectorAll('[data-table-select]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            seleccionarDesdeTabla(key, parseInt(btn.dataset.tableSelect, 10), btn.closest('tr'));
        });
    });
    contenedor.querySelectorAll('tbody tr[data-feature-index]').forEach(function(row) {
        row.addEventListener('click', function() {
            seleccionarDesdeTabla(key, parseInt(row.dataset.featureIndex, 10), row);
        });
    });
}

function seleccionarDesdeTabla(key, featureIndex, row) {
    if (key === CAPAS_CREADAS_KEY) {
        var geo = construirGeoJSONCapasCreadas();
        var featureCreada = geo.features[featureIndex];
        if (featureCreada && featureCreada.properties && featureCreada.properties._createdId) {
            document.querySelectorAll('.attr-table tr.selected-row').forEach(function(tr) {
                tr.classList.remove('selected-row');
            });
            if (row) row.classList.add('selected-row');
            seleccionarCapaCreada(featureCreada.properties._createdId);
        }
        return;
    }
    if (!capasLeaflet[key]) return;
    var encontrado = null;
    capasLeaflet[key].eachLayer(function(lyr) {
        if (lyr._featureIndex === featureIndex) encontrado = lyr;
    });
    if (!encontrado) return;

    document.querySelectorAll('.attr-table tr.selected-row').forEach(function(tr) {
        tr.classList.remove('selected-row');
    });
    if (row) row.classList.add('selected-row');

    seleccionarElemento(encontrado, {
        capaKey: key,
        featureIndex: featureIndex,
        origen: 'tabla',
        nombre: nombreCapaPorKey(key)
    });

    if (!map.hasLayer(capasLeaflet[key])) toggleCapa(key, true);
    var centro = obtenerCentroLayer(encontrado);
    map.setView(centro, Math.max(map.getZoom(), 17));
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Cerrar modales al hacer click fuera
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

// =============================
// DIBUJO Y MEDICIÓN
// =============================
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

function obtenerIconoConfig(id) {
    return ICONOS_MARKER.find(function(icono) { return icono.id === id; }) || ICONOS_MARKER[0];
}

function crearIconoMarker(id, seleccionado) {
    var cfg = obtenerIconoConfig(id);
    return L.divIcon({
        className: '',
        html: '<div class="user-marker-icon ' + (seleccionado ? 'selected-marker' : '') + '" style="background:' + cfg.color + '">' + htmlSeguro(cfg.simbolo) + '</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
    });
}

function inicializarBibliotecaIconos() {
    var cont = document.getElementById('iconLibrary');
    var select = document.getElementById('selMarkerIcono');
    if (select) {
        select.innerHTML = '';
        ICONOS_MARKER.forEach(function(icono) {
            var opt = document.createElement('option');
            opt.value = icono.id;
            opt.textContent = icono.nombre;
            select.appendChild(opt);
        });
    }
    if (!cont) return;
    cont.innerHTML = '';
    ICONOS_MARKER.forEach(function(icono) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'icon-choice' + (icono.id === iconoMarkerActivo ? ' active' : '');
        btn.title = icono.nombre;
        btn.dataset.icono = icono.id;
        btn.innerHTML = '<span style="color:' + icono.color + '">' + htmlSeguro(icono.simbolo) + '</span>';
        btn.addEventListener('click', function() {
            iconoMarkerActivo = icono.id;
            document.querySelectorAll('.icon-choice').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
        });
        cont.appendChild(btn);
    });
}

function registrarCapaCreada(layer, tipo) {
    contadorCapasCreadas += 1;
    var id = 'creada_' + contadorCapasCreadas;
    var descripcion = window.prompt('Nombre o descripción de la geometría:', tipo + ' ' + contadorCapasCreadas) || (tipo + ' ' + contadorCapasCreadas);
    layer._createdId = id;
    layer._createdTipo = tipo;
    layer._descripcion = descripcion;
    if (tipo === 'marker') {
        layer._iconoId = iconoMarkerActivo;
        layer.setIcon(crearIconoMarker(layer._iconoId, false));
    }
    capasCreadas[id] = {
        id: id,
        nombre: descripcion,
        descripcion: descripcion,
        tipo: tipo,
        layer: layer,
        visible: true,
        atributos: {}
    };
    actualizarAtributosCapaCreada(id);
    layer.on('click', function() { seleccionarCapaCreada(id); });
    layer.on('contextmenu', function(e) {
        L.popup()
            .setLatLng(e.latlng || obtenerCentroLayer(layer))
            .setContent('<div class="popup-inner"><div class="popup-header">CAPA CREADA</div><button class="sci-btn full secondary" onclick="eliminarCapaCreada(\'' + id + '\')">ELIMINAR</button></div>')
            .openOn(map);
    });
    actualizarListaCapas();
    actualizarListaCapasCreadas();
    actualizarSelectores();
}

function actualizarListaCapasCreadas() {
    var cont = document.getElementById('listaCapasCreadas');
    if (!cont) return;
    var ids = Object.keys(capasCreadas);
    cont.innerHTML = '';
    if (ids.length === 0) {
        cont.innerHTML = '<p class="hint-text">Dibuja puntos, lineas o poligonos para agregarlos aqui.</p>';
        return;
    }
    ids.forEach(function(id) {
        var reg = capasCreadas[id];
        var item = document.createElement('div');
        item.className = 'created-layer-item' + (elementoSeleccionado && elementoSeleccionado.id === id ? ' selected' : '');
        item.innerHTML =
            '<div class="created-layer-meta">' +
            '  <input type="checkbox" class="layer-checkbox" data-created-toggle="' + id + '" ' + (reg.visible !== false ? 'checked' : '') + '>' +
            '  <span>' + reg.tipo.toUpperCase() + '</span>' +
            '  <span>' + htmlSeguro(reg.nombre) + '</span>' +
            '</div>' +
            '<div class="created-layer-actions">' +
            '  <button class="layer-action-btn" data-created-select="' + id + '">SEL</button>' +
            '  <button class="layer-action-btn" data-created-zoom="' + id + '">ZOOM</button>' +
            '  <button class="layer-action-btn" data-created-delete="' + id + '">BORRAR</button>' +
            '</div>';
        cont.appendChild(item);
    });
    cont.querySelectorAll('[data-created-toggle]').forEach(function(cb) {
        cb.addEventListener('change', function(e) {
            toggleCapaCreada(e.target.dataset.createdToggle, e.target.checked);
        });
    });
    cont.querySelectorAll('[data-created-select]').forEach(function(btn) {
        btn.addEventListener('click', function() { seleccionarCapaCreada(btn.dataset.createdSelect); });
    });
    cont.querySelectorAll('[data-created-zoom]').forEach(function(btn) {
        btn.addEventListener('click', function() { zoomACapaCreada(btn.dataset.createdZoom); });
    });
    cont.querySelectorAll('[data-created-delete]').forEach(function(btn) {
        btn.addEventListener('click', function() { eliminarCapaCreada(btn.dataset.createdDelete); });
    });
}

function toggleCapaCreada(id, visible) {
    var reg = capasCreadas[id];
    if (!reg) return;
    reg.visible = visible;
    if (visible) {
        if (!drawnItems.hasLayer(reg.layer)) drawnItems.addLayer(reg.layer);
    } else {
        if (drawnItems.hasLayer(reg.layer)) drawnItems.removeLayer(reg.layer);
    }
}

function seleccionarCapaCreada(id) {
    var reg = capasCreadas[id];
    if (!reg) return;
    if (reg.visible === false) toggleCapaCreada(id, true);
    seleccionarElemento(reg.layer, {
        id: id,
        origen: 'creada',
        nombre: reg.nombre,
        tipo: reg.tipo
    });
    irAPanel('panelSeleccion');
}

function zoomACapaCreada(id) {
    var reg = capasCreadas[id];
    if (!reg) return;
    if (reg.layer.getBounds) map.fitBounds(reg.layer.getBounds(), { padding: [40, 40] });
    else if (reg.layer.getLatLng) map.setView(reg.layer.getLatLng(), Math.max(map.getZoom(), 18));
}

function eliminarCapaCreada(id) {
    var reg = capasCreadas[id];
    if (!reg) return;
    if (elementoSeleccionado && elementoSeleccionado.id === id) limpiarSeleccion();
    if (drawnItems.hasLayer(reg.layer)) drawnItems.removeLayer(reg.layer);
    if (map.hasLayer(reg.layer)) map.removeLayer(reg.layer);
    delete capasCreadas[id];
    map.closePopup();
    actualizarListaCapas();
    actualizarListaCapasCreadas();
    actualizarSelectores();
    if (document.getElementById('datosSelectorCapa').value === CAPAS_CREADAS_KEY) {
        mostrarResumenDatos(CAPAS_CREADAS_KEY);
        actualizarCamposGrafica(CAPAS_CREADAS_KEY);
    }
}

function formatearNumero(v) {
    return Number(v).toLocaleString('es-CO', { maximumFractionDigits: 2 });
}

function calcularLongitud(lls) {
    var t = 0;
    for (var i = 0; i < lls.length - 1; i++) t += lls[i].distanceTo(lls[i + 1]);
    return t;
}

function calcularPerimetro(lls) {
    var t = 0;
    for (var i = 0; i < lls.length; i++) t += lls[i].distanceTo(lls[(i + 1) % lls.length]);
    return t;
}

function calcularArea(lls) {
    var area = 0;
    var pts = lls.map(function(ll) { return map.latLngToLayerPoint(ll); });
    for (var i = 0; i < pts.length; i++) {
        var j = (i + 1) % pts.length;
        area += pts[i].x * pts[j].y;
        area -= pts[j].x * pts[i].y;
    }
    return Math.abs(area / 2);
}

function calcularAreaGeodesica(lls) {
    if (L.GeometryUtil && L.GeometryUtil.geodesicArea) {
        return Math.abs(L.GeometryUtil.geodesicArea(lls));
    }
    return calcularArea(lls);
}

function aplicarEstilo(layer, tipo) {
    var estilos = {
        polygon:   { color: '#00ff88', fillColor: '#00ff88', fillOpacity: 0.3 },
        rectangle: { color: '#ff3b3b', fillColor: '#ff3b3b', fillOpacity: 0.3 },
        polyline:  { color: '#ffaa00' },
        circle:    { color: '#cc44ff', fillColor: '#cc44ff', fillOpacity: 0.25 }
    };
    if (estilos[tipo]) layer.setStyle(estilos[tipo]);
}

function agregarPopup(layer, tipo) {
    var c = '';
    var descripcion = layer._descripcion ? htmlSeguro(layer._descripcion) : 'Sin descripción';
    if (tipo === 'marker') {
        var coord = layer.getLatLng();
        c = '<div class="popup-inner"><div class="popup-header">PUNTO</div>' +
            '<div class="popup-row"><span class="popup-key">Lat</span><span class="popup-val">' + formatearNumero(coord.lat) + '</span></div>' +
            '<div class="popup-row"><span class="popup-key">Lng</span><span class="popup-val">' + formatearNumero(coord.lng) + '</span></div>' +
            '<div class="popup-row"><span class="popup-key">Descripción</span><span class="popup-val">' + descripcion + '</span></div></div>';
    }
    if (tipo === 'polyline') {
        c = '<div class="popup-inner"><div class="popup-header">LÍNEA</div>' +
            '<div class="popup-row"><span class="popup-key">Descripción</span><span class="popup-val">' + descripcion + '</span></div>' +
            '<div class="popup-row"><span class="popup-key">Longitud</span><span class="popup-val">' + formatearNumero(calcularLongitud(layer.getLatLngs())) + ' m</span></div></div>';
    }
    if (tipo === 'polygon' || tipo === 'rectangle') {
        var lls = layer.getLatLngs()[0];
        c = '<div class="popup-inner"><div class="popup-header">' + (tipo === 'rectangle' ? 'RECTÁNGULO' : 'POLÍGONO') + '</div>' +
            '<div class="popup-row"><span class="popup-key">Descripción</span><span class="popup-val">' + descripcion + '</span></div>' +
            '<div class="popup-row"><span class="popup-key">Área</span><span class="popup-val">' + formatearNumero(calcularAreaGeodesica(lls)) + ' m²</span></div>' +
            '<div class="popup-row"><span class="popup-key">Perímetro</span><span class="popup-val">' + formatearNumero(calcularPerimetro(lls)) + ' m</span></div></div>';
    }
    if (tipo === 'circle') {
        var r = layer.getRadius();
        c = '<div class="popup-inner"><div class="popup-header">CÍRCULO</div>' +
            '<div class="popup-row"><span class="popup-key">Descripción</span><span class="popup-val">' + descripcion + '</span></div>' +
            '<div class="popup-row"><span class="popup-key">Radio</span><span class="popup-val">' + formatearNumero(r) + ' m</span></div>' +
            '<div class="popup-row"><span class="popup-key">Área</span><span class="popup-val">' + formatearNumero(Math.PI * r * r) + ' m²</span></div></div>';
    }
    layer.bindPopup(c);
}

var drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: {
        polygon:      { shapeOptions: { color: '#00ff88', fillColor: '#00ff88', fillOpacity: 0.3 } },
        polyline:     { shapeOptions: { color: '#ffaa00' } },
        rectangle:    { shapeOptions: { color: '#ff3b3b', fillColor: '#ff3b3b', fillOpacity: 0.3 } },
        circle:       { shapeOptions: { color: '#cc44ff', fillColor: '#cc44ff', fillOpacity: 0.25 } },
        marker:       true,
        circlemarker: false
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function(e) {
    aplicarEstilo(e.layer, e.layerType);
    registrarCapaCreada(e.layer, e.layerType);
    agregarPopup(e.layer, e.layerType);
    drawnItems.addLayer(e.layer);
    seleccionarCapaCreada(e.layer._createdId);
});

map.on('draw:edited', function(e) {
    e.layers.eachLayer(function(layer) {
        var tipo = '';
        if (layer instanceof L.Marker) tipo = 'marker';
        else if (layer instanceof L.Circle) tipo = 'circle';
        else if (layer instanceof L.Rectangle) tipo = 'rectangle';
        else if (layer instanceof L.Polygon) tipo = 'polygon';
        else if (layer instanceof L.Polyline) tipo = 'polyline';
        agregarPopup(layer, tipo);
        if (layer._createdId && capasCreadas[layer._createdId]) {
            capasCreadas[layer._createdId].tipo = tipo;
            actualizarAtributosCapaCreada(layer._createdId);
        }
    });
    actualizarListaCapas();
    actualizarListaCapasCreadas();
    actualizarSelectores();
});

var measureControl = new L.Control.Measure({
    position: 'topright',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'hectares',
    activeColor: '#00d4ff',
    completedColor: '#0088aa'
});
measureControl.addTo(map);

// =============================
// BIBLIOTECA, FILTROS, ALERTAS Y CASOS
// =============================
function crearCapaAnalisis(nombre, features, estilo, popupTitulo) {
    contadorCapasAnalisis += 1;
    var id = 'analisis_' + contadorCapasAnalisis;
    var geojson = { type: 'FeatureCollection', features: features };
    var layer = L.geoJSON(geojson, {
        style: function(feature) {
            var props = feature.properties || {};
            return Object.assign({}, estilo, props._alertStyle || {});
        },
        pointToLayer: function(feature, latlng) {
            var color = (feature.properties && feature.properties._alertColor) || estilo.color || '#00d4ff';
            return L.circleMarker(latlng, {
                radius: 4,
                color: color,
                weight: 1,
                fillColor: color,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, lyr) {
            lyr.bindPopup(function() {
                var props = feature.properties || {};
                var html = '<div class="popup-inner"><div class="popup-header">' + popupTitulo + '</div>';
                Object.keys(props).slice(0, 12).forEach(function(k) {
                    if (k.indexOf('_') === 0) return;
                    html += '<div class="popup-row"><span class="popup-key">' + htmlSeguro(k) + '</span><span class="popup-val">' + htmlSeguro(props[k]) + '</span></div>';
                });
                html += '</div>';
                return html;
            });
            lyr.on('click', function() {
                seleccionarElemento(lyr, { origen: 'analisis', nombre: nombre });
            });
        }
    });
    capasAnalisis[id] = { id: id, nombre: nombre, layer: layer, geojson: geojson, visible: true, tipo: popupTitulo };
    layer.addTo(map);
    actualizarBibliotecas();
    return capasAnalisis[id];
}

function toggleCapaAnalisis(id, visible) {
    var reg = capasAnalisis[id];
    if (!reg) return;
    reg.visible = visible;
    if (visible) {
        if (!map.hasLayer(reg.layer)) reg.layer.addTo(map);
    } else if (map.hasLayer(reg.layer)) {
        map.removeLayer(reg.layer);
    }
    actualizarBibliotecas();
}

function actualizarBibliotecas() {
    var cont = document.getElementById('bibliotecaCapas');
    var cats = document.getElementById('listaCategorizacionesGuardadas');
    var casos = document.getElementById('listaCasos');
    var html = '';

    categorizacionesGuardadas.forEach(function(cat) {
        html += '<div class="created-layer-item"><div class="created-layer-meta"><input type="checkbox" class="layer-checkbox" data-catlib-toggle="' + cat.id + '" checked><span>CAT</span><span>' + htmlSeguro(cat.nombre) + '</span></div><div class="created-layer-actions"><button class="layer-action-btn" data-catlib-apply="' + cat.id + '">APLICAR</button></div></div>';
    });
    Object.keys(capasAnalisis).forEach(function(id) {
        var reg = capasAnalisis[id];
        html += '<div class="created-layer-item"><div class="created-layer-meta"><input type="checkbox" class="layer-checkbox" data-analisis-toggle="' + id + '" ' + (reg.visible ? 'checked' : '') + '><span>' + htmlSeguro(reg.tipo) + '</span><span>' + htmlSeguro(reg.nombre) + '</span></div><div class="created-layer-actions"><button class="layer-action-btn" data-analisis-zoom="' + id + '">ZOOM</button></div></div>';
    });
    if (cont) cont.innerHTML = html || '<p class="hint-text">Las categorizaciones guardadas, alertas y casos apareceran aqui.</p>';
    if (cats) cats.innerHTML = categorizacionesGuardadas.length ? html : '<p class="hint-text">Guarda una categorizacion para verla aqui.</p>';

    var casosHtml = '';
    casosObservacion.forEach(function(caso, i) {
        casosHtml += '<div class="created-layer-item"><div class="created-layer-meta"><span>CASO</span><span>' + htmlSeguro(caso.nombre) + '</span></div><div class="created-layer-actions"><button class="layer-action-btn" data-caso-zoom="' + i + '">ZOOM</button></div></div>';
    });
    if (casos) casos.innerHTML = casosHtml || '<p class="hint-text">Los predios marcados para verificacion apareceran aqui.</p>';

    document.querySelectorAll('[data-analisis-toggle]').forEach(function(cb) {
        cb.addEventListener('change', function() { toggleCapaAnalisis(cb.dataset.analisisToggle, cb.checked); });
    });
    document.querySelectorAll('[data-analisis-zoom]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var reg = capasAnalisis[btn.dataset.analisisZoom];
            if (reg && reg.layer.getBounds) map.fitBounds(reg.layer.getBounds(), { padding: [40, 40] });
        });
    });
    document.querySelectorAll('[data-catlib-apply]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var cat = categorizacionesGuardadas.find(function(c) { return c.id === btn.dataset.catlibApply; });
            if (!cat) return;
            categoriasGeneradas[cat.capaKey] = { campo: cat.campo, categorias: JSON.parse(JSON.stringify(cat.categorias)) };
            var selector = document.getElementById('categoriaSelectorCapa');
            if (selector) selector.value = cat.capaKey;
            aplicarCategorias();
        });
    });
    document.querySelectorAll('[data-catlib-toggle]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            var cat = categorizacionesGuardadas.find(function(c) { return c.id === cb.dataset.catlibToggle; });
            if (!cat) return;
            if (cb.checked) {
                categoriasGeneradas[cat.capaKey] = { campo: cat.campo, categorias: JSON.parse(JSON.stringify(cat.categorias)) };
                var selector = document.getElementById('categoriaSelectorCapa');
                if (selector) selector.value = cat.capaKey;
                aplicarCategorias();
            } else {
                restaurarEstiloCapa(cat.capaKey);
            }
        });
    });
    document.querySelectorAll('[data-caso-zoom]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var caso = casosObservacion[parseInt(btn.dataset.casoZoom, 10)];
            if (caso && caso.bounds) map.fitBounds(caso.bounds, { padding: [40, 40] });
        });
    });
}

function actualizarCamposFiltros(key) {
    var cont = document.getElementById('filtroCondiciones');
    if (!cont || cont.children.length > 0) return;
    agregarCondicionFiltro();
}

function agregarCondicionFiltro() {
    var key = document.getElementById('filtroSelectorCapa') ? document.getElementById('filtroSelectorCapa').value : '';
    var campos = obtenerCamposCapa(key);
    var cont = document.getElementById('filtroCondiciones');
    if (!cont) return;
    var item = document.createElement('div');
    item.className = 'filter-item';
    var camposOpts = campos.map(function(c) { return '<option value="' + htmlSeguro(c) + '">' + htmlSeguro(c) + '</option>'; }).join('');
    item.innerHTML =
        '<select class="sci-select filtro-campo">' + camposOpts + '</select>' +
        '<select class="sci-select filtro-operador"><option value="contiene">contiene</option><option value="igual">igual</option><option value="mayor">mayor que</option><option value="menor">menor que</option><option value="distinto">distinto</option></select>' +
        '<input class="sci-input filtro-valor" placeholder="valor">' +
        '<button class="layer-action-btn filtro-borrar">BORRAR</button>';
    cont.appendChild(item);
    item.querySelector('.filtro-borrar').addEventListener('click', function() { item.remove(); });
}

function cumpleCondicion(valor, operador, esperado) {
    var v = valor === null || valor === undefined ? '' : String(valor);
    var e = esperado === null || esperado === undefined ? '' : String(esperado);
    var nv = Number(v);
    var ne = Number(e);
    if (operador === 'igual') return v.toLowerCase() === e.toLowerCase();
    if (operador === 'distinto') return v.toLowerCase() !== e.toLowerCase();
    if (operador === 'mayor') return !isNaN(nv) && !isNaN(ne) && nv > ne;
    if (operador === 'menor') return !isNaN(nv) && !isNaN(ne) && nv < ne;
    return v.toLowerCase().indexOf(e.toLowerCase()) !== -1;
}

function obtenerCondicionesFiltro() {
    return Array.prototype.slice.call(document.querySelectorAll('#filtroCondiciones .filter-item')).map(function(item) {
        return {
            campo: item.querySelector('.filtro-campo').value,
            operador: item.querySelector('.filtro-operador').value,
            valor: item.querySelector('.filtro-valor').value
        };
    }).filter(function(c) { return c.campo && c.valor !== ''; });
}

function obtenerFeatureLayerPorIndice(key, idx) {
    var found = null;
    if (!capasLeaflet[key]) return found;
    capasLeaflet[key].eachLayer(function(lyr) {
        if (lyr._featureIndex === idx) found = lyr;
    });
    return found;
}

function resumenSuperposiciones(layer, keyBase) {
    if (!layer || !layer.getBounds) return [];
    var bounds = layer.getBounds();
    var resumen = [];
    Object.keys(capasLeaflet).forEach(function(key) {
        if (key === keyBase) return;
        var conteo = 0;
        capasLeaflet[key].eachLayer(function(lyr) {
            if (lyr.getBounds && bounds.intersects(lyr.getBounds())) conteo += 1;
        });
        if (conteo > 0) resumen.push(nombreCapaPorKey(key) + ': ' + conteo);
    });
    return resumen;
}

function aplicarFiltrosAvanzados() {
    var key = document.getElementById('filtroSelectorCapa').value;
    var geojson = obtenerGeoJSONCapa(key);
    var condiciones = obtenerCondicionesFiltro();
    var resumen = document.getElementById('filtroResumen');
    if (!geojson || !geojson.features || condiciones.length === 0) return;
    var features = [];
    geojson.features.forEach(function(f, idx) {
        var props = f.properties || {};
        var ok = condiciones.every(function(c) { return cumpleCondicion(props[c.campo], c.operador, c.valor); });
        if (!ok) return;
        var copia = JSON.parse(JSON.stringify(f));
        var lyr = obtenerFeatureLayerPorIndice(key, idx);
        copia.properties = Object.assign({}, props, { _origen: nombreCapaPorKey(key), superposiciones: resumenSuperposiciones(lyr, key).join(' | ') });
        features.push(copia);
    });
    if (capaFiltroResultados) toggleCapaAnalisis(capaFiltroResultados.id, false);
    capaFiltroResultados = crearCapaAnalisis('Filtro avanzado ' + new Date().toLocaleTimeString(), features, { color: '#ffea00', fillColor: '#ffea00', weight: 3, fillOpacity: 0.35, opacity: 1 }, 'FILTRO');
    if (resumen) resumen.innerHTML = '<div class="d-row"><span class="d-key">RESULTADOS</span><span class="d-val">' + features.length + '</span></div><div class="d-row"><span class="d-key">CAPA</span><span class="d-val">' + htmlSeguro(nombreCapaPorKey(key)) + '</span></div>';
}

function buscarPredioPorCodigo() {
    var q = (document.getElementById('busquedaPredio').value || '').trim().toLowerCase();
    if (!q) return;
    var key = document.getElementById('filtroSelectorCapa').value || 'lotes_samu';
    var geojson = obtenerGeoJSONCapa(key);
    if (!geojson || !geojson.features) return;
    var features = [];
    geojson.features.forEach(function(f, idx) {
        var props = f.properties || {};
        var cbml = String(props.cbml || '').toLowerCase();
        var cobama = String(props.cobama || '').toLowerCase();
        if (cbml === q || cobama === q || cbml.indexOf(q) !== -1 || cobama.indexOf(q) !== -1) {
            var copia = JSON.parse(JSON.stringify(f));
            var lyr = obtenerFeatureLayerPorIndice(key, idx);
            copia.properties = Object.assign({}, props, { superposiciones: resumenSuperposiciones(lyr, key).join(' | ') });
            features.push(copia);
        }
    });
    crearCapaAnalisis('Busqueda predio ' + q, features, { color: '#00ff88', fillColor: '#00ff88', weight: 4, fillOpacity: 0.3, opacity: 1 }, 'PREDIO');
    if (features.length && document.getElementById('filtroResumen')) {
        document.getElementById('filtroResumen').innerHTML = '<div class="d-row"><span class="d-key">PREDIOS</span><span class="d-val">' + features.length + '</span></div>';
    }
}

function analizarSeleccionActual() {
    if (!elementoSeleccionado || !elementoSeleccionado.layer) return;
    var props = elementoSeleccionado.layer.feature ? elementoSeleccionado.layer.feature.properties : {};
    var resumen = resumenSuperposiciones(elementoSeleccionado.layer, elementoSeleccionado.capaKey || '');
    var div = document.getElementById('filtroResumen');
    if (div) {
        div.innerHTML = '<div class="d-row"><span class="d-key">SELECCION</span><span class="d-val">' + htmlSeguro(elementoSeleccionado.nombre || 'Elemento') + '</span></div><div class="d-row"><span class="d-key">CBML</span><span class="d-val">' + htmlSeguro(props.cbml || 'N/D') + '</span></div><div class="d-row"><span class="d-key">SUPERPONE</span><span class="d-val">' + htmlSeguro(resumen.join(' | ') || 'Sin cruces') + '</span></div>';
    }
}

function actualizarCamposAlertas() {}

function normalizarIdCatastral(valor) {
    return String(valor || '').trim().toLowerCase();
}

function buscarFeaturePorCampos(key, campos, propsBase) {
    var geojson = obtenerGeoJSONCapa(key);
    if (!geojson || !geojson.features) return null;
    for (var i = 0; i < campos.length; i += 1) {
        var campo = campos[i];
        var valor = normalizarIdCatastral(propsBase[campo]);
        if (!valor) continue;
        for (var j = 0; j < geojson.features.length; j += 1) {
            var props = geojson.features[j].properties || {};
            if (normalizarIdCatastral(props[campo]) === valor) {
                return { feature: geojson.features[j], index: j, props: props };
            }
        }
    }
    return null;
}

function buscarLayerRelacionado(key, layerBase) {
    if (!layerBase || !layerBase.getBounds || !capasLeaflet[key]) return null;
    var bounds = layerBase.getBounds();
    var encontrado = null;
    capasLeaflet[key].eachLayer(function(lyr) {
        if (encontrado) return;
        if (lyr.getBounds && bounds.intersects(lyr.getBounds())) encontrado = lyr;
        else if (lyr.getLatLng && bounds.contains(lyr.getLatLng())) encontrado = lyr;
    });
    return encontrado;
}

function propsDeLayer(layer) {
    return layer && layer.feature ? (layer.feature.properties || {}) : {};
}

function construirIndiceLayers(key) {
    var indice = {};
    if (!capasLeaflet[key]) return indice;
    capasLeaflet[key].eachLayer(function(lyr) {
        if (lyr._featureIndex !== undefined) indice[lyr._featureIndex] = lyr;
    });
    return indice;
}

function obtenerLayersCapa(key) {
    var layers = [];
    if (!capasLeaflet[key]) return layers;
    capasLeaflet[key].eachLayer(function(lyr) { layers.push(lyr); });
    return layers;
}

function layersRelacionados(key, layerBase) {
    var relacionados = [];
    if (!layerBase || !capasLeaflet[key]) return relacionados;
    var bounds = layerBase.getBounds ? layerBase.getBounds() : null;
    var latlng = layerBase.getLatLng ? layerBase.getLatLng() : null;
    capasLeaflet[key].eachLayer(function(lyr) {
        if (lyr.getBounds && bounds && bounds.intersects(lyr.getBounds())) relacionados.push(lyr);
        else if (lyr.getLatLng && bounds && bounds.contains(lyr.getLatLng())) relacionados.push(lyr);
        else if (lyr.getBounds && latlng && lyr.getBounds().contains(latlng)) relacionados.push(lyr);
    });
    return relacionados;
}

function textoContiene(props, campos, patrones) {
    var texto = campos.map(function(c) { return props && props[c] !== undefined ? props[c] : ''; }).join(' ').toLowerCase();
    return patrones.some(function(p) { return texto.indexOf(p) !== -1; });
}

function tituloResultado(prefix, props, idx) {
    return prefix + ' ' + (props.cbml || props.cobama || props.codigo || props.nombre_est || props.id_constru || props.FID || idx);
}

function numeroCampo(props, campo) {
    var valor = Number(props && props[campo]);
    return isNaN(valor) ? null : valor;
}

function valorParametro(id, defecto) {
    var el = document.getElementById(id);
    var valor = el ? Number(el.value) : NaN;
    return isNaN(valor) ? defecto : valor;
}

function nivelAlertaDesdeRazones(razones) {
    var criticas = razones.filter(function(r) { return r.nivel === 'alto'; }).length;
    if (criticas || razones.length >= 3) return 'alto';
    if (razones.length >= 2) return 'medio';
    return 'bajo';
}

function colorNivelAlerta(nivel) {
    if (nivel === 'alto') return '#ff3b3b';
    if (nivel === 'medio') return '#ffd700';
    return '#00d4ff';
}

function textoNumero(valor, sufijo) {
    return valor === null || valor === undefined ? 'N/D' : formatearNumero(valor) + (sufijo || '');
}

function construirResultadoAuditoria(feature, props, idx, layer, razones, contexto) {
    var nivel = nivelAlertaDesdeRazones(razones);
    var color = colorNivelAlerta(nivel);
    var copia = JSON.parse(JSON.stringify(feature));
    copia.properties = Object.assign({}, props, {
        _nivelAlerta: nivel,
        _razonesAlerta: razones.map(function(r) { return r.texto; }).join(' | '),
        _capasCruce: contexto.capas.join(', '),
        _alertColor: color,
        _alertStyle: { color: color, fillColor: color, fillOpacity: nivel === 'alto' ? 0.48 : 0.32, weight: nivel === 'alto' ? 4 : 3 }
    });
    return {
        feature: copia,
        layer: layer,
        featureIndex: idx,
        nivel: nivel,
        color: color,
        capaKey: contexto.capaKey || 'construcciones_bvh',
        titulo: contexto.titulo || tituloResultado('Elemento', props, idx),
        razones: razones,
        contexto: contexto
    };
}

function modeloCrecimientoVertical() {
    var key = 'construcciones_bvh';
    var geojson = obtenerGeoJSONCapa(key);
    if (!geojson || !geojson.features) return;

    var pisosAltos = valorParametro('alertaPisosAltos', 4);
    var estratoBajo = valorParametro('alertaEstratoBajo', 2);
    var valorM2Bajo = valorParametro('alertaValorM2Bajo', 1000000);
    var tolerancia = valorParametro('alertaAreaTolerancia', 75) / 100;
    var resultados = [];
    var layersBase = construirIndiceLayers(key);
    var layersLotes = construirIndiceLayers('lotes_samu');
    var layersUsos = construirIndiceLayers('usos_del_predio');

    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layersBase[idx] || obtenerFeatureLayerPorIndice(key, idx);
        var loteMatch = buscarFeaturePorCampos('lotes_samu', ['cbml', 'cobama'], props);
        var loteLayer = loteMatch ? layersLotes[loteMatch.index] : buscarLayerRelacionado('lotes_samu', layer);
        var loteProps = loteMatch ? loteMatch.props : propsDeLayer(loteLayer);
        var estratoLayer = buscarLayerRelacionado('estrato_SE', layer);
        var zonaLayer = buscarLayerRelacionado('zonas_geoeconomicas', layer);
        var usoMatch = buscarFeaturePorCampos('usos_del_predio', ['cbml', 'cobama'], props);
        var usoLayer = usoMatch ? layersUsos[usoMatch.index] : buscarLayerRelacionado('usos_del_predio', layer);
        var usoProps = usoMatch ? usoMatch.props : propsDeLayer(usoLayer);

        var pisos = numeroCampo(props, 'numero_pis');
        var areaConst = numeroCampo(props, 'area_const');
        var areaLote = numeroCampo(loteProps, 'area_lote');
        var estrato = numeroCampo(propsDeLayer(estratoLayer), 'estrato');
        if (estrato === null) estrato = numeroCampo(usoProps, 'estrato');
        var valorM2 = numeroCampo(propsDeLayer(zonaLayer), 'valor_m2');
        var pisosUso = numeroCampo(usoProps, 'numero_edi');
        var pisosLote = numeroCampo(loteProps, 'numero_edi');
        var razones = [];
        var capas = ['construcciones'];

        if (loteLayer || loteMatch) capas.push('lotes');
        else razones.push({ nivel: 'medio', texto: 'no se encontro lote asociado por CBML/COBAMA ni por cruce espacial' });
        if (estratoLayer || estrato !== null) capas.push('estrato');
        if (zonaLayer || valorM2 !== null) capas.push('zonas geoeconomicas');
        if (usoLayer || usoMatch) capas.push('usos del predio');

        if (pisos !== null && pisos >= pisosAltos && estrato !== null && estrato <= estratoBajo) {
            razones.push({ nivel: 'alto', texto: pisos + ' pisos en estrato ' + estrato });
        }
        if (pisos !== null && pisos >= pisosAltos && valorM2 !== null && valorM2 <= valorM2Bajo) {
            razones.push({ nivel: 'medio', texto: pisos + ' pisos en zona con valor m2 ' + textoNumero(valorM2) });
        }
        if (areaConst !== null && areaLote !== null && pisos !== null && areaLote > 0) {
            var pisosEstimados = areaConst / areaLote;
            if (pisosEstimados > pisos + tolerancia) {
                razones.push({ nivel: 'alto', texto: 'area construida sugiere ' + formatearNumero(pisosEstimados) + ' pisos frente a ' + pisos + ' registrados' });
            }
        }
        if (pisos !== null && pisosUso !== null && Math.abs(pisos - pisosUso) >= 2) {
            razones.push({ nivel: 'medio', texto: 'pisos en construccion (' + pisos + ') difieren de usos del predio (' + pisosUso + ')' });
        }
        if (pisos !== null && pisosLote !== null && Math.abs(pisos - pisosLote) >= 2) {
            razones.push({ nivel: 'medio', texto: 'pisos en construccion (' + pisos + ') difieren de lotes (' + pisosLote + ')' });
        }

        if (razones.length) {
            resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
                capaKey: key,
                titulo: tituloResultado('Construccion', props, idx),
                capas: capas,
                pisos: pisos,
                areaConst: areaConst,
                areaLote: areaLote,
                estrato: estrato,
                valorM2: valorM2,
                uso: usoProps.destinacio || usoProps.nombre_pre || 'N/D'
            }));
        }
    });
    return resultados;
}

function modeloLotesSinConstruccion() {
    var geojson = obtenerGeoJSONCapa('lotes_samu');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('lotes_samu');
    var resultados = [];
    var areaLoteAlta = valorParametro('alertaValorM2Bajo', 120);
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('lotes_samu', idx);
        var construcciones = layersRelacionados('construcciones_bvh', layer);
        var areaLote = numeroCampo(props, 'area_lote');
        var numeroEdi = numeroCampo(props, 'numero_edi');
        var razones = [];
        if (!construcciones.length) razones.push({ nivel: areaLote && areaLote > areaLoteAlta ? 'alto' : 'medio', texto: 'lote sin construccion asociada por cruce espacial' });
        if (!construcciones.length && numeroEdi && numeroEdi > 0) razones.push({ nivel: 'alto', texto: 'el lote registra numero_edi ' + numeroEdi + ' pero no cruza construcciones' });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'lotes_samu', titulo: tituloResultado('Lote', props, idx), capas: ['lotes', 'construcciones'], pisos: numeroEdi, areaLote: areaLote, areaConst: null, estrato: null, valorM2: null
        }));
    });
    return resultados;
}

function modeloConstruccionesSinLote() {
    var geojson = obtenerGeoJSONCapa('construcciones_bvh');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('construcciones_bvh');
    var resultados = [];
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('construcciones_bvh', idx);
        var loteMatch = buscarFeaturePorCampos('lotes_samu', ['cbml', 'cobama'], props);
        var loteLayer = loteMatch ? obtenerFeatureLayerPorIndice('lotes_samu', loteMatch.index) : buscarLayerRelacionado('lotes_samu', layer);
        var razones = [];
        if (!loteMatch) razones.push({ nivel: 'medio', texto: 'no coincide con lotes por CBML/COBAMA' });
        if (!loteLayer) razones.push({ nivel: 'alto', texto: 'no intersecta ningun lote' });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'construcciones_bvh', titulo: tituloResultado('Construccion', props, idx), capas: ['construcciones', 'lotes'], pisos: numeroCampo(props, 'numero_pis'), areaConst: numeroCampo(props, 'area_const'), areaLote: null, estrato: null, valorM2: null
        }));
    });
    return resultados;
}

function modeloUsoVsPot() {
    var geojson = obtenerGeoJSONCapa('usos_del_predio');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('usos_del_predio');
    var grupos = {};
    var unidadesAlto = valorParametro('alertaPisosAltos', 6);
    var estratoBajo = valorParametro('alertaEstratoBajo', 2);
    var resultados = [];

    geojson.features.forEach(function(feature) {
        var props = feature.properties || {};
        var cbml = normalizarIdCatastral(props.cbml);
        if (!cbml) return;
        if (!grupos[cbml]) grupos[cbml] = { total: 0, destinos: {}, tieneLote: false, tieneActivo: false };
        grupos[cbml].total += 1;
        var destino = String(props.destinacio || 'Sin dato');
        grupos[cbml].destinos[destino] = true;
        if (textoContiene(props, ['destinacio'], ['lote', 'sin uso'])) grupos[cbml].tieneLote = true;
        if (!textoContiene(props, ['destinacio'], ['lote', 'sin uso'])) grupos[cbml].tieneActivo = true;
    });

    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('usos_del_predio', idx);
        var pot = buscarLayerRelacionado('pot48_usos_generales', layer);
        var potProps = propsDeLayer(pot);
        var construccionMatch = buscarFeaturePorCampos('construcciones_bvh', ['cbml'], props);
        var construccionLayer = construccionMatch ? obtenerFeatureLayerPorIndice('construcciones_bvh', construccionMatch.index) : buscarLayerRelacionado('construcciones_bvh', layer);
        var construccionProps = construccionMatch ? construccionMatch.props : propsDeLayer(construccionLayer);
        var cbml = normalizarIdCatastral(props.cbml);
        var grupo = grupos[cbml] || { total: 1, destinos: {}, tieneLote: false, tieneActivo: false };
        var destinos = Object.keys(grupo.destinos);
        var usoEconomico = textoContiene(props, ['destinacio', 'nombre_pre', 'tipo_punto'], ['comerc', 'industr', 'servic']);
        var potResidencial = textoContiene(potProps, ['areagralus', 'subcategor'], ['baja mixtura', 'residen', 'habitacional']);
        var estrato = numeroCampo(props, 'estrato');
        var pisosUso = numeroCampo(props, 'numero_edi');
        var pisosConstruccion = numeroCampo(construccionProps, 'numero_pis');
        var razones = [];
        if (grupo.tieneLote && grupo.tieneActivo) razones.push({ nivel: 'medio', texto: 'CBML registra lote/sin uso y tambien usos activos' });
        if (destinos.length >= 3) razones.push({ nivel: 'medio', texto: 'CBML con mezcla de destinos: ' + destinos.slice(0, 4).join(', ') });
        if (grupo.total >= unidadesAlto) razones.push({ nivel: 'alto', texto: grupo.total + ' unidades o registros asociados al mismo CBML' });
        if (usoEconomico && potResidencial) razones.push({ nivel: 'alto', texto: 'uso economico en area POT predominantemente residencial o baja mixtura' });
        if (usoEconomico && estrato !== null && estrato <= estratoBajo) razones.push({ nivel: 'medio', texto: 'uso economico en estrato ' + estrato });
        if (pisosUso !== null && pisosConstruccion !== null && Math.abs(pisosUso - pisosConstruccion) >= 2) {
            razones.push({ nivel: 'medio', texto: 'numero_edi en uso (' + pisosUso + ') difiere de pisos construccion (' + pisosConstruccion + ')' });
        }
        if (!pot) razones.push({ nivel: 'bajo', texto: 'uso predial sin cruce con POT para contexto normativo' });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'usos_del_predio',
            titulo: tituloResultado('Uso predial', props, idx),
            capas: ['usos del predio', 'POT', 'construcciones'],
            pisos: pisosUso,
            areaConst: numeroCampo(construccionProps, 'area_const'),
            areaLote: null,
            estrato: estrato,
            valorM2: null
        }));
    });
    return resultados;
}

function modeloComercioResidencial() {
    var geojson = obtenerGeoJSONCapa('establecimientos_industria_comercio');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('establecimientos_industria_comercio');
    var resultados = [];
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('establecimientos_industria_comercio', idx);
        var usos = layersRelacionados('usos_del_predio', layer);
        var razones = [];
        var usoProps = usos.length ? propsDeLayer(usos[0]) : {};
        if (!usos.length) razones.push({ nivel: 'bajo', texto: 'establecimiento sin predio de uso asociado' });
        if (usos.some(function(u) { return textoContiene(propsDeLayer(u), ['destinacio', 'nombre_pre'], ['vivienda', 'residen', 'habitacion']); })) {
            razones.push({ nivel: 'alto', texto: 'establecimiento economico sobre predio residencial' });
        }
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'establecimientos_industria_comercio', titulo: tituloResultado('Establecimiento', props, idx), capas: ['establecimientos', 'usos del predio'], pisos: null, areaConst: null, areaLote: null, estrato: numeroCampo(usoProps, 'estrato'), valorM2: null
        }));
    });
    return resultados;
}

function modeloActividadConcentrada() {
    var geojson = obtenerGeoJSONCapa('lotes_samu');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('lotes_samu');
    var resultados = [];
    var altoDesde = valorParametro('alertaPisosAltos', 5);
    var medioDesde = valorParametro('alertaEstratoBajo', 2);
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('lotes_samu', idx);
        var establecimientos = layersRelacionados('establecimientos_industria_comercio', layer);
        var razones = [];
        if (establecimientos.length >= altoDesde) razones.push({ nivel: 'alto', texto: establecimientos.length + ' establecimientos en el mismo lote' });
        else if (establecimientos.length >= medioDesde) razones.push({ nivel: 'medio', texto: establecimientos.length + ' establecimientos concentrados en el lote' });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'lotes_samu', titulo: tituloResultado('Lote', props, idx), capas: ['lotes', 'establecimientos'], pisos: numeroCampo(props, 'numero_edi'), areaLote: numeroCampo(props, 'area_lote'), areaConst: null, estrato: null, valorM2: null
        }));
    });
    return resultados;
}

function modeloRetiroHidrico() {
    var geojson = obtenerGeoJSONCapa('construcciones_bvh');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('construcciones_bvh');
    var resultados = [];
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('construcciones_bvh', idx);
        var buffers = layersRelacionados('redhidrica_buffer', layer);
        var razones = [];
        if (buffers.length) razones.push({ nivel: 'alto', texto: 'construccion intersecta buffer de red hidrica' });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'construcciones_bvh', titulo: tituloResultado('Construccion', props, idx), capas: ['construcciones', 'red hidrica buffer'], pisos: numeroCampo(props, 'numero_pis'), areaConst: numeroCampo(props, 'area_const'), areaLote: null, estrato: null, valorM2: null
        }));
    });
    return resultados;
}

function modeloValorIntensidad() {
    var resultados = (modeloCrecimientoVertical() || []).filter(function(r) {
        return r.razones.some(function(x) { return x.texto.indexOf('valor m2') !== -1 || x.texto.indexOf('area construida') !== -1; });
    });
    resultados.forEach(function(r) {
        r.titulo = r.titulo.replace('Construccion', 'Intensidad');
        r.contexto.capas = ['construcciones', 'lotes', 'zonas geoeconomicas'];
    });
    return resultados;
}

function modeloEstratoActividad() {
    var geojson = obtenerGeoJSONCapa('usos_del_predio');
    if (!geojson || !geojson.features) return [];
    var layers = construirIndiceLayers('usos_del_predio');
    var resultados = [];
    var estratoBajo = valorParametro('alertaEstratoBajo', 2);
    var establecimientosAlto = valorParametro('alertaPisosAltos', 2);
    geojson.features.forEach(function(feature, idx) {
        var props = feature.properties || {};
        var layer = layers[idx] || obtenerFeatureLayerPorIndice('usos_del_predio', idx);
        var estratoLayer = buscarLayerRelacionado('estrato_SE', layer);
        var estrato = numeroCampo(props, 'estrato');
        if (estrato === null) estrato = numeroCampo(propsDeLayer(estratoLayer), 'estrato');
        var establecimientos = layersRelacionados('establecimientos_industria_comercio', layer);
        var usoEconomico = textoContiene(props, ['destinacio', 'nombre_pre'], ['comerc', 'industr', 'servic']) || establecimientos.length > 0;
        var razones = [];
        if (usoEconomico && estrato !== null && estrato <= estratoBajo) razones.push({ nivel: 'medio', texto: 'actividad economica en contexto de estrato ' + estrato });
        if (establecimientos.length >= establecimientosAlto && estrato !== null && estrato <= estratoBajo) razones.push({ nivel: 'alto', texto: establecimientos.length + ' establecimientos asociados a predio de estrato ' + estrato });
        if (razones.length) resultados.push(construirResultadoAuditoria(feature, props, idx, layer, razones, {
            capaKey: 'usos_del_predio', titulo: tituloResultado('Predio', props, idx), capas: ['usos del predio', 'estrato', 'establecimientos'], pisos: numeroCampo(props, 'numero_edi'), areaConst: null, areaLote: null, estrato: estrato, valorM2: null
        }));
    });
    return resultados;
}

function ejecutarAlertas() {
    var modelo = document.getElementById('alertaModelo').value || 'pisos';
    var ejecutores = {
        pisos: modeloCrecimientoVertical,
        lotes_sin_construccion: modeloLotesSinConstruccion,
        construcciones_sin_lote: modeloConstruccionesSinLote,
        uso_vs_pot: modeloUsoVsPot,
        comercio_residencial: modeloComercioResidencial,
        actividad_concentrada: modeloActividadConcentrada,
        retiro_hidrico: modeloRetiroHidrico,
        valor_intensidad: modeloValorIntensidad,
        estrato_actividad: modeloEstratoActividad
    };
    var fn = ejecutores[modelo] || modeloCrecimientoVertical;
    alertaResultados = fn() || [];
    alertaCategoriaActiva = null;
    if (capaAlertasResultados) toggleCapaAnalisis(capaAlertasResultados.id, false);
    if (alertaResultados.length) {
        capaAlertasResultados = crearCapaAnalisis('Auditoria catastral ' + new Date().toLocaleTimeString(), alertaResultados.map(function(r) { return r.feature; }), { color: '#00d4ff', fillColor: '#00d4ff', weight: 2, fillOpacity: 0.2, opacity: 1 }, 'AUDITORIA');
    }
    renderizarResultadosAlertas();
}

function renderizarResultadosAlertas() {
    var conteo = { alto: 0, medio: 0, bajo: 0 };
    alertaResultados.forEach(function(r) { conteo[r.nivel] += 1; });
    var div = document.getElementById('alertaResumen');
    if (div) {
        div.innerHTML =
            '<button class="audit-summary-card alto" onclick="mostrarCategoriaAlerta(\'alto\')"><span>ALTO</span><strong>' + conteo.alto + '</strong></button>' +
            '<button class="audit-summary-card medio" onclick="mostrarCategoriaAlerta(\'medio\')"><span>MEDIO</span><strong>' + conteo.medio + '</strong></button>' +
            '<button class="audit-summary-card bajo" onclick="mostrarCategoriaAlerta(\'bajo\')"><span>BAJO</span><strong>' + conteo.bajo + '</strong></button>' +
            '<div class="d-row"><span class="d-key">TOTAL</span><span class="d-val">' + alertaResultados.length + '</span></div>';
    }
    var cont = document.getElementById('alertaResultados');
    if (!cont) return;
    if (!alertaResultados.length) {
        cont.innerHTML = '<p class="hint-text">No se encontraron irregularidades con los parametros actuales.</p>';
        return;
    }
    if (!alertaCategoriaActiva) {
        cont.innerHTML = '<p class="hint-text">Haz clic en ALTO, MEDIO o BAJO para ver los objetos de esa categoria.</p>';
        return;
    }
    var filtrados = alertaResultados.map(function(r, i) { return { r: r, i: i }; }).filter(function(item) { return item.r.nivel === alertaCategoriaActiva; });
    cont.innerHTML = filtrados.slice(0, 120).map(function(item) {
        var r = item.r;
        var i = item.i;
        return '<div class="audit-result-item">' +
            '<div class="audit-result-head"><span class="audit-level ' + r.nivel + '">' + r.nivel.toUpperCase() + '</span><span>' + htmlSeguro(r.titulo) + '</span></div>' +
            '<div class="audit-result-body">' + htmlSeguro(r.razones.map(function(x) { return x.texto; }).join(' | ')) + '</div>' +
            '<div class="audit-result-meta">Pisos: ' + htmlSeguro(textoNumero(r.contexto.pisos, '')) + ' - Estrato: ' + htmlSeguro(textoNumero(r.contexto.estrato, '')) + ' - Valor m2: ' + htmlSeguro(textoNumero(r.contexto.valorM2, '')) + '</div>' +
            '<div class="created-layer-actions"><button class="layer-action-btn" onclick="zoomAResultadoAlerta(' + i + ')">VERIFICAR</button><button class="layer-action-btn" onclick="guardarResultadoAlerta(' + i + ')">GUARDAR</button></div>' +
            '</div>';
    }).join('');
}

function mostrarCategoriaAlerta(nivel) {
    alertaCategoriaActiva = nivel;
    renderizarResultadosAlertas();
}

function zoomAResultadoAlerta(i) {
    var r = alertaResultados[i];
    if (!r || !r.layer) return;
    seleccionarElemento(r.layer, { capaKey: r.capaKey || 'construcciones_bvh', featureIndex: r.featureIndex, origen: 'auditoria', nombre: r.titulo });
    if (r.layer.getBounds) map.fitBounds(r.layer.getBounds(), { padding: [40, 40] });
    else if (r.layer.getLatLng) map.setView(r.layer.getLatLng(), Math.max(map.getZoom(), 18));
}

function guardarResultadoAlerta(i) {
    zoomAResultadoAlerta(i);
    var r = alertaResultados[i];
    if (!r || !r.layer) return;
    casosObservacion.push({
        nombre: r.titulo + ' - ' + r.nivel,
        props: Object.assign({}, r.feature.properties),
        bounds: r.layer.getBounds ? r.layer.getBounds() : null
    });
    actualizarBibliotecas();
}

function limpiarAlertas() {
    if (capaAlertasResultados) toggleCapaAnalisis(capaAlertasResultados.id, false);
    capaAlertasResultados = null;
    alertaResultados = [];
    alertaCategoriaActiva = null;
    var div = document.getElementById('alertaResumen');
    if (div) div.innerHTML = '<p class="hint-text">Cruza construcciones con lotes, estrato, valor m2 y usos del predio.</p>';
    var cont = document.getElementById('alertaResultados');
    if (cont) cont.innerHTML = '';
    actualizarModeloAlertas();
}

var modelosAuditoriaInfo = {
    pisos: {
        base: 'construcciones_bvh',
        texto: 'Cruza construcciones con lotes, estrato, valor m2 y usos del predio.',
        parametros: [
            { id: 'PisosAltos', label: 'Pisos altos desde', value: 4 },
            { id: 'EstratoBajo', label: 'Estrato bajo hasta', value: 2 },
            { id: 'ValorM2Bajo', label: 'Valor m2 bajo hasta', value: 1000000 },
            { id: 'AreaTolerancia', label: 'Tolerancia area %', value: 75 }
        ]
    },
    lotes_sin_construccion: {
        base: 'lotes_samu',
        texto: 'Busca lotes sin construcciones asociadas o con numero_edi pero sin geometria construida.',
        parametros: [
            { id: 'ValorM2Bajo', label: 'Area lote alta desde m2', value: 120 }
        ]
    },
    construcciones_sin_lote: {
        base: 'construcciones_bvh',
        texto: 'Busca construcciones sin lote por CBML/COBAMA o sin interseccion espacial.',
        parametros: []
    },
    uso_vs_pot: {
        base: 'usos_del_predio',
        texto: 'Audita mezcla de destinos, usos economicos, concentracion por CBML, POT y diferencias con construcciones.',
        parametros: [
            { id: 'PisosAltos', label: 'Alto desde registros por CBML', value: 6 },
            { id: 'EstratoBajo', label: 'Estrato bajo hasta', value: 2 }
        ]
    },
    comercio_residencial: {
        base: 'establecimientos_industria_comercio',
        texto: 'Cruza establecimientos economicos con usos residenciales del predio.',
        parametros: []
    },
    actividad_concentrada: {
        base: 'lotes_samu',
        texto: 'Detecta concentracion de establecimientos dentro de un mismo lote.',
        parametros: [
            { id: 'PisosAltos', label: 'Alto desde establecimientos', value: 5 },
            { id: 'EstratoBajo', label: 'Medio desde establecimientos', value: 2 }
        ]
    },
    retiro_hidrico: {
        base: 'construcciones_bvh',
        texto: 'Busca construcciones que intersectan el buffer de red hidrica.',
        parametros: []
    },
    valor_intensidad: {
        base: 'construcciones_bvh',
        texto: 'Compara intensidad constructiva con area de lote y valor m2.',
        parametros: [
            { id: 'PisosAltos', label: 'Pisos altos desde', value: 4 },
            { id: 'ValorM2Bajo', label: 'Valor m2 bajo hasta', value: 1000000 },
            { id: 'AreaTolerancia', label: 'Tolerancia area %', value: 75 }
        ]
    },
    estrato_actividad: {
        base: 'usos_del_predio',
        texto: 'Cruza uso/actividad economica con estrato y establecimientos cercanos.',
        parametros: [
            { id: 'PisosAltos', label: 'Alto desde establecimientos', value: 2 },
            { id: 'EstratoBajo', label: 'Estrato bajo hasta', value: 2 }
        ]
    }
};

function actualizarModeloAlertas() {
    var modelo = document.getElementById('alertaModelo');
    var capa = document.getElementById('alertaSelectorCapa');
    var info = document.getElementById('alertaModeloInfo');
    var panelParametros = document.getElementById('alertaParametros');
    if (!modelo) return;
    var cfg = modelosAuditoriaInfo[modelo.value] || modelosAuditoriaInfo.pisos;
    if (capa) {
        capa.innerHTML = '<option value="' + cfg.base + '">' + htmlSeguro(nombreCapaPorKey(cfg.base)) + '</option>';
    }
    if (info) info.textContent = cfg.texto;
    ['PisosAltos', 'EstratoBajo', 'ValorM2Bajo', 'AreaTolerancia'].forEach(function(id) {
        var field = document.getElementById('param' + id);
        if (field) field.classList.add('hidden');
    });
    (cfg.parametros || []).forEach(function(param) {
        var field = document.getElementById('param' + param.id);
        var label = document.getElementById('labelAlerta' + param.id);
        var input = document.getElementById('alerta' + param.id);
        if (field) field.classList.remove('hidden');
        if (label) label.textContent = param.label;
        if (input) {
            input.value = param.value;
            input.placeholder = String(param.value);
        }
    });
    if (panelParametros) panelParametros.classList.toggle('hidden', !cfg.parametros || cfg.parametros.length === 0);
}

function guardarCasoSeleccionado() {
    if (!elementoSeleccionado || !elementoSeleccionado.layer) return;
    var props = elementoSeleccionado.layer.feature ? elementoSeleccionado.layer.feature.properties || {} : {};
    var nombre = window.prompt('Nombre u observacion del caso:', props.cbml || props.cobama || elementoSeleccionado.nombre || 'Caso de verificacion');
    if (!nombre) return;
    casosObservacion.push({
        nombre: nombre,
        props: Object.assign({}, props),
        bounds: elementoSeleccionado.layer.getBounds ? elementoSeleccionado.layer.getBounds() : null
    });
    actualizarBibliotecas();
}

if (document.getElementById('btnAgregarFiltro')) document.getElementById('btnAgregarFiltro').addEventListener('click', agregarCondicionFiltro);
if (document.getElementById('btnAplicarFiltros')) document.getElementById('btnAplicarFiltros').addEventListener('click', aplicarFiltrosAvanzados);
if (document.getElementById('btnLimpiarFiltros')) document.getElementById('btnLimpiarFiltros').addEventListener('click', function() {
    document.getElementById('filtroCondiciones').innerHTML = '';
    agregarCondicionFiltro();
    if (capaFiltroResultados) toggleCapaAnalisis(capaFiltroResultados.id, false);
});
if (document.getElementById('btnBuscarPredio')) document.getElementById('btnBuscarPredio').addEventListener('click', buscarPredioPorCodigo);
if (document.getElementById('btnFiltroSeleccion')) document.getElementById('btnFiltroSeleccion').addEventListener('click', analizarSeleccionActual);
if (document.getElementById('filtroSelectorCapa')) document.getElementById('filtroSelectorCapa').addEventListener('change', function() {
    document.getElementById('filtroCondiciones').innerHTML = '';
    agregarCondicionFiltro();
});
if (document.getElementById('alertaModelo')) document.getElementById('alertaModelo').addEventListener('change', actualizarModeloAlertas);
if (document.getElementById('alertaSelectorCapa')) document.getElementById('alertaSelectorCapa').addEventListener('change', function() { actualizarCamposAlertas(this.value); });
if (document.getElementById('btnEjecutarAlertas')) document.getElementById('btnEjecutarAlertas').addEventListener('click', ejecutarAlertas);
if (document.getElementById('btnLimpiarAlertas')) document.getElementById('btnLimpiarAlertas').addEventListener('click', limpiarAlertas);
if (document.getElementById('btnGuardarCasoSeleccion')) document.getElementById('btnGuardarCasoSeleccion').addEventListener('click', guardarCasoSeleccionado);

// =============================
// GOOGLE STREET VIEW EMBED
// =============================
function actualizarStreetView(latlng) {
    var panel = document.getElementById('streetViewPanel');
    var frame = document.getElementById('streetViewFrame');
    var empty = document.getElementById('streetViewEmpty');
    if (!panel || !frame || !empty) return;

    if (!GOOGLE_STREET_VIEW_API_KEY) {
        if (frame.getAttribute('src')) {
            panel.classList.add('has-view');
        } else {
            panel.classList.remove('has-view');
            empty.textContent = 'Configura GOOGLE_STREET_VIEW_API_KEY en scripts.js para activar Street View.';
        }
        return;
    }

    var lat = latlng.lat.toFixed(6);
    var lng = latlng.lng.toFixed(6);
    frame.src = 'https://www.google.com/maps/embed/v1/streetview?key=' +
        encodeURIComponent(GOOGLE_STREET_VIEW_API_KEY) +
        '&location=' + lat + ',' + lng +
        '&heading=210&pitch=10&fov=80';
    panel.classList.add('has-view');
}

map.on('click', function(e) {
    actualizarStreetView(e.latlng);
});

var streetViewHeader = document.querySelector('#streetViewPanel .streetview-header');
if (streetViewHeader) {
    streetViewHeader.addEventListener('click', function(e) {
        e.stopPropagation();
        var panel = document.getElementById('streetViewPanel');
        var toggleText = document.getElementById('streetViewToggleText');
        panel.classList.toggle('collapsed');
        if (toggleText) toggleText.textContent = panel.classList.contains('collapsed') ? 'ABRIR' : 'OCULTAR';
    });
}

// =============================
// INICIALIZACIÓN
// =============================
inicializarBibliotecaIconos();
actualizarListaCapasCreadas();
actualizarBibliotecas();
actualizarModeloAlertas();
capasConfig.forEach(cargarCapa);
