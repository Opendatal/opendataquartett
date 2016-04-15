var globalStore = {};
globalStore.cards = [];
globalStore.fields = [];
globalStore.selectedFields = [];
var town = {};
var ready = 0;
$(document).ready(function() {
  $.getJSON('fields.json', function(data) {
    globalStore.fields = data;
    var $overlay = $('<div/>').addClass('tt-overlay');
    $('<h1/>').html('Kategorien w&auml;hlen').addClass('tt-start-h1').appendTo($overlay);
    for (i = 0; i < 5; i++) {
      var $select = $('<select>').prop("id", "field-" + i).addClass('tt-start-select').appendTo($overlay);
      j = 0;
      $.each(data, function() {
        $('<option/>').val(this.name).html(this.name).appendTo($select);
        if (i == j)
          $select.val(this.name);
        j++;
      });
      $("<br/>").appendTo($overlay);
    }

    $('<p/>').addClass('tt-start').html('Spiel starten').appendTo($overlay);

    $overlay.appendTo("#cardgame");

    $('p.tt-start').click(function(e) {
      for (i = 0; i < 5; i++) {
        $.each(globalStore.fields, function() {
          if (this.name == $("#field-" + i).val()) {
            globalStore.selectedFields.push(this);
          }
        });
      }
      loadTowns();
      e.preventDefault();
    });


  })
});


function loadTowns() {
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
        $.each(globalStore.selectedFields, function() {
          var $field = this.name;
          $.each(attr.fields, function() {
            $.each(this, function(key, value) {
              if (key == $field) {
                town.fields.push(parseFloat(value));
              }
            });
          });
        });
        globalStore.cards.push(town);
        ready--;
        loadGame();
      })
    })
  });
}

function loadGame() {
  if (ready != 0)
    return;

  $('#cardgame').toptrumps({
    'fields': globalStore.selectedFields,
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
