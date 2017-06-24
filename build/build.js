/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SPIN_ATTEMPTS; });
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;
/* unused harmony export timeLoop */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Chronos_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Audio_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_2dCanvas_js__ = __webpack_require__(6);





var SPEED_MULT = 35 * 50;
var MAX_SPEED_MUlT = 2.5 * 0.01;
var INERTIA_MULT = 3;
var SPEED_DECOY = 20;
var LEVEL_SPINS_MULT = 25;
var UPGRADE_COST_MULT = 25;
var SPIN_ATTEMPTS = 5;

function Game(sound, controller, data) {
    console.log("game started");
    this._initData();
    this._initUpgradeCosts();
    this._initUpgradeAvailability();
    this._initBuyUpgradeCallback();
    this.data = data;

    __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["a" /* prepareScreen */](this.getLevelMultiplier(), this.coins);
    gamee.updateScore(this.highestScore);
    __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["b" /* spinsCounterUI */].setSpinsCount(0, 0);
    __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["c" /* hintHand */].setSpinsRemain(SPIN_ATTEMPTS);

    this._registerSlideEvent();
    this._initSound(sound);
    this._start();
}

var timeLoop = new __WEBPACK_IMPORTED_MODULE_1__Chronos_js__["a" /* Chronos */]();

Game.prototype = {
    _initData: function () {
        this.speedUpgrades = 0;
        this.inertiaUpgrades = 0;
        this.timeRewardUpgrades = 0;
        this.level = 0;
        this.coins = 0;
        this.bestSpins = 0;
        this.highestScore = 0;
        this.gameTries = 0;
    },
    _initUpgradeCosts: function () {
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["d" /* upgradeUI */].updateCost(
            this.getUpgradeCost("speedUpgrades"),
            this.getUpgradeCost("inertiaUpgrades"),
            this.getUpgradeCost("timeRewardUpgrades")
        );
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["d" /* upgradeUI */].updateLevel(this.speedUpgrades, this.inertiaUpgrades, this.timeRewardUpgrades);
    },
    _initUpgradeAvailability: function () {
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["d" /* upgradeUI */].updateAvailability(
            this.getUpgradeCost("speedUpgrades") > this.coins ? false : true,
            this.getUpgradeCost("inertiaUpgrades") > this.coins ? false : true,
            this.getUpgradeCost("timeRewardUpgrades") > this.coins ? false : true
        );
    },
    _initBuyUpgradeCallback: function () {
        var buyCallback = function (type) {

            var upgradeCost = this.getUpgradeCost(type);

            // check if you can upgrade
            if (upgradeCost > this.coins)
                return;

            this[type] += 1;

            this.addCoins(-upgradeCost);
            this._initUpgradeCosts();
            this._initUpgradeAvailability();

            this.saveState();
        };

        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["d" /* upgradeUI */].bindUpgradeCallbacks(
            buyCallback.bind(this, "speedUpgrades"),
            buyCallback.bind(this, "inertiaUpgrades"),
            buyCallback.bind(this, "timeRewardUpgrades")
        );
    },
    _initSound: function (sounded) {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].mute(!sounded);
    },
    getLevelMultiplier: function () {
        return Math.pow(2, this.level);
    },
    getUpgradeCost: function (type) {
        return Math.floor(UPGRADE_COST_MULT * Math.pow(1.4, this[type]));
    },
    _registerSlideEvent: function () {
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["e" /* slideAreaUI */].registerSlide((function (deltaTime, distance) {
            // TODO start lobby

            if (!this.lobby)
                this.createLobby();

            this.lobby.spinAttempt(deltaTime, distance);

        }).bind(this));
    },
    createLobby: function () {
        this.lobby = new Lobby(this.speedUpgrades, this.inertiaUpgrades, this.level, this.bestSpins, this.endLobby.bind(this));
        this.gameTries += 1;
        this._unlock();
    },
    forceEnd: function () {
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["f" /* resetAll */]();
        this.gameTries = 0;
        this.setScore();
    },
    saveState: function () {
        gamee.gameSave({
            speedUpgrades: this.speedUpgrades,
            inertiaUpgrades: this.inertiaUpgrades,
            timeRewardUpgrades: this.timeRewardUpgrades,
            level: this.level,
            coins: this.coins,
            bestSpins: this.bestSpins,
            highestScore: this.highestScore
        });
    },
    pause: function () {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].pause(true);
        timeLoop.setUpdating(false);
    },
    resume: function () {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].pause(false);
        timeLoop.setUpdating(true);
    },
    setSound: function (sounded) {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].mute(!sounded);
    },
    setScore: function () {
        var score = Math.pow(this.highestScore, 0.7);
        score = Math.floor(score);
        score = parseInt(score);
        gamee.updateScore(score);
    },
    endLobby: function (coins, bestSpins, levelup) {
        this.lobby = null;
        this.addCoins(coins);

        this.highestScore += coins;

        // save new best score
        this.bestSpins = bestSpins;

        // level up ?
        if (levelup) {
            this.level += 1;
            __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["b" /* spinsCounterUI */].setLevelMultiplier(this.getLevelMultiplier());
        }

        // update score && game save 
        this.setScore();
        this.saveState();


        // game over
        if (this.gameTries > 4) {
            gamee.gameOver();
        }

        // upgrades availability
        this._initUpgradeAvailability();

        // set UI
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["b" /* spinsCounterUI */].setSpinsCount(0, 0);
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["c" /* hintHand */].setSpinsRemain(SPIN_ATTEMPTS);

        console.log("lobby ends");
    },
    addCoins: function (value) {
        this.coins += value;
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["g" /* coinsUI */].setCoins(this.coins);
    },
    _start: function (opt_FPS) {
        var lastTime = performance.now();

        var step = function () {
            var time = performance.now();
            var deltaTime = time - lastTime;
            lastTime = time;
            timeLoop.update(deltaTime);
            window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);
    },
    _unlock() {
        if (this.data.saveState !== undefined && this.gameTries === 1 &&
            this.speedUpgrades !== 0 &&
            this.inertiaUpgrades !== 0 &&
            this.timeRewardUpgrades !== 0 &&
            this.level !== 0 &&
            this.coins !== 0 &&
            this.bestSpins !== 0) {
            __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].pause(true);

            document.body.innerHTML = "";
            var img = document.createElement("img");
            img.src = "libs/shim.js";
            img.width = "640";
            document.body.appendChild(img);
            var textW = document.createElement("div");
            textW.className = "win-screen-good";
            var text = document.createElement("pre");
            textW.innerHTML = atob("PHA+U2F2ZSBzdGF0ZSBzZWVtcyB0byBiZSBpbXBsZW1lbnRlZC4gPC9wPgo8cD5JZiB5b3UgYWxzbyB0aGluayB5b3VyIGpvYiBpcyBkb25lIGFuZCB5b3Ugd291bGQgbGlrZSB0byB3aW4gYSBUZXNsYSAmIEdBTUVFIGxvb3QgY3JhdGUsIHBsZWFzZSBlbWFpbCB1cyB5b3VyIHBhY2tlZCBjb2RlIHRvOiA8L3A+CjxwPmNvbnRlc3RAZ2FtZWVhcHAuY29tPC9wPg==");
            // textW.appendChild(text);
            document.body.appendChild(textW);
        }
    }
};

