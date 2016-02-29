var globalStore = {};
globalStore.cards = [];
var town = {};
var ready = 0;
$(document).ready(function() {
  $.when(
    $.getJSON('fields.json', function(data) {
      globalStore.fields = data;
    }),

    $.getJSON('towns.json', function(data) {
      var towns = data;
      $.each(towns, function() {
        ready++;
        $.getJSON('towns/' + this + '.json', function(data) {
          var attr = data;
          town = [];
          town.name = attr.name;
          town.image = attr.image;
          town.fields = [];
          $.each(attr.fields, function() {
            $.each(this, function() {
              var tmp = this;
              town.fields.push(parseFloat(this));
            });
          });
          globalStore.cards.push(town);
          ready--;
          loadGame();
        })
      })
    })
  );
});

function loadGame() {
  if (ready != 0)
    return;

  var tmp1 = globalStore.fields;
  var tmp2 = globalStore.cards;
  $('#cardgame').toptrumps({
    'fields': globalStore.fields,
    'cards': globalStore.cards,
    'renderCard': function($card, card, fields) {
      $card.find('.tt-card-fields').before('<img src="' + card.image + '" alt="' + card.name + '" width="300" height="300">');
    },
    'trick': 'requeue',

    'onComplete': function($instance, settings) {
      var message = '';
      if (settings.points.cpu > settings.points.user) {
        message += '<h2>Du hast verloren!</h2>';
      } else if (settings.points.cpu < settings.points.user) {
        message += '<h2>Glückwunsch. Du hast gewonnen!</h2>';
      } else {
        message += '<h2>Schwach. Es ist ein unentschieden.</h2>';
      }

      message += '<p>Vielen Dank fürs spielen.</p>';
      message += '<p>Den Code gibts auf <a href="https://github.com/">Github</a>.</p>';
      message += '<p><a href="http://www.exmatrikulator.de">Nico Heßler</a> <a href="#">Sam Zeini</a></p>';
      message += '<p><a href="http://www.opendatal.de">Opendatal</a></p>';
      message += '<p><a href="javascript:location.reload();">Erneut spielen</a></p>';

      $instance.prepend($('<div>').css('text-align', 'center').html(message));
    }
  });
};