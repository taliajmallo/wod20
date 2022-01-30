/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  console.log("Schrecknet : loading subroutines");
  // Define template paths to load
  const templatePaths = [
    // Actor Sheet Partials
    "systems/evwod/templates/actor/parts/biography.html",
    "systems/evwod/templates/actor/parts/disciplines.html",
    "systems/evwod/templates/actor/parts/exp.html",
    "systems/evwod/templates/actor/parts/features.html",
    "systems/evwod/templates/actor/parts/frenzy.html",
    "systems/evwod/templates/actor/parts/health.html",
    "systems/evwod/templates/actor/parts/humanity.html",
    "systems/evwod/templates/actor/parts/bloodpool.html",
    "systems/evwod/templates/actor/parts/essence.html",
    "systems/evwod/templates/actor/parts/limit.html",
    "systems/evwod/templates/actor/parts/profile-img.html",
    "systems/evwod/templates/actor/parts/other.html",
    "systems/evwod/templates/actor/parts/rotschreck.html",
    "systems/evwod/templates/actor/parts/stats.html",
    "systems/evwod/templates/actor/parts/exaltStats.html",
    "systems/evwod/templates/actor/parts/willpower.html",
    "systems/evwod/templates/actor/parts/combat.html",

    // Item Sheet Partials
    "systems/evwod/templates/item/parts/skills.html",
    "systems/evwod/templates/item/parts/disciplines.html",
    "systems/evwod/templates/item/parts/attributes.html",
    "systems/evwod/templates/item/parts/virtues.html",
  ];

  /* Load the template parts
     That function is part of foundry, not founding it here is normal
  */
  return loadTemplates(templatePaths); // eslint-disable-line no-undef
};
