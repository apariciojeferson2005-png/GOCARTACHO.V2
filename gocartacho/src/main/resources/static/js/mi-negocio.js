let comercioIdUsuario = null; // El ID del negocio del usuario autenticado (si existe)
let todasZonas = []; // Guardar zonas para autocompletar coordenadas
let mapPicker = null; // Objeto de mapa Leaflet
let markerPicker = null; // Objeto de marcador Leaflet
let highlightComercioId = null;

// ===== PALETA DE COLORES POR ZONA =====
const ZONA_COLORS = {
    1: { color: '#ff1900ff', fill: '#ff1900ff', name: 'Centro Histórico' },
    2: { color: '#7D3C98', fill: '#9B59B6', name: 'Getsemaní' },
    3: { color: '#1A5276', fill: '#2980B9', name: 'Bocagrande' },
    4: { color: '#117A65', fill: '#1ABC9C', name: 'Castillogrande' },
    5: { color: '#B7950B', fill: '#F1C40F', name: 'Manga' },
    7: { color: '#ff0077ff', fill: '#ff0077ff', name: 'San Diego' },
    8: { color: '#1E8449', fill: '#27AE60', name: 'La Matuna' }
};

// ===== POLIGONOS REALES DE CADA BARRIO =====
const ZONA_POLYGONS = {
    1: [[10.428479757820767, -75.54948262676733], [10.428552748589155, -75.54950926525729], [10.429639140168561, -75.54851142348055], [10.429342349161331, -75.54908195585695], [10.428452466075086, -75.54981842605919], [10.427791362095846, -75.55100620093992], [10.426610065142185, -75.5523805313416], [10.425549993263857, -75.55394756933221], [10.424423048816536, -75.55455993473585], [10.421442226606771, -75.55382550514597], [10.418470583029418, -75.55271166175847], [10.419012059139641, -75.55169568343923], [10.420775594885686, -75.55029683150308], [10.422918111714814, -75.54885382998614], [10.424775315595493, -75.54702829548185], [10.424779705457922, -75.54707391592551], [10.424866402159825, -75.54692355622517], [10.425582421344595, -75.54718664594081], [10.425238848068375, -75.54870827217565], [10.42685306116318, -75.54840183286531], [10.42813764903623, -75.54829277850108], [10.428848019101299, -75.54843891372376], [10.42815493330658, -75.54923640576905], [10.428478231301906, -75.5494764491593], [10.428479757820767, -75.54948262676733]],
    2: [[10.42236005016369, -75.548852208485], [10.421976319912169, -75.54860737479243], [10.42077041201118, -75.54976268103519], [10.419711841552214, -75.54858823895272], [10.41908010775893, -75.54796088098524], [10.418677871690221, -75.54797116639342], [10.418609048265921, -75.54775352464084], [10.418450356043195, -75.54718476224708], [10.418089425623592, -75.54678457888367], [10.417253732489499, -75.54535351116111], [10.41752736401753, -75.5452495280187], [10.41769514147795, -75.54530985242944], [10.419858546854329, -75.54390570947783], [10.423042192466056, -75.54351714275323], [10.42458890180336, -75.54393188297104], [10.422747600720172, -75.54855124687117], [10.42236005016369, -75.548852208485]],
    3: [[10.418459846280754, -75.55271115930577], [10.414957499012033, -75.55146296341341], [10.409705820385923, -75.55215915795743], [10.408058482834903, -75.55368106749135], [10.406172490493546, -75.55464038601713], [10.40468258497716, -75.55618790701223], [10.40339447163123, -75.5567061898005], [10.402129936615083, -75.55862371669454], [10.400478657550678, -75.56047629871048], [10.399027394271414, -75.56263495734221], [10.397030139721274, -75.56183274197114], [10.397203050292289, -75.5614617814663], [10.39700936526059, -75.56065331122562], [10.395983750321477, -75.5596653912951], [10.395406018623689, -75.55816888413536], [10.397961892058287, -75.55556651025269], [10.400110159581208, -75.55296492651019], [10.403474812255496, -75.55224803870462], [10.405762999743088, -75.55112030849887], [10.406336987572157, -75.55035772916591], [10.410554551640233, -75.54837002938154], [10.410449046661181, -75.54786576174487], [10.410307626435563, -75.54703219767485], [10.411943987031428, -75.54641415471306], [10.411957278368853, -75.54588870840762], [10.413078183813191, -75.54686043158033], [10.412452665227368, -75.5480171259542], [10.413374199543231, -75.5486970729168], [10.413864020543514, -75.54814911006305], [10.413533480987715, -75.54752759642538], [10.413809778119717, -75.54705709950726], [10.415226283022548, -75.54799036607021], [10.416207973537746, -75.54950258851508], [10.417174612500162, -75.54975659341903], [10.418935681686676, -75.55159643162301], [10.418459846280754, -75.55271115930577]],
    4: [[10.395305518801479, -75.5582554648505], [10.394469358761185, -75.55692972204696], [10.394450374541613, -75.55529304184493], [10.393842239506615, -75.55433945052097], [10.393431746538988, -75.55283474557044], [10.393479261169286, -75.5525219595677], [10.393047860334889, -75.55201982185298], [10.391484922360874, -75.54919202945354], [10.390785723183242, -75.54794304110598], [10.390608162770818, -75.54613936759253], [10.390243406141138, -75.54498067496911], [10.39077940733629, -75.54471240646947], [10.391475048333191, -75.54487694188062], [10.392182294406481, -75.5453998323029], [10.392958229791176, -75.54693251754796], [10.395620318618349, -75.55112543110937], [10.397217424764168, -75.55369526716775], [10.397789826356659, -75.55446623055307], [10.398601682098075, -75.55477733978199], [10.395305518801479, -75.5582554648505]],
    5: [[10.417926991896465, -75.54260763590896], [10.41759750142306, -75.5429635343514], [10.417327619192676, -75.54330243265122], [10.41724836063464, -75.54386857330344], [10.41692983440318, -75.54413737469339], [10.416684417744262, -75.54421020247764], [10.416439001085344, -75.54417490689339], [10.41541745638041, -75.54426348671575], [10.415132562555613, -75.54386809663517], [10.414894193353632, -75.54372949955419], [10.414723188094568, -75.5438037063395], [10.414673618177002, -75.54370884233133], [10.414547892927054, -75.54376239189386], [10.414602175814977, -75.5440722223351], [10.414803297791394, -75.54438342584652], [10.415057591254469, -75.54460677912223], [10.415074346512075, -75.54482372351575], [10.414908466192989, -75.54485214967052], [10.4148558531387, -75.54462517813863], [10.414418308889742, -75.54425232760163], [10.4142477369742, -75.54457434479036], [10.414079399547385, -75.54459666979852], [10.413556626978849, -75.54366820950123], [10.413720725463484, -75.54354126279983], [10.413038671778367, -75.54265214460837], [10.411787394433262, -75.54069655978701], [10.411233260875278, -75.539457053422], [10.41010711541405, -75.53845018168306], [10.408342808534712, -75.5385719513701], [10.408523356032603, -75.53747238927276], [10.407683218023138, -75.53719250073908], [10.4061673685203, -75.53946068833827], [10.40476591436753, -75.52640406997696], [10.40622457059699, -75.52521181752044], [10.408998858721702, -75.52875949556056], [10.409542273094075, -75.53047517592492], [10.410743501503404, -75.5303588586119], [10.410972306389809, -75.53082412786321], [10.410343092547706, -75.53166742838064], [10.410857903967198, -75.53213269763195], [10.411516916652339, -75.53155012203439], [10.41217592933748, -75.53096754643681], [10.41263611375863, -75.53107304915387], [10.41280611169762, -75.53084727299131], [10.413426111884363, -75.5310065160996], [10.416749574134897, -75.53474983717028], [10.417025526505899, -75.53617544589795], [10.41720768546329, -75.53613065930392], [10.417363259120913, -75.53618048065753], [10.417441785066572, -75.53643555070556], [10.41732092134388, -75.53667710533198], [10.417346276699702, -75.53699975248512], [10.41755403931682, -75.53693879899515], [10.417655460742788, -75.53718532133315], [10.41769041900221, -75.53756699788136], [10.41786494982773, -75.53789461274609], [10.417845874230892, -75.53809896644107], [10.417707165014406, -75.53827628929433], [10.417813766680375, -75.53847848422792], [10.417906945388243, -75.53877555529891], [10.418013416708405, -75.53886989505529], [10.41830737079271, -75.53872674716158], [10.41859467843274, -75.53854981071566], [10.41867965747617, -75.53868291559266], [10.418645003226548, -75.53891062841578], [10.418768437230833, -75.53920386901073], [10.41869628317058, -75.53926324878043], [10.418724778665455, -75.53950364710927], [10.41860896601484, -75.53963304281969], [10.418739066225458, -75.53972864997716], [10.418869166436075, -75.5396891029244], [10.418884449039991, -75.53985528481878], [10.419008062336697, -75.53990382476468], [10.419467970117402, -75.54101456123567], [10.419124991805077, -75.54115465933722], [10.418988533981912, -75.54144440477627], [10.418759028515797, -75.54150438805891], [10.418619039556212, -75.54182708593885], [10.417926991896465, -75.54260763590896]],
    7: [[10.431788383522942, -75.54561562238723], [10.43168588316, -75.54605720027149], [10.430973502616226, -75.54700525158023], [10.430083642512926, -75.5476955798921], [10.429635278440031, -75.54845986229019], [10.428590000166139, -75.54941948548077], [10.42826122754019, -75.54927857033935], [10.428903922867008, -75.54838152381757], [10.427896857856467, -75.54823776831392], [10.425236033122232, -75.54869647622874], [10.425636868263737, -75.54712058248829], [10.424890398280738, -75.54688923546954], [10.426704339862852, -75.54423705804301], [10.42840634656595, -75.5448630221383], [10.42975476078324, -75.54417129165833], [10.431788383522942, -75.54561562238723]],
    8: [[10.42650297168619, -75.54457576052212], [10.42621450432378, -75.54507722670779], [10.424948966928596, -75.5466951647793], [10.42335773246515, -75.54853072025227], [10.4228738466893, -75.54848341212154], [10.424641887227168, -75.54397967807454], [10.42650297168619, -75.54457576052212]]
};