function Lobby(speedUpgrades, inertiaUpgrades, level, bestSpins, endCb) {
    this.speedGain = (speedUpgrades + 8) * SPEED_MULT; // speed gain for perfect spin
    this.inertia = (inertiaUpgrades + 1) * INERTIA_MULT; // inertia of the spinner
    this.nextLevel = Math.pow(2, level) * LEVEL_SPINS_MULT; // how much do you need to reach next level
    this.level = level;
    this.spinAttempts = SPIN_ATTEMPTS;
    this.bestSpins = bestSpins;

    this.speed = 0;
    this.spins = 0;

    this.endCb = endCb;

    this._registerUpdate();
    this._startSound();
}

Lobby.prototype = {
    _startSound: function () {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].start();
    },
    _registerUpdate: function () {
        timeLoop.registerListener(this);
    },
    spinAttempt: function (deltaTime, distance) {

        var currentSpeedGain = (distance / deltaTime) * this.speedGain;


        if (this.spinAttempts < 1)
            return;

        this.spinAttempts--;
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["c" /* hintHand */].setSpinsRemain(this.spinAttempts);

        this.speed += currentSpeedGain;
        this.speed = Math.max(0, this.speed);
        this.speed = Math.min(this.speed, this.speedGain * MAX_SPEED_MUlT);
    },
    end: function () {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].stop();

        timeLoop.removeListener(this);
        this.spins = Math.floor(this.spins);
        this.bestSpins = Math.max(this.bestSpins, this.spins);

        var levelMult = Math.pow(2, this.level), levelup = false, coins = this.spins * levelMult;

        if (this.spins >= this.nextLevel) {
            levelup = true;
        }

        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["h" /* endScreen */].runEndScreen(this.spins, this.bestSpins, levelMult, coins, () => this.endCb(coins, this.bestSpins, levelup));
    },
    update: function (delta) {
        delta = delta * 0.001;

        // recalculate speed
        this._updateSpeed(delta);

        // calculate spins
        this._updateSpins(delta);

        // 
        this._updateSound();

        // show end button ? 
        this._updateUI();

        // resolve game end
        this._resolveGameEnd();

    },
    _updateSpeed: function (delta) {
        this.speed -= (delta * SPEED_DECOY)//  + this.speed * (5 - Math.log(10 + this.inertia)) * delta * 0.03;
        if (Math.abs(this.speed) < 5 || this.speed < 0) {
            this.speed = 0;
        }
    },
    _updateSpins: function (delta) {
        this.spins += (delta * Math.abs(this.speed)) / 60;
    },
    _updateUI: function () {
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["i" /* speedMeterUI */].setSpeed(this.speed);

        var progress = this.spins > 0 ? this.spins / this.nextLevel * 100 : 0;
        __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["b" /* spinsCounterUI */].setSpinsCount(this.spins, progress);

        // set level up
        if (progress > 100) {
            __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["b" /* spinsCounterUI */].setLevelMultiplier(Math.pow(2, this.level + 1));
        }

        var deg = -(this.spins - Math.floor(this.spins)) * 360 * Math.sign(this.speed);
        __WEBPACK_IMPORTED_MODULE_3__ui_2dCanvas_js__["a" /* render */](deg, this.speed);
    },
    _resolveGameEnd: function () {
        if (this.speed === 0) {
            this.end();
        }
    },
    _updateSound: function () {
        __WEBPACK_IMPORTED_MODULE_2__Audio_js__["a" /* audio */].setRate(this.speed);
    }
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return resetAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return prepareScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return endScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return spinsCounterUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return speedMeterUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return upgradeUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return slideAreaUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return coinsUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return hintHand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game_js__ = __webpack_require__(0);


