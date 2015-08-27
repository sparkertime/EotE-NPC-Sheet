var SETBACK_WIDTH = 6.8;
var SETBACK_Y_OFFSET = -1.4;
var BOOST_WIDTH = 6.8;
var BOOST_Y_OFFSET = -1.4;
var PROFICIENCY_WIDTH = 7.6535644;
var PROFICIENCY_Y_OFFSET = -0.5;
var ABILITY_WIDTH = 5.734069;
var ABILITY_Y_OFFSET = 0.0;
var DIE_BUFFER = 0.01;
var MAX_DICE = 7;
var MAX_BOOST = 2;

function forEach(array, fn) {
  var arrayLength = array.length;
  for(var i = 0; i < arrayLength; i++) {
    fn(array[i]);
  }

  return array;
}

function dieFieldName(prefix, dieType, position) {
  return prefix + dieType + position;
}

function remove(fieldName) {
  if(this.getField(fieldName)) {
    this.removeField(fieldName);
  }
}

function removeAllDice(namePrefix) {
  for(var i = 1; i <= MAX_BOOST; i++) {
    remove(dieFieldName(namePrefix, 'Setback', i));
  }
  for(var i = 1; i <= MAX_BOOST; i++) {
    remove(dieFieldName(namePrefix, 'Boost', i));
  }
  for(var i = 1; i <= MAX_DICE; i++) {
    remove(dieFieldName(namePrefix, 'Proficiency', i));
  }
  for(var i = 1; i <= MAX_DICE; i++) {
    remove(dieFieldName(namePrefix, 'Ability', i));
  }
}

function inspectField(fieldName) {
  var field = this.getField(fieldName);

  app.alert(field.name+" is at "+field.rect[0]+", "+field.rect[1]);
  app.alert(field.name+" is "+(field.rect[2] - field.rect[0])+"x"+(field.rect[3] - field.rect[1]));
}

function cloneDieField(name, dieType, x, y) {
  var oldField = this.getField(dieType);
  var newPosition = [
    x,
    y,
    x + (oldField.rect[2] - oldField.rect[0]),
    y + (oldField.rect[3] - oldField.rect[1]),
  ];

  var newField = this.addField(name, 'button', 0, newPosition);

  newField.buttonAlignX = oldField.buttonAlignX;
  newField.buttonAlignY = oldField.buttonAlignY;
  newField.buttonFitBounds = oldField.buttonFitBounds;
  newField.buttonPosition = oldField.buttonPosition;
  newField.buttonScaleHow = oldField.buttonScaleHow;
  newField.buttonScaleWhen = oldField.buttonScaleWhen;
  newField.borderStyle = oldField.borderStyle;
  newField.lineWidth = oldField.lineWidth;
  newField.buttonSetIcon(oldField.buttonGetIcon(0), 0);
  newField.buttonSetIcon(oldField.buttonGetIcon(1), 1);
  newField.buttonSetIcon(oldField.buttonGetIcon(2), 2);
  newField.readonly = true;

  return newField;
}

function setDice(namePrefix, abilities, proficiencies, boosts, setbacks, topRightX, topRightY) {
  var currentX = topRightX;

  removeAllDice(namePrefix);

  for(var i = 1; i <= setbacks; i++) {
    currentX = currentX - SETBACK_WIDTH;
    var newName = dieFieldName(namePrefix, 'Setback', i);
    cloneDieField(newName, 'Setback', currentX, topRightY + SETBACK_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }

  for(var i = 1; i <= boosts; i++) {
    currentX = currentX - BOOST_WIDTH;
    var newName = dieFieldName(namePrefix, 'Boost', i);
    cloneDieField(newName, 'Boost', currentX, topRightY + BOOST_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }

  for(var i = 1; i <= proficiencies; i++) {
    currentX = currentX - PROFICIENCY_WIDTH;
    var newName = dieFieldName(namePrefix, 'Proficiency', i);
    cloneDieField(newName, 'Proficiency', currentX, topRightY + PROFICIENCY_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }

  for(var i = 1; i <= abilities; i++) {
    currentX = currentX - ABILITY_WIDTH;
    var newName = dieFieldName(namePrefix, 'Ability', i);
    cloneDieField(newName, 'Ability', currentX, topRightY + ABILITY_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }
}

function parseRoll(unformattedRoll) {
  var boosts = 0;
  var setbacks = 0;
  var roll = unformattedRoll.split(' ').join('');

  var lowRoll = [];
  var highRoll = [];
  var parsingHigh = true;

  for(var i = 0; i < roll.length; i++) {
    var char = roll[i];

    if(char == '+') {
      boosts += 1;
    } else if(char == '-') {
      setbacks += 1;
    } else if(isNaN(char)) {
      parsingHigh = false;
    } else if(parsingHigh) {
      highRoll.push(char);
    } else {
      lowRoll.push(char);
    }

  }

  return {
    boosts: boosts,
    setbacks: setbacks,
    top: parseInt(highRoll.join('')),
    bottom: parseInt(lowRoll.join('')),
  };
}

function showDice(fieldName, topRightX, topRightY) {
  var rollField = this.getField(fieldName);
  var roll = parseRoll(rollField.value);

  var min = (roll.top < roll.bottom) ? roll.top : roll.bottom;
  var max = (roll.top > roll.bottom) ? roll.top : roll.bottom;

  setDice(fieldName, (max - min), min, roll.boosts, roll.setbacks, topRightX, topRightY);
}

function showDiceForRoll(fieldName) {
  var rollField = this.getField(fieldName);
  var topRightX = rollField.rect[0] + 95.0;
  var topRightY = rollField.rect[1] - 0.513061738;
  showDice(fieldName, topRightX, topRightY);
}