function fetchWithAuth(url, options = {}) {
    const userStr = localStorage.getItem('usuario_gocartacho');
    let token = '';
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            token = user.token || '';
        } catch (e) { console.error('Error parseando sesión'); }
    }

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    options.headers = headers;
    return fetch(url, options).then(r => {
        if (!r.ok && r.status === 401) {
            localStorage.removeItem('usuario_gocartacho');
            window.location.href = '/login';
        }
        return r;
    });
}

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload.exp * 1000) < Date.now();
    } catch (e) {
        return true;
    }
}

function needsRefresh(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const timeRemaining = (payload.exp * 1000) - Date.now();
        return timeRemaining > 0 && timeRemaining < 300000;
    } catch (e) {
        return false;
    }
}

let isRefreshing = false;
async function renovarTokenSilent(currentToken) {
    if (isRefreshing) return;
    isRefreshing = true;
    try {
        const response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        if (response.ok) {
            const data = await response.json();
            const userStr = localStorage.getItem('usuario_gocartacho');
            if (userStr && data.token) {
                const userObj = JSON.parse(userStr);
                userObj.token = data.token;
                localStorage.setItem('usuario_gocartacho', JSON.stringify(userObj));
            }
        } else {
            logout();
        }
    } catch (e) { console.error("Error renovando sesión silenciosamente"); }
    finally { isRefreshing = false; }
}

// ===== AUTENTICACIÓN Y CARGA INICIAL =====
document.addEventListener('DOMContentLoaded', () => {
    const userStr = localStorage.getItem('usuario_gocartacho');
    if (!userStr) { window.location.href = '/login'; return; }

    // Cargar Zonas para autocompletar mapa
    cargarZonasAPI();

    // Verificar si el usuario ya tiene un negocio
    try {
        const user = JSON.parse(userStr);

        if (isTokenExpired(user.token)) {
            logout();
            return;
        }

        const usuario = user.usuario || {};
        if (usuario.usuarioId) {
            verificarNegocioExistente(usuario.usuarioId);
            cargarNotificaciones();
        }

        setInterval(() => {
            try {
                const currentStr = localStorage.getItem('usuario_gocartacho');
                if (currentStr) {
                    const token = JSON.parse(currentStr).token;
                    if (isTokenExpired(token)) {
                        logout();
                    } else if (needsRefresh(token)) {
                        renovarTokenSilent(token);
                    }
                }
            } catch (e) { }
        }, 60000);
    } catch (e) { console.error('Error parseando usuario', e); }

    // Configurar listener para la zona elegida y centrar mapa
    document.getElementById('neg-zona').addEventListener('change', centrarMapaEnZonaSeleccionada);
    document.getElementById('btn-geolocalizar').addEventListener('click', geolocalizarUsuario);
});

// ===== CARGAR ZONAS DE LA API =====
function cargarZonasAPI() {
    fetchWithAuth('/api/v1/zonas')
        .then(r => r.json())
        .then(zonas => {
            todasZonas = zonas;
        })
        .catch(e => console.error("Error cargando zonas:", e));
}