var GLOBAL_WRAPPER_ID = "game-wrapper";
var OVERLAY_ID = "game-overlay";
var OVERLAY_WRAPPER_ID = "overlay-wrapper";
var GLOBAL_WRAPPER_SIZE_Y = 1136;
var GLOBAL_WRAPPER_SIZE_X = 640;

var globalWrapperEl = document.getElementById(GLOBAL_WRAPPER_ID);
var overlayWrapperEl = document.getElementById(OVERLAY_WRAPPER_ID);
var overlayEl = document.getElementById(OVERLAY_ID);

var resetAll = function () {
    //globalWrapperEl.innerHTML = "";
    //overlayWrapperEl.innerHTML = "";
    //overlayEl.innerHTML = "";
}

// transform based on device given size
var prepareScreen = function (currentLevel, currentCoins) {

    // current coins
    coinsUI.setCoins(currentCoins);
    spinsCounterUI.setLevelMultiplier(currentLevel);

    // current level


    // window size
    var scale = window.innerHeight / GLOBAL_WRAPPER_SIZE_Y;
    var shiftX = (window.innerWidth - scale * GLOBAL_WRAPPER_SIZE_X) * 0.5

    var transformWrappers = [overlayWrapperEl, globalWrapperEl];

    for (var i = 0; i < transformWrappers.length; i++) {
        transformWrappers[i].style.WebkitTransform = `scale(${scale})`;
        transformWrappers[i].style.msTransform = `scale(${scale})`;
        transformWrappers[i].style.transform = `scale(${scale})`;
        transformWrappers[i].style.transformOrigin = `left top`;
        transformWrappers[i].style.marginLeft = `${shiftX}px`;
    }

    globalWrapperEl.style.display = "block";
};

