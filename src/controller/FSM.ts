import StateMachine from 'javascript-state-machine';

export const fsm = new StateMachine({
    init: 'start',
    transitions: [
      { name: 'starting', from: 'start', to: 'gamerturn' },
      { name: 'resulting',   from: ['gamerturn','enemyturn'], to: 'result'  },
      { name: 'gamer', from: 'enemyturn', to: 'gamerturn'},
      { name: 'enemy', from: 'gamerturn', to: 'enemyturn'},
      { name: 'reset', from: '*', to: 'start' },
    ],
    methods: {
      onStarting: function() { console.log('I initializing')    },
      onExiting:   function() { console.log('I exit')     },
      onGamer: function() { console.log('I gamer') },
      onEnemy: function() { console.log('I enemy') }
    }
  });