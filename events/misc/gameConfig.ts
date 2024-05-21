// /**const {
//   Events,
//   ActionRowBuilder,
//   StringSelectMenuBuilder,
//   ComponentType,
//   StringSelectMenuOptionBuilder,

// } = require("discord.js");
// const {
//   Snake,
//   Connect4,
//   TicTacToe,
//   RockPaperScissors,
//   FastType,
//   GuessThePokemon,
//   TwoZeroFourEight,
//   Minesweeper 
// } = require("discord-gamecord");

// module.exports = {
//   name: Events.MessageCreate,
//   /**
//    *
//    * @param {Object} param0
//    * @param {import('discord.js').ChatInputCommandInteraction} param0.message
//    */
//   async execute(message) {
//     if (message.content.startsWith("x!games")) {
//       const gameMenu = new StringSelectMenuBuilder()
//         .setCustomId("game-menu")
//         .setPlaceholder("Choose any game")
//         .addOptions(
//           new StringSelectMenuOptionBuilder()
//             .setLabel("TicTacToe")
//             .setDescription("Play tic-tac-toe with another user")
//             .setValue("tictactoe"),
//           new StringSelectMenuOptionBuilder()
//             .setLabel("RockPaperScissors")
//             .setDescription("Play rps with another user")
//             .setValue("rps"),
//           new StringSelectMenuOptionBuilder()
//             .setLabel("GuessThePokemon")
//             .setDescription("Play guess the pokemon with yourself")
//             .setValue("pokemon"),
//           new StringSelectMenuOptionBuilder()
//             .setLabel("FastType")
//             .setDescription("Play FastType with yourself")
//             .setValue("fast-type"),
//           new StringSelectMenuOptionBuilder()
//             .setLabel("TwoZeroFourEight")
//             .setDescription("Play TwoZeroFourEight with yourself")
//             .setValue("two-zero-four-eight"),
//           new StringSelectMenuOptionBuilder()
//             .setLabel("Snake")
//             .setDescription("Play Snake with yourself")
//             .setValue("snake"),
//             new StringSelectMenuOptionBuilder()
//             .setLabel('Minesweeper')
//             .setDescription('minesweeperPlay Minesweeper with yourself')
//             .setValue('minesweeper'),
//             new StringSelectMenuOptionBuilder()
//             .setLabel('Connect4')
//             .setDescription('Play Connect4 with user')
//             .setValue('connect4')
            
//         );
//       const row = new ActionRowBuilder().addComponents(gameMenu);

//       try {
//         const response = await message.channel.send({
//           content: "Play any game from the menu",
//           components: [row],
//         });

//         const collector = response.createMessageComponentCollector({
//           componentType: ComponentType.StringSelect,
//           time: 3_600_000,
//         });

//         collector.on("collect", async (i) => {
//           if (i.user.id !== message.author.id) {
//             await i.reply({
//               content: "You cant select any options",
//               ephemeral: true,
//             });
//           }
//           switch (i.values[0]) {
//             case "tictactoe":
//               const tttuser = message.mentions.users.first();
//               if (!tttuser) {
//                 await i.reply({
//                   content: "No user provided \n Trt `x!games @user`",
//                   components: [],
//                   ephemeral: true,
//                 });
//               }
//               try {
//                 const Game = new TicTacToe({
//                   message: message,
//                   isSlashGame: false,
//                   opponent: tttuser,

//                   embed: {
//                     title: "Tic Tac Toe",
//                     color: "#5865F2",
//                     statusTitle: "Status",
//                     overTitle: "Game Over",
//                   },
//                   emojis: {
//                     xButton: "❌",
//                     oButton: "🔵",
//                     blankButton: "➖",
//                   },
//                   mentionUser: true,
//                   timeoutTime: 60000,
//                   xButtonStyle: "DANGER",
//                   oButtonStyle: "PRIMARY",
//                   turnMessage: "{emoji} | Its turn of player **{player}**.",
//                   winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
//                   tieMessage: "The Game tied! No one won the Game!",
//                   timeoutMessage:
//                     "The Game went unfinished! No one won the Game!",
//                   playerOnlyMessage:
//                     "Only {player} and {opponent} can use these buttons.",
//                 });

//                 Game.startGame();
//                 Game.on("gameOver", (result) => {
//                   return; // =>  { result... }
//                 });
//               } catch (e) {
//                 console.log(e);
//               }
//               break;
//             case "rps":
//               const rpsuser = message.mentions.users.first();
//               if (!rpsuser) {
//                 i.reply({
//                   content: "No user provided \n Trt `x!games @user`",
//                   components: [],
//                 });
//               }
//               try {
//                 const Game = new RockPaperScissors({
//                   message: message,
//                   isSlashGame: false,
//                   opponent: rpsuser,
//                   embed: {
//                     title: "Rock Paper Scissors",
//                     color: "#5865F2",
//                     description: "Press a button below to make a choice.",
//                   },
//                   buttons: {
//                     rock: "Rock",
//                     paper: "Paper",
//                     scissors: "Scissors",
//                   },
//                   emojis: {
//                     rock: "🌑",
//                     paper: "📰",
//                     scissors: "✂️",
//                   },
//                   mentionUser: true,
//                   timeoutTime: 60000,
//                   buttonStyle: "PRIMARY",
//                   pickMessage: "You choose {emoji}.",
//                   winMessage: "**{player}** won the Game! Congratulations!",
//                   tieMessage: "The Game tied! No one won the Game!",
//                   timeoutMessage:
//                     "The Game went unfinished! No one won the Game!",
//                   playerOnlyMessage:
//                     "Only {player} and {opponent} can use these buttons.",
//                 });

