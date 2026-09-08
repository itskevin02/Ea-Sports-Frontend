const torneos = [
    {
        id: 1,
        nombre: "Torneo 1",
        juego: "Counter-Strike 2",
        modalidad: "5 vs 5",
        inscritos: 6,
        cupoMaximo: 8,
        fechaCierre: "2026-09-10",
        estado: "Abierto"
    },
    {
        id: 2,
        nombre: "Torneo 2",
        juego: "VALORANT",
        modalidad: "5 vs 5",
        inscritos: 7,
        cupoMaximo: 8,
        fechaCierre: "2026-09-12",
        estado: "Abierto"
    },
    {
        id: 3,
        nombre: "Torneo 3",
        juego: "Fortnite",
        modalidad: "Dúos",
        inscritos: 10,
        cupoMaximo: 16,
        fechaCierre: "2026-09-14",
        estado: "Abierto"
    },
    {
        id: 4,
        nombre: "Torneo 4",
        juego: "FC26",
        modalidad: "Parejas",
        inscritos: 8,
        cupoMaximo: 12,
        fechaCierre: "2026-08-28",
        estado: "En curso"
    },
    {
        id: 5,
        nombre: "Torneo 5",
        juego: "Tom Clancy's Rainbow Six Siege",
        modalidad: "5 vs 5",
        inscritos: 8,
        cupoMaximo: 8,
        fechaCierre: "2026-08-25",
        estado: "Finalizado"
    }
];

function crearTarjetaTorneo(torneo, mostrarDetalle) {
    const tarjeta = document.createElement("article");
    const titulo = document.createElement("h3");
    const juego = document.createElement("p");
    const estado = document.createElement("p");

    tarjeta.classList.add("tarjeta-torneo");

    titulo.textContent = torneo.nombre;
    juego.textContent = `Juego: ${torneo.juego}`;
    estado.textContent = `Estado: ${torneo.estado}`;

    if (torneo.estado === "En curso") {
        estado.classList.add("estado-en-curso");
    }

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(juego);

    if (mostrarDetalle) {
        const modalidad = document.createElement("p");
        const cupos = document.createElement("p");
        const cierre = document.createElement("p");

        modalidad.textContent = `Modalidad: ${torneo.modalidad}`;
        cupos.textContent = `Cupos: ${torneo.inscritos} / ${torneo.cupoMaximo}`;
        cierre.textContent = `Cierre de inscripción: ${torneo.fechaCierre}`;

        tarjeta.appendChild(modalidad);
        tarjeta.appendChild(cupos);
        tarjeta.appendChild(cierre);
    }

tarjeta.appendChild(estado);

    const enlaceDetalle = document.createElement("a");

    enlaceDetalle.href = "detalle-torneo.html";
    enlaceDetalle.textContent = "Ver detalle";
    enlaceDetalle.classList.add("enlace-detalle");

    tarjeta.appendChild(enlaceDetalle);

    return tarjeta;

}

const contenedorTorneos = document.getElementById("contenedor-torneos");
const estadoVacio = document.getElementById("estado-vacio");

function mostrarTorneos(listaTorneos) {
    if (contenedorTorneos === null) {
        return;
    }

    contenedorTorneos.textContent = "";

    if (estadoVacio !== null) {
        estadoVacio.textContent = "";
    }

    if (listaTorneos.length === 0) {
        if (estadoVacio !== null) {
            estadoVacio.textContent = "No existen torneos que cumplan los filtros seleccionados.";
        }

        return;
    }

    listaTorneos.forEach(function (torneo) {
        const tarjeta = crearTarjetaTorneo(torneo, true);

        contenedorTorneos.appendChild(tarjeta);
    });
}

if (contenedorTorneos !== null) {
    mostrarTorneos(torneos);
}

const filtroJuego = document.getElementById("filtro-juego");

