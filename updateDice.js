function inspectField(fieldName) {
  var field = this.getField(fieldName);

  app.alert(field.name+" is at "+field.rect[0]+", "+field.rect[1]);
  app.alert(field.name+" is "+(field.rect[2] - field.rect[0])+"x"+(field.rect[3] - field.rect[1]));
}

function dieFieldName(skillField, dieType, position) {
  return skillField.name + dieType + position;
}

function cloneDieField(skillField, dieType, position, x, y) {
  var oldField = this.getField(dieType);
  var newPosition = [
    x,
    y,
    x + (oldField.rect[2] - oldField.rect[0]),
    y + (oldField.rect[3] - oldField.rect[1]),
  ];

  var newField = this.addField(dieFieldName(skillField, dieType, position), 'button', 0, newPosition);

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

  return newField;
}

var PROFICIENCY_WIDTH = 7.6535644;
var PROFICIENCY_Y_OFFSET = -0.5;
var ABILITY_WIDTH = 5.734069;
var ABILITY_Y_OFFSET = 0.0;
var DIE_BUFFER = 0.01;
var MAX_DICE = 7;

function setDice(skillField, abilities, proficiencies, topRightX, topRightY) {
  var currentX = topRightX;

  for(var i = 1; i <= MAX_DICE; i++) {
    this.removeField(dieFieldName(skillField, 'Proficiency', i));
  }

  for(var i = 1; i <= proficiencies; i++) {
    currentX = currentX - PROFICIENCY_WIDTH;
    cloneDieField(skillField, 'Proficiency', i, currentX, topRightY + PROFICIENCY_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }

  for(var i = 1; i <= MAX_DICE; i++) {
    this.removeField(dieFieldName(skillField, 'Ability', i));
  }

  for(var i = 1; i <= abilities; i++) {
    currentX = currentX - ABILITY_WIDTH;
    cloneDieField(skillField, 'Ability', i, currentX, topRightY + ABILITY_Y_OFFSET);
    currentX = currentX - DIE_BUFFER;
  }
}

function updateDice(skill, characteristic) {
  //TODO - make these arguments or derived intelligently from skill field
  var topRightX = 670.9606314;
  var topRightY = 551.488220;

  var skillField = this.getField(skill);
  var characteristicField = this.getField(characteristic);
  var skillValue = parseInt(skillField.value);
  var characteristicValue = parseInt(characteristicField.value);

  var min = (skillValue < characteristicValue) ? skillValue : characteristicValue;
  var max = (skillValue > characteristicValue) ? skillValue : characteristicValue;

  setDice(skillField, (max - min), min, topRightX, topRightY);
}
