// Assumes your screen resolution is 1440 x 

const MENU_ACTIONS = { dx: 90, dy: 20 };
const MENU_ACTIONS_SHOW_SGF_OUTPUT = { dx: 90, dy: 134 };

const PLAYER_0_IS_ACTIVE = { dx: 24, dy: 290 };
const PLAYER_1_IS_ACTIVE = { dx: 720, dy: 290 };

const DONE_BUTTON = { dx: 460, dy: 802 };

const A1 = { dx: 220, dy: 684 };
const A2 = { dx: 196, dy: 640 };
const A3 = { dx: 177, dy: 596 };

const B1 = { dx: 281, dy: 684 };
const B2 = { dx: 257, dy: 640 };
const B3 = { dx: 234, dy: 598 };
const B4 = { dx: 213, dy: 557 };

const C1 = { dx: 343, dy: 685 };
const C2 = { dx: 316, dy: 641 };
const C3 = { dx: 291, dy: 597 };
const C4 = { dx: 270, dy: 557 };
const C5 = { dx: 250, dy: 517 };

const D1 = { dx: 405, dy: 684 };
const D2 = { dx: 376, dy: 642 };
const D3 = { dx: 349, dy: 595 };
const D4 = { dx: 324, dy: 554 };
const D5 = { dx: 302, dy: 518 };

const E1 = { dx: 465, dy: 685 };
const E2 = { dx: 435, dy: 641 };
const E3 = { dx: 406, dy: 597 };
const E4 = { dx: 380, dy: 555 };
const E5 = { dx: 355, dy: 516 };

const F1 = { dx: 526, dy: 683 };
const F2 = { dx: 495, dy: 640 };
const F3 = { dx: 463, dy: 597 };
const F4 = { dx: 436, dy: 556 };
const F5 = { dx: 410, dy: 516 };

const G1 = { dx: 589, dy: 684 };
const G2 = { dx: 554, dy: 640 };
const G3 = { dx: 521, dy: 596 };
const G4 = { dx: 492, dy: 558 };
const G5 = { dx: 464, dy: 516 };

const H1 = { dx: 649, dy: 684 };
const H2 = { dx: 613, dy: 640 };
const H3 = { dx: 579, dy: 598 };
const H4 = { dx: 548, dy: 555 };
const H5 = { dx: 519, dy: 516 };

const I1 = { dx: 711, dy: 684 };
const I2 = { dx: 673, dy: 641 };
const I3 = { dx: 637, dy: 598 };
const I4 = { dx: 604, dy: 556 };
const I5 = { dx: 572, dy: 517 };

const J2 = { dx: 734, dy: 641 };
const J3 = { dx: 695, dy: 597 };
const J4 = { dx: 660, dy: 556 };
const J5 = { dx: 626, dy: 516 };

const K3 = { dx: 753, dy: 599 };
const K4 = { dx: 715, dy: 557 };
const K5 = { dx: 679, dy: 516 };

const ABSOLUTE_OFFSETS = {
    DONE_BUTTON,
    
    A1, A2, A3,
    B1, B2, B3, B4,
    C1, C2, C3, C4, C5,
    D1, D2, D3, D4, D5,
    E1, E2, E3, E4, E5,
    F1, F2, F3, F4, F5,
    G1, G2, G3, G4, G5,
    H1, H2, H3, H4, H5,
    I1, I2, I3, I4, I5,
    J2, J3, J4, J5,
    K3, K4, K5
};

Object.keys(ABSOLUTE_OFFSETS).forEach(k => {
    ABSOLUTE_OFFSETS[k].dx -= 11;
    ABSOLUTE_OFFSETS[k].dy -= 30;
});

export default {
    MENU_ACTIONS,
    MENU_ACTIONS_SHOW_SGF_OUTPUT,
    PLAYER_0_IS_ACTIVE,
    PLAYER_1_IS_ACTIVE,

    ...ABSOLUTE_OFFSETS
}