if (filtroJuego !== null) {
    const juegos = [];

    torneos.forEach(function (torneo) {
        if (!juegos.includes(torneo.juego)) {
            juegos.push(torneo.juego);
        }
    });

    juegos.forEach(function (juego) {
        const opcion = document.createElement("option");

        opcion.value = juego;
        opcion.textContent = juego;

        filtroJuego.appendChild(opcion);
    });
}

const formularioFiltros = document.getElementById("formulario-filtros");

if (formularioFiltros !== null) {
    formularioFiltros.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const juegoSeleccionado = document.getElementById("filtro-juego").value;
        const estadoSeleccionado = document.getElementById("filtro-estado").value;
        const fechaInicial = document.getElementById("fecha-inicial").value;
        const fechaFinal = document.getElementById("fecha-final").value;
        const nombreBuscado = document.getElementById("buscar-nombre").value
            .trim()
            .toLowerCase();

        if (fechaInicial !== "" && fechaFinal !== "" && fechaInicial > fechaFinal) {
            contenedorTorneos.textContent = "";

            if (estadoVacio !== null) {
                estadoVacio.textContent = "La fecha inicial no puede ser posterior a la fecha final.";
            }

            return;
        }

        const torneosFiltrados = torneos.filter(function (torneo) {
            const estadoTorneo = torneo.estado.toLowerCase().replace(" ", "-");
            const cumpleJuego = juegoSeleccionado === "" || torneo.juego === juegoSeleccionado;
            const cumpleEstado = estadoSeleccionado === "" || estadoTorneo === estadoSeleccionado;
            const cumpleFechaInicial = fechaInicial === "" || torneo.fechaCierre >= fechaInicial;
            const cumpleFechaFinal = fechaFinal === "" || torneo.fechaCierre <= fechaFinal;
            const cumpleNombre = torneo.nombre.toLowerCase().includes(nombreBuscado);

            return cumpleJuego &&
                cumpleEstado &&
                cumpleFechaInicial &&
                cumpleFechaFinal &&
                cumpleNombre;
        });

        mostrarTorneos(torneosFiltrados);
    });
}

const contenedorDestacados = document.getElementById("torneos-destacados");

if (contenedorDestacados !== null) {
    const torneosDestacados = torneos.filter(function (torneo) {
        return (torneo.estado === "Abierto" || torneo.estado === "En curso")
            && torneo.id !== 2;
    });

    torneosDestacados.forEach(function (torneo) {
        const tarjeta = crearTarjetaTorneo(torneo, false);

        contenedorDestacados.appendChild(tarjeta);
    });
}

const proximosCierres = document.getElementById("proximos-cierres");

if (proximosCierres !== null) {
    const torneosAbiertos = torneos.filter(function (torneo) {
        return torneo.estado === "Abierto";
    });

    torneosAbiertos.sort(function (a, b) {
        return new Date(a.fechaCierre) - new Date(b.fechaCierre);
    });

    const lista = document.createElement("ul");

    torneosAbiertos.forEach(function (torneo) {
        const elemento = document.createElement("li");

        elemento.textContent = `${torneo.nombre}: cierre ${torneo.fechaCierre}`;

        lista.appendChild(elemento);
    });

    proximosCierres.appendChild(lista);
}
const participantesDetalle = [
    "Equipo 1",
    "Equipo 2",
    "Equipo 3",
    "Equipo 4",
    "Equipo 5",
    "Equipo 6"
];

const informacionTorneo = document.getElementById("informacion-torneo");