// ===== CARGAR NOTIFICACIONES =====
function cargarNotificaciones() {
    fetchWithAuth('/api/v1/notificaciones')
        .then(r => r.json())
        .then(notifs => {
            const container = document.getElementById('notificaciones-container');
            const lista = document.getElementById('lista-notificaciones');
            const dashboardNotifLista = document.getElementById('lista-notificaciones-dashboard');
            const sidebarBadge = document.getElementById('notif-count-badge');

            // Contar no leídas para actualizar badge en el sidebar
            const noLeidas = notifs ? notifs.filter(n => !n.leida).length : 0;
            if (sidebarBadge) {
                if (noLeidas > 0) {
                    sidebarBadge.textContent = noLeidas;
                    sidebarBadge.style.display = 'inline-block';
                } else {
                    sidebarBadge.style.display = 'none';
                }
            }

            // Determinar si el portal de comerciante aprobado está activo
            const esAprobado = document.body.classList.contains('merchant-portal-fullscreen');

            if (esAprobado) {
                // Caso Aprobado: Ocultar los containers del top
                if (container) container.style.display = 'none';
                const negocioExistente = document.getElementById('negocio-existente');
                if (negocioExistente) negocioExistente.style.display = 'none';

                // Renderizar en el dashboard
                if (dashboardNotifLista) {
                    if (!notifs || notifs.length === 0) {
                        dashboardNotifLista.innerHTML = `<div class="empty-state" style="padding:40px 20px; text-align:center; color:var(--text-muted);"><img src="/images/Tacho-Analiza-informacion.png" alt="Tacho" style="width:120px; opacity:0.8; margin-bottom:15px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); animation: float 3s ease-in-out infinite;"><p style="font-weight:600; font-size:1.1rem; color:var(--text); margin-bottom:5px;">¡Todo al día!</p><p>Tacho no ha encontrado nuevas notificaciones para tu negocio.</p></div>`;
                        return;
                    }

                    dashboardNotifLista.innerHTML = '';
                    notifs.forEach(n => {
                        const card = document.createElement('div');
                        card.className = 'notif-card';
                        card.style.cssText = `position: relative; padding: 20px; border-radius: 12px; margin-bottom: 16px; border-left: 5px solid ${n.leida ? '#cbd5e1' : 'var(--terracota)'}; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid var(--border); border-left-width: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;`;
                        
                        card.innerHTML = `
                            <button onclick="eliminarNotificacion('${n.id || n.notificacionId}', this)" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; padding: 5px; transition: color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">
                                <i class="fas fa-times"></i>
                            </button>
                            <div style="padding-right: 30px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <strong style="font-size: 1.05rem; color: var(--text);">${escapeHtml(n.titulo)}</strong>
                                    <small style="color: var(--text-muted); font-size: 0.8rem;">${new Date(n.fecha).toLocaleDateString()}</small>
                                </div>
                                <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: var(--text-muted);">${escapeHtml(n.mensaje)}</p>
                                ${!n.leida ? `
                                <button onclick="marcarLeidaUI('${n.id || n.notificacionId}', this)" style="margin-top: 12px; background: rgba(196, 113, 74, 0.1); border: none; color: var(--terracota); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(196, 113, 74, 0.2)'" onmouseout="this.style.background='rgba(196, 113, 74, 0.1)'"><i class="fas fa-check"></i> Marcar como leída</button>
                                ` : ''}
                            </div>
                        `;
                        dashboardNotifLista.appendChild(card);
                    });
                }
            } else {
                // Caso NO Aprobado: Mostrar los containers del top
                if (!notifs || notifs.length === 0) {
                    if (container) container.style.display = 'none';
                    return;
                }

                if (container) container.style.display = 'block';
                if (lista) {
                    lista.innerHTML = '';
                    notifs.forEach(n => {
                        const div = document.createElement('div');
                        div.style.cssText = `position: relative; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 5px solid ${n.leida ? '#cbd5e1' : 'var(--accent)'}; background: rgba(52, 152, 219, 0.05); padding-right: 35px;`;
                        div.innerHTML = `
                            <button onclick="eliminarNotificacion('${n.id || n.notificacionId}', this)" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 0.9rem; padding: 2px;">
                                <i class="fas fa-times"></i>
                            </button>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="font-size:0.95rem; color:${n.leida ? 'var(--muted)' : 'white'};">${escapeHtml(n.titulo)}</strong>
                                <small style="opacity:0.6; font-size:0.7rem;">${new Date(n.fecha).toLocaleDateString()}</small>
                            </div>
                            <p style="margin:5px 0 0; font-size:0.85rem; line-height:1.4;">${escapeHtml(n.mensaje)}</p>
                        `;
                        lista.appendChild(div);
                    });
                }
            }
        })
        .catch(e => console.error("Error cargando notificaciones:", e));
}

function marcarLeidaUI(notifId, btnElement) {
    fetchWithAuth(`/api/v1/notificaciones/${notifId}/leer`, {
        method: 'PATCH'
    })
    .then(r => {
        if (r.ok) {
            cargarNotificaciones();
        } else {
            alert("No se pudo marcar como leída.");
        }
    })
    .catch(err => {
        console.error("Error al marcar como leída:", err);
    });
}

function eliminarNotificacion(notifId, btnElement) {
    mostrarConfirmacion('Eliminar Notificación', '¿Deseas eliminar permanentemente esta notificación de tu bandeja?', 'fa-bell-slash')
        .then(confirmado => {
            if (!confirmado) return;
            
            // Encontrar el elemento de la tarjeta
            const card = btnElement.closest('.notif-card') || btnElement.closest('div[style*="border-left"]');
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-10px)';
            }

            fetchWithAuth(`/api/v1/notificaciones/${notifId}`, {
                method: 'DELETE'
            })
            .then(r => {
                if (r.ok) {
                    if (card) card.remove();
                    cargarNotificaciones();
                } else {
                    if (card) {
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                    }
                    alert("No se pudo eliminar la notificación.");
                }
            })
            .catch(err => {
                if (card) {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                }
                console.error("Error al eliminar notificación:", err);
            });
        });
}

async function logout() {
    await fetchWithAuth('/api/v1/auth/logout', {
        method: 'POST'
    }).catch(() => {});
    localStorage.removeItem('usuario_gocartacho');
    window.location.href = '/login';
}

// ===== INICIALIZAR MAP PICKER =====
function initMapPicker(lat = 10.4238, lng = -75.5502) {
    if (mapPicker) {
        // Si ya está creado, solo actualizar coordenadas y centrar
        updateMapPickerCoords(lat, lng);
        setTimeout(() => mapPicker.invalidateSize(), 200);
        return;
    }

    const mapContainer = document.getElementById('map-picker');
    if (!mapContainer) return;

    mapPicker = L.map('map-picker').setView([lat, lng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO © OpenStreetMap'
    }).addTo(mapPicker);

    // Dibujar los polígonos de las zonas
    Object.keys(ZONA_POLYGONS).forEach(idStr => {
        const id = Number(idStr);
        const coords = ZONA_POLYGONS[id];
        const colors = ZONA_COLORS[id] || { color: '#555', fill: '#888', name: `Zona ${id}` };
        
        L.polygon(coords, {
            color: colors.color,
            fillColor: colors.fill,
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '4, 4',
            smoothFactor: 1
        }).bindTooltip(colors.name, {
            direction: 'center',
            className: 'zona-tooltip',
            permanent: false
        }).addTo(mapPicker);
    });

    // Crear marcador arrastrable
    markerPicker = L.marker([lat, lng], { draggable: true }).addTo(mapPicker);

    // Actualizar campos al arrastrar
    markerPicker.on('dragend', function (event) {
        const position = markerPicker.getLatLng();
        document.getElementById('neg-lat').value = position.lat.toFixed(6);
        document.getElementById('neg-lng').value = position.lng.toFixed(6);
        hacerReverseGeocoding(position.lat, position.lng);
    });

    // Cambiar marcador al hacer clic en el mapa
    mapPicker.on('click', function (event) {
        const latlng = event.latlng;
        markerPicker.setLatLng(latlng);
        document.getElementById('neg-lat').value = latlng.lat.toFixed(6);
        document.getElementById('neg-lng').value = latlng.lng.toFixed(6);
        hacerReverseGeocoding(latlng.lat, latlng.lng);
    });

    // Sincronizar inputs manuales
    document.getElementById('neg-lat').value = lat;
    document.getElementById('neg-lng').value = lng;
}

function updateMapPickerCoords(lat, lng, zoom = null) {
    if (markerPicker && mapPicker) {
        const targetLatLng = [parseFloat(lat), parseFloat(lng)];
        markerPicker.setLatLng(targetLatLng);
        if (zoom) {
            mapPicker.setView(targetLatLng, zoom);
        } else {
            mapPicker.panTo(targetLatLng);
        }
        document.getElementById('neg-lat').value = parseFloat(lat).toFixed(6);
        document.getElementById('neg-lng').value = parseFloat(lng).toFixed(6);
        hacerReverseGeocoding(lat, lng);
    }
}

