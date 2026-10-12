
const participantesIniciales = [
  {
    id: 2001,
    torneoId: 2,
    nombre: 'GridironPro',
    tipo: 'jugador'
  },
  {
    id: 2002,
    torneoId: 2,
    nombre: 'TouchdownKing',
    tipo: 'jugador'
  },
  {
    id: 2003,
    torneoId: 2,
    nombre: 'BlitzMaster',
    tipo: 'jugador'
  },
  {
    id: 2004,
    torneoId: 2,
    nombre: 'RedZoneAce',
    tipo: 'jugador'
  },
  {
    id: 2005,
    torneoId: 2,
    nombre: 'NFLWarrior',
    tipo: 'jugador'
  },
  {
    id: 2006,
    torneoId: 2,
    nombre: 'QuarterbackX',
    tipo: 'jugador'
  },
  {
    id: 2007,
    torneoId: 2,
    nombre: 'EndZonePro',
    tipo: 'jugador'
  },
  {
    id: 2008,
    torneoId: 2,
    nombre: 'MaddenElite',
    tipo: 'jugador'
  },
  {
    id: 2009,
    torneoId: 2,
    nombre: 'FieldGeneral',
    tipo: 'jugador'
  },
  {
    id: 2010,
    torneoId: 2,
    nombre: 'RushMaster',
    tipo: 'jugador'
  },
  {
    id: 2011,
    torneoId: 2,
    nombre: 'DefenseKing',
    tipo: 'jugador'
  },
  {
    id: 2012,
    torneoId: 2,
    nombre: 'HailMary',
    tipo: 'jugador'
  },
  {
    id: 2013,
    torneoId: 2,
    nombre: 'IronTackle',
    tipo: 'jugador'
  },
  {
    id: 2014,
    torneoId: 2,
    nombre: 'MaddenLegend',
    tipo: 'jugador'
  },
  {
    id: 2015,
    torneoId: 2,
    nombre: 'PrimeQB',
    tipo: 'jugador'
  },
  {
    id: 2016,
    torneoId: 2,
    nombre: 'FinalDrive',
    tipo: 'jugador'
  }
]

// Obtener participantes de un torneo
function obtenerParticipantes(torneoId) {

  const participantes = participantesIniciales.filter(
    (participante) => participante.torneoId === torneoId
  )

  return participantes
}

export {
  participantesIniciales,
  obtenerParticipantes
}
