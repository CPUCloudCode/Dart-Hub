let players = 4;
let minPlayers = 1;
let maxPlayers = 12;

$(document).ready(function(){

    $('#addPlayer').click(function() {
        if(players==maxPlayers) {
            return;
        }
        let newPlayer = "player" + (players+1)
        let newPlayerStr = "Spieler " + (players+1)
        $('#playerRow').append($('<div class="col-6 mb-3"></div>').append($('<label for="'+newPlayer+'" class="form-label">' + newPlayerStr +'</label>')).append($('<input type="text" class="form-control" id="'+newPlayer+'" placeholder="Spielername von '+newPlayerStr+'" name="'+newPlayer+'" required>')))
        players++;
        $('#players').val(players)
    })


    $('#removePlayer').click(function() {
        if(players==minPlayers) {
            return;
        }
        let delPlayer = "player" + (players)
        console.log( $('#' + delPlayer))
        $('#' + delPlayer).parent('.col-6').remove()
        players--;
        $('#players').val(players)
        
    })


    $('#resetPlayer').click(function() {
        alert("Reset")
    })


  });