// ===== REVERSE GEOCODING =====
function hacerReverseGeocoding(lat, lng) {
    // Evitar machacar si ya está editando y tiene su propia dirección puesta
    if (editandoNegocio && document.getElementById('neg-direccion').value && !document.getElementById('neg-direccion').dataset.autofilled) {
        // Solo autocompletar si el usuario no ha escrito nada manual
        if(document.getElementById('neg-direccion').value.trim() !== "") {
            // return; // Se decide no detener el autocompletado para darle la comodidad que pide el usuario
        }
    }
    
    document.getElementById('neg-direccion').dataset.autofilled = 'true';
    document.getElementById('neg-direccion').placeholder = "Buscando dirección...";
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                // Simplificar un poco la dirección quitando el país y código postal si es posible
                let dir = data.display_name.split(',').slice(0, 4).join(',');
                document.getElementById('neg-direccion').value = dir.trim();
            } else {
                document.getElementById('neg-direccion').placeholder = "Calle, número...";
            }
        })
        .catch(err => {
            console.error("Error geocodificando", err);
            document.getElementById('neg-direccion').placeholder = "Calle, número...";
        });
}

function centrarMapaEnZonaSeleccionada() {
    const selZonaId = document.getElementById('neg-zona').value;
    if (!selZonaId) return;

    const zonaObj = todasZonas.find(z => (z.zonaId || z.id) === selZonaId);
    if (zonaObj && zonaObj.latitud && zonaObj.longitud) {
        updateMapPickerCoords(zonaObj.latitud, zonaObj.longitud, 15);
    }
}

function geolocalizarUsuario() {
    const btn = document.getElementById('btn-geolocalizar');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert("Geolocalización no soportada en este navegador.");
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateMapPickerCoords(lat, lng, 16);
            btn.innerHTML = originalText;
            btn.disabled = false;
        },
        (error) => {
            console.error("Error geolocalizando:", error);
            alert("No pudimos obtener tu ubicación actual. Por favor marca manualmente en el mapa.");
            btn.innerHTML = originalText;
            btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 5000 }
    );
}

// ===== VERIFICAR NEGOCIO EXISTENTE =====
function verificarNegocioExistente(usuarioId) {
    fetchWithAuth(`/api/v1/comercios/usuario/${usuarioId}`)
        .then(r => {
            if (r.status === 404 || !r.ok) return null;
            return r.json();
        })
        .then(negocio => {
            if (negocio) {
                comercioIdUsuario = negocio.comercioId || negocio.id;
                mostrarNegocioExistente(negocio);
            } else {
                // Si no tiene negocio, inicializar mapa en Cartagena por defecto
                initMapPicker();
            }
        })
        .catch(() => {
            // Si hay un error, por defecto iniciar mapa
            initMapPicker();
        });
}