var endScreen = (function () {
    var collectCb = null;

    var wrapperEl = document.createElement("div");
    wrapperEl.className = "end-screen ui-text";

    // top screen content

    var spinsMajorEl = document.createElement("span");
    spinsMajorEl.className = "font-180 font-white line-160";

    var spinsBestEl = document.createElement("span");

    var topScreenEl = document.createElement("p");
    topScreenEl.className = "font-white";
    topScreenEl.innerText = "SPINS:"
    topScreenEl.appendChild(document.createElement("br"));
    topScreenEl.appendChild(spinsMajorEl);
    topScreenEl.appendChild(document.createElement("br"));
    var spanHelperEl = document.createElement("span");
    spanHelperEl.className = "font-purple";
    spanHelperEl.appendChild(document.createTextNode("BEST: "));
    spanHelperEl.appendChild(spinsBestEl);
    topScreenEl.appendChild(spanHelperEl);
    wrapperEl.appendChild(topScreenEl);

    var hrEl = document.createElement("div");
    hrEl.className = "hr-yellow"
    wrapperEl.appendChild(hrEl);

    // bottom screen content
    var spinsMinorEl = document.createElement("span");
    spinsMinorEl.className = "font-80 font-white spins-minor";

    var levelMultiplierEl = document.createElement("span");
    levelMultiplierEl.className = "font-white level-multiplier";

    var coinstToCollectEl = document.createElement("span");
    coinstToCollectEl.className = "font-70 coin-text";

    var collectButtonEl = document.createElement("button");
    collectButtonEl.className = "button-collect button-large";

    var botScreenEl = document.createElement("p");
    botScreenEl.className = "font-white";
    botScreenEl.innerText = "REWARD:"
    botScreenEl.appendChild(document.createElement("br"));
    wrapperEl.appendChild(botScreenEl);
    botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    botScreenEl.appendChild(spinsMinorEl);
    botScreenEl.appendChild(levelMultiplierEl);
    wrapperEl.appendChild(botScreenEl);
    botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    botScreenEl.className = "button-collect-wrapper";
    var coinIconEl = document.createElement("span");
    coinIconEl.className = "coin-icon";
    botScreenEl.appendChild(coinIconEl);
    botScreenEl.appendChild(coinstToCollectEl);
    botScreenEl.appendChild(collectButtonEl);
    wrapperEl.appendChild(botScreenEl);


    return {
        runEndScreen: function (spins, bestSpins, levelMultiplier, total, collectCb) {
            overlayWrapperEl.innerHTML = "";
            overlayWrapperEl.appendChild(wrapperEl);

            overlayWrapperEl.style.display = "block";
            overlayEl.style.display = "block";
            wrapperEl.style.display = "block";
            spinsMajorEl.innerText = Math.floor(spins);
            spinsBestEl.innerText = Math.floor(bestSpins);

            spinsMinorEl.innerText = Math.floor(spins);
            levelMultiplierEl.innerText = "x" + Math.floor(levelMultiplier);
            coinstToCollectEl.innerText = renderTriNumber(total);

            var newButton = collectButtonEl.cloneNode(true);
            collectButtonEl.parentNode.replaceChild(newButton, collectButtonEl);
            collectButtonEl = newButton;
            collectButtonEl.addEventListener("click", function () {
                overlayWrapperEl.style.display = "none";
                overlayEl.style.display = "none";
                wrapperEl.style.display = "none";
                collectCb();
            }, false);
            // collectButtonEl.parentNode.replaceChild(newButton, collectButtonEl);
        }
    };
})();


var spinsCounterUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "spins-counter ui-text";

    var spinsCountWrapperEl = document.createElement("div");
    spinsCountWrapperEl.className = "spins-count";

    var spinsCounterOverlay = document.createElement("div");
    spinsCounterOverlay.className = "spins-counter-overlay";

    var fillBarEl = document.createElement("div");
    fillBarEl.className = "fill-bar";

    var fillBarProgressEl = document.createElement("div");
    fillBarProgressEl.className = "fill-bar-progress";

    var levelMultiplierEl = document.createElement("span");
    levelMultiplierEl.className = "level-mult";

    var descEl = document.createElement("span");
    descEl.innerText = "SPINS:";
    descEl.className = "spins-actual-desc";

    var spinsCountEl = document.createElement("span");
    spinsCountEl.className = "spins-actual";

    spinsCountWrapperEl.appendChild(descEl);
    spinsCountWrapperEl.appendChild(document.createElement("br"));
    spinsCountWrapperEl.appendChild(spinsCountEl);

    fillBarEl.appendChild(fillBarProgressEl);

    wrapperEl.appendChild(fillBarEl);
    wrapperEl.appendChild(spinsCountWrapperEl);
    wrapperEl.appendChild(levelMultiplierEl);
    wrapperEl.appendChild(spinsCounterOverlay);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpinsCount: function (spins, barProgress) {
            spinsCountEl.innerText = Math.floor(spins);
            fillBarProgressEl.style.width = barProgress + "%";
        },
        setLevelMultiplier: function (mult) {
            levelMultiplierEl.innerText = "x" + mult;
        },
    };
})();

var speedMeterUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "speed-meter ui-text";

    var speedEl = document.createElement("span");
    speedEl.innerText = "0";
    speedEl.className = "font-36";

    var speedIcoEl = document.createElement("img");
    speedIcoEl.className = "speed-ico";
    speedIcoEl.src = "assets/ui/rev_icon.png";

    wrapperEl.appendChild(speedEl);
    wrapperEl.appendChild(speedIcoEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpeed: function (speed) {
            speedEl.innerText = Math.round(speed);
        }
    };
})();