if (informacionTorneo !== null) {
    const torneoDetalle = torneos[0];
    const nombre = document.createElement("h3");
    const juego = document.createElement("p");
    const modalidad = document.createElement("p");
    const cupos = document.createElement("p");
    const cierre = document.createElement("p");
    const estado = document.createElement("p");
    const cuposDisponibles = torneoDetalle.cupoMaximo - torneoDetalle.inscritos;

    nombre.textContent = torneoDetalle.nombre;
    juego.textContent = `Juego: ${torneoDetalle.juego}`;
    modalidad.textContent = `Modalidad: ${torneoDetalle.modalidad}`;
    cupos.textContent = `Cupos disponibles: ${cuposDisponibles}`;
    cierre.textContent = `Cierre de inscripción: ${torneoDetalle.fechaCierre}`;
    estado.textContent = `Estado: ${torneoDetalle.estado}`;

    informacionTorneo.appendChild(nombre);
    informacionTorneo.appendChild(juego);
    informacionTorneo.appendChild(modalidad);
    informacionTorneo.appendChild(cupos);
    informacionTorneo.appendChild(cierre);
    informacionTorneo.appendChild(estado);
}

const contenedorParticipantes = document.getElementById("participantes-inscritos");

if (contenedorParticipantes !== null) {
    const listaParticipantes = document.createElement("ul");

    participantesDetalle.forEach(function (participante) {
        const elemento = document.createElement("li");

        elemento.textContent = participante;

        listaParticipantes.appendChild(elemento);
    });

    contenedorParticipantes.appendChild(listaParticipantes);
}
const partidasDetalle = [
    {
        ronda: "Ronda 1",
        encuentro: "Equipo 1 vs Equipo 2",
        horario: "2026-09-12 18:00",
        estado: "Programada"
    },
    {
        ronda: "Ronda 1",
        encuentro: "Equipo 3 vs Equipo 4",
        horario: "2026-09-12 19:00",
        estado: "Programada"
    },
    {
        ronda: "Ronda 1",
        encuentro: "Equipo 5 vs Equipo 6",
        horario: "2026-09-12 20:00",
        estado: "Programada"
    }
];

const posicionesDetalle = [
    {
        posicion: 1,
        participante: "Equipo 1",
        puntos: 6
    },
    {
        posicion: 2,
        participante: "Equipo 2",
        puntos: 4
    },
    {
        posicion: 3,
        participante: "Equipo 3",
        puntos: 2
    }
];

const premiosDetalle = [
    {
        posicion: "1° lugar",
        premio: "Premio 1"
    },
    {
        posicion: "2° lugar",
        premio: "Premio 2"
    },
    {
        posicion: "3° lugar",
        premio: "Premio 3"
    }
];

const contenedorPartidas = document.getElementById("llaves-partidas");

if (contenedorPartidas !== null) {
    partidasDetalle.forEach(function (partida) {
        const partidaElemento = document.createElement("article");
        const ronda = document.createElement("h3");
        const encuentro = document.createElement("p");
        const horario = document.createElement("p");
        const estado = document.createElement("p");

        ronda.textContent = partida.ronda;
        encuentro.textContent = partida.encuentro;
        horario.textContent = `Horario: ${partida.horario}`;
        estado.textContent = `Estado: ${partida.estado}`;

        partidaElemento.appendChild(ronda);
        partidaElemento.appendChild(encuentro);
        partidaElemento.appendChild(horario);
        partidaElemento.appendChild(estado);

        contenedorPartidas.appendChild(partidaElemento);
    });
}

const contenedorPosiciones = document.getElementById("tabla-posiciones");

if (contenedorPosiciones !== null) {
    const tabla = document.createElement("table");
    const encabezado = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    const cuerpoTabla = document.createElement("tbody");

    const tituloPosicion = document.createElement("th");
    const tituloParticipante = document.createElement("th");
    const tituloPuntos = document.createElement("th");

    tituloPosicion.textContent = "Posición";
    tituloParticipante.textContent = "Participante";
    tituloPuntos.textContent = "Puntos";

    filaEncabezado.appendChild(tituloPosicion);
    filaEncabezado.appendChild(tituloParticipante);
    filaEncabezado.appendChild(tituloPuntos);
    encabezado.appendChild(filaEncabezado);

    posicionesDetalle.forEach(function (posicion) {
        const fila = document.createElement("tr");
        const numero = document.createElement("td");
        const participante = document.createElement("td");
        const puntos = document.createElement("td");

        numero.textContent = posicion.posicion;
        participante.textContent = posicion.participante;
        puntos.textContent = posicion.puntos;

        fila.appendChild(numero);
        fila.appendChild(participante);
        fila.appendChild(puntos);
        cuerpoTabla.appendChild(fila);
    });

    tabla.appendChild(encabezado);
    tabla.appendChild(cuerpoTabla);
    contenedorPosiciones.appendChild(tabla);
}