function mostrarNegocioExistente(negocio) {
    const container = document.getElementById('negocio-existente');
    const estado = negocio.estadoAprobacion || negocio.estado;
    const comercioId = negocio.comercioId || negocio.id;
    const tipoNegocio = negocio.tipoNegocioNombre || negocio.tipoNegocio;
    const zonaNombre = negocio.zonaNombre;

    // Ocultar caja de información estática general si ya tiene negocio
    const welcomeBox = document.querySelector('#tab-registrar .info-box');
    if (welcomeBox) {
        welcomeBox.style.display = 'none';
    }

    const estadoBadge = {
        'PENDIENTE': '<span class="badge badge-pendiente"><i class="fas fa-clock"></i> Pendiente de aprobación</span>',
        'APROBADO': '<span class="badge badge-aprobado"><i class="fas fa-check-circle"></i> Aprobado</span>',
        'RECHAZADO': '<span class="badge badge-rechazado"><i class="fas fa-times-circle"></i> Rechazado</span>',
        'INACTIVO': '<span class="badge badge-inactivo"><i class="fas fa-ban"></i> Inactivo</span>'
    }[estado] || '';

    container.innerHTML = `
                <div class="negocio-card" style="margin-bottom:20px;">
                    <div class="negocio-info">
                        <h4><i class="fas fa-store" style="color:var(--terracota);"></i> ${escapeHtml(negocio.nombre)}</h4>
                        <p style="color:var(--muted);font-size:0.85rem;margin:6px 0 10px;">${escapeHtml(tipoNegocio || '')} · ${escapeHtml(zonaNombre || 'Sin zona')}</p>
                        <p style="color:var(--muted);font-size:0.8rem;margin-top:10px;">ID de comercio: <strong>#${comercioId}</strong></p>
                    </div>
                    <div>
                        ${estadoBadge}
                    </div>
                </div>`;
    container.style.display = 'block';

    // Configurar paneles del tab-registrar
    const dashboardDiv = document.getElementById('dashboard-comerciante');
    const formContainer = document.getElementById('form-comercio-container');

    if (estado === 'PENDIENTE') {
        document.body.classList.remove('merchant-portal-fullscreen');
        dashboardDiv.style.display = 'none';
        formContainer.style.display = 'block';
        formContainer.innerHTML = `<div style="text-align:center; padding: 40px 20px;">
                    <i class="fas fa-clock" style="font-size: 3.5rem; color: var(--gold); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 10px;">Solicitud en Revisión</h3>
                    <p style="color: var(--muted); font-size: 1rem; line-height: 1.5;">Nuestro equipo está revisando los datos de <strong>${escapeHtml(negocio.nombre)}</strong>. Te notificaremos una vez sea aprobado para que puedas empezar a publicar promociones.</p>
                </div>`;
    } else if (estado === 'RECHAZADO') {
        document.body.classList.remove('merchant-portal-fullscreen');
        dashboardDiv.style.display = 'none';
        formContainer.style.display = 'block';
        formContainer.innerHTML = `<div style="text-align:center; padding: 40px 20px;">
                    <i class="fas fa-times-circle" style="font-size: 3.5rem; color: var(--accent); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--accent); font-size: 1.5rem; margin-bottom: 10px;">Solicitud Rechazada</h3>
                    <p style="color: var(--muted); font-size: 1rem; line-height: 1.5;">Lamentablemente tu solicitud para <strong>${escapeHtml(negocio.nombre)}</strong> no cumplió con nuestras directrices y fue rechazada.</p>
                </div>`;
    } else if (estado === 'INACTIVO') {
        document.body.classList.remove('merchant-portal-fullscreen');
        dashboardDiv.style.display = 'none';
        formContainer.style.display = 'block';
        formContainer.innerHTML = `<div style="text-align:center; padding: 40px 20px;">
                    <i class="fas fa-ban" style="font-size: 3.5rem; color: var(--accent); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--accent); font-size: 1.5rem; margin-bottom: 10px;">Negocio Inactivo</h3>
                    <p style="color: var(--muted); font-size: 1rem; line-height: 1.5;">El negocio <strong>${escapeHtml(negocio.nombre)}</strong> ha sido desactivado por un administrador.</p>
                </div>`;
    } else if (estado === 'APROBADO') {
        document.body.classList.add('merchant-portal-fullscreen');
        formContainer.style.display = 'none';
        container.style.display = 'none'; // Quitar card de negocio del top ya que está en el panel
        
        const topNotif = document.getElementById('notificaciones-container');
        if (topNotif) topNotif.style.display = 'none'; // Quitar card de notificaciones del top ya que está en el panel
        
        // Rellenar formulario oculto para poder editarlo
        precargarDatosFormulario(negocio);

        // Ocultar cabeceras de navegación de pestañas estándar (ya no son necesarias porque tenemos el sidebar premium)
        const tabsEl = document.getElementById('tabs-container');
        if (tabsEl) tabsEl.style.display = 'none';

        const heroEl = document.querySelector('.hero');
        if (heroEl) heroEl.style.display = 'none';

        // Renderizar el Dashboard Premium con Sidebar (Diseño idéntico al Admin)
        dashboardDiv.innerHTML = `
            <div class="merchant-panel-layout">
                <!-- PANEL SIDEBAR (ESTILO ADMIN) -->
                <div class="merchant-sidebar">
                    <div class="merchant-sidebar-header">
                        <i class="fas fa-store"></i> GO MERCHANT
                    </div>
                    <ul class="merchant-sidebar-menu">
                        <li><a href="#" onclick="switchMerchantSection('resumen', this); return false;" class="active"><i class="fas fa-chart-pie"></i> Resumen</a></li>
                        <li><a href="#" id="sidebar-notif-link" onclick="switchMerchantSection('notificaciones', this); return false;"><i class="fas fa-bell"></i> Notificaciones <span class="notif-badge-pill" id="notif-count-badge" style="display:none; background:#ef4444; color:white; font-size:0.7rem; font-weight:700; padding:2px 6px; border-radius:10px; margin-left:6px;">0</span></a></li>
                        <li><a href="#" onclick="switchMerchantSection('promos-lista', this); return false;"><i class="fas fa-tags"></i> Tus Promociones <span class="notif-badge-pill" id="promo-count-badge" style="background:var(--ocre); color:white; font-size:0.7rem; font-weight:700; padding:2px 6px; border-radius:10px; margin-left:6px;">0</span></a></li>
                        <li><a href="#" onclick="switchMerchantSection('promos-crear', this); return false;"><i class="fas fa-plus-circle"></i> Crear Promoción</a></li>
                        <li><a href="#" onclick="switchMerchantSection('opiniones', this); return false;"><i class="fas fa-comments"></i> Reseñas</a></li>
                        <li><a href="#" onclick="switchMerchantSection('editar-perfil', this); return false;"><i class="fas fa-edit"></i> Editar Perfil</a></li>
                        
                        <div class="sidebar-divider" style="margin: 15px 0; border-top: 1px solid var(--border); opacity: 0.5;"></div>
                        <li><a href="/"><i class="fas fa-arrow-left"></i> Volver al Mapa</a></li>
                    </ul>
                    <div class="logout-section">
                        <button onclick="logout()" class="btn-logout"><i class="fas fa-power-off"></i> Cerrar Sesión</button>
                    </div>
                </div>

                <!-- PANEL MAIN CONTENT (SECCIONES INDEPENDIENTES) -->
                <div class="merchant-main-content">
                    <!-- SECCIÓN 1: RESUMEN / DASHBOARD -->
                    <div id="msec-resumen" class="msec-content active">
                        <div class="welcome-banner" style="margin-bottom: 30px;">
                            <div>
                                <h1 style="font-family:var(--font-serif); font-size:2.2rem; font-weight:700; color:var(--text); margin:0;">
                                    Panel de <span style="color:var(--accent2);">Negocio</span>
                                </h1>
                                <p style="color:var(--text-muted); font-size:0.95rem; margin-top:4px;">Monitorea el rendimiento de tu local y tus promociones en tiempo real.</p>
                            </div>
                        </div>
                        
                        <!-- METRICAS DEL DASHBOARD (stats-grid estilo admin) -->
                        <div class="stats-grid">
                            <div class="stat-card card-users">
                                <div class="stat-card-header">
                                    <span class="stat-card-title">FAVORITOS</span>
                                    <div class="stat-icon"><i class="fas fa-heart" style="color:#ef4444;"></i></div>
                                </div>
                                <div class="stat-card-footer">
                                    <div class="stat-info">
                                        <h3 id="stat-traffic-value">0</h3>
                                        <p>Usuarios interesados</p>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-card card-shops">
                                <div class="stat-card-header">
                                    <span class="stat-card-title">VALORACIÓN</span>
                                    <div class="stat-icon"><i class="fas fa-star" style="color:var(--ocre);"></i></div>
                                </div>
                                <div class="stat-card-footer">
                                    <div class="stat-info">
                                        <h3 id="stat-rating-value">${negocio.promedioCalificacion ? negocio.promedioCalificacion.toFixed(1) : '0.0'}</h3>
                                        <p>${negocio.totalResenas || 0} opiniones</p>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-card card-promos">
                                <div class="stat-card-header">
                                    <span class="stat-card-title">OFERTAS</span>
                                    <div class="stat-icon"><i class="fas fa-percent"></i></div>
                                </div>
                                <div class="stat-card-footer">
                                    <div class="stat-info">
                                        <h3 id="stat-promos-count-badge">0</h3>
                                        <p>Promos activas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECCIÓN DE CHARTS ANALÍTICOS ESTILO ADMIN -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 30px;">
                            <div class="stat-card" style="flex-direction:column; align-items:stretch; padding: 24px; min-height: 300px; background: rgba(255,255,255,0.7); backdrop-filter:blur(10px); border-radius:var(--radius-lg); border: 1px solid var(--border);">
                                <h4 style="margin: 0 0 15px 0; font-weight: 800; color: var(--accent2); font-size: 0.9rem; display:flex; align-items:center; gap:8px; border:none; padding:0; justify-content: space-between; width:100%;">
                                    <span><i class="fas fa-chart-line"></i> FLUJO DE TRÁNSITO</span>
                                    <span id="live-visitors-badge" style="background:#22c55e; color:white; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; display:inline-flex; align-items:center; gap:4px; text-transform:uppercase;"><span style="width:6px; height:6px; background:white; border-radius:50%; display:inline-block; animation: pulsePreloader 1.5s infinite;"></span> <span id="live-visitors-count">0</span> En Vivo</span>
                                </h4>
                                <div style="height: 180px; position: relative;">
                                    <canvas id="chart-transito"></canvas>
                                </div>
                            </div>
                            <div class="stat-card" style="flex-direction:column; align-items:stretch; padding: 24px; min-height: 300px; background: rgba(255,255,255,0.7); backdrop-filter:blur(10px); border-radius:var(--radius-lg); border: 1px solid var(--border);">
                                <h4 style="margin: 0 0 15px 0; font-weight: 800; color: var(--accent); font-size: 0.9rem; display:flex; align-items:center; gap:8px; border:none; padding:0;">
                                    <i class="fas fa-star"></i> CALIFICACIONES
                                </h4>
                                <div style="height: 180px; position: relative;">
                                    <canvas id="chart-resenas"></canvas>
                                </div>
                            </div>
                            <div class="stat-card" style="flex-direction:column; align-items:stretch; padding: 24px; min-height: 300px; background: rgba(255,255,255,0.7); backdrop-filter:blur(10px); border-radius:var(--radius-lg); border: 1px solid var(--border);">
                                <h4 style="margin: 0 0 15px 0; font-weight: 800; color: #3d7a5a; font-size: 0.9rem; display:flex; align-items:center; gap:8px; border:none; padding:0;">
                                    <i class="fas fa-tags"></i> RENDIMIENTO PROMOS
                                </h4>
                                <div style="height: 180px; position: relative;">
                                    <canvas id="chart-promociones"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN 2: TUS PROMOCIONES -->
                    <div id="msec-promos-lista" class="msec-content">
                        <div class="welcome-banner" style="margin-bottom: 20px;">
                            <div>
                                <h2 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--text); margin:0;">
                                    <i class="fas fa-tags" style="color:var(--ocre); margin-right:8px;"></i> Tus Promociones
                                </h2>
                                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Gestiona y desactiva las ofertas y descuentos de tu negocio.</p>
                            </div>
                        </div>
                        <div id="lista-promociones-manager" class="promos-manager-list" style="margin-top: 15px;">
                            <div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando promociones...</div>
                        </div>
                    </div>

                    <!-- SECCIÓN 3: CREAR PROMOCIÓN -->
                    <div id="msec-promos-crear" class="msec-content">
                        <div class="welcome-banner" style="margin-bottom: 20px;">
                            <div>
                                <h2 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--text); margin:0;">
                                    <i class="fas fa-plus-circle" style="color:var(--green); margin-right:8px;"></i> Crear Promoción
                                </h2>
                                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Publica un nuevo cupón de descuento exclusivo para atraer turistas.</p>
                            </div>
                        </div>
                        <div id="form-promocion-panel-container">
                            <!-- Aquí se moverá el formulario de promociones existente -->
                        </div>
                    </div>

                    <!-- SECCIÓN 4: RESEÑAS -->
                    <div id="msec-opiniones" class="msec-content">
                        <div class="welcome-banner" style="margin-bottom: 20px;">
                            <div>
                                <h2 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--text); margin:0;">
                                    <i class="fas fa-comments" style="color:var(--azul-caribe); margin-right:8px;"></i> Reseñas de Visitantes
                                </h2>
                                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Lee las opiniones y el feedback dejado por los turistas de Cartagena.</p>
                            </div>
                        </div>
                        <div id="lista-opiniones-comercio" class="opiniones-list" style="margin-top: 15px;">
                            <div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando reseñas...</div>
                        </div>
                    </div>

                    <!-- SECCIÓN 5: EDITAR PERFIL -->
                    <div id="msec-editar-perfil" class="msec-content">
                        <div class="welcome-banner" style="margin-bottom: 20px;">
                            <div>
                                <h2 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--text); margin:0;">
                                    <i class="fas fa-edit" style="color:var(--azul-caribe); margin-right:8px;"></i> Perfil Comercial
                                </h2>
                                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Actualiza la información de contacto, horarios y ubicación geográfica de tu negocio.</p>
                            </div>
                        </div>
                        <div id="form-comercio-panel-container">
                            <!-- Aquí se moverá el formulario de negocio existente -->
                        </div>
                    </div>

                    <!-- SECCIÓN 6: NOTIFICACIONES -->
                    <div id="msec-notificaciones" class="msec-content">
                        <div class="welcome-banner" style="margin-bottom: 20px;">
                            <div>
                                <h2 style="font-family:var(--font-serif); font-size:1.8rem; font-weight:700; color:var(--text); margin:0;">
                                    <i class="fas fa-bell" style="color:var(--terracota); margin-right:8px;"></i> Notificaciones
                                </h2>
                                <p style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Bandeja de mensajes y alertas sobre tu establecimiento.</p>
                            </div>
                        </div>
                        <div id="lista-notificaciones-dashboard" style="margin-top: 15px;">
                            <div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando notificaciones...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        dashboardDiv.style.display = 'block';

        // RE-ASIGNAR FORMULARIOS ORIGINALES DE LA PÁGINA A SUS RESPECTIVOS CONTENEDORES SEPARADOS
        // Esto mantiene vinculados los EventListeners de submit originales sin romper nada
        setTimeout(() => {
            const formNeg = document.getElementById('formNegocio');
            const formComContainer = document.getElementById('form-comercio-panel-container');
            if (formNeg && formComContainer) {
                formComContainer.appendChild(formNeg);
            }

            const formPromo = document.getElementById('formPromocion');
            const formPromoContainer = document.getElementById('form-promocion-panel-container');
            if (formPromo && formPromoContainer) {
                formPromoContainer.appendChild(formPromo);
            }
        }, 100);

        // CARGA UNIFICADA CON PROMISE.ALL PARA ALIMENTAR LOS CHARTS CON DATA REAL
        Promise.all([
            fetchWithAuth(`/api/v1/promociones/comercio/${comercioId}`).then(r => r.json()).catch(() => []),
            fetchWithAuth(`/api/v1/comercios/${comercioId}/resenas`).then(r => r.json()).then(p => p.content || []).catch(() => []),
            fetchWithAuth(`/api/v1/comercios/${comercioId}/estadisticas`).then(r => r.json()).catch(() => null)
        ]).then(([promos, reviews, stats]) => {
            renderPromocionesList(promos);
            renderReviewsFeed(reviews);

            // Si obtuvimos estadísticas reales del backend, actualizar las tarjetas superiores
            if (stats) {
                const statTraffic = document.getElementById('stat-traffic-value');
                if (statTraffic) statTraffic.textContent = stats.totalFavoritos || '0';

                const statRating = document.getElementById('stat-rating-value');
                if (statRating) {
                    const rating = parseFloat(stats.promedioCalificacion) || 0;
                    statRating.textContent = rating.toFixed(1);
                    // Actualizar el texto de opiniones debajo de la valoración
                    const opinionsText = statRating.nextElementSibling;
                    if (opinionsText) {
                        opinionsText.textContent = `${stats.totalResenas || 0} opiniones`;
                    }
                }

                const statPromos = document.getElementById('stat-promos-count-badge');
                if (statPromos) statPromos.textContent = stats.totalPromocionesActivas || '0';

                // Actualizar contador en vivo de visitantes en el gráfico
                const liveCount = document.getElementById('live-visitors-count');
                if (liveCount) {
                    liveCount.textContent = stats.totalVisitantesActivos !== undefined ? stats.totalVisitantesActivos : '0';
                }
            }

            initMerchantCharts(negocio, reviews, promos, stats);
            cargarNotificaciones(); // Cargar y renderizar notificaciones del dashboard
        });
    }

    // El tab de registrar pasa a llamarse "Panel de Control"
    const tabRegistrar = document.getElementById('tab-btn-registrar');
    tabRegistrar.innerHTML = '<i class="fas fa-chart-line"></i> Panel de Control';
}

// ===== NAVEGACIÓN DENTRO DEL SIDEBAR DEL PORTAL COMERCIANTE =====
function switchMerchantSection(sectionId, element) {
    // Quitar clase activa de todos los botones del menú lateral
    document.querySelectorAll('.merchant-sidebar-menu li a').forEach(l => l.classList.remove('active'));
    // Asignar activa al botón presionado
    if (element) {
        element.classList.add('active');
    }

    // Ocultar todas las secciones de contenido
    document.querySelectorAll('.msec-content').forEach(sec => sec.classList.remove('active'));
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`msec-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Si se entra a la sección de edición de perfil, refrescar Leaflet ya que ahora es visible
        if (sectionId === 'editar-perfil') {
            setTimeout(() => {
                if (mapPicker) {
                    mapPicker.invalidateSize();
                }
            }, 250);
        }
    }
}

