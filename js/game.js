/**
 * This Script serves the dart game and provides the template with logic!
 * 
 * @author Lennert Meißner <Lennert.Meissner@team-con.de>
 * @last_changed <28.09.2022>
 */

// Declare const variables
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const bgPlayer = ".playerSpan"
const bgCount = ".bg-count"
const bgStatus = ".bg-status"

// Declare const maps
const players = new Map();
const playerCounts = new Map();
const playerThrow = new Map();
const savedThrows = new Map()

// Declare global game variables
let wuerfe = 3;
let rounds = 501;
let round = 1;
let playerActive = 1;
let cWurf = 1;

let finish = []

// Dart Algorithm
import { DartCalculateAlgorithm } from './dartalgorithm.js';
let dartAlgorithm = new DartCalculateAlgorithm(rounds, wuerfe, 1, 50);
let dartAlgorithmStats = new DartCalculateAlgorithm(rounds, wuerfe, 1, 50);

// Document loaded
$(document).ready(function () {
    // Test the algorithm
    dartAlgorithm.calculateSingleThrow(3);
    dartAlgorithm.calculateDoubleThrow(3)
    dartAlgorithm.calculateThrows(3)
    // Set Difficulty Bans to algorithm
    /*dartAlgorithm.toggleDifficulty("T")
    dartAlgorithm.toggleDifficulty("D")
    dartAlgorithm.toggleDifficulty("Bullseye")
    dartAlgorithm.toggleDifficulty("Single Bull")*/

    // Initialize Game and Players
    initGame()
    initPlayers()

    // Form submit für das Werten der 3 Würfe
    $("#gameForm").submit(function (event) {
        // Prevent form from submitting normal
        event.preventDefault();

        // Declare Player ID and The ID from the next player
        let playerID = "#player" + playerActive;
        if(finish.length==players.size) {
            alert("Das Spiel ist zu Ende!")
            return;
        }
        

        // Get all 3 scored throws
        let score1 = (playerThrow.has(1))?playerThrow.get(1): 0 ;
        let score2 = (playerThrow.has(2))?playerThrow.get(2): 0 ;
        let score3 = (playerThrow.has(3))?playerThrow.get(3): 0 ;

        // Check if scores > 0
        if (checkForNegativeValues()) { alert('Bitte kein negativen Werte eintragen!'); return; }

        // Decrease player score according to the scored throws
        let currentScore = playerCounts.get(playerActive)
        currentScore = currentScore - score1 - score2 - score3
        console.log("Score: " + currentScore)
        // Check if a player won or throwed to much!
        if (currentScore == 1 || currentScore < 0) {
            alert("Überworfen!!!")
        } else if (currentScore == 0) {
            $(playerID + " " + bgStatus).removeClass("bg-success")
            $(playerID + " " + bgStatus).addClass("bg-warning")
            
            finish.push(playerActive)
            $(playerID + " " + bgStatus).text("#" + finish.length)
            $(playerID + " " + bgCount).text(0)
            if(finish.length==players.size) {
                alert("Das Spiel wurde beendet!")
                $("#myModal").modal('show');
                finish.forEach(function(value, index) {
                    let durchschnitt = 0;
                    savedThrows.get(value).forEach(function (score) {
                        durchschnitt += score
                    })
                    let calculateDurchschnitt = (savedThrows.get(value).length == 0) ? 0 : parseInt((durchschnitt / (savedThrows.get(value).length)))
                    if(index==0) {
                        $('#modalBody').append('<h3><span class="badge bg-success">#' + (index+1) + '</span> - ' + players.get(value) + ' <span class="badge bg-primary">Ø '+calculateDurchschnitt+'</span>' + '</h3>')
                    } else if(index==1) {
                        $('#modalBody').append('<h3><span class="badge bg-warning">#' + (index+1) + '</span> - ' + players.get(value) + ' <span class="badge bg-primary">Ø '+calculateDurchschnitt+'</span>' + '</h3>')
                    } else if(index==2) {
                        $('#modalBody').append('<h3><span class="badge bg-info">#' + (index+1) + '</span> - ' + players.get(value) + ' <span class="badge bg-primary">Ø '+calculateDurchschnitt+'</span>' + '</h3>')
                    } else {
                        $('#modalBody').append('<h3><span class="badge bg-secondary">#' + (index+1) + '</span> - ' + players.get(value) + ' <span class="badge bg-primary">Ø '+calculateDurchschnitt+'</span>' + '</h3>')
                    }
                })
                return;
            }
            
        } else {
            playerCounts.set(playerActive, currentScore)
            $(playerID + " " + bgCount).text(currentScore)

        }

        // Set active Player to waiting
        if(!finish.includes(playerActive)) {
            $(playerID + " " + bgStatus).removeClass("bg-success")
            $(playerID + " " + bgStatus).addClass("bg-secondary")
            $(playerID + " " + bgStatus).text("Wartet")
        }

        // Set current throw back to 1
        cWurf = 1;

        // Clear all temp stored player throws
        let x = savedThrows.get(playerActive)
        playerThrow.forEach(function (value, key) {
            x.push(value)
        })
        playerThrow.clear()

        // Add player throws to saved throws
        savedThrows.set(playerActive, x)

        // Increase Player Count or switch to 1

        let foundPlayer = false;
        let cPlayer = 0;
        if (playerActive == players.size) { playerActive = 1;} else { playerActive++; }
        if(finish.length!=0) {
            for(let i = 1; i<=players.size;i++) {
                for(let l = 1; l<=players.size;l++) {
                    cPlayer = l
                    if(finish.includes(cPlayer)==false && playerActive==cPlayer) {
                        foundPlayer=true;
                        break
                    }
                }
                if(foundPlayer) {
                    break;
                }
                
                 if (playerActive == players.size) { playerActive = 1;} else { playerActive++; }
                
            }
        }
        
        if(foundPlayer) {
            playerActive = cPlayer; 
            round++;
        }
        let playerNextID = "#player" + playerActive
        // Set next player to active
        $(playerNextID + " " + bgStatus).addClass("bg-success")
        $(playerNextID + " " + bgStatus).removeClass("bg-warning")
        $(playerNextID + " " + bgStatus).text("Wirft")

        console.log("PlayerNext: " + playerActive)
        updateStats(1)

        // Clear the Score Input Fields
        clearInputScores(wuerfe);

    });

    //Dartboard rendern und click listener
    var dartboard = new Dartboard('#dartboard');
    dartboard.render();

    // Event for clicking on the dart board
    document.querySelector('#dartboard').addEventListener('throw', function (d) {
        // get score from api
        let score = d.detail.score;
        $('#score' + cWurf).val(score)

        // Add Throw to map
        playerThrow.set(cWurf, score)
        console.log("Wurf: " + cWurf + " - Score: " + score)
        console.log(playerThrow)
        // Remove active class from old input
        let oldWurf = cWurf;
        $('#score' + cWurf).removeClass('input-active')
        if (cWurf == wuerfe) { cWurf = 1; } else { cWurf++; }
        // Remove active class from old input
        $('#score' + cWurf).addClass('input-active')
        // Update Stats
        updateStats(oldWurf)

    });

    // Click on score field and change focus and logic to it!
    $('.score').click(function () {
        var scoreInput = $(this).children('.form-control');
        // get element of current input
        let elementId = scoreInput.attr('id')
        let id = elementId.replace("score", "")
        var input = $('#' + elementId)

        // check if import is already selected
        if (input.hasClass('input-active')) return;

        // Set input active to this input
        input.addClass('input-active')

        /* Remove active from old input
        * And for that get id of current input */
        let formerId = cWurf
        $('#score' + formerId).removeClass('input-active')
        // set cWurf to this wurf
        cWurf = parseInt(id);
        // update stats because of new wurf
        updateStats(formerId)
    })

    $("#scroll").click(function() {
        $('#reload').click()
        scrollToEnd()
    })

    $('#reload').click(function() {
        let score = $('#scoreInput').val()
        let counter = $('#countInput').val()
        let allowed = $('#allowedInput').val()
        let difficulty = $('#difficultyInput').val()
        let cThrows = $('#throwsInput').val()

        console.log(score)
        console.log(counter)
        console.log(allowed)
        console.log(difficulty)
        console.log(cThrows)

        // configure dart algorithm
        dartAlgorithmStats.setScore(score)
        dartAlgorithmStats.setThrowsleft(cThrows)

        // banned
        dartAlgorithmStats.resetDifficulty()
        if(allowed==1) {
            dartAlgorithmStats.toggleDifficulty("T")
        } else if(allowed==2) {
            dartAlgorithmStats.toggleDifficulty("D")
        } else if(allowed==3) {
            dartAlgorithmStats.toggleDifficulty("Bullseye")
            dartAlgorithmStats.toggleDifficulty("Single Bull")
        } else if(allowed==4) {
            dartAlgorithmStats.setDifficulty(["T", "D", "Single Bull", "Bullseye"])
        } 

        let list = dartAlgorithmStats.calculate()
        if(difficulty=="difficult") list.reverse()
        if(counter=="all") counter=list.length;

        $('#resultsT').text("Insgesamte Ergebnisse: " + list.length)
        $('#tableBody').empty()
        // Add all {counter}x Throws to table
        for(let i = 1; i<= counter; i++) {
            if(i <= list.length) {
                var x = $('#tableBody').append($('<tr></tr>'))
                x.append('<th scope="row">' + i + '</th>')
                
                if(cThrows>=2) {
                    list[i-1].forEach(function(value){
                        x.append(addTableItem(value, false))
                    })
                } else {
                    x.append(addTableItem(list[i-1], false))
                }
                    
            }
        }


    })
});

