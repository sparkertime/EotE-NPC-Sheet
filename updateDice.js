var PROFICIENCY_WIDTH = 7.6535644;
var PROFICIENCY_Y_OFFSET = -0.5;
var ABILITY_WIDTH = 5.734069;
var ABILITY_Y_OFFSET = 0.0;
var DIE_BUFFER = 0.01;
var MAX_DICE = 7;

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

function removeAllDice(namePrefix) {
  for(var i = 1; i <= MAX_DICE; i++) {
    this.removeField(dieFieldName(namePrefix, 'Proficiency', i));
  }
  for(var i = 1; i <= MAX_DICE; i++) {
    this.removeField(dieFieldName(namePrefix, 'Ability', i));
  }
}

var charsToSkills = {
  "Brawn"     : ["Brawl", "Melee", "Athletics", "Resilience"],
  "Agility"   : ["RangedLight", "RangedHeavy", "Gunnery", "Coordination", "PilotingPlanetary", "PilotingSpace", "Stealth"],
  "Intellect" : ["Astrogation", "Computers", "Mechanics", "Medicine"],
  "Cunning"   : ["Perception", "Deception", "Skulduggery", "Streetwise", "Survival"],
  "Willpower" : ["Discipline", "Vigilance", "Coercion"],
  "Presence"  : ["Cool", "Negotiation", "Leadership", "Charm"]
};

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

function setDice(namePrefix, abilities, proficiencies, topRightX, topRightY) {
  var currentX = topRightX;

  removeAllDice(namePrefix);

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

function showDice(namePrefix, skill, characteristic, topRightX, topRightY) {
  var skillField = this.getField(skill);
  var characteristicField = this.getField(characteristic);
  var skillValue = parseInt(skillField.value);
  var characteristicValue = parseInt(characteristicField.value);

  var min = (skillValue < characteristicValue) ? skillValue : characteristicValue;
  var max = (skillValue > characteristicValue) ? skillValue : characteristicValue;

  setDice(namePrefix, (max - min), min, topRightX, topRightY);
}

// showDice('CoolSkill', 'Cool', 'Presence', [670.96.., 551.48...]
// showDiceForSkill('Cool', 'Presence')
function showDiceForSkill(skill, characteristic) {
  var skillField = this.getField(skill);
  var topRightX = skillField.rect[0] + 75.0;
  var topRightY = skillField.rect[1] - 0.513061738;
  showDice(skill+'Skill', skill, characteristic, topRightX, topRightY);
}

function refreshAllForCharacteristic(characteristic) {
  var skills = charsToSkills[characteristic];
  forEach(skills, function(s) { showDiceForSkill(s, characteristic) });
}

var ATTACK_SKILLS = {
  "Brawl"         : ["Brawl", "Brawn"],
  "Melee"         : ["Melee", "Brawn"],
  "Ranged: Light" : ["RangedLight", "Agility"],
  "Ranged: Heavy" : ["RangedHeavy", "Agility"],
  "Gunnery"       : ["Gunnery", "Agility"],
}

function showDiceForAttack(attackFieldName) {
  var attackSkillField = this.getField(attackFieldName);
  var namePrefix = attackFieldName+'Attack';

  if(attackSkillField.value == ' ') {
    removeAllDice(namePrefix);
  }

  var skill = ATTACK_SKILLS[attackSkillField.value][0];
  var characteristic = ATTACK_SKILLS[attackSkillField.value][1];
  var topRightX = attackSkillField.rect[0] + 58.0;
  var topRightY = attackSkillField.rect[1] - 10;

  showDice(namePrefix, skill, characteristic, topRightX, topRightY);
}
