const en_instructions = (
  <>
    <p>
      When the players join the room, they all receive a sequence of random
      numbers, those numbers are unique between the players in that round.
    </p>
    <p>
      The raffled balls will be shown on the host screen. On the players screen
      will be exhibited the last 5 raffled balls.
    </p>
    <p>
      When you click on a number on the screen player, that number will receive
      an emphasis regardless of the raffled balls.
    </p>
    <p>
      When you click on the bingo! button, your numbers will be verified. If a
      bingo does not occur, you will receive a strike, with three strikes you
      will be eliminated from that round. If the bingo happens, the round will
      finish and your name will be displayed on all players' screens.
    </p>
  </>
);

const en = {
  home: {
    btn1: "Join room",
    btn2: "Create room",
  },
  createRoom: {
    createRoom: {
      title: "Create Room",
      label1: "ROOM NAME: ",
      label2: "BALLS AMOUNT (50 - 99): ",
      btn: "Join",
      warning: "Room unavailable, try another name.",
    },
    waitRoom: {
      title: "ROOM ID: ",
      subtitle: "Balls amount: ",
      btn: "Start",
      title2: "Waiting players... ",
      subtitle2: "is here.",
      title3: "Instructions",
      instructions: en_instructions,
    },
    playRoom: {
      title: "Raffling off balls...",
      btn: "Raffle",
    },
    bingo: {
      title: "Won!",
    },
  },
  joinRoom: {
    joinRoom: {
      title: "Joing Room",
      label1: "YOUR NAME: ",
      label2: "ROOM ID: ",
      btn: "Join",
    },
    waitRoom: {
      title: "Waiting to start...",
      subtitle: "Your numbers:  ",
      subtitle2: "Creating paper",
      subtitle3: "is here!",
      title2: "Instructions",
      title3: "Waiting players...",
      instructions: en_instructions,
    },
    playRoom: {
      title: "The game is on",
      btn: "BINGO!",
      bingoDisplay: {
        title: "last 5 numbers:",
      },
    },
    bingo: {
      title: "won!",
    },
  },
};

const pt_instructions = (
  <>
    <p>
      Alle spillere, der deltager før spillets start, modtager deres bingo tal. Denne sekvens af tal er tilfældigt genereret og er unik blandt spillerne i kampen.
    </p>
    <p>
      De trukne bolde vises på værtens skærm. På spillerens skærm vil være. De sidste 5 udtrukne kugler vises.
    </p>
    <p>
      Når du klikker på tallet på spillerens skærm, vil det blive fremhævet uanset de trukket kugler.
    </p>
    <p>
      Ved at klikke på bingo!-knappen vil tallene blive valideret. Hvis det er falsk, vil spiller tager en straf. Med tre straffe er spilleren elimineret af afgang. Hvis bingo opstår, slutter spillet og vinderen vises på alle deltageres skærm.
    </p>
  </>
);

const pt = {
  home: {
    btn1: "Gå ind i spillet",
    btn2: "Lav nyt spil",
  },
  createRoom: {
    createRoom: {
      title: "Lav nyt spil",
      label1: "Spillets navn: ",
      label2: "Antal bolde: (50 - 99)",
      warning: "Spillet er ikke tilgængeligt - prøv et andet.",
      btn: "Log ind",
    },
    waitRoom: {
      title: "Spillets navn: ",
      subtitle: "Antal bolde: ",
      btn: "Start",
      title2: "Venter på spillere... ",
      subtitle2: "Kom ind!",
      title3: "Instruktioner",
      instructions: pt_instructions,
    },
    playRoom: {
      title: "Sorteando bolas...",
      btn: "sortear",
    },
    bingo: {
      title: "venceu!",
    },
  },
  joinRoom: {
    joinRoom: {
      title: "Gå ind i spillet",
      label1: "Dit navn: ",
      label2: "spillets navn: ",
      btn: "Log ind",
    },
    waitRoom: {
      title: "Venter på at spil starter",
      subtitle: "Dine udtrukne tal:  ",
      subtitle2: "Generer kort",
      subtitle3: "Log ind!",
      title2: "Instruktioner",
      title3: "Venter på spillere...",
      instructions: pt_instructions,
    },
    playRoom: {
      title: "Spillet er startet",
      btn: "BINGO!",
      bingoDisplay: {
        title: "De sidste 5 udtrukne tal:",
      },
    },
    bingo: {
      title: "Du vandt!",
    },
  },
};

export default { pt, en };