const contenedorPremios = document.getElementById("premios-torneo");

if (contenedorPremios !== null) {
    const listaPremios = document.createElement("ul");

    premiosDetalle.forEach(function (premio) {
        const elemento = document.createElement("li");

        elemento.textContent = `${premio.posicion}: ${premio.premio}`;

        listaPremios.appendChild(elemento);
    });

    contenedorPremios.appendChild(listaPremios);
}

const equipos = [
    {
        id: 1,
        nombre: "Equipo 1",
        juego: "Counter-Strike 2",
        integrantes: 5,
        activo: true
    },
    {
        id: 2,
        nombre: "Equipo 2",
        juego: "VALORANT",
        integrantes: 5,
        activo: true
    },
    {
        id: 3,
        nombre: "Equipo 3",
        juego: "Fortnite",
        integrantes: 2,
        activo: true
    }
];

const jugadores = [
    {
        id: 1,
        nombre: "Jugador 1"
    },
    {
        id: 2,
        nombre: "Jugador 2"
    },
    {
        id: 3,
        nombre: "Jugador 3"
    },
    {
        id: 4,
        nombre: "Jugador 4"
    },
    {
        id: 5,
        nombre: "Jugador 5"
    }
];

const selectorEquipo = document.getElementById("equipo");

if (selectorEquipo !== null) {
    equipos.forEach(function (equipo) {
        const opcion = document.createElement("option");

        opcion.value = equipo.id;
        opcion.textContent = equipo.nombre;

        selectorEquipo.appendChild(opcion);
    });
}

const selectorJuegoPrincipal = document.getElementById("juego-principal");

if (selectorJuegoPrincipal !== null) {
    torneos.forEach(function (torneo) {
        const opcion = document.createElement("option");

        opcion.value = torneo.juego;
        opcion.textContent = torneo.juego;

        selectorJuegoPrincipal.appendChild(opcion);
    });
}

const selectorCapitan = document.getElementById("capitan");
const selectorJugador = document.getElementById("jugador");

jugadores.forEach(function (jugador) {
    if (selectorCapitan !== null) {
        const opcionCapitan = document.createElement("option");

        opcionCapitan.value = jugador.id;
        opcionCapitan.textContent = jugador.nombre;

        selectorCapitan.appendChild(opcionCapitan);
    }

    if (selectorJugador !== null) {
        const opcionJugador = document.createElement("option");

        opcionJugador.value = jugador.id;
        opcionJugador.textContent = jugador.nombre;

        selectorJugador.appendChild(opcionJugador);
    }
});

const formularioEquipo = document.getElementById("formulario-equipo");

