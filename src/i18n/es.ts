// Todos los strings de UI del sitio. i18n-ready: agregar inglés = crear en.ts
// y resolver por locale en index.ts. Hoy solo español.
// Los textos de contenido (proyectos, categorías) viven en src/data/ — eso es content-as-data, no UI.
export const es = {
  // Meta por defecto = la home del GRUPO (grupo-y-marketing, 2026-09-21). Cada ruta de división
  // (/web, /marketing) y cada página interior define la suya; esta solo la hereda `/`.
  meta: {
    title: 'Pixies Design Group · Web, datos, IA y creatividad',
    description:
      'Dos divisiones bajo un mismo proceso: Pixies Digital Web Design (web, datos, IA) y Pixies Creative (advertising, branding, contenido). Bogotá, alcance global.',
  },
  nav: {
    mainLabel: 'Principal',
    skip: 'Saltar al contenido',
    portfolio: 'Portafolio',
    web: 'Web',
    marketing: 'Creative',
    engineer: 'Ingeniero',
    cta: 'Trabajemos juntos',
    ctaShort: 'Hablemos',
  },
  // Hero de /web. Misma ESTRUCTURA que el de /marketing (Samuel, 2026-09-22: "que web y
  // creative tengan la misma estructura inicial, botones y animaciones; que cambien colores,
  // formas y contenido, no la estructura"): wordmark → nombre de la división + kicker →
  // tagline → fila [firma C/W + tesis + CTA | bloque de apoyo].
  hero: {
    title: 'PIXIES',
    subtitle: 'Digital Web Design',
    tagline: 'Web design · Data · AI · Digital solutions',
    tesis: 'Páginas, ERP, datos, IA y ciberseguridad que puedes abrir y usar, no solo ver en capturas.',
    cta: 'Quiero trabajar con Pixies',
    ctaProyectos: 'Ver los proyectos →',
    chipsLabel: 'Qué construimos',
    photoRole: 'Ingeniero de Sistemas',
    scroll: 'Proyectos que ya corren',
    // Bloque de apoyo del hero (2026-09-22, 2ª pasada): tiene que leerse como un EQUIPO, no
    // como una persona — "el grupo de ingeniería y desarrollo está a cargo de esto" — y solo
    // después decir quién lo lidera. Nada de "cada producto lo construye un ingeniero".
    // 2026-09-23 (Samuel): el bloque tenía que sonar más profesional y dejar claro que él
    // DIRIGE el área y al equipo, no que es un ingeniero más. El cargo pasa de "Ingeniero de
    // Sistemas" a arquitecto: es quien decide la arquitectura y responde por la entrega.
    respaldoEyebrow: 'ingeniería y desarrollo',
    respaldoLinea:
      'Un área propia de ingeniería diseña la arquitectura, construye y mantiene en producción cada solución que entregamos. Nada se subcontrata y nada se abandona al entregarlo.',
    respaldoLidera: 'Dirige el área',
    respaldoQuien: 'Samuel Galeano',
    respaldoRol: 'Arquitecto de Datos y Soluciones',
  },
  signature: {
    // firma interactiva del hero → /samuel: la cita que revela al ingeniero
    quotePre: 'la mente detrás de',
    quoteEm: 'cada proyecto',
    name: 'Samuel Galeano',
    role: 'Ingeniero de Sistemas',
    cta: 'Conócelo',
    slide: 'desliza · conócelo',
    aria: 'Conoce a Samuel Galeano, el ingeniero detrás de Pixies',
  },
  portfolio: {
    // 2026-09-23 (Samuel): "que se note más como productos o soluciones, que se entienda que
    // es un catálogo de lo que ya se tiene". Deja de ser un portafolio de proyectos pasados y
    // se presenta como lo que es: un catálogo de soluciones que ya están funcionando.
    eyebrow: '/catalogo',
    title: 'Catálogo de soluciones',
    // Samuel (2026-09-22): "optimizar el tiempo de scroll para suplir la necesidad lo más
    // rápido posible" — la entrada manda a elegir en el menú de abajo, no describe el sitio.
    intro: 'Elige la solución que necesitas y salta directo. Cada una existe: está en producción o tiene demo en vivo.',
    navLabel: 'Categorías del portafolio',
    statusLive: '● En producción',
    statusCode: '‹/› Código',
    statusDemo: '▶ Demo en vivo',
    openLive: 'Abrir sitio →',
    openRepo: 'Ver en GitHub →',
    openDemo: 'Ver demo en vivo →',
    pendingLink: 'enlace en publicación',
    pendingShot: 'vista previa en producción',
    emptyTitle: 'Casos en curado',
    emptyBody: 'Los proyectos de esta categoría se están documentando para publicarse. Si quieres verlos ya, pídelos directo:',
    emptyCta: 'Ver casos por WhatsApp →',
    // desplegable de la tarjeta (síntesis arriba, detalle técnico bajo demanda)
    detailsShow: 'Decisiones de ingeniería',
    detailsHide: 'Ocultar detalles',
    stackLabel: 'Stack completo',
  },
  midCta: {
    title: '¿Tienes un proyecto en mente?',
    body: 'Cuéntanos qué necesitas. Respondemos con opciones concretas, no con un tarifario genérico.',
    cta: 'Hablemos de tu proyecto',
  },
  engineerTeaser: {
    eyebrow: '/el-ingeniero',
    title: 'Detrás de cada proyecto hay un ingeniero',
    body: 'La fortaleza de Pixies es el conocimiento de quien la construye. Conoce a Samuel: su trayectoria, sus decisiones y su forma de pensar la tecnología.',
    cta: 'Conoce al ingeniero →',
  },
  exhibit: {
    viewCode: 'Ver el código en GitHub →',
    pendingRepo: 'repositorio en preparación',
    pendingTech: 'detalle técnico en redacción',
    chipDemo: '▶ probar la demo →',
    chipReport: '📄 ver el informe →',
    viewDemo: 'Ver demo en vivo →',
    viewReport: 'Leer el informe completo →',
    viewResults: '📊 Resultados y gráficas →',
    viewCodeR: '‹/› Ver el código R',
    dataDeeper: 'Para quien quiere profundizar',
    ariaErpDemo: 'Abrir la demo en vivo del ERP',
    ariaDataReport: 'Leer el informe completo del análisis de Saber 11',
    replay: '↻ Reproducir',
    running: '· ejecutando',
    consoleLabel: 'agente · replay (datos de ejemplo)',
    techShow: 'Detalle técnico',
    techHide: 'Ocultar detalle',
    erpProblem: 'El problema',
    erpSolution: 'La solución',
    psHint: 'ver la solución →',
  },
  // Sección directa de aplicaciones propias, arriba en /web (Samuel, 2026-09-23). El título es
  // "Aplicaciones" y "by Pixies" va DEBAJO, como una firma — no "Aplicaciones by Pixies" en
  // una sola línea.
  apps: {
    eyebrow: '/aplicaciones',
    titulo: 'Aplicaciones',
    by: 'by Pixies',
    // etiquetas de la ficha tipo tienda
    btnDescargar: 'Descargar',
    btnProbar: 'Probar en el navegador',
    vistaPie: 'Así se ve al procesar un audio: el grafo de lo que dijiste, dentro de la app.',
    metaVersion: 'Versión',
    metaFormato: 'Formato',
    metaPrecio: 'Precio',
    intro: 'Software propio, no encargos. Se prueba gratis en el navegador y se descarga para trabajar en tu computador.',
    // 2026-09-23 (Samuel): los tres textos anteriores eran "textos vacíos" — decían cosas
    // genéricas de cualquier app. Ahora cada uno habla de ESTA aplicación y de lo que hace,
    // y juntos cuentan el argumento: de dónde viene, contra qué compite y qué te llevas.
    notas: [
      {
        titulo: 'Nació de perder contexto en reuniones',
        cuerpo: 'Reuniones y notas de voz que nadie vuelve a escuchar, decisiones que se pierden y un mes después nadie recuerda por qué se hizo así. La app se construyó para eso, primero para nosotros.',
      },
      {
        titulo: 'Obsidian y Whisper Flow, pero un paso más allá',
        cuerpo: 'Obsidian enlaza notas que tú escribes; Whisper Flow transcribe lo que dices. Esta las junta y añade lo que falta: un motor propio que estructura el audio, arma los enlaces solo y marca qué tan sostenida está cada afirmación.',
      },
      {
        titulo: 'Lo que dijiste queda listo para otra IA',
        cuerpo: 'El resultado no es un resumen para leer: es contexto citado y conectado, acumulado por proyecto, que le puedes dar a un asistente sin que se invente la mitad.',
      },
    ],
  },
  escucha: {
    tabCurada: 'Ejemplo real',
    tabVivo: 'Prueba con tu audio',
    curadaPendingTitle: 'Ejemplo en preparación',
    curadaPendingBody: 'Todavía estoy preparando un ejemplo real curado con esta herramienta.',
    curadaPendingCta: 'Probar con mi propio audio →',
    dropzoneTitle: 'Suelta o elige un audio corto',
    dropzoneLimits: 'Hasta 90 segundos y 4 MB — .mp3, .m4a, .wav, .webm u .ogg',
    dropzoneCta: 'Elegir archivo',
    dropzonePrivacidad: 'No se guarda: se procesa en memoria y se descarta al responder.',
    sampleCta: '🎧 O prueba con un audio de muestra →',
    sampleLoading: 'Cargando la muestra…',
    sampleAttribution: 'Muestra: discurso de 1943 en dominio público (Wikimedia Commons) — solo para probar el pipeline.',
    stageTranscribir: 'Transcribiendo',
    stageTranscribirDesc: 'Convirtiendo tu audio en texto, con Groq.',
    stageEstructurar: 'Estructurando',
    stageEstructurarDesc: 'Sacando conceptos, decisiones y tareas citadas, y armando el grafo que las conecta.',
    errorFormato: 'Formato no soportado — usa .mp3, .m4a, .wav, .webm u .ogg.',
    errorTamano: 'El archivo pesa más de 4 MB — prueba con un audio más corto.',
    errorGenerico: 'Algo falló al procesar el audio. Inténtalo de nuevo.',
    errorRate: 'Ya lo has probado varias veces seguidas — espera unos minutos.',
    errorSaturado: 'El procesamiento en vivo está saturado en este momento.',
    errorSaturadoCta: 'Ver un ejemplo real ya procesado →',
    errorEstructuracion: 'Transcribimos el audio, pero no pudimos estructurarlo esta vez.',
    reintentar: 'Reintentar',
    probarOtro: '↻ Probar con otro audio',
    resumenLabel: 'De qué se trata',
    areaConceptos: 'Conceptos',
    areaDecisiones: 'Decisiones',
    areaTareas: 'Tareas',
    areaRiesgos: 'Riesgos',
    areaNoSeSabe: 'Lo que no se sabe',
    pedirApp: 'Solicitar la app de escritorio →',
    accessTitle: '¿Ya tienes el código de acceso?',
    accessBody: 'Te lo entrego yo por WhatsApp o LinkedIn cuando me escribes — con él desbloqueas aquí la app de escritorio completa.',
    accessPlaceholder: 'Código de acceso',
    accessSubmitNsis: 'Descargar instalador (Windows)',
    accessSubmitPortable: 'Descargar portable',
    accessDownloading: 'Preparando la descarga…',
    accessErrorCodigo: 'Código incorrecto.',
    accessErrorRate: 'Demasiados intentos seguidos — espera unos minutos.',
    accessErrorGenerico: 'Algo falló. Inténtalo de nuevo.',
    accessSolicitar: '¿No tienes uno? Pídemelo por WhatsApp →',
    // Entrada de la página de la app (Samuel, 2026-09-23): "cuando se entra, una explicación
    // muy concreta de lo que hace, y justo abajo ya la demo". Tres puntos, ni uno más.
    introQue: 'Qué hace, en concreto',
    // 2026-09-23 (Samuel): "los pasos 01, 02, 03 están bien, pero redúcelos mucho más" — la
    // gente se aburre antes de llegar a probar. De tres párrafos a tres líneas.
    introPuntos: [
      { titulo: 'No se queda en transcribir', cuerpo: 'Parte lo dicho en decisiones, tareas, riesgos y dudas, con el segundo exacto.' },
      { titulo: 'Las conecta entre sí', cuerpo: 'Arma el grafo de lo que dijiste, y en escritorio crece con cada audio del proyecto.' },
      { titulo: 'Dice de qué se fía', cuerpo: 'Marca lo deducido y lo dudoso en vez de darlo todo por cierto.' },
    ],
    introObsidian: 'Obsidian y Whisper Flow, un paso más allá: notas enlazadas, audio y un motor propio que arma los enlaces por ti.',
    // Desplegable de condiciones: la demo procesa MENOS que la app descargada y hay que
    // decirlo, no esconderlo (regla de la casa: no prometemos lo que no controlamos).
    condicionesTitulo: 'Condiciones de esta demo',
    condiciones: [
      'Procesa los primeros 90 segundos y hasta 4 MB de audio. La app de escritorio no tiene ese tope.',
      'Corre sobre modelos abiertos en la nube, en su capa gratuita. La app de escritorio trabaja con un motor más potente y contra tus propios archivos.',
      'Cada prueba arranca de cero: aquí no hay proyecto que acumule. En la app, cada audio nuevo se enlaza con lo que ya tenías.',
      'El audio no se guarda: se procesa en memoria y se descarta al responder.',
      'Hay un tope de intentos seguidos para que la demo siga siendo gratis para todo el mundo.',
    ],
    // Carcasa tipo app de escritorio y vistas del resultado (Samuel, 2026-09-23)
    shellTitulo: 'escuchacomprendiendo.IA',
    shellDemo: 'demo en el navegador',
    shellLateral: 'Proyecto y notas',
    shellProyectos: 'Proyectos',
    shellProyectoActual: '▸ Prueba desde la web',
    shellNotas: 'Notas de este audio',
    shellAcumula: 'En la app de escritorio cada audio nuevo entra a un proyecto y se enlaza con lo que ya había. Aquí la prueba arranca vacía cada vez.',
    shellVistas: 'Vistas del resultado',
    vistaGrafo: 'Grafo',
    vistaContexto: 'Contexto',
    vistaTranscripcion: 'Transcripción',
    transcripcionAviso: 'Esto es lo que devuelve un transcriptor. Es la materia prima, no el resultado: el valor está en las otras dos pestañas.',
    demoHeading: 'Pruébala en el navegador',
    appEnter: 'Entrar a la app →',
    // sin flecha: en la tarjeta la flecha es un <span> aparte que se anima al hover
    appEnterCorto: 'Entrar a la app',
    appEnterAria: 'probar en vivo o descargar',
    appEyebrow: '/aplicaciones · by Pixies',
    appBack: '← Volver a las aplicaciones',
    appContact: '¿Quieres algo así para tu empresa? Hablemos →',
  },
  contact: {
    title: 'Cuéntanos tu proyecto',
    intro: 'Respondemos por WhatsApp. Tu mensaje queda guardado desde que lo envías, pase lo que pase después.',
  },
  form: {
    nombre: 'Nombre',
    nombrePh: '¿Cómo te llamamos?',
    contacto: '¿Cómo te contactamos?',
    contactoPh: 'Correo o WhatsApp (+57…)',
    empresa: 'Empresa (opcional)',
    empresaPh: 'Nombre de tu empresa',
    tipo: '¿Qué necesitas?',
    tipoPh: 'Elige una opción',
    mensaje: 'Cuéntanos más (opcional)',
    mensajePh: '¿Qué problema quieres resolver?',
    enviar: 'Enviar y abrir WhatsApp',
    enviando: 'Guardando…',
    exito: 'Recibido. Abriendo WhatsApp…',
    exitoSinWa: 'Recibido. Te contactaremos pronto.',
    errorGuardado: 'No pudimos guardar tu mensaje. Escríbenos directo:',
    errorRate: 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.',
    errores: {
      nombre: 'Escribe tu nombre (mínimo 2 letras).',
      contacto: 'Ingresa un correo válido o un WhatsApp con indicativo.',
      tipoProyecto: 'Elige el tipo de proyecto.',
      empresa: 'Máximo 120 caracteres.',
      mensaje: 'Máximo 1000 caracteres.',
    } as Record<string, string>,
    waDirecto: 'WhatsApp directo',
    correo: 'Correo',
  },
  samuel: {
    title: 'El Ingeniero',
    metaTitle: 'Samuel Galeano — El ingeniero detrás de Pixies',
    metaDescription:
      'Samuel Galeano, ingeniero de sistemas: el cerebro detrás de Pixies. Trayectoria, capacidades por dominio, proyectos y su foro sobre IA, tecnología y emprender.',
    eyebrow: '/el-ingeniero',
    manifestoTitle: 'El cerebro detrás de Pixies',
    manifestoTagline: 'Ingeniero de sistemas · full-stack · analítica de datos',
    // pruebas concretas (no adjetivos): lo que respalda el titular
    proof: [
      'Sitios y sistemas en producción hoy',
      'AWS EC2 · Vercel · Render · GCP',
      'Del front al servidor, y a los datos',
    ],
    // manifiesto: corto, al grano y profesional
    manifesto:
      'Construyo el proyecto completo —del servidor a la interfaz—, lo llevo a producción y lo mantengo. Este sitio es la prueba: cada decisión, medida y documentada en su repositorio.',
    deploymentsTitle: 'En producción',
    deploymentsIntro:
      'No solo escribo código: lo pongo a correr y lo mantengo. Despliegues reales, decisiones de infraestructura y presupuesto en la nube.',
    knowledgeTitle: 'Mapa de conocimiento',
    knowledgeIntro: 'Dónde me formé y qué he certificado. Soportes disponibles si los necesitas.',
    skillsTitle: 'Capacidades por dominio',
    skillsIntro: 'Con honestidad de ingeniería: lo que uso en producción, lo que domino y lo que exploro.',
    storiesTitle: 'Profundizaciones de ingeniería',
    storiesIntro: 'Cada proyecto contado desde la decisión que lo hizo funcionar — a fondo, como una bitácora abierta.',
    storiesCta: 'Entrar a las profundizaciones →',
    storyDecision: 'La decisión',
    storyLink: 'Ver en el portafolio →',
    back: 'Ver el portafolio',
    // subpágina de casos (estilo foro/bitácora)
    casosMetaTitle: 'Casos de ingeniería — Samuel Galeano',
    casosMetaDescription:
      'Bitácora de decisiones de ingeniería detrás de cada proyecto de Pixies: el rol, el problema y la decisión que lo hizo funcionar.',
    casosEyebrow: '/el-ingeniero · casos',
    casosBack: '← Volver al ingeniero',
    foroTitle: 'Foro',
    foroIntro: 'Notas escritas sobre decisiones de ingeniería reales, no contenido genérico.',
    foroCta: 'Entrar al foro →',
  },
  post: {
    backToForum: '← Volver al foro',
    readingTime: 'min de lectura',
    draft: 'Borrador',
    indexMetaTitle: 'Foro — Samuel Galeano',
    indexMetaDescription:
      'Artículos sobre decisiones de ingeniería reales detrás de los proyectos de Pixies: ERP, análisis de datos, ciberseguridad y más.',
    indexEyebrow: '/el-ingeniero · foro',
    indexBack: '← Volver al ingeniero',
  },
  footer: {
    tagline: 'Construimos cosas digitales que funcionan.',
    madeBy: 'Hecho por Pixies. Sí, este sitio también.',
    navLabel: 'Pie de página',
    navHome: 'Inicio',
    navContact: 'Contacto',
    pendingSocial: 'redes en conexión',
    writeUs: 'escríbenos por el formulario →',
    ctaLine: '¿Construimos algo juntos?',
    ctaAction: 'Hablemos →',
  },
  status: {
    city: 'bogotá',
    available: 'disponible para proyectos',
  },
  statement: {
    label: 'Principios de Pixies',
    footnote: '/principios — la evidencia está una sección más arriba.',
    lines: [
      { plain: 'produccion', pre: 'El software que mostramos ', em: 'corre en producción', post: '.' },
      { plain: 'stack', pre: 'El stack que listamos ', em: 'es el que de verdad usamos', post: '.' },
      { plain: 'demo', pre: 'El diseño que ves ', em: 'es la demo', post: '.' },
    ],
  },
  // Hero de la landing del grupo (`/`), distinto del hero de /web: sin "/digital·web·design"
  // ni portal del ingeniero — esos son de la división Web, no del grupo (Samuel, 2026-09-21).
  // Voz EMPRESARIAL (Pixies Design Group es una empresa de varias personas, no la voz de un
  // solo ingeniero): nada en primera persona del singular en esta capa.
  // Hero del grupo (Samuel, 2026-09-22 · 2ª ronda): eslogan "súper directo, algo como que
  // son soluciones que también se ven bien"; un solo CTA de acción ("qué necesitas,
  // contáctanos, te contactamos de una vez"); y los dos accesos laterales — Creative a la
  // izquierda, Web a la derecha — con una línea de qué resuelve cada uno.
  grupoHero: {
    title: 'PIXIES',
    subtitle: 'Design Group',
    kicker: 'Bogotá · alcance global',
    // Frase-DESEO (Samuel, 2026-09-22): no dice lo que hacemos nosotros, dice lo que el
    // cliente quiere que pase. Conserva la idea aprobada (funciona + se ve bien) pero
    // puesta en su empresa, y va en un tono visual menos relevante que el H2.
    tesis: 'Que tu empresa se vea tan bien como funciona.',
    // 2026-09-22 (Samuel): más corto y menos protagonista. El botón grande de conversión ya
    // está en el header y al final de la página; aquí basta con una invitación breve.
    cta: 'Hablemos',
    // Selector de sección (2026-09-22): reemplaza el enlace "Ver cómo trabajamos" por un
    // segmentado diminuto que salta a cada sección de la home.
    secciones: {
      label: 'Ir a una sección',
      items: [
        { id: 'grupo-split-h', etiqueta: 'Las dos divisiones' },
        { id: 'proceso', etiqueta: 'La ruta' },
        { id: 'contacto', etiqueta: 'Contacto' },
      ],
    },
    accesos: {
      creative: { etiqueta: 'Creative', que: 'Campañas, marca y contenido', ir: 'Entrar' },
      web: { etiqueta: 'Web', que: 'Sitios, sistemas, datos e IA', ir: 'Entrar' },
    },
  },
  // Bifurcación Pixies Design Group (grupo-y-marketing, 2026-09): frase-puente + los dos
  // "capítulos". Nombres y taglines textuales de Samuel (2026-09-21): la división Web se
  // presenta como "Pixies Digital Web Design" (ya era el título global del sitio) y Marketing
  // pasa a llamarse "Pixies Creative". Cifras: las mismas que ya usa `portfolio`/`statement`.
  // Voz empresarial: sin "armé", sin "mido", sin "uso" — el grupo habla como empresa.
  split: {
    // Frase puente (Samuel, 2026-09-22): más corta y en clave de UNIFICACIÓN — no son dos
    // caminos que se eligen, es un mismo equipo que arma la mezcla según lo que haga falta.
    bridgePre: 'Que te ',
    bridgeMk: 'encuentren',
    bridgeMid: ' y que te ',
    bridgeWeb: 'compren',
    bridgePost: '. Los dos frentes trabajan juntos y se arma la mezcla que necesites.',
    marketing: {
      capNum: 'Capítulo uno',
      title: 'Pixies Creative',
      tagline: 'Advertising · Branding · Campaigns · Content · Social Media · Creative Strategy',
      que: 'Campañas, contenido y marca medidos contra el margen real, no contra los likes.',
      quien: 'Para empresas y marcas personales jóvenes.',
      chip1n: '162.936',
      chip1t: 'impresiones LinkedIn',
      chip2n: '7',
      chip2t: 'documentos de método',
      cta: 'Hablemos de tu marca',
      href: '/marketing',
    },
    web: {
      capNum: 'Capítulo dos',
      title: 'Pixies Digital Web Design',
      tagline: 'Web design · Data · AI · Digital solutions',
      que: 'Páginas, ERP, datos, IA y ciberseguridad que puedes abrir y usar, no solo ver en capturas.',
      quien: 'Para PyMEs y medianas empresas.',
      chip1n: '45/240',
      chip1t: 'módulos y tablas del ERP',
      chip2n: '1.0.1',
      chip2t: 'escuchacomprendiendo.IA',
      cta: 'Ver el portafolio',
      href: '/web',
    },
    union: 'Las dos divisiones comparten el mismo flujo de trabajo: se contratan juntas o por separado.',
  },
  // La ruta de un proyecto (home, justo debajo de la bifurcación). Samuel (2026-09-21): "que el
  // cliente vea todo lo que hace Pixies Design Group sin tener que escoger Creative o Web":
  // pasos cortos, segmentados por color de forma IMPLÍCITA (ámbar = Creative, violeta = Web,
  // degradado = los dos). `casos` son reales y citan SOLO los pasos que cada uno recorrió de
  // verdad — nada de atribuirle a Xiaomi CarTech una marca que no se le hizo.
  // 2ª ronda (2026-09-22): "títulos y subtítulos mucho más
  // simples, muy directo al cliente"; de 8 pasos a 6 — arquitectura y construcción se
  // fusionan, entra un paso de soluciones empresariales — y **cada paso es un botón** que
  // lleva a la sección donde está ese trabajo de verdad. Con flechas entre pasos.
  proceso: {
    eyebrow: '/la-ruta',
    // 2026-09-23 (Samuel): "De la idea a los números" era tibio. El título tiene que decir el
    // recorrido completo y por qué importa recorrerlo entero, sin prometer un resultado que
    // depende del mercado.
    title: 'Todo lo que hay entre una idea y un cliente',
    intro: 'Seis pasos. Oprime cualquiera y mira lo que ya hicimos ahí.',
    pasos: [
      { n: '01', lado: 'creative', title: 'Marca', desc: 'Identidad, sistema visual y tono.', crea: 'Se crea la marca', href: '/marketing#servicios', destino: 'Ver marca' },
      { n: '02', lado: 'creative', title: 'Estrategia', desc: 'Público, canales y mensaje.', crea: 'Se crea la estrategia', href: '/marketing#areas', destino: 'Ver dónde aplica' },
      { n: '03', lado: 'creative', title: 'Campaña', desc: 'Piezas, parrilla y pauta.', crea: 'Se crean las piezas', href: '/marketing#casos', destino: 'Ver casos' },
      { n: '04', lado: 'web', title: 'Web', desc: 'Arquitectura, diseño y construcción del sitio.', crea: 'Se construye el sitio', href: '/web#landing', destino: 'Ver sitios' },
      { n: '05', lado: 'web', title: 'Sistemas', desc: 'ERP, automatización e IA para operar.', crea: 'Se monta el sistema', href: '/web#erp', destino: 'Ver el ERP' },
      { n: '06', lado: 'ambas', title: 'Datos', desc: 'Medición, análisis y la siguiente decisión.', crea: 'Se mide y se decide', href: '/web#datos', destino: 'Ver el análisis' },
    ],
    // Roadmap de EJEMPLO con un cliente real (Samuel, 2026-09-23): los seis pasos dicen el
    // método; este recorrido dice cómo se vivió de verdad, uno por uno. Specifinance es el
    // caso completo — empezó sin marca y terminó con sitio, captación y panel propio. Los
    // datos salen de src/data/projects.ts (diagnóstico multipaso, mini-CRM con sesión
    // firmada): nada inventado, y sin cifras de resultado que dependen del mercado.
    casoEyebrow: 'un caso, paso a paso',
    casoTitle: 'Cómo se ve esto en un cliente real',
    casoIntro:
      'Specifinance, una boutique de dirección financiera. Llegó sin marca definida y hoy tiene un sitio que capta solo y un panel donde le hace seguimiento a cada interesado. Estos fueron los pasos, en orden.',
    casoPasos: [
      { n: '01', lado: 'creative', title: 'Marca e identidad', desc: 'Nombre, sistema visual y tono para una boutique que dirige finanzas, no que lleva contabilidad.', crea: 'Identidad completa' },
      { n: '02', lado: 'creative', title: 'Público objetivo', desc: 'A quién se le habla: empresas que ya facturan y no saben dónde se les va la plata.', crea: 'Perfil de cliente' },
      { n: '03', lado: 'creative', title: 'Estrategia de atracción', desc: 'Con qué promesa entran, por qué canales y qué tienen que ver antes de escribir.', crea: 'Plan de captación' },
      { n: '04', lado: 'web', title: 'El sitio', desc: 'Se construye con esa identidad y ese mensaje, no con una plantilla que después se decora.', crea: 'Sitio en producción' },
      { n: '05', lado: 'web', title: 'Diagnóstico que capta', desc: 'Dentro del sitio, un cuestionario por pasos que no se siente formulario y deja registrado a quien lo llena.', crea: 'Leads que entran solos' },
      { n: '06', lado: 'web', title: 'Panel propio', desc: 'Los interesados caen en un mini-CRM con sesión firmada, sin depender de herramientas de terceros ni pagar por ellas.', crea: 'Seguimiento sin terceros' },
      { n: '07', lado: 'creative', title: 'Campaña en LinkedIn', desc: 'Con el sitio ya captando, la búsqueda sale a buscar: LinkedIn y bases de datos propias apuntando a ese perfil.', crea: 'Demanda que llega' },
    ],
    casoCta: 'Ver el sitio de Specifinance →',
    casoHref: '/web#landing',
    cierreTitle: 'Y lo que aprendemos vuelve a entrar',
    cierreBody:
      'Reuniones, entrevistas y notas de voz se convierten en contexto citado con escuchacomprendiendo.IA, nuestra propia aplicación. Ese conocimiento alimenta la siguiente campaña y el siguiente sistema.',
    cierreCta: 'Probar la aplicación →',
    cierreHref: '/aplicaciones/escuchacomprendiendo-ai',
    cta: 'Cuéntanos tu caso',
  },
  // Contenido de /marketing (grupo-y-marketing, 2026-09). Fuente:
  // Pixies\marketing\empresa\portafolio\SECCION-MARKETING.md + servicios\*.md + casos\*.md
  // + empresas\pixies\core\equipo\*. Sin cifras inventadas — lo que falta queda marcado con
  // Pending, no con un número inventado.
  // La división se llama "Pixies Creative" (Samuel, 2026-09-21; la ruta sigue siendo
  // /marketing). La CABECERA va en voz empresarial (es una división de varias personas);
  // las secciones internas (servicios, método, casos) conservan el copy del brief aprobado.
  marketing: {
    metaTitle: 'Pixies Creative · Advertising, branding y contenido con margen comprobado',
    metaDescription:
      'Publicidad, marca y contenido medidos contra el margen real de cada producto, no contra los likes. Estrategia creativa, campañas, social media y pauta por datos para empresas y marcas personales jóvenes.',
    title: 'Pixies Creative',
    tagline: 'Advertising · Branding · Campaigns · Content · Social Media · Creative Strategy',
    tesis:
      'Publicidad, marca y contenido que se miden contra el margen real de cada producto, no contra los likes. Estrategia creativa y pauta por datos, bajo un mismo flujo de trabajo.',
    cta: 'Hablemos de tu marca',
    ctaAreas: 'Ver dónde se aplica →',
    // Tres frentes del hero. Samuel (2026-09-22 · 2ª ronda): "quita los nombres de la parte
    // inicial; que sea algo implícito de las áreas que manejamos, que son los especialistas,
    // pero como EMPRESA". Los nombres siguen abajo, en Equipo — ahí sí tienen sentido.
    frentes: [
      { area: 'Campañas y redes', quien: 'Especialista dedicada', lado: 'creative' },
      { area: 'Marca y dirección de arte', quien: '+30 años de oficio', lado: 'creative' },
      { area: 'Crecimiento, pauta y datos', quien: 'Ingeniería propia', lado: 'web' },
    ],
    servicios: {
      eyebrow: '/con-qué-te-ayudamos',
      title: 'Cinco formas de ayudarte',
      intro: 'Oprime la que te suene: te contactamos con eso en concreto.',
      liderLabel: 'Lo lidera',
      pedir: 'Lo quiero',
      items: [
        {
          title: 'Campañas en redes y comunidad',
          ayuda: 'Que te vean y te escriban cada semana.',
          icono: ['11111', '10001', '11111', '00100', '01000'],
          desde: 'creative-campanas',
          paraQuien: 'Empresas y marcas personales jóvenes que necesitan presencia constante sin armar equipo propio.',
          entrego:
            'Concepto de campaña, estrategia de contenido (dos pilares: autoridad y alcance), parrilla mensual, copys, historias, reels y shorts, gestión de comunidad y reporte mensual de métricas.',
          canales: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube Shorts', 'Facebook'],
          lider: 'Isabela Torrenegra',
          quien: 'Isabela crea la campaña, el contenido y la parrilla, y contesta la comunidad; Samuel fija la estrategia y mide.',
          limite: 'No garantizamos seguidores ni alcance — dependen del algoritmo. Garantizamos constancia, criterio y datos.',
        },
        {
          title: 'Publicidad pagada por datos',
          ayuda: 'Que cada peso invertido se pueda medir.',
          icono: ['01110', '10001', '10101', '10001', '01110'],
          desde: 'creative-pauta',
          paraQuien: 'PyMEs que ya venden y quieren escalar sin quemar presupuesto.',
          entrego:
            'Plan de medios, configuración de campañas, creatividades de rendimiento, costo de adquisición (CAC) y ROMI contra el margen real de cada producto.',
          canales: ['Meta', 'Google', 'LinkedIn', 'TikTok'],
          lider: 'Samuel Galeano',
          quien: 'Samuel (Growth Director) arma y optimiza la pauta; Isabela produce las piezas de rendimiento.',
          limite: 'No prometemos ROAS; proponemos objetivos y mostramos los datos cada semana.',
        },
        {
          title: 'Contenido y video',
          ayuda: 'Que tengas qué publicar sin improvisar.',
          icono: ['11000', '11100', '11110', '11100', '11000'],
          desde: 'creative-contenido',
          paraQuien: 'Marcas que necesitan contar lo que hacen en video corto, cada semana.',
          entrego: 'Guion, producción, edición, motion y adaptaciones por formato; piezas gráficas alineadas con la identidad.',
          canales: ['Reel', 'Short', 'Historia', 'Carrusel', 'Banner'],
          lider: 'Isabela Torrenegra',
          quien: 'Isabela produce las piezas para redes; Edison dirige el arte; Content Hub las programa.',
          limite: 'Concepto aprobado → key visual aprobado → piezas. No se produce nada sin la aprobación anterior.',
        },
        {
          title: 'SEO y contenidos',
          ayuda: 'Que te encuentren cuando te buscan.',
          icono: ['01110', '10001', '10001', '01110', '00011'],
          desde: 'creative-seo',
          paraQuien: 'Empresas que quieren que las encuentren por lo que venden, incluidos los asistentes de IA.',
          entrego: 'Auditoría técnica y de contenido, arquitectura del sitio, datos estructurados (schema), llms.txt y visibilidad en respuestas de IA.',
          canales: ['Google', 'ChatGPT', 'Perplexity', 'Claude'],
          lider: 'Samuel Galeano',
          quien: 'Samuel, con el especialista de SEO del flujo de marketing.',
          limite: 'El posicionamiento es acumulativo: resultados en meses, no en días.',
        },
        {
          title: 'Marca e identidad',
          ayuda: 'Que te vean como la empresa que eres.',
          icono: ['00100', '01110', '11111', '01110', '00100'],
          desde: 'creative-marca',
          paraQuien: 'Empresas nuevas o que quieren renovar cómo se ven, dentro y fuera de la pantalla.',
          entrego:
            'Naming, logotipo, sistema visual, manual de marca, identidad digital y su aplicación física: papelería, señalización, avisos, piezas especiales.',
          canales: ['Impreso', 'Señalización', 'Digital'],
          lider: 'Edison Galeano',
          quien: 'Edison Galeano (Brand & Creative Director, +30 años de experiencia) diseña y produce.',
          limite: 'Diseño y producción: la pieza se fabrica e instala, no se entrega solo en PDF.',
        },
      ],
    },
    // Dónde se aplica cada servicio (Samuel, 2026-09-22: "mostrar áreas de implementación de
    // servicios"): situaciones reales de cliente, qué servicios entran, quién responde y el
    // caso real cuando existe. Sin cifras.
    areas: {
      eyebrow: '/dónde-se-aplica',
      title: 'Dónde se aplica: seis situaciones típicas',
      intro: 'Un cliente no compra "redes" o "marca": llega con una situación. Estas son las que resolvemos y con qué.',
      serviciosLabel: 'Entra',
      liderLabel: 'Responde',
      ejemploLabel: 'Caso real',
      items: [
        {
          title: 'Lanzar una marca o un producto',
          situacion: 'Hay algo nuevo que vender y todavía no existe cómo se ve ni cómo se cuenta.',
          servicios: ['Marca e identidad', 'Campaña de lanzamiento en redes', 'Pauta por datos'],
          lider: 'Edison · Isabela · Samuel',
          ejemplo: '',
        },
        {
          title: 'Presencia constante en redes',
          situacion: 'El negocio tiene que publicar cada semana y contestar a la gente, sin un equipo interno para hacerlo.',
          servicios: ['Campañas en redes y comunidad', 'Contenido y video'],
          lider: 'Isabela',
          ejemplo: '',
        },
        {
          title: 'Vender directo con landing y pauta',
          situacion: 'Un producto concreto, un presupuesto y la necesidad de saber cuánto cuesta cada lead o venta.',
          servicios: ['Pauta por datos', 'Landing (Pixies Digital Web Design)', 'Medición servidor a servidor'],
          lider: 'Samuel',
          ejemplo: 'Xiaomi CarTech',
        },
        {
          title: 'Marca personal o empresa B2B en LinkedIn',
          situacion: 'Que a la persona o a la empresa la conozcan por lo que sabe hacer, para vender con estatus y no por precio.',
          servicios: ['Contenido y parrilla', 'SEO y visibilidad en respuestas de IA'],
          lider: 'Isabela · Samuel',
          ejemplo: 'LinkedIn de Samuel',
        },
        {
          title: 'Sello, artista o proyecto creativo',
          situacion: 'Mucho material y poca estructura: hace falta un sistema de contenido que se sostenga semana a semana.',
          servicios: ['Estrategia y sistema de contenido', 'Video corto', 'Marca'],
          lider: 'Isabela · Edison',
          ejemplo: 'Mamba Records',
        },
        {
          title: 'Identidad física: local, avisos, impresos',
          situacion: 'La marca tiene que verse igual de bien en la fachada, la señalización y el papel que en la pantalla.',
          servicios: ['Marca e identidad', 'Producción e instalación de piezas'],
          lider: 'Edison',
          ejemplo: '',
        },
      ],
    },
    metodo: {
      eyebrow: '/método',
      title: 'Seis fases, cada una con dueño',
      intro: 'El mismo flujo para pauta y para software. Isabela lidera las fases de campaña y redes; nada se produce sin aprobar lo anterior.',
      regla: 'No se produce nada sin aprobar lo anterior.',
      fases: [
        { n: '01', title: 'Estrategia', dueno: 'Samuel', desc: 'Qué se vende, a quién y con qué margen.' },
        { n: '02', title: 'Concepto', dueno: 'Isabela · Edison', desc: 'La idea de campaña (redes) y la idea de marca.' },
        { n: '03', title: 'Key Visual', dueno: 'Edison', desc: 'La pieza madre de la que salen las demás.' },
        { n: '04', title: 'Piezas', dueno: 'Isabela · Edison', desc: 'Copys, historias, reels y adaptaciones por formato y canal.' },
        { n: '05', title: 'Parrilla y comunidad', dueno: 'Isabela', desc: 'Calendario, publicación y respuesta a la comunidad.' },
        { n: '06', title: 'Medición', dueno: 'Samuel · Isabela', desc: 'CAC, costo por lead calificado y ROMI; métricas de cada red.' },
      ],
    },
    equipo: {
      eyebrow: '/equipo',
      title: 'Tres personas, tres frentes',
      intro: 'Quién lidera qué en Creative, con cargo, qué hace y de dónde viene cada uno.',
      lideraLabel: 'Lidera',
      personas: [
        {
          nombre: 'Isabela Torrenegra Jiménez',
          cargo: 'Social Media Manager',
          rol: 'Isabela lidera las campañas en redes: crea el contenido, arma la parrilla y contesta la comunidad.',
          bio: 'Comunicación social con énfasis en publicidad y producción audiovisual.',
          lidera: ['Campañas en redes', 'Contenido y parrilla', 'Comunidad', 'Métricas de cada red'],
          foto: '',
          cita:
            'Desarrollo ideas creativas, copys, parrillas de contenido, historias, reels, posts y piezas gráficas alineadas con la identidad de cada marca. Analizo resultados y métricas e interactúo con la comunidad.',
          trayectoria: '',
          destacada: true,
        },
        {
          nombre: 'Edison Galeano',
          cargo: 'Brand & Creative Director',
          rol: 'Edison dirige la marca y produce las piezas, en pantalla y en físico.',
          bio: 'Más de 30 años en diseño y producción: imagen corporativa, impresos, señalización, avisos y piezas especiales.',
          lidera: ['Marca e identidad', 'Concepto y key visual', 'Producción física'],
          foto: '',
          cita: 'Ideas que se convierten en piezas reales. · Diseñamos para el mundo real.',
          trayectoria: 'Trayectoria propia (no son casos de Pixies): Pixel Med · Camvucol · Garden Secrets · Granja El Abuelo · The Carpintería',
          destacada: false,
        },
        {
          nombre: 'Samuel Galeano',
          cargo: 'Growth Director',
          rol: 'Samuel fija la estrategia, arma la pauta, mide contra el margen y cotiza.',
          bio: 'Planeación de crecimiento, optimización de inversión publicitaria, análisis de datos comerciales y medición de ROMI.',
          lidera: ['Estrategia de crecimiento', 'Pauta por datos', 'Medición: CAC y ROMI'],
          foto: '/samuel/samuel-avatar.webp',
          cita: '',
          trayectoria: '',
          destacada: false,
        },
      ],
    },
    comparativa: {
      title: 'Marketing común',
      titleEm: 'vs',
      titleEnd: 'con Pixies',
      colMalo: 'Lo que suele pasar',
      colBueno: 'Lo que hacemos',
      filas: [
        {
          malo: 'Métricas de vanidad (likes, vistas) que no llegan al banco.',
          bueno: 'Costo por lead calificado y EBITDA de ventas como métrica única.',
        },
        {
          malo: 'Pauta a ciegas sin calcular el CAC.',
          bueno: 'Pauta sobre lo que deja margen contable.',
        },
        {
          malo: 'Poco valor percibido; bajar precios para competir.',
          bueno: 'Posicionamiento B2B (LinkedIn y marca) para ganar estatus.',
        },
      ],
    },
    casos: {
      eyebrow: '/casos',
      title: 'Casos, sin inventar',
      intro: 'Donde no hay métricas todavía, lo decimos.',
      items: [
        {
          tag: 'Marketing',
          title: 'Mamba Records',
          desc: 'Sello y ecosistema creativo. Kit de marketing de 7 documentos aprobados: propuesta, estrategia de marca, sistema de contenido, biblioteca de prompts, plantillas y SOP. Estrategia de dos pilares (autoridad 60 / alcance 40), 4 videos por semana.',
          cifra: '',
          cifraLabel: '',
          pendiente: false,
          nota: 'Fases 4–9 pendientes. Sin métricas de resultado todavía — aquí se cuenta el sistema, no un resultado que no existe.',
        },
        {
          tag: 'Marketing · Web',
          title: 'LinkedIn de Samuel',
          desc: 'Campaña propia: que se conozca al ingeniero para que Pixies venda. Post del ERP: 162.936 impresiones; 7 de los 10 posts más vistos son del ERP y suman más de 340.000.',
          cifra: '162.936',
          cifraLabel: 'impresiones del post del ERP',
          pendiente: false,
          nota: 'A 2 posts/día el alcance cayó de 313 a 44–56: la frecuencia tumbó el alcance, no el contenido. Se volvió a 1 post/día.',
        },
        {
          tag: 'Web · Marketing',
          title: 'Xiaomi CarTech',
          desc: 'Landing de venta directa con captura de leads + campaña en Meta. Tracking servidor a servidor con la Conversions API (email y teléfono hasheados) para medir el costo real por lead sin depender del píxel.',
          cifra: '',
          cifraLabel: '',
          pendiente: true,
          nota: 'Presupuesto, periodo, costo por lead y ventas: por confirmar con Samuel. Sin número se cuenta el sistema: qué se midió y cómo.',
        },
      ],
    },
    producto: {
      title: 'Content Hub',
      lead: 'Consola que programa YouTube Shorts e Instagram Reels por las APIs oficiales, para varias marcas a la vez.',
      specs: ['Programa YouTube Shorts', 'Programa Instagram Reels', 'APIs oficiales de YouTube e Instagram', 'Multi-marca desde una consola'],
      estado: 'estado actual y acceso para clientes: por confirmar',
    },
    contacto: {
      title: 'Hablemos de tu marca',
      intro: 'Cuéntanos qué vendes y a quién; respondemos con un plan, no con un formulario automático.',
    },
  },
  common: {
    pending: 'en construcción',
    toConfirm: 'por confirmar',
    credsPending: 'certificados en verificación',
  },
  notFound: {
    title: '404: píxel no encontrado',
    body: 'Esta página todavía no se ensambla. El resto del sitio, sí.',
    back: 'Volver al inicio',
  },
} as const;