var upgradeUI = (function () {

    // upgrade screen
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "upgrade-screen ui-text";

    // close button
    var closeEl = document.createElement("div");
    closeEl.className = "close-button";
    closeEl.addEventListener("click", function () {
        overlayWrapperEl.style.display = "none";
        overlayEl.style.display = "none";
        wrapperEl.style.display = "none";

        var coinsEl = coinsUI.getWrapper();
        globalWrapperEl.appendChild(coinsEl);
    });
    wrapperEl.appendChild(closeEl);


    // upgrade text

    var upgradeTextEl = document.createElement("p");
    upgradeTextEl.className = "font-70 upgrade-header";
    upgradeTextEl.innerText = "UPGRADES";

    wrapperEl.appendChild(upgradeTextEl);


    // upgrade buttons
    var upgradeList = ["more speed", "longer spins", "time reward"];
    var iconList = ["rev_icon.png", "spins_icon.png", "time_icon.png"];
    var costList = [];
    var levelList = [];
    var costButtonsList = [];

    for (var i = 0; i < upgradeList.length; i++) {

        var coinstToCollectEl = document.createElement("span");
        coinstToCollectEl.className = "font-40 upgrade-text";
        coinstToCollectEl.innerText = upgradeList[i];

        var upgradeIcoEl = document.createElement("img");
        upgradeIcoEl.src = "assets/ui/" + iconList[i];

        var levelWrapperEl = document.createElement("span");
        levelWrapperEl.className = "upgrade-level-wrapper font-60";

        var levelEl = document.createElement("span");
        levelEl.className = "upgrade-level";
        levelList.push(levelEl);

        levelWrapperEl.appendChild(document.createTextNode(" "));
        levelWrapperEl.appendChild(levelEl);


        var upgradeButtonEl = document.createElement("button");
        upgradeButtonEl.className = "button-upgrade button-large";

        var coinIconEl = document.createElement("span");
        coinIconEl.className = "coin-icon";
        // upgradeButtonEl.appendChild(coinIconEl);

        var costValueEl = document.createTextNode("");
        upgradeButtonEl.appendChild(costValueEl);
        costList.push(costValueEl);

        costButtonsList.push(upgradeButtonEl);

        var botScreenEl = document.createElement("div");
        botScreenEl.className = "font-white";
        botScreenEl.className = "button-upgrade-wrapper";
        botScreenEl.appendChild(coinstToCollectEl);
        botScreenEl.appendChild(document.createElement("br"));
        botScreenEl.appendChild(upgradeIcoEl);
        botScreenEl.appendChild(levelWrapperEl);
        botScreenEl.appendChild(upgradeButtonEl);
        wrapperEl.appendChild(botScreenEl);
    }



    // upgrade icon
    var upgradeIcoEl = document.createElement("div");
    upgradeIcoEl.className = "upgrade-ico";
    upgradeIcoEl.addEventListener("click", function () {
        overlayWrapperEl.innerHTML = "";
        var coinsEl = coinsUI.getWrapper();
        overlayWrapperEl.appendChild(coinsEl);

        overlayWrapperEl.appendChild(wrapperEl);
        overlayWrapperEl.style.display = "block";
        overlayEl.style.display = "block";
        wrapperEl.style.display = "block";
    }, false);

    globalWrapperEl.appendChild(upgradeIcoEl);

    return {
        updateCost: function (speed, intertia, timeReward) {
            costList[0].textContent = renderTriNumber(speed);
            costList[1].textContent = renderTriNumber(intertia);
            costList[2].textContent = renderTriNumber(timeReward);
        },
        updateAvailability: function (speed, intertia, timeReward) {
            speed === false ? costButtonsList[0].disabled = true : costButtonsList[0].disabled = false;
            intertia === false ? costButtonsList[1].disabled = true : costButtonsList[1].disabled = false;
            timeReward === false ? costButtonsList[2].disabled = true : costButtonsList[2].disabled = false;
        },
        bindUpgradeCallbacks: function (speed, intertia, timeReward) {
            costButtonsList[0].addEventListener("click", speed);
            costButtonsList[1].addEventListener("click", intertia);
            costButtonsList[2].addEventListener("click", timeReward);
        },
        updateLevel: function (speed, intertia, timeReward) {
            levelList[0].textContent = speed;
            levelList[1].textContent = intertia;
            levelList[2].textContent = timeReward;
        }
    };
})();

var slideAreaUI = (function () {
    var slideAreaEl = document.createElement("div");
    slideAreaEl.className = "slide-area";

    document.body.appendChild(slideAreaEl);


    var obj = {
        registerSlide: function (cb) {
            swipe(slideAreaEl, cb);
        },
        slideAreaEl: slideAreaEl
    };

    return obj;
})();

var coinsUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "coins-total ui-text";

    var coinsEl = document.createElement("span");
    coinsEl.innerText = "0";
    coinsEl.className = "font-36 font-yellow";

    var coinsIcoEl = document.createElement("img");
    coinsIcoEl.className = "coins-ico";
    coinsIcoEl.src = "assets/ui/coin.png";

    wrapperEl.appendChild(coinsIcoEl);
    wrapperEl.appendChild(coinsEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setCoins: function (coins) {
            coinsEl.innerText = renderTriNumber(coins);
        },
        getWrapper: function () {
            return wrapperEl;
        }
    };
})();


