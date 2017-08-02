# dumberbot
A bot that beats Dumbot.
---

## Quick start

### 1. Start the bot with BoardSpace DVONN game client opened: `yarn start` 
### 2. Run the test script: `./test.ts`

### Architecture

```
1. Automator (OS interface with Boardspace.net applet)
2. Referree (manages game state and movement rules)
  - should be able to parse SGF file
  - SGFParser
    - step forward, step back through frames
3. Scout (analyzes game state and outputs statistics for game space given its state and player)
4. Field marshal (tactical decisions)
5. Commander (strategic decisions)
```

## General Tactics

### Next-move metrics

**Composition** is the ratio of enemy rings vs own rings in a stack. A higher composition is favored
 as the target of the next move.
 
**Disposition** is the number of defenders of a stack. Enemy disposition is the number of available 
stacks the enemy has to cover a position, vs own disposition which is the number of stacks you have
that can move on top of the position of interest.

**Locality** is the density of stacks of the same color in a neighborhood of 7 positions (1 central + 6 adjacent).

### Strategies

1. Early-game
2. Mid-game
3. End-game