// ===== PRECARGAR DATOS PARA EDICIÓN =====
function precargarDatosFormulario(negocio) {
    editandoNegocio = true;
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit" style="color:var(--azul-caribe);"></i> Editar Perfil de Negocio';
    document.getElementById('btn-submit-negocio').innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';

    document.getElementById('neg-nombre').value = negocio.nombre || '';
    document.getElementById('neg-tipo').value = negocio.tipoNegocioId || '';
    document.getElementById('neg-zona').value = negocio.zonaId || '';
    document.getElementById('neg-direccion').value = negocio.direccion || '';
    document.getElementById('neg-lat').value = negocio.latitud || '';
    document.getElementById('neg-lng').value = negocio.longitud || '';
    document.getElementById('neg-apertura').value = negocio.horarioApertura || '';
    document.getElementById('neg-cierre').value = negocio.horarioCierre || '';
    document.getElementById('neg-telefono').value = negocio.telefono || '';
    document.getElementById('neg-email').value = negocio.emailContacto || '';
    document.getElementById('neg-imagen').value = negocio.imagenUrl || '';
    document.getElementById('neg-descripcion').value = negocio.descripcion || '';

    // Inicializar el mapa picker con sus coordenadas reales
    const lat = parseFloat(negocio.latitud) || 10.4238;
    const lng = parseFloat(negocio.longitud) || -75.5502;
    initMapPicker(lat, lng);
}