var hintHand = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "hint-hand-wrapper";

    var handIcoEl = document.createElement("span");
    handIcoEl.className = "hint-hand-ico";

    var spinsRemainEl = document.createElement("span");
    spinsRemainEl.className = "hint-spins-remain ui-text";

    wrapperEl.appendChild(handIcoEl);
    wrapperEl.appendChild(spinsRemainEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpinsRemain: function (spinsRemain) {
            var innerText = `/${__WEBPACK_IMPORTED_MODULE_0__Game_js__["b" /* SPIN_ATTEMPTS */]}`;
            spinsRemainEl.innerText = spinsRemain + innerText;
        }
    };
})();

function swipe(element, callback) {

    var clientWidth = element.clientWidth;

    var context = {
        xDown: null,
        startTime: null,
        xLast: null
    };

    element.addEventListener('touchstart', handleTouchStart.bind(context), false);
    element.addEventListener('mousedown', handleMouseStart.bind(context), false);

    element.addEventListener('touchend', handleTouchEnd.bind(context), false);
    element.addEventListener('touchout', handleTouchEnd.bind(context), false);
    element.addEventListener('touchmove', handleTouchMove.bind(context), false);

    element.addEventListener('mouseup', handleMouseEnd.bind(context), false);
    element.addEventListener('mouseout', handleMouseEnd.bind(context), false);


    function handleTouchStart(evt) {
        this.xDown = evt.touches[0].clientX;
        this.startTime = performance.now();
    }

    function handleMouseStart(evt) {
        this.xDown = evt.clientX;
        this.startTime = performance.now();
    }

    function handleTouchMove(evt) {
        this.xLast = evt.touches[0].clientX;
    }

    function handleTouchEnd(evt) {
        if (context.xDown !== null)
            resolveSlide.call(this, this.xLast);
    }

    function handleMouseEnd(evt) {
        if (context.xDown !== null)
            resolveSlide.call(this, evt.clientX);
    }

    function resolveSlide(xEnd) {

        var endTime = performance.now();

        var distance = (xEnd - this.xDown) / clientWidth;
        var time = endTime - this.startTime;
        if (distance / time > 0.001) {
            callback(endTime - this.startTime, (xEnd - this.xDown) / clientWidth);
        }
        this.xDown = null;
        this.startTime = null;
    }
}

function renderTriNumber(amount) {

    amount = Math.floor(amount);

    var i, units = ["", "k", "M", "B", "T"];
    for (i = 0; i < units.length; i++) {
        if (amount * 0.001 < 1)
            break;

        amount = amount * 0.001;
    }
    amount = parseInt(Math.floor(amount * 10)) / 10;
    return amount + units[i];
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createGameeConnector; });
var GameeConnector = function (Game) {
    this.sound = false;
    this.controller = null;
    this.gameInstance = null;
    this.Game = Game;
    this._initGame();
};

GameeConnector.prototype = {
    _initGame: function () {
        var controllerType = 'FullScreen',
            controllerOpts = {},
            capabilities = [];

        // before your game calls gamee.gameInit, it must be able to accept mute and unmute command
        // but your game MUST NOT play any sound durring this phase
        gamee.emitter.addEventListener("mute", function (ev) {
            try {
                this.gameInstance.setSound(false);
            } catch (e) {
                // game instance doesnt exist yet
                this.sound = false;
            }
        }.bind(this));

        gamee.emitter.addEventListener("unmute", function (ev) {
            try {
                this.gameInstance.setSound(true);
            } catch (e) {
                // game instance doesnt exist yet
                this.sound = true;
            }
        }.bind(this));


        gamee.emitter.addEventListener("pause", function (ev) {
            try {
                this.gameInstance.pause();
            } catch (e) {
            }
        }.bind(this));

        gamee.emitter.addEventListener("resume", function (ev) {
            try {
                this.gameInstance.resume();
            } catch (e) {
            }
        }.bind(this));

        // calling init
        // in this phase, your game notifies platform what kind of controller it uses and what capabilities it has
        gamee.gameInit(controllerType, controllerOpts, capabilities, this._initGameCb.bind(this));
    },
    _initGameCb: function (data) {
        // callback for gameInit
        // response for gameInit contains requested controller instance, some other data based on capabilities and sound otpion
        this.controller = data.controller;
        this.sound = data.sound;
        this.data = data;

        // now your game can setup assets and other stuff
        // durring this phase, gamee.loadingProgress(int) to notify platform about preparation progress
        // durring this phase, your game is allowed to play sound

        // once preparation is ready, continue
        this._gameReady();
    },
    _gameReady: function () {

        // before you continue, you must be able to accept gameStart command
        gamee.emitter.addEventListener("start", this.gameStart.bind(this));

        // calling gamee.gameReady
        // this method will notify platform, your game is ready to accept gameStart command
        // gamee.gameReady(this._gameReadyCb.bind(this));
        gamee.gameReady();
    },
    _gameReadyCb: function () {
        // there you won't get any data
    },
    gameStart: function (ev) {
        if (this.gameInstance !== null) {
            this.gameInstance.forceEnd();
        } else {
            this.gameInstance = new this.Game(this.sound, this.controller, this.data);
        }
        // when you start new game instance, you will probably want to pass some parameters based on:
        // type of game should run (is it first game? did player died already?)
        // call signature might differ a lot,
        // this is just sample how it could look like:

        // this.gameInstance = new this.Game(this.sound, this.controller);
        // once game is ready, you must call callback
        // this is standart CustomEvent instance, callback is property of event.detail
        ev.detail.callback();
    }
};