function addTableItem(item, badge) {
    let str = ""
    if(!badge) {
        if(item.length<=3) {
            if(item.startsWith("S")) {
                str = '<td> <span class="badge bg-success">' + item + '</span> </td>'
            } else if(item.startsWith("D")) {
                str = '<td> <span class="badge bg-warning">' + item + '</span> </td>'
            } else if(item.startsWith("T")) {
                str = '<td> <span class="badge bg-danger">' + item + '</span> </td>'
            }
        } else {
            str = '<td> <span class="badge bg-danger">' + item + '</span> </td>'
        }
        
    } else {
        str = "<td>" + item + "</td>"
    }
    return str;
    
}

/**
 * Updates all fields on the statistic card!
 */
function updateStats(oldWurf) {


    // Set easy data to statistic card
    $('#statistics').text('Statistiken R-' + round)
    let playername = players.get(playerActive)
    $('#player').text("Werfer: " + playername)
    $('#wurf').text("Wurf: " + cWurf)
    $('#score').text("Score: " + playerCounts.get(playerActive))

    // Calculate Fix Score via {playerThrow} temp map
    let amount = playerCounts.get(playerActive)
    let fixdurchschnitt = 0;
    let ueberworfen = false
    playerThrow.forEach(function (value, key) {
        amount -= value
        if(amount<0){
             amount += value;
             alert("Überworfen!")
             ueberworfen = true;
        }
        fixdurchschnitt += value
    })
    $('#fixscore').text(amount)
    $('#scoreInput').val(amount)

    // Check if wurf us 3 and autosubmit is activatet
    if((oldWurf==wuerfe) || ueberworfen || amount==0) {
        if($('#auto-complete').prop('checked')) {
            $('#gameForm').submit()
            return;
        }
        
    }

    // Calculate Fix Durchschnitt
    let calculateFix = (playerThrow.size == 0) ? 0 : parseInt((fixdurchschnitt / playerThrow.size))
    $('#fixDurchschnitt').text("Fixdurchschnitt: " + calculateFix)

    // Calculate Durchschnitt via saved throws
    let durchschnitt = 0;
    savedThrows.get(playerActive).forEach(function (value) {
        durchschnitt += value
    })
    let calculateDurchschnitt = (savedThrows.get(playerActive).length == 0) ? 0 : parseInt((durchschnitt / (savedThrows.get(playerActive).length)))
    $('#durchschnitt').text("Durchschnitt: " + calculateDurchschnitt)

    // Set tips
    
    // declare algorithm previews
    var oneThrowPossible = $('#1throwPossible')
    var oneThrowImpossible = $('#1throwImpossible')

    var doubleThrowPossible = $('#2throwsPossible')
    var doubleThrowImpossible = $('#2throwsImpossible')

    var tripleThrowPossible = $('#3throwsPossible')
    var tripleThrowImpossible = $('#3throwsImpossible')

    // configure dart algorithm
    dartAlgorithm.setScore(amount)
    dartAlgorithm.setThrowsleft((wuerfe+1)-cWurf)

    // Preview Lists
    let singleList = dartAlgorithm.calculateSingleThrow()
    let doubleList = dartAlgorithm.calculateDoubleThrow()
    let tripleList = dartAlgorithm.calculateThrows()

    let finishPossible = false;

    // Set Possibilite counter
    $('#pSingle').text(singleList.length)
    $('#pDouble').text(doubleList.length)
    $('#pTriple').text(tripleList.length)

    // 1 Throw Preview
    if(singleList.length != 0) {
        finishPossible = true;
        $(oneThrowPossible).show()
        $(oneThrowImpossible).hide()
        $("#" + oneThrowPossible.attr("id") + " .bg-success").text(singleList[0])
    } else {$(oneThrowPossible).hide();$(oneThrowImpossible).show()}

    // 2 Throws Preview
    if(doubleList.length != 0) {
        finishPossible = true;
        $(doubleThrowPossible).show()
        $(doubleThrowImpossible).hide()
        $("#" + doubleThrowPossible.attr("id") + " .bg-info").text(doubleList[0][0])
        $("#" + doubleThrowPossible.attr("id") + " .bg-success").text(doubleList[0][1])
    } else {
        $(doubleThrowPossible).hide();
        $(doubleThrowImpossible).show()
    }

    // 3 Throws Preview
    if(tripleList.length != 0) {
        finishPossible = true;
        $(tripleThrowPossible).show()
        $(tripleThrowImpossible).hide()
        $("#" + tripleThrowPossible.attr("id") + " .bg-primary").text(tripleList[0][0])
        $("#" + tripleThrowPossible.attr("id") + " .bg-info").text(tripleList[0][1])
        $("#" + tripleThrowPossible.attr("id") + " .bg-success").text(tripleList[0][2])
    } else {
        $(tripleThrowPossible).hide();
        $(tripleThrowImpossible).show()
    }

    // Set Possible
    if(finishPossible) {
        $('#possible').text("Ja!").removeClass("bg-danger").addClass("bg-success")
    } else {
        $('#possible').text("Nein!").removeClass("bg-success").addClass("bg-danger")
    }
    
    
}