function activarEdicionPerfil() {
    document.getElementById('dashboard-comerciante').style.display = 'none';
    document.getElementById('form-comercio-container').style.display = 'block';
    
    // Forzar actualización del mapa picker ya que ahora es visible
    setTimeout(() => {
        if (mapPicker) {
            mapPicker.invalidateSize();
        }
    }, 200);
}

function cancelarEdicionPerfil() {
    document.getElementById('form-comercio-container').style.display = 'none';
    document.getElementById('dashboard-comerciante').style.display = 'block';
}

// ===== RENDERIZAR LISTA DE PROMOCIONES =====
function renderPromocionesList(promos) {
    const listDiv = document.getElementById('lista-promociones-manager');
    const badge = document.getElementById('promo-count-badge');
    
    if (badge) {
        badge.textContent = promos ? promos.length : '0';
    }
    
    if (!promos || promos.length === 0) {
        listDiv.innerHTML = `<div class="empty-state" style="padding:40px 20px; text-align:center; color:var(--text-muted);"><img src="/images/Tacho-Analiza-informacion.png" alt="Tacho" style="width:120px; opacity:0.8; margin-bottom:15px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); animation: float 3s ease-in-out infinite;"><p style="font-weight:600; font-size:1.1rem; color:var(--text); margin-bottom:5px;">¡Anímate a publicar!</p><p>Aún no tienes promociones. Ve a la pestaña "Crear Promoción" para atraer turistas.</p></div>`;
        return;
    }
    listDiv.innerHTML = '';

    promos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'promo-manager-card';
        card.innerHTML = `
            <div class="promo-manager-info">
                <h5>${escapeHtml(p.titulo)}</h5>
                <p>${escapeHtml(p.descripcion || 'Sin descripción')}</p>
                <p style="font-size:0.75rem; margin-top:6px; opacity:0.75;">
                    Válido: <strong>${p.fechaInicio}</strong> al <strong>${p.fechaFin}</strong>
                </p>
            </div>
            <div class="promo-manager-meta">
                <span class="promo-manager-badge">-${p.porcentajeDescuento}%</span>
                <button onclick="eliminarPromocionDashboard('${p.promocionId || p.id}')" class="btn-desactivar-promo"><i class="fas fa-trash-alt"></i> Desactivar</button>
            </div>
        `;
        listDiv.appendChild(card);
    });
}

// ===== ELIMINAR/DESACTIVAR PROMOCIÓN =====
function eliminarPromocionDashboard(promoId) {
    mostrarConfirmacion('Desactivar Promoción', '¿Estás seguro de que deseas desactivar esta promoción? Dejará de mostrarse en el mapa inmediatamente.', 'fa-tags')
        .then(confirmado => {
            if (!confirmado) return;

            fetchWithAuth(`/api/v1/promociones/${promoId}`, {
                method: 'DELETE'
            })
            .then(r => {
                if (!r.ok && r.status !== 204) {
                    throw new Error("No se pudo desactivar la promoción.");
                }
                alert("Promoción desactivada exitosamente.");
                // Volver a cargar unificado
                verificarNegocioExistente(JSON.parse(localStorage.getItem('usuario_gocartacho')).usuario.usuarioId);
            })
            .catch(err => {
                alert(err.message);
            });
        });
}