if (formularioEquipo !== null) {
    formularioEquipo.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombreEquipo = document.getElementById("nombre-equipo").value.trim();
        const juegoPrincipal = document.getElementById("juego-principal").value;
        const capitan = document.getElementById("capitan").value;

        const errorNombre = document.getElementById("error-nombre-equipo");
        const errorJuego = document.getElementById("error-juego-principal");
        const errorCapitan = document.getElementById("error-capitan");
        const mensajeEquipo = document.getElementById("mensaje-equipo");

        errorNombre.textContent = "";
        errorJuego.textContent = "";
        errorCapitan.textContent = "";
        mensajeEquipo.textContent = "";

        let formularioValido = true;

        if (nombreEquipo === "") {
            errorNombre.textContent = "El nombre del equipo es obligatorio.";
            formularioValido = false;
        } else {
            const equipoDuplicado = equipos.some(function (equipo) {
                return equipo.nombre.toLowerCase() === nombreEquipo.toLowerCase();
            });

            if (equipoDuplicado) {
                errorNombre.textContent = "El nombre del equipo ya existe.";
                formularioValido = false;
            }
        }

        if (juegoPrincipal === "") {
            errorJuego.textContent = "Debes seleccionar un juego principal.";
            formularioValido = false;
        }

        if (capitan === "") {
            errorCapitan.textContent = "Debes seleccionar un capitán.";
            formularioValido = false;
        }

        if (formularioValido) {
            const nuevoEquipo = {
                id: equipos.length + 1,
                nombre: nombreEquipo,
                juego: juegoPrincipal,
                integrantes: 1,
                activo: true
            };

            equipos.push(nuevoEquipo);

            if (selectorEquipo !== null) {
                const opcionEquipo = document.createElement("option");

                opcionEquipo.value = nuevoEquipo.id;
                opcionEquipo.textContent = nuevoEquipo.nombre;

                selectorEquipo.appendChild(opcionEquipo);
            }

            mensajeEquipo.textContent = "Equipo creado correctamente.";
            formularioEquipo.reset();
        }
    });
}
const integrantesEquipo = [];
const botonAgregarJugador = document.getElementById("boton-agregar-jugador");
const listaIntegrantes = document.getElementById("lista-integrantes");
const errorJugador = document.getElementById("error-jugador");

function mostrarIntegrantes() {
    if (listaIntegrantes === null) {
        return;
    }

    listaIntegrantes.textContent = "";

    integrantesEquipo.forEach(function (integrante) {
        const elemento = document.createElement("article");
        const nombre = document.createElement("p");
        const botonQuitar = document.createElement("button");

        nombre.textContent = integrante.nombre;
        botonQuitar.type = "button";
        botonQuitar.textContent = "Quitar jugador";

        botonQuitar.addEventListener("click", function () {
            const indice = integrantesEquipo.findIndex(function (jugador) {
                return jugador.id === integrante.id;
            });

            integrantesEquipo.splice(indice, 1);
            mostrarIntegrantes();
        });

        elemento.appendChild(nombre);
        elemento.appendChild(botonQuitar);
        listaIntegrantes.appendChild(elemento);
    });
}

if (botonAgregarJugador !== null) {
    botonAgregarJugador.addEventListener("click", function () {
        const idJugador = Number(selectorJugador.value);

        errorJugador.textContent = "";

        if (idJugador === 0) {
            errorJugador.textContent = "Debes seleccionar un jugador.";
            return;
        }

        const jugadorRepetido = integrantesEquipo.some(function (integrante) {
            return integrante.id === idJugador;
        });

        if (jugadorRepetido) {
            errorJugador.textContent = "El jugador ya pertenece al equipo.";
            return;
        }

        const jugadorSeleccionado = jugadores.find(function (jugador) {
            return jugador.id === idJugador;
        });

        integrantesEquipo.push(jugadorSeleccionado);
        selectorJugador.value = "";
        mostrarIntegrantes();
    });
}

const inscripciones = [];
const fechaActualSimulada = "2026-09-02";

equipos[1].activo = false;
equipos[2].sancionActiva = true;

const requisitosTorneo = document.getElementById("requisitos-torneo");

if (requisitosTorneo !== null) {
    const torneoInscripcion = torneos[0];
    const textoRequisitos = document.createElement("p");

    textoRequisitos.textContent =
        `Cupos disponibles: ${torneoInscripcion.cupoMaximo - torneoInscripcion.inscritos}. ` +
        `Cierre de inscripción: ${torneoInscripcion.fechaCierre}. ` +
        "Los equipos deben tener al menos 5 integrantes activos.";

    requisitosTorneo.appendChild(textoRequisitos);
}

