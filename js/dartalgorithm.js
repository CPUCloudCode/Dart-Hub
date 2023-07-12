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
        this.possibleMap = this.generatePossibleDartThrowsList()
        this.banned = [];
        // Multiplier needed by the algorithm to calculate the easiest possibilities
        this.multipler = {
            "S": 3,
            "D": 2,
            "T": 1,
            "Single Bull": 1,
            "Bullseye": 0,
        }
    }

    /**
     * 
     * @returns throw list regarding the throws
     */
    calculate() {
        if(this.throwsleft==1) {
            return this.calculateSingleThrow()
        } else if(this.throwsleft==2) {
            return this.calculateDoubleThrow()
        } else {
            return this.calculateThrows()
        }
    }

    /**
     * Calculate best possibilities for a single throw by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
    calculateSingleThrow() {               
        this.next = this.getFieldsByScore(this.score)[0];
        return this.getEasiestThrow(this.getFieldsByScore(this.score));
    }

    /**
     * Calculate best possibilities for two throws by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
     calculateDoubleThrow() {
        if(this.throwsleft<2) return [];
        // 1 - 50
        console.log("::::::::::::Double Algorithm::::::::::::")
        let x = []        
        let map = this.possibleMap
        const that = this;
        map.forEach(function(score, name) {
            map.forEach(function(value, key) {
                if(!that.isDifficultyBanned([name, key])) {
                    if((score + value)==that.score) {
                        x.push([name, key])
                    }
                }
            })
        })
        return this.getEasiestThrows(x);
        // Example 3D Array
    }
    

    /**
     * Calculate best possibilities for <x> throws by a player
     * 
     * @param {number} results Amount of results the method should serve
     */
     calculateThrows() {
        if(this.throwsleft<3) return [];
        console.log("::::::::::::Triple Algorithm::::::::::::")
        let x = []
        let map = this.possibleMap
        const that = this;
        map.forEach(function(score, name) {
            map.forEach(function(score2, name2) {
                map.forEach(function(value, key) {
                    if(!that.isDifficultyBanned([name, name2, key])) {
                        if((score + score2 + value)==that.score) {
                            x.push([name, name2, key])
                        }
                    }
                })
            })
        })
         return this.getEasiestThrows(x);
    }


    /**
     * Get All Fields linked by the same score
     * 
     * @returns all the Fields who have the same score
     */
    getFieldsByScore(score) {
        let x = []
        let that = this;
        this.possibleMap.forEach(function(value, key) {
            if(!that.isDifficultyBanned([key])) {
                if(value==score) x.push(key)
            }
        })
        return x;
    }

    /**
     * Get the score linked to a specific field
     * 
     * @returns the score a specific field has
     */
     getScoreByField(field) {
        if(this.possibleMap.has(field)) {
            return this.possibleMap.get(field);
        }
        return 0;
    }

    /**
     * Format > {<name>: <value>}
     * Example > {D10: 20}
     * 
     * @returns a map with all possible dart throws
     */
    generatePossibleDartThrowsList() {
        let x = new Map();
        for(let i = 1; i<=this.numbers; i++) {
            x.set((this.single + i), i)
            x.set((this.double + i), (i*2))
            x.set((this.triple + i), (i*3))
        }
        // specials
        x.set(this.bullseye, 50)
        x.set(this.singleBull, 25)
        console.log(x)

        return x;
    }

    /**
     * Get a list with all possible dart scores
     * 
     * @returns all possible dart scores as values
     */
    getPossibleDartScores() {
        let x = []
        this.possibleMap.forEach(function(value) {
            if(!x.includes(value)) x.push(value)
        })
        return x;
    }

    /**
     * Order possible throw list SINGLE from EASY to HARD
     * 
     * @param {*} items 
     * @returns 
     */
    getEasiestThrow(items) {
        let easy = []
        let mid = []
        let difficult = []
        let that = this;
        items.forEach(function(value) {
            if(value.length<=3) {
                if(value.startsWith(that.single)) {
                    easy.push(value)
                } else if(value.startsWith(that.double)) {
                    mid.push(value)
                } else {
                    difficult.push(value)
                }
            } else {
                difficult.push(value)
            }
        })
        const array = easy.concat(mid.concat(difficult))
        return array;
    }

    /**
     * Order possible throw list from EASY to HARD
     * 
     * @param {*} items 
     * @returns 
     */
    getEasiestThrows(items) {
        
        let multiplier = this.multipler;
        let sortedMid = this.sort(items, multiplier)
        return sortedMid;
   
    }

    /**
     * Sort the array {mid} from EASY to HARD by {multiplier}
     * 
     * @param {*} mid 
     * @param {*} multiplier 
     * @returns 
     */
    sort(mid, multiplier) {
        let midSorted = []
        let len = mid.length
        for(let i = 0; i<len;i++) {
            let currentList = []
            let currentScore = 0;
            let currentIndex = 0;
            mid.forEach(function(value, index) {
                let score = 0;
                value.forEach(function(item) {
                    if(item.length<=3) {
                        score+=multiplier[item.charAt(0)]
                    } else {
                        score+=multiplier[item]
                    }
                   
                })
                if(currentList.length==0) {
                    currentList=value;
                    currentIndex=index;
                    currentScore=score;
                } else {
                    if(score>currentScore) {
                        currentList=value;
                        currentIndex=index;
                        currentScore=score;
                    }
                }
            })
            midSorted.push(currentList)
            mid.splice(currentIndex, 1)
        }
        return midSorted
    }

    /**
     * ALGORITHM for x-throws ! NEEDS TO MUCH CPU !
     * 
     * @param {*} map 
     * @param {*} wuerfe 
     * @param {*} results
     */
     gnr(map, wuerfe, results) {
        const that = this;
        let overall = []
        map.forEach(function(score, name) {
            // number 1, ...
            
                // make map with doubles!
                let firstDoubles = new Map()
                let count = 0;
                map.forEach(function(scorex, namex) {
                    let d = []
                    d.push(score)
                    d.push(scorex)
                    firstDoubles.set(count, d)
                    d = []
                    count++;  
                })
                
                // use double map to go on!
                let then = []

                for(let i = 1; i<(wuerfe-1); i++) {
                    if(i == 1) {
                        then = that.addOneItem(firstDoubles, map)
                    } else {
                        then = that.addOneItem(then, map)
                    }
                    
                }
                let stop = 1;
                then.forEach(function(value) {
                    if(stop<=results) {
                        let score = that.score;
                        value.forEach(function(value) {
                            score -= value;
                        })
                        if(score==0) {
                            if(!that.alreadyInList(overall, value)) {
                                overall.push(value)
                            }
                        
                        }
                    }
                    stop++;
                    
                })
            
         })
    }

    /**
     * Checks if there is a specific array inside a array
     * > CHECK IF
     * 
     * @param {*} list 
     * @param {*} varray 
     * @returns 
     */
    alreadyInList(list, varray) {
        let that = this;
        let already = false;
        // 
        list.every(value => {
            if(that.arraysEqual(varray, value)) {
                already = true;
                return false; // break array
            } else {
                return true;
            }
          });
        return already;
    }

    /**
     * Method that checks if an array equals another array
     * 
     * @param {*} a1 Array 1
     * @param {*} a2 Array 2
     * @returns 
     */
    arraysEqual(a1,a2) {
        /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1)==JSON.stringify(a2);
    }

    /**
     * Method that adds every number from map to every list in lou
     * 
     * @param {*} lou 
     * @param {*} map 
     * @returns 
     */
    addOneItem(lou, map) {
        let after = []
        // go through first doubles
        lou.forEach(function(value, index) {
            //for(let i = 1; i<3; i++) {
                map.forEach(function(score, name) {
                    let x = []
                    value.forEach(function(l) {
                        x.push(l)
                    })
                    x.push(score)
                    after.push(x)
                })
            //}
        }) 
        return after;
    }

    /**
     * Calculates off integer in a list together and returns the sum
     * 
     * @param {*} x 
     * @returns the sum of the values in list x
     */
    calculateListValues(x) {
        let score = 0;
        x.forEach(function(value) {
            score+=value;
        }) 
        return score;
    }

    /**
     * Check items if their difficulty is banned!
     * @param {*} items 
     * @returns 
     */
    isDifficultyBanned(items) {
        let banned = false;
        let blackList = this.banned;
        items.forEach(function(item) {
            if(item.length<=3) {
                if(blackList.includes(item.charAt(0))) {
                    banned = true;
                }
            } else {
                if(blackList.includes(item)) {
                    banned = true;
                }
            }
        })
        
        return banned;
    }

    /**
     * Toggle difficulties
     * @param {*} difficulty 
     */
    toggleDifficulty(difficulty) {
        if(this.banned.includes(difficulty)) {
            this.banned.splice(this.banned.indexOf(difficulty), 1)
        } else {
            this.banned.push(difficulty)
        }
    }

    resetDifficulty() {
        console.log("CLEAR: " + this.banned)
        this.banned = []
        console.log("CLEARED: " + this.banned)
    }

    /**
     * Sets difficulties
     * @param {*} difficulty 
     */
     setDifficulty(difficultyList) {
       this.banned=difficultyList
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