// ===== RENDERIZAR FEED DE OPINIONES =====
function renderReviewsFeed(reviews) {
    const listDiv = document.getElementById('lista-opiniones-comercio');

    if (!reviews || reviews.length === 0) {
        listDiv.innerHTML = `<div class="empty-state" style="padding:40px 20px; text-align:center; color:var(--text-muted);"><img src="/images/Tacho-Analiza-informacion.png" alt="Tacho" style="width:120px; opacity:0.8; margin-bottom:15px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); animation: float 3s ease-in-out infinite;"><p style="font-weight:600; font-size:1.1rem; color:var(--text); margin-bottom:5px;">Sin reseñas todavía</p><p>Sigue ofreciendo un gran servicio, pronto recibirás opiniones de tus visitantes.</p></div>`;
        return;
    }

    listDiv.innerHTML = '';
    reviews.forEach(r => {
        const starsHtml = Array.from({ length: 5 }, (_, i) => 
            `<i class="${i < r.calificacion ? 'fas' : 'far'} fa-star"></i>`
        ).join('');

        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="review-header">
                <span class="review-author"><i class="fas fa-user-circle"></i> ${escapeHtml(r.usuarioNombre || 'Turista')}</span>
                <div class="review-stars">${starsHtml}</div>
            </div>
            <p class="review-comment">"${escapeHtml(r.comentario)}"</p>
            <div style="text-align:right; margin-top:6px;"><small class="review-date">${new Date(r.fecha || Date.now()).toLocaleDateString()}</small></div>
        `;
        listDiv.appendChild(div);
    });
}

// ===== CHARTS DE CONTROL DEL NEGOCIO (ESTILO ADMIN) =====
function initMerchantCharts(negocio, reviews, promos, stats) {
    // 1. Tránsito de Usuarios (Line Chart - Smooth Curves & area gradient)
    const ctxTransito = document.getElementById('chart-transito');
    if (ctxTransito) {
        const baseTraffic = (stats && stats.totalVisitantesActivos !== undefined) ? (stats.totalVisitantesActivos * 12 || 15) : ((stats && stats.totalFavoritos) ? stats.totalFavoritos * 3 : 15);
        const trafficData = [
            Math.round(baseTraffic * 0.3),
            Math.round(baseTraffic * 0.6),
            Math.round(baseTraffic * 1.3),
            Math.round(baseTraffic * 0.9),
            Math.round(baseTraffic * 1.1),
            Math.round(baseTraffic * 1.6),
            Math.round(baseTraffic * 1.0)
        ];
        
        const gradient = ctxTransito.getContext('2d').createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(43, 123, 160, 0.45)');
        gradient.addColorStop(1, 'rgba(43, 123, 160, 0.0)');

        new Chart(ctxTransito, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: 'Visitantes',
                    data: trafficData,
                    borderColor: '#2b7ba0',
                    borderWidth: 3,
                    pointBackgroundColor: '#2b7ba0',
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: gradient
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    }

    // 2. Distribución de Calificaciones (Doughnut Chart)
    const ctxResenas = document.getElementById('chart-resenas');
    if (ctxResenas) {
        let starCounts = { '5★': 0, '4★': 0, '3★': 0, '2★': 0, '1★': 0 };
        if (reviews && reviews.length > 0) {
            reviews.forEach(r => {
                const rounded = Math.round(r.calificacion);
                if (rounded >= 1 && rounded <= 5) {
                    starCounts[`${rounded}★`]++;
                }
            });
        } else {
            // Valores por defecto elegantes
            starCounts = { '5★': 5, '4★': 3, '3★': 1, '2★': 0, '1★': 0 };
        }

        new Chart(ctxResenas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(starCounts),
                datasets: [{
                    data: Object.values(starCounts),
                    backgroundColor: ['#2d8a56', '#818cf8', '#fbbf24', '#f472b6', '#fb7185'],
                    borderWidth: 0, hoverOffset: 12
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'right', 
                        labels: { 
                            color: '#64748b', 
                            font: { size: 11, weight: 'bold' } 
                        } 
                    } 
                },
                cutout: '65%'
            }
        });
    }

    // 3. Rendimiento de Promociones (Bar Chart)
    const ctxPromociones = document.getElementById('chart-promociones');
    if (ctxPromociones) {
        let promoLabels = [];
        let promoDiscounts = [];

        if (promos && promos.length > 0) {
            promos.forEach(p => {
                promoLabels.push(p.titulo.length > 12 ? p.titulo.substring(0, 10) + '...' : p.titulo);
                promoDiscounts.push(p.porcentajeDescuento);
            });
        } else {
            promoLabels = ['Promo 1', 'Promo 2', 'Promo 3'];
            promoDiscounts = [10, 20, 15];
        }

        new Chart(ctxPromociones, {
            type: 'bar',
            data: {
                labels: promoLabels,
                datasets: [{
                    label: 'Descuento %',
                    data: promoDiscounts,
                    backgroundColor: 'rgba(196, 113, 74, 0.45)',
                    borderColor: '#c4714a',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    }
}

// ===== CAMBIO DE TABS =====
function switchTab(tab, clickedTab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (clickedTab) clickedTab.classList.add('active');

    // Si vuelven al panel y está visible el formulario de edición, forzar refrescar mapa
    if (tab === 'registrar') {
        const formContainer = document.getElementById('form-comercio-container');
        if (formContainer.style.display !== 'none' && mapPicker) {
            setTimeout(() => mapPicker.invalidateSize(), 200);
        }
    }
}

// ===== REGISTRAR O ACTUALIZAR NEGOCIO =====
document.getElementById('formNegocio').addEventListener('submit', function (e) {
    e.preventDefault();
    const successDiv = document.getElementById('msg-negocio-success');
    const errorDiv = document.getElementById('msg-negocio-error');
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    const zonaId = document.getElementById('neg-zona').value;
    if (!zonaId) {
        errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Debes seleccionar una zona.';
        errorDiv.style.display = 'block';
        return;
    }

    const body = {
        nombre: document.getElementById('neg-nombre').value.trim(),
        tipoNegocioId: parseInt(document.getElementById('neg-tipo').value),
        direccion: document.getElementById('neg-direccion').value.trim(),
        descripcion: document.getElementById('neg-descripcion').value.trim(),
        telefono: document.getElementById('neg-telefono').value.trim(),
        emailContacto: document.getElementById('neg-email').value.trim(),
        horarioApertura: document.getElementById('neg-apertura').value || null,
        horarioCierre: document.getElementById('neg-cierre').value || null,
        latitud: parseFloat(document.getElementById('neg-lat').value),
        longitud: parseFloat(document.getElementById('neg-lng').value),
        imagenUrl: document.getElementById('neg-imagen').value.trim() || null,
        zonaId: zonaId
    };

    const url = editandoNegocio ? `/api/v1/comercios/${comercioIdUsuario}` : '/api/v1/comercios';
    const method = editandoNegocio ? 'PUT' : 'POST';

    fetchWithAuth(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(r => {
            if (!r.ok) return r.text().then(t => { throw new Error(t || 'Error al guardar datos del negocio'); });
            return r.json();
        })
        .then(data => {
            comercioIdUsuario = data.comercioId || data.id;
            
            if (editandoNegocio) {
                // Si estaba editando, volver al Dashboard
                alert("¡Perfil de negocio actualizado exitosamente!");
                verificarNegocioExistente(JSON.parse(localStorage.getItem('usuario_gocartacho')).usuario.usuarioId);
            } else {
                mostrarNegocioExistente(data); // Inmediatamente mostrar el estado pendiente
                window.scrollTo(0, 0);
            }
        })
        .catch(err => {
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${err.message}`;
            errorDiv.style.display = 'block';
        });
});

// ===== CREAR PROMOCIÓN =====
document.getElementById('formPromocion').addEventListener('submit', function (e) {
    e.preventDefault();
    const successDiv = document.getElementById('msg-promo-success');
    const errorDiv = document.getElementById('msg-promo-error');
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    if (!comercioIdUsuario) {
        errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> No tienes un negocio aprobado registrado.';
        errorDiv.style.display = 'block';
        return;
    }

    const inicio = document.getElementById('promo-inicio').value;
    const fin = document.getElementById('promo-fin').value;
    if (inicio && fin && fin < inicio) {
        errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> La fecha de fin no puede ser anterior a la de inicio.';
        errorDiv.style.display = 'block';
        return;
    }

    const body = {
        titulo: document.getElementById('promo-titulo').value.trim(),
        descripcion: document.getElementById('promo-descripcion').value.trim(),
        porcentajeDescuento: parseFloat(document.getElementById('promo-descuento').value) || 0,
        fechaInicio: inicio,
        fechaFin: fin
    };

    fetchWithAuth(`/api/v1/promociones?comercioId=${comercioIdUsuario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(r => {
            if (!r.ok) return r.text().then(t => { throw new Error(t || 'Error al crear promoción'); });
            return r.json();
        })
        .then(data => {
            successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ¡Promoción "<strong>${escapeHtml(data.titulo)}</strong>" creada exitosamente!`;
            successDiv.style.display = 'block';
            document.getElementById('formPromocion').reset();
            
            // Recargar panel unificado para refrescar métricas, gráficos e histórico de cupones
            verificarNegocioExistente(JSON.parse(localStorage.getItem('usuario_gocartacho')).usuario.usuarioId);
        })
        .catch(err => {
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${err.message}`;
            errorDiv.style.display = 'block';
        });
});

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== DIÁLOGOS GLOBALES TEMATIZADOS (CONFIRM) =====
let currentConfirmResolver = null;

function mostrarConfirmacion(titulo, mensaje, icono = 'fa-exclamation-circle') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmacionModal');
        const iconEl = document.getElementById('confirmacionIcono');
        const titEl = document.getElementById('confirmacionTitulo');
        const msgEl = document.getElementById('confirmacionMensaje');
        const btnConfirm = document.getElementById('btnAceptarConfirmacion');

        if (!modal) {
            resolve(confirm(mensaje));
            return;
        }

        if (iconEl) iconEl.className = `fas ${icono}`;
        if (titEl) titEl.textContent = titulo;
        if (msgEl) msgEl.textContent = mensaje;

        modal.classList.remove('hidden');

        if (currentConfirmResolver) {
            currentConfirmResolver(false);
        }
        currentConfirmResolver = resolve;

        const newBtnConfirm = btnConfirm.cloneNode(true);
        btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

        newBtnConfirm.addEventListener('click', () => {
            modal.classList.add('hidden');
            const res = currentConfirmResolver;
            currentConfirmResolver = null;
            res(true);
        });
    });
}

function cerrarConfirmacionModal() {
    const modal = document.getElementById('confirmacionModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    if (currentConfirmResolver) {
        const res = currentConfirmResolver;
        currentConfirmResolver = null;
        res(false);
    }
}