/**
 * Clear all input fields completely + Sets 0 to all scores in map
 * 
 * @param {number} scoreAmount The amount of scores existing
 */
function clearInputScores(scoreAmount) {
    for (let i = 1; i <= scoreAmount; i++) {
        $('#score' + i).val("0")
        playerThrow.set(i, 0)
    }
}

/**
 * Initialize the game and read needed game data
 */
function initGame() {
    // get rounds from url params
    if (urlParams.has("rounds")) {
        rounds = parseInt(urlParams.get('rounds'))
    }
    // get wuerfe from url params
    if (urlParams.has("wuerfe")) {
        wuerfe = urlParams.get('wuerfe')
    }
}

/**
 * Get all players from url params and
 * initialize all maps/lists with them
 */
function initPlayers() {
    let playerCount = 1;

    // loops through all url params from player1 to player<x>
    for (let i = 1; i <= urlParams.get('players'); i++) {
        let pStr = "player" + playerCount
        if (urlParams.has(pStr)) {
            let playerName = urlParams.get(pStr)
            players.set(i, playerName)
            savedThrows.set(i, [])
        }
        playerCount++;

    }

    // Set Title of Player Card
    // > Dart Hub (amount of players)
    $('#dartHub').empty()
    $('#dartHub').append('<h2 class="card-title mb-4">Dart Hub (' + players.size + ')</h2>')

    // Loop through players and create player in following format
    // > [amount] [name] [status]
    players.forEach(function (player, index) {
        playerCounts.set(index, rounds)
        let status = (index == 1) ? '<span class="badge bg-status bg-success bg-w">Wirft!</span>' : '<span class="badge bg-status bg-secondary bg-w">Wartet</span>'
        $('#dartHub').append($('<h4 class="card-text mt-3" id="player' + index + '"></h4>')
            .append($('<span class="badge bg-danger bg-count me-3">' + rounds + '</span>'))
            .append($('<span class="playerSpan me-3">' + player + '</span>'))
            .append($(status))
        )
    })

    updateStats(1)

}

// scroll to the end of the html page
function scrollToEnd() {
    $('html, body').scrollTop($(document).height());
}

/**
 * Check if there are negative values in {playerThrow}
 */
function checkForNegativeValues() {
    // Loop throug playerThrow and return true if a value < 0
    playerThrow.forEach(function (value) {
        if (value < 0) {
            return true;
        }
    })
    return false;
}