//                 Game.startGame();
//                 Game.on("gameOver", (result) => {
//                   return; // =>  { result... }
//                 });
//               } catch (e) {
//                 console.error(e);
//               }
//               break;
//             case 'pokemon':
//                 try {
//          /** */           const Game = new GuessThePokemon({
//                         message: message,
//                         isSlashGame: false,
//                         embed: {
//                           title: 'Who\'s The Pokemon',
//                           color: '#5865F2'
//                         },
//                         timeoutTime: 60000,
//                         winMessage: 'You guessed it right! It was a {pokemon}.',
//                         loseMessage: 'Better luck next time! It was a {pokemon}.',
//                         errMessage: 'Unable to fetch pokemon data! Please try again.',
//                         playerOnlyMessage: 'Only {player} can use these buttons.'
//                       });
                      
//                       Game.startGame();
//                       Game.on('gameOver', result => {
//                        return; // =>  { result... }
//                       });
//                 } catch (e) {
//                     console.log(e)
//                 }
//                 break;
//                 case 'fast-type':
//                     try {
//                         const Game = new FastType({
//                             message: message,
//                             isSlashGame: false,
//                             embed: {
//                               title: 'Fast Type',
//                               color: '#5865F2',
//                               description: 'You have {time} seconds to type the sentence below.'
//                             },
//                             timeoutTime: 60000,
//                             sentence: 'Some really cool sentence to fast type.',
//                             winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
//                             loseMessage: 'You lost! You didn\'t type the correct sentence in time.',
//                           });
                          
//                           Game.startGame();
//                           Game.on('gameOver', result => {
//                             return;  // =>  { result... }
//                           });
//                     } catch (e) {
//                         console.error(e)
//                     }
//                     break;
//                 case 'two-zero-four-eight':
//                    try {
//                     const Game = new TwoZeroFourEight({
//                         message: message,
//                         isSlashGame: false,
//                         embed: {
//                           title: '2048',
//                           color: '#5865F2'
//                         },
//                         emojis: {
//                           up: '⬆️',
//                           down: '⬇️',
//                           left: '⬅️',
//                           right: '➡️',
//                         },
//                         timeoutTime: 60000,
//                         buttonStyle: 'PRIMARY',
//                         playerOnlyMessage: 'Only {player} can use these buttons.'
//                       });
                      
//                       Game.startGame();
//                       Game.on('gameOver', result => {
//                           // =>  { result... }
//                       });
//                    } catch (e) {
//                     console.log(e)
//                    }
//                    break;
//                 case 'snake':
//                     try {
//                         const Game = new Snake({
//                             message: message,
//                             isSlashGame: false,
//                             embed: {
//                               title: 'Snake Game',
//                               overTitle: 'Game Over',
//                               color: '#5865F2'
//                             },
//                             emojis: {
//                               board: '⬛',
//                               food: '🍎',
//                               up: '⬆️', 
//                               down: '⬇️',
//                               left: '⬅️',
//                               right: '➡️',
//                             },
//                             snake: { head: '🟢', body: '🟩', tail: '🟢', skull: '💀' },
//                             foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
//                             stopButton: 'Stop',
//                             timeoutTime: 60000,
//                             playerOnlyMessage: 'Only {player} can use these buttons.'
//                           });
                          
//                           Game.startGame();
//                           Game.on('gameOver', result => {
//                             return;  // =>  { result... }
//                           });
//                     } catch (e) {
//                         console.error(e)
                          
//                     }
//                     break;
//                 case 'minesweeper':
//                     try {
//                         const Game = new Minesweeper({
//                             message: message,
//                             isSlashGame: false,
//                             embed: {
//                               title: 'Minesweeper',
//                               color: '#5865F2',
//                               description: 'Click on the buttons to reveal the blocks except mines.'
//                             },
//                             emojis: { flag: '🚩', mine: '💣' },
//                             mines: 5,
//                             timeoutTime: 60000,
//                             winMessage: 'You won the Game! You successfully avoided all the mines.',
//                             loseMessage: 'You lost the Game! Beaware of the mines next time.',
//                             playerOnlyMessage: 'Only {player} can use these buttons.'
//                           });
                          
//                           Game.startGame();
//                           Game.on('gameOver', result => {
//                             return; // =>  { result... }
//                           });
//                     } catch (e) {
//                         console.error(e)
//                     }
//                     break;
//                 case 'connect4':
//                     const connectUser = message.mentions.users.first()
//                     if (!connectUser) {
//                         i.reply({
//                             content: 'No users found \n Try `x!games @user`',
//                             components: [],
//                             ephemeral: true
//                         })
//                     }
//                     try {
//                         const Game = new Connect4({
//                             message: message,
//                             isSlashGame: false,
//                             opponent: connectUser,
//                             embed: {
//                               title: 'Connect4 Game',
//                               statusTitle: 'Status',
//                               color: '#5865F2'
//                             },
//                             emojis: {
//                               board: '⚪',
//                               player1: '🔴',
//                               player2: '🟡'
//                             },
//                             mentionUser: true,
//                             timeoutTime: 60000,
//                             buttonStyle: 'PRIMARY',
//                             turnMessage: '{emoji} | Its turn of player **{player}**.',
//                             winMessage: '{emoji} | **{player}** won the Connect4 Game.',
//                             tieMessage: 'The Game tied! No one won the Game!',
//                             timeoutMessage: 'The Game went unfinished! No one won the Game!',
//                             playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
//                           });
                          
//                           Game.startGame();
//                           Game.on('gameOver', result => {
//                             return; // =>  { result... }
//                           });
//                     } catch (e) {
//                         console.error(e)
//                     }
//                   break;
                 
            
//           }
//         });
//       } catch (err) {
//         console.log(`Error in ${__filename} \n ${err}`);
//       }
//     }
//   }
