/* global game, mergeObject */

import { GhoulActorSheet } from "./ghoul-actor-sheet.js";
import { getBloodPotencyValues, getBloodPotencyText } from "./blood-potency.js";
import { rollDice } from "./roll-dice.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {GhoulActorSheet}
 */

export class VampireDarkAgesSheet extends GhoulActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vtm5e", "sheet", "actor", "vampire-da"],
      template: "systems/evwod/templates/actor/vampire-da-sheet.html",
      width: 800,
      height: 700,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats",
        },
      ],
    });
  }

  constructor(actor, options) {
    super(actor, options);
    this.hunger = true;
  }

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited)
      return "systems/evwod/templates/actor/limited-sheet.html";
    return "systems/evwod/templates/actor/vampire-da-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    console.log(data);
    data.sheetType = `${game.i18n.localize("VTM5E.VampireDarkAges")}`;

    // Prepare items.
    if (
      this.actor.data.type === "vampire-da" ||
      this.actor.data.type === "character"
    ) {
      this._prepareItems(data);
    }

    return data;
  }

  /**
   * set Blood Potency for Vampire sheets.
   *
   * @param {Object} actorData The actor to prepare.
   * @return {undefined}
   * @override
   */
  _prepareItems(sheetData) {
    super._prepareItems(sheetData);

    const actorData = sheetData.actor;
    actorData.bloodPotencyValue = parseInt(this.actor.data.data.blood.potency);
    sheetData.blood_potency_text = getBloodPotencyText(
      actorData.bloodPotencyValue
    );
    actorData.bloodPotency = getBloodPotencyValues(actorData.bloodPotencyValue);
  }

  /** @override */
  _onVampireRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item = this.actor.items.get(dataset.id);
    let disciplineValue = 0;
    // if (item.data.data.discipline === "rituals") {
    //   disciplineValue = this.actor.data.data.disciplines.sorcery.value;
    // } else

    if (item.data.data.discipline === "ceremonies") {
      disciplineValue = this.actor.data.data.disciplines.oblivion.value;
    } else {
      disciplineValue =
        this.actor.data.data.disciplines[item.data.data.discipline].value;
    }
    disciplineValue += this.actor.bloodPotency.power; // Blood potency power adds dices to discipline rolls only

    const dice1 =
      item.data.data.dice1 === "discipline"
        ? disciplineValue
        : this.actor.data.data.abilities[item.data.data.dice1].value;

    let dice2;
    if (item.data.data.dice2 === "discipline") {
      dice2 = disciplineValue;
    } else if (item.data.data.skill) {
      dice2 = this.actor.data.data.skills[item.data.data.dice2].value;
    } else {
      dice2 = this.actor.data.data.abilities[item.data.data.dice2].value;
    }

    const dicePool = dice1 + dice2;
    rollDice(dicePool, this.actor, `${item.data.name}`, 0, this.hunger);
  }
}