const formularioInscripcion = document.getElementById("formulario-inscripcion");

if (formularioInscripcion !== null) {
    formularioInscripcion.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const tipoParticipante = document.getElementById("tipo-participante").value;
        const idEquipo = Number(document.getElementById("equipo").value);

        const errorTipo = document.getElementById("error-tipo-participante");
        const errorEquipo = document.getElementById("error-equipo-inscripcion");
        const errorInscripcion = document.getElementById("error-inscripcion");
        const confirmacion = document.getElementById("confirmacion-inscripcion");
        const torneoInscripcion = torneos[0];

        errorTipo.textContent = "";
        errorEquipo.textContent = "";
        errorInscripcion.textContent = "";
        confirmacion.textContent = "";

        let formularioValido = true;
        let participante = "Jugador actual";

        if (tipoParticipante === "") {
            errorTipo.textContent = "Debes seleccionar un tipo de participante.";
            formularioValido = false;
        }

        if (tipoParticipante === "equipo") {
            if (idEquipo === 0) {
                errorEquipo.textContent = "Debes seleccionar un equipo.";
                formularioValido = false;
            } else {
                const equipoSeleccionado = equipos.find(function (equipo) {
                    return equipo.id === idEquipo;
                });

                participante = equipoSeleccionado.nombre;

                if (equipoSeleccionado.activo === false) {
                    errorInscripcion.textContent = "El equipo está inactivo y no puede inscribirse.";
                    formularioValido = false;
                }

                if (equipoSeleccionado.integrantes < 5) {
                    errorInscripcion.textContent =
                        "El equipo no tiene la cantidad mínima de integrantes requerida.";
                    formularioValido = false;
                }

                if (equipoSeleccionado.sancionActiva === true) {
                    errorInscripcion.textContent =
                        "El equipo tiene una sanción vigente y no puede inscribirse.";
                    formularioValido = false;
                }
            }
        }

        if (fechaActualSimulada > torneoInscripcion.fechaCierre) {
            errorInscripcion.textContent =
                "La inscripción está fuera del plazo permitido.";
            formularioValido = false;
        }

        if (torneoInscripcion.inscritos >= torneoInscripcion.cupoMaximo) {
            errorInscripcion.textContent =
                "No hay cupos disponibles para este torneo.";
            formularioValido = false;
        }

        const participanteYaInscrito = inscripciones.some(function (inscripcion) {
            return inscripcion.participante === participante;
        });

        if (participanteYaInscrito) {
            errorInscripcion.textContent =
                "El participante ya se encuentra inscrito en este torneo.";
            formularioValido = false;
        }

        if (formularioValido) {
            inscripciones.push({
                torneoId: torneoInscripcion.id,
                participante: participante
            });

            torneoInscripcion.inscritos += 1;

            confirmacion.textContent =
                `Inscripción confirmada para ${participante} en ${torneoInscripcion.nombre}.`;

            formularioInscripcion.reset();
        }
    });
}

const formularioPerfil = document.getElementById("formulario-perfil");