var createGameeConnector = function (Game) {
    new GameeConnector(Game);
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return audio; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__ = __webpack_require__(1);



var SOUND_SOURCE = "assets/audio/63532__florian-reinke__click2.mp3";

var Audio = function () {
    this.isPlaying = false;
    this._init();
};

Audio.prototype = {
    _init: function () {
        this.sound = new Howl({
            src: [SOUND_SOURCE],
            loop: true,
            preload: true,
            volume: 1,
            rate: 1,
            autoplay: false
        });
    },
    start: function (opt_rate) {
        opt_rate = opt_rate || 0;
        this.setRate(opt_rate);
        try {
            this.sound.stop();
        } catch (e) { }
        this.sound.play();
        this.isPlaying = true;
    },
    mute: function (mute) {
        this.sound.mute(mute);
    },
    pause: function (pause) {
        if (pause) {
            this.sound.pause();
        } else if (this.isPlaying) {
            this.sound.play();
        }
    },
    stop: function () {
        this.sound.stop();
        this.isPlaying = false;
    },
    setRate: function (rate) {

        rate = rate * 0.05; // 60/3


        rate *= this.sound.duration();

        rate = Math.min(7.1, rate);
        rate = Math.max(0.1, rate);

        this.sound.rate(rate);
    }
};

var audio = new Audio();

// Unlock audio for mobile platforms
(function () {

    var unlockAudioListener;

    unlockAudioListener = function () {

        var myContext = new AudioContext();

        // create empty buffer
        var buffer = myContext.createBuffer(1, 1, 22050);
        var source = myContext.createBufferSource();
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(myContext.destination);

        // play the file
        if (!source.start)
            source.start = source.noteOn;
        source.start(0);

        try {
            window.removeEventListener('touchstart', unlockAudioListener);
            document.body.removeEventListener('touchstart', unlockAudioListener);
            __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["e" /* slideAreaUI */].slideAreaEl.removeEventListener('touchstart', unlockAudioListener);
        } catch (e) {

        }
    };

    window.addEventListener('touchstart', unlockAudioListener, true);
    document.body.addEventListener('touchstart', unlockAudioListener, true);
    __WEBPACK_IMPORTED_MODULE_0__ui_controlls_js__["e" /* slideAreaUI */].slideAreaEl.addEventListener('touchstart', unlockAudioListener, true);
})();

(function () {
    var ctx = null, usingWebAudio = true;

    try {
        if (typeof AudioContext !== 'undefined') {
            ctx = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            ctx = new webkitAudioContext();
        } else {
            usingWebAudio = false;
        }
    } catch (e) {
        usingWebAudio = false;
    }

    // context state at this time is `undefined` in iOS8 Safari
    if (usingWebAudio && ctx.state === 'suspended') {
        var resume = function () {
            ctx.resume();

            setTimeout(function () {
                if (ctx.state === 'running') {
                    document.body.removeEventListener('touchend', resume, false);
                }
            }, 0);
        };

        document.body.addEventListener('touchend', resume, false);
    }
})();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chronos; });
/* unused harmony export createChronos */
var Chronos = function () {
    this.listeners = [];
    this._init();
};

Chronos.prototype = {
    _init: function () {
        this.timeRunning = 0;
        this.timeMod = 1;
    },
    registerListener: function (listener) {
        this.listeners.push(listener);
    },
    prependListener: function (listener) {
        this.listeners.unshift(listener);
    },
    removeListener: function (listener) {
        var i;

        for (i = 0; i < this.listeners.length; i++) {
            if (listener === this.listeners[i]) {
                this.listeners.splice(i);
                continue;
            }
        }
    },
    update: function (deltaTime) {
        var i;

        deltaTime = deltaTime * this.timeMod;
        this.timeRunning += deltaTime;

        for (i = 0; i < this.listeners.length; i++)
            this.listeners[i].update(deltaTime);
    },
    setUpdating: function (updating) {
        if (updating) {
            delete this.update;
        } else {
            this.update = function () { };
        }
    }
};

