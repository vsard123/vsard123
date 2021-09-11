jQuery(document).ready(function () {
  jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
  jQuery(".colors a").click(function () {
    if ($(this).attr("class") != "default") {
      $("#jquery-accordion-menu").removeClass();
      $("#jquery-accordion-menu")
        .addClass("jquery-accordion-menu")
        .addClass($(this).attr("class"));
    } else {
      $("#jquery-accordion-menu").removeClass();
      $("#jquery-accordion-menu").addClass("jquery-accordion-menu");
    }
  });
});
