function from_dict(state) {
  const cards = state.currentPlayer.cards;
  const card_vis = state.currentPlayer.cardVisibilities;
  const card_permissions =
    state.currentPlayer.cardPermissions || new Array(cards.length).fill(true);

  const cards_at_hand = cards.filter((x, i) => card_vis[i]);
  const trump = state.trump != null ? state.trump : null;

  const first_player_pos =
    state.stepFirstPlayerIndex != null
      ? state.stepFirstPlayerIndex
      : state.roundFirstPlayerIndex;

  const player_stats = !state.players[0].lastRoundStats
    ? state.players.map((x) => x.roundStats)
    : state.players.map((x) => x.lastRoundStats);

  const action_type = statusMap[state.status];

  const down_cards = state.downCards;

  const step = state.step;

  return encode(
    player_stats,
    first_player_pos,
    cards_at_hand,
    card_permissions,
    down_cards,
    action_type,
    step,
    trump
  );
}

function encode(
  player_stats,
  first_player_pos,
  cards_at_hand,
  allowed_cards,
  table_cards,
  expected_action_type,
  step,
  trump_card
) {
  // featue 1
  const feat1 = [];
  for (stat of player_stats) {
    if (!stat) {
      feat1.push(...one_hot_encode(0, 11), ...one_hot_encode(0, 11));
    } else {
      feat1.push(
        ...one_hot_encode(stat.bid + 1, 11),
        ...one_hot_encode(stat.have + 1, 11)
      );
    }
  }

  // featue 2
  const feat2 = one_hot_encode(first_player_pos, 4);

  // featues 3 + 4
  const feat3Items = [];
  const feat4Items = [];

  for (let i in cards_at_hand) {
    const [card_color, card_level] = cards_at_hand[i];

    feat3Items.push(card_color * 9 + card_level);

    if (allowed_cards[i]) {
      feat4Items.push(card_color * 9 + card_level);
    }
  }

  const feat3 = one_hot_encode(feat3Items, 36);
  const feat4 = one_hot_encode(feat4Items, 36);

  // feature 5
  const feat5Items = [];
  for (let card of table_cards) {
    if (!card) {
      continue;
    }

    // 15 is the smallest index of CARD action
    feat5Items.push(getCardActionIndex([card[0], card[1], card[2]]) - 15);
  }
  const feat5 = one_hot_encode(feat5Items, 54); // 54 is a total number of CARD actions (68 - 15 + 1)

  // feature 6
  const feat6 = one_hot_encode(expected_action_type, 3);

  // feature 7
  const feat7 = one_hot_encode(
    expected_action_type != ActionType.TRUMP ? step + 1 : 0,
    11
  );

  // feature 8
  const feat8 = one_hot_encode(!trump_card ? 0 : trump_card.value + 1, 6);

  return [].concat(feat1, feat2, feat3, feat4, feat5, feat6, feat7, feat8);
}

function getCardActionIndex(action) {
  return flatActions.findIndex(
    (x) =>
      Array.isArray(x) &&
      x.length >= 1 &&
      x[0][0] === action[0][0] &&
      x[0][1] === action[0][1] &&
      (!x[1] ||
        (action[1] &&
          x[1].want === action[1].want &&
          x[1].color === action[1].color))
  );
}

function one_hot_encode(indicesParam, n) {
  const indices = Array.isArray(indicesParam) ? indicesParam : [indicesParam];

  const arr = new Array(n).fill(0);
  indices.forEach((x) => (arr[x] = 1));

  return arr;
}

// data
const allActions = {
  bidActions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  trumpActions: [0, 1, 2, 3, 4],
  cardActions: [
    [[0, 1]],
    [[0, 2]],
    [[0, 3]],
    [[0, 4]],
    [[0, 5]],
    [[0, 6]],
    [[0, 7]],
    [[0, 8]],
    [[1, 1]],
    [[1, 2]],
    [[1, 3]],
    [[1, 4]],
    [[1, 5]],
    [[1, 6]],
    [[1, 7]],
    [[1, 8]],
    [[2, 1]],
    [[2, 2]],
    [[2, 3]],
    [[2, 4]],
    [[2, 5]],
    [[2, 6]],
    [[2, 7]],
    [[2, 8]],
    [[3, 1]],
    [[3, 2]],
    [[3, 3]],
    [[3, 4]],
    [[3, 5]],
    [[3, 6]],
    [[3, 7]],
    [[3, 8]],
    [[0, 0]],
    [[1, 0]],
    [[2, 0], { want: true, color: 0 }],
    [[2, 0], { want: true, color: 1 }],
    [[2, 0], { want: true, color: 2 }],
    [[2, 0], { want: true, color: 3 }],
    [[2, 0], { want: false, color: 0 }],
    [[2, 0], { want: false, color: 1 }],
    [[2, 0], { want: false, color: 2 }],
    [[2, 0], { want: false, color: 3 }],
    [[2, 0], { want: true, color: null }],
    [[2, 0], { want: false, color: null }],
    [[3, 0], { want: true, color: 0 }],
    [[3, 0], { want: true, color: 1 }],
    [[3, 0], { want: true, color: 2 }],
    [[3, 0], { want: true, color: 3 }],
    [[3, 0], { want: false, color: 0 }],
    [[3, 0], { want: false, color: 1 }],
    [[3, 0], { want: false, color: 2 }],
    [[3, 0], { want: false, color: 3 }],
    [[3, 0], { want: true, color: null }],
    [[3, 0], { want: false, color: null }],
  ],
};

const flatActions = [
  ...allActions.bidActions,
  ...allActions.trumpActions,
  ...allActions.cardActions,
];

const ActionType = {
  TRUMP: 0,
  BID: 1,
  CARD: 2,
  NIL: 3,
};

const statusMap = {
  WAITING_TRUMP: ActionType.TRUMP,
  WAITING_BID: ActionType.bid,
  WAITING_CARD: ActionType.CARD,
  FINISHED: ActionType.NIL,
};

// console.log(process.args);
// from_dict(process.args[0])
// console.log(from_dict(state1).join(""));
// console.log(from_dict(state2).join(""));
// console.log(from_dict(state3).join(""));
// console.log(from_dict(state4).join(""));

module.exports = {
  main: from_dict,
  encode,
};
