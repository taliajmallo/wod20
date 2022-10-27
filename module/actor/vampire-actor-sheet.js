/* global game, mergeObject */

import { GhoulActorSheet } from "./ghoul-actor-sheet.js";
import { getBloodPotencyValues, getBloodPotencyText } from "./blood-potency.js";
import { rollDice } from "./roll-dice.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {GhoulActorSheet}
 */

export class VampireActorSheet extends GhoulActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vtm5e", "sheet", "actor", "vampire"],
      template: "systems/evwod/templates/actor/vampire-sheet.html",
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
    return "systems/evwod/templates/actor/vampire-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.sheetType = `${game.i18n.localize("VTM5E.Vampire")}`;

    //data.skillsDa = skillsDa
    //data.skillsWild = skillsWild


    // Prepare items.
    if (
      this.actor.data.type === "vampire" ||
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

}