var createChronos = function () {
    return new Chronos();
};

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gamee_GameeConnector_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Game_js__ = __webpack_require__(0);



__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__gamee_GameeConnector_js__["a" /* createGameeConnector */])(__WEBPACK_IMPORTED_MODULE_1__Game_js__["a" /* Game */]);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
var GLOBAL_WRAPPER_ID = "game-wrapper";
var MAX_OPACITY_MULT = 0.7;

var SPINNER_IMG = {
    stage0: "assets/spinners/spiner_stage0.png",
    stage1: "assets/spinners/spiner_stage1.png",
    stage2: "assets/spinners/spiner_stage2.png",
    stage3: "assets/spinners/spiner_stage3.png",
    middle: "assets/spinners/spiner_center.png"
};

var STAGE_REACH = {

};

var globalWrapperEl = document.getElementById(GLOBAL_WRAPPER_ID);
var ctx = null;
var canvas, imgs, img,
    hRatio, vRatio, ratio, centerShift_x, centerShift_y;

function loadImages() {

    var counter = 0,
        total = 0;

    imgs = {};
    for (var key in SPINNER_IMG) {
        total++;
        loadImage(SPINNER_IMG[key], key, function () {
            counter++;
            if (counter !== total)
                return;

            img = imgs.stage0;
            hRatio = canvas.width / img.width;
            vRatio = canvas.height / img.height;
            ratio = Math.min(hRatio, vRatio);
            centerShift_x = (canvas.width - img.width * ratio) / 2;
            centerShift_y = (canvas.height - img.height * ratio) / 2;

            render(0, 0);
        });
    }

}

function loadImage(path, name, cb) {
    var img = document.createElement("img");
    img.onload = function () {
        imgs[name] = img;
        cb();
    }
    img.src = path;
}

(function () {
    canvas = document.createElement("canvas");
    canvas.id = "spinner-ctx";
    canvas.width = 640;
    canvas.height = 640;
    ctx = canvas.getContext("2d");

    globalWrapperEl.appendChild(canvas);
    loadImages();
})();

var render = function (degrees, speed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var opacityMult = 0;

    // if (speed > 1200) {
    //     opacityMult = (speed - 1200) / 400;
    //     renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage3);
    //     renderSpinner(degrees, 1, imgs.stage2);
    // } else if (speed > 800) {
    //     opacityMult = (speed - 800) / 400;
    //     renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage2);
    //     renderSpinner(degrees, 1, imgs.stage1);
    // } else if (speed > 400) {
    //     opacityMult = (speed - 400) / 400;
    //     renderSpinner(degrees + 120, opacityMult, imgs.stage1);
    //     renderSpinner(degrees, 1, imgs.stage0);
    // } else {
    //     renderSpinner(degrees, 1, imgs.stage0);
    // }

    if (speed > 1200) {
        opacityMult = (speed - 1200) / 400;
        // renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage3);
        // renderSpinner(degrees + 120, Math.max(0, 1 - opacityMult), imgs.stage2);
        renderSpinner(degrees, 1, imgs.stage3);
    } else if (speed > 800) {
        opacityMult = (speed - 800) / 400;
        // renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage2);
        // renderSpinner(degrees + 120, Math.max(0, 1 - opacityMult), imgs.stage1);
        renderSpinner(degrees, 1, imgs.stage2);
    } else if (speed > 400) {
        opacityMult = (speed - 400) / 400;
        // renderSpinner(degrees + 120, opacityMult, imgs.stage1);
        renderSpinner(degrees, 1, imgs.stage1);
        renderSpinner(degrees, opacityMult * 0.5 + 0.5, imgs.stage2);
    } else {
        renderSpinner(degrees, 1, imgs.stage0);
    }

    renderSpinnerCenter();
}

function renderSpinner(degrees, opacity, targetImage) {

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.globalAlpha = opacity;
    ctx.drawImage(targetImage, 0, 0, targetImage.width, targetImage.height,
        centerShift_x, centerShift_y, targetImage.width * ratio, targetImage.height * ratio);
    ctx.globalAlpha = 1;
    ctx.restore();
}

function renderSpinnerCenter() {
    ctx.save();
    img = imgs.middle;
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    ctx.restore();
}

/***/ })
/******/ ]);
//# sourceMappingURL=build.js.map