if (formularioPerfil !== null) {
    formularioPerfil.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const apodo = document.getElementById("apodo").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const contrasena = document.getElementById("contrasena").value;
        const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

        const errorApodo = document.getElementById("error-apodo");
        const errorCorreo = document.getElementById("error-correo");
        const errorContrasena = document.getElementById("error-contrasena");
        const errorConfirmarContrasena = document.getElementById("error-confirmar-contrasena");
        const mensajePerfil = document.getElementById("mensaje-perfil");
        const fichaJugador = document.getElementById("ficha-jugador");

        errorApodo.textContent = "";
        errorCorreo.textContent = "";
        errorContrasena.textContent = "";
        errorConfirmarContrasena.textContent = "";
        mensajePerfil.textContent = "";

        let formularioValido = true;

        if (apodo === "") {
            errorApodo.textContent = "El apodo es obligatorio.";
            formularioValido = false;
        } else if (apodo.includes(" ")) {
            errorApodo.textContent = "El apodo no puede contener espacios.";
            formularioValido = false;
        } else if (apodo.length < 3) {
            errorApodo.textContent = "El apodo debe tener al menos 3 caracteres.";
            formularioValido = false;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo === "") {
            errorCorreo.textContent = "El correo electrónico es obligatorio.";
            formularioValido = false;
        } else if (!formatoCorreo.test(correo)) {
            errorCorreo.textContent = "El correo electrónico no tiene un formato válido.";
            formularioValido = false;
        }

        if (contrasena.length < 6) {
            errorContrasena.textContent = "La contraseña debe tener al menos 6 caracteres.";
            formularioValido = false;
        }

        if (confirmarContrasena !== contrasena) {
            errorConfirmarContrasena.textContent =
                "La confirmación no coincide con la contraseña.";
            formularioValido = false;
        }

        if (formularioValido) {
            const titulo = document.createElement("h3");
            const datoApodo = document.createElement("p");
            const datoCorreo = document.createElement("p");

            titulo.textContent = "Datos guardados";
            datoApodo.textContent = `Apodo: ${apodo}`;
            datoCorreo.textContent = `Correo: ${correo}`;

            fichaJugador.textContent = "";
            fichaJugador.appendChild(titulo);
            fichaJugador.appendChild(datoApodo);
            fichaJugador.appendChild(datoCorreo);

            mensajePerfil.textContent = "Perfil guardado correctamente.";
            formularioPerfil.reset();
        }
    });
}
const equiposJugador = [
    equipos[0],
    equipos[1]
];

const historialTorneosJugador = [
    {
        torneo: "Torneo 1",
        resultado: "Participación registrada"
    },
    {
        torneo: "Torneo 2",
        resultado: "Participación registrada"
    }
];

const estadisticasJugador = {
    victorias: 12,
    derrotas: 5
};

const sancionesJugador = [
    {
        estado: "Cumplida",
        descripcion: "Sanción 1"
    }
];

const contenedorEquiposJugador = document.getElementById("equipos-jugador");

if (contenedorEquiposJugador !== null) {
    const listaEquipos = document.createElement("ul");

    equiposJugador.forEach(function (equipo) {
        const elemento = document.createElement("li");

        elemento.textContent = `${equipo.nombre} - ${equipo.juego}`;

        listaEquipos.appendChild(elemento);
    });

    contenedorEquiposJugador.appendChild(listaEquipos);
}

const contenedorHistorial = document.getElementById("historial-torneos");

if (contenedorHistorial !== null) {
    const listaHistorial = document.createElement("ul");

    historialTorneosJugador.forEach(function (registro) {
        const elemento = document.createElement("li");

        elemento.textContent = `${registro.torneo}: ${registro.resultado}`;

        listaHistorial.appendChild(elemento);
    });

    contenedorHistorial.appendChild(listaHistorial);
}

const contenedorEstadisticas = document.getElementById("estadisticas-jugador");

if (contenedorEstadisticas !== null) {
    const victorias = document.createElement("p");
    const derrotas = document.createElement("p");

    victorias.textContent = `Victorias: ${estadisticasJugador.victorias}`;
    derrotas.textContent = `Derrotas: ${estadisticasJugador.derrotas}`;

    contenedorEstadisticas.appendChild(victorias);
    contenedorEstadisticas.appendChild(derrotas);
}

const contenedorSanciones = document.getElementById("sanciones-jugador");

if (contenedorSanciones !== null) {
    const listaSanciones = document.createElement("ul");

    sancionesJugador.forEach(function (sancion) {
        const elemento = document.createElement("li");

        elemento.textContent = `${sancion.estado}: ${sancion.descripcion}`;

        listaSanciones.appendChild(elemento);
    });

    contenedorSanciones.appendChild(listaSanciones);
}