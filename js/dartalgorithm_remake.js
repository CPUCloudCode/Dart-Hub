export class DartCalculateAlgorithm {
    /**
     * 
     * @param {number} score Current score of a player
     * @param {number} throwsleft Amount of Throws left of a player
     * @param {number} min Minimum score a throw can have
     * @param {number} max Maximum score a throw can have
     */
    constructor(score, throwsleft, min, max) {
        this.score = score;
        this.throwsleft = throwsleft;
        this.min = min;
        this.max = max;
        this.minTogether = min*throwsleft;
        this.maxTogether = max*throwsleft;
        // Own Class Variables
        this.single = "S";
        this.double = "D";
        this.triple = "T";
        this.bullseye = "Bullseye"
        this.singleBull = "Single Bull"
        this.numbers = 20;
        this.possibleMap = this.generatePossibleDartThrowsMap()
    }

    /**
     * Calculate best possibilities for a single throw by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
    calculateSingleThrow(results) {
        console.log(this.possibleMap)
        console.log(":::::::::::::::SingeThrow:::::::::::::::")
        let score = this.score // 50
        this.possibleMap // Allen Single Throws
        
        this.possibleMap.forEach(function(value, key) {
            if(value==score) {
                console.log("Gewonnen! - " + key)
            }
        })

    }

    /**
     * Calculate best possibilities for two throws by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
     calculateDoubleThrow(results) {
        console.log(":::::::::::::::DoubleThrow:::::::::::::::")
        /**
         * Score: 50
         * [] + [] = 50
         */
        let numbers = this.possibleMap
        numbers.forEach(function(number, key){
            // 1,2,...,x = number
            numbers.forEach(function(number2, key2) {
                // 1, 2, 3
                if(number+number2==20) {
                    if(key.startsWith("S") && key2.startsWith("S")) {
                        console.log("Gewonnen! - " + key + " + " + key2)
                    }
                }
            })
        })
        
    }
    

    /**
     * Calculate best possibilities for <x> throws by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
     calculateThrows(results) {
        console.log(":::::::::::::::TripleThrow:::::::::::::::")

        let numbers = this.possibleMap

        /**
         * 1 + 1 + 1
         * 1 + 1 + 2
         * 1 + 1 + 3
         * ....
         * 1 + 2 + 1
         * 1 + 2 + 2
         * ...
         * 2 + 1 + 1
         * 2 + 1 + 2
         */

        /*numbers.forEach(function(number, key){
            // 1 = number
            numbers.forEach(function(number2, key2) {
                // 1 = number
                numbers.forEach(function(number3, key3) {
                    // 1, 2, 3
                    if(number+number2+number3==50) {
                        console.log("Gewonnen! - " + key + " + " + key2 + " + " + key3)
                    }
                })
            })
        })*/

    }

    

    /**
     * Get the best next throw needed to finish faster
     * 
     * @returns the best next score needed 
     */
    getNextThrow() {
        return this.next;
    }

    /**
     * 
     * @returns the fields needed to achieve specific score
     */
    getFieldsByScore(score) {
        let x = []
        this.possibleMap.forEach(function(value, key) {
            if(value==score) x.push(key)
        })
        return x;
    }

    /**
     * Format > {<name>: <value>}
     * Example > {D10: 20}
     * 
     * @returns a map with all possible dart throws
     */
    generatePossibleDartThrowsMap() {
        let x = new Map();
        for(let i = 1; i<=this.numbers; i++) {
            x.set((this.single + i), i)
            x.set((this.double + i), (i*2))
            x.set((this.triple + i), (i*3))
        }
        // specials
        x.set(this.bullseye, 50)
        x.set(this.singleBull, 25)

        return x;
    }
    /**
     * 
     * @returns all possible dart scores as values
     */
    getPossibleDartScores() {
        let x = []
        this.possibleMap.forEach(function(value) {
            x.push(value)
        })
        return x;
    }

















    // All getters and setters for class variables
    setScore(score) {
        this.score = score
    }
    getScore() {
        return this.score;
    }
    setThrowsleft(throwsleft) {
        this.throwsleft = throwsleft
    }
    getThrowsleft() {
        return this.throwsleft;
    }

  }