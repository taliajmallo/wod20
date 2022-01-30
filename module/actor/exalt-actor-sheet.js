/* global Dialog, game, mergeObject */

import { MortalActorSheet } from "./mortal-actor-sheet.js";

import { rollDice } from "./roll-dice.js";
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {MortalActorSheet}
 */

export class ExaltActorSheet extends MortalActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vtm5e", "sheet", "actor", "exalt"],
      template: "systems/evwod/templates/actor/exalt-sheet.html",
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

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited)
      return "systems/evwod/templates/actor/limited-sheet.html";
    return "systems/evwod/templates/actor/exalt-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.sheetType = `${game.i18n.localize("VTM5E.Exalt")}`;

    // Prepare items.
    if (this.actor.data.type === "exalt") {
      this._prepareItems(data);
    }

    return data;
  }

  /**
   * Organize and classify Disciplines for Vampire & Exalt sheets.
   *
   * @param {Object} actorData The actor to prepare.
   * @return {undefined}
   * @override
   */
  _prepareItems(sheetData) {
    super._prepareItems(sheetData);
    const actorData = sheetData.actor;

    const disciplines = {
      abombwe: [],
      animalism: [],
      auspex: [],
      bardo: [],
      celerity: [],
      chimerstry:[],
      daimonion: [],
      dementation: [],
      dominate: [],
      flight: [],
      fortitude: [],
      melpominee: [],
      mytherceria: [],
      obeah: [],
      obfuscate: [],
      obtenebration: [],
      potence: [],
      presence: [],
      protean: [],
      quietus: [],
      sanguinus: [],
      serpentis: [],
      spiritus: [],
      temporis: [],
      thanatosis: [],
      valeren: [],
      vicissitude: [],
      visceratika: [],
      oblivion: [],
      rituals: [],
      ceremonies: [],
      thaumaturgy: [],
      necromancy: [],
    };

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      if (i.type === "power") {
        // Append to disciplines.
        if (i.data.discipline !== undefined) {
          console.log("that's the discipline", i.data.discipline);
          disciplines[i.data.discipline].push(i);
          if (!this.actor.data.data.disciplines[i.data.discipline].visible) {
            this.actor.update({
              [`data.disciplines.${i.data.discipline}.visible`]: true,
            });
          }
        }
      }
    }

    // Assign and return
    actorData.disciplines_list = disciplines;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Make Discipline visible
    html.find(".discipline-create").click(this._onShowDiscipline.bind(this));

    // Make Discipline hidden
    html.find(".discipline-delete").click((ev) => {
      const data = $(ev.currentTarget)[0].dataset;
      this.actor.update({
        [`data.disciplines.${data.discipline}.visible`]: false,
      });
    });

    // Rollable Vampire/Exalts powers
    html.find(".power-rollable").click(this._onVampireRoll.bind(this));
  }

  /**
   * Handle making a discipline visible
   * @param {Event} event   The originating click event
   * @private
   */
  _onShowDiscipline(event) {
    event.preventDefault();
    let options = "";
    for (const [key, value] of Object.entries(
      this.actor.data.data.disciplines
    )) {
      options = options.concat(
        `<option value="${key}">${game.i18n.localize(value.name)}</option>`
      );
    }

    const template = `
      <form>
          <div class="form-group">
              <label>${game.i18n.localize("VTM5E.SelectDiscipline")}</label>
              <select id="disciplineSelect">${options}</select>
          </div>
      </form>`;

    let buttons = {};
    buttons = {
      draw: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("VTM5E.Add"),
        callback: async (html) => {
          const discipline = html.find("#disciplineSelect")[0].value;
          this.actor.update({
            [`data.disciplines.${discipline}.visible`]: true,
          });
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("VTM5E.Cancel"),
      },
    };

    new Dialog({
      title: game.i18n.localize("VTM5E.AddDiscipline"),
      content: template,
      buttons: buttons,
      default: "draw",
    }).render(true);
  }

  _onVampireRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item = this.actor.items.get(dataset.id);
    const disciplineValue = 1;

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
