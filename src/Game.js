import * as controlls from "./ui/controlls.js"
import { Chronos } from "./Chronos.js"
import { audio } from "./Audio.js"
import * as spinner from "./ui/2dCanvas.js"

var SPEED_MULT = 35 * 50;
var MAX_SPEED_MUlT = 2.5 * 0.01;
var INERTIA_MULT = 3;
var SPEED_DECOY = 20;
var LEVEL_SPINS_MULT = 25;
var UPGRADE_COST_MULT = 25;
export var SPIN_ATTEMPTS = 5;

export function Game(sound, controller, data) {
    console.log("game started");
    this._initData();
    this._initUpgradeCosts();
    this._initUpgradeAvailability();
    this._initBuyUpgradeCallback();
    this.data = data;

    controlls.prepareScreen(this.getLevelMultiplier(), this.coins);
    gamee.updateScore(this.highestScore);
    controlls.spinsCounterUI.setSpinsCount(0, 0);
    controlls.hintHand.setSpinsRemain(SPIN_ATTEMPTS);

    this._registerSlideEvent();
    this._initSound(sound);
    this._start();
}

export var timeLoop = new Chronos();

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
        controlls.upgradeUI.updateCost(
            this.getUpgradeCost("speedUpgrades"),
            this.getUpgradeCost("inertiaUpgrades"),
            this.getUpgradeCost("timeRewardUpgrades")
        );
        controlls.upgradeUI.updateLevel(this.speedUpgrades, this.inertiaUpgrades, this.timeRewardUpgrades);
    },
    _initUpgradeAvailability: function () {
        controlls.upgradeUI.updateAvailability(
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

        controlls.upgradeUI.bindUpgradeCallbacks(
            buyCallback.bind(this, "speedUpgrades"),
            buyCallback.bind(this, "inertiaUpgrades"),
            buyCallback.bind(this, "timeRewardUpgrades")
        );
    },
    _initSound: function (sounded) {
        audio.mute(!sounded);
    },
    getLevelMultiplier: function () {
        return Math.pow(2, this.level);
    },
    getUpgradeCost: function (type) {
        return Math.floor(UPGRADE_COST_MULT * Math.pow(1.4, this[type]));
    },
    _registerSlideEvent: function () {
        controlls.slideAreaUI.registerSlide((function (deltaTime, distance) {
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
        controlls.resetAll();
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
        audio.pause(true);
        timeLoop.setUpdating(false);
    },
    resume: function () {
        audio.pause(false);
        timeLoop.setUpdating(true);
    },
    setSound: function (sounded) {
        audio.mute(!sounded);
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
            controlls.spinsCounterUI.setLevelMultiplier(this.getLevelMultiplier());
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
        controlls.spinsCounterUI.setSpinsCount(0, 0);
        controlls.hintHand.setSpinsRemain(SPIN_ATTEMPTS);

        console.log("lobby ends");
    },
    addCoins: function (value) {
        this.coins += value;
        controlls.coinsUI.setCoins(this.coins);
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
            audio.pause(true);

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
        audio.start();
    },
    _registerUpdate: function () {
        timeLoop.registerListener(this);
    },
    spinAttempt: function (deltaTime, distance) {

        var currentSpeedGain = (distance / deltaTime) * this.speedGain;


        if (this.spinAttempts < 1)
            return;

        this.spinAttempts--;
        controlls.hintHand.setSpinsRemain(this.spinAttempts);

        this.speed += currentSpeedGain;
        this.speed = Math.max(0, this.speed);
        this.speed = Math.min(this.speed, this.speedGain * MAX_SPEED_MUlT);
    },
    end: function () {
        audio.stop();

        timeLoop.removeListener(this);
        this.spins = Math.floor(this.spins);
        this.bestSpins = Math.max(this.bestSpins, this.spins);

        var levelMult = Math.pow(2, this.level), levelup = false, coins = this.spins * levelMult;

        if (this.spins >= this.nextLevel) {
            levelup = true;
        }

        controlls.endScreen.runEndScreen(this.spins, this.bestSpins, levelMult, coins, () => this.endCb(coins, this.bestSpins, levelup));
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
        controlls.speedMeterUI.setSpeed(this.speed);

        var progress = this.spins > 0 ? this.spins / this.nextLevel * 100 : 0;
        controlls.spinsCounterUI.setSpinsCount(this.spins, progress);

        // set level up
        if (progress > 100) {
            controlls.spinsCounterUI.setLevelMultiplier(Math.pow(2, this.level + 1));
        }

        var deg = -(this.spins - Math.floor(this.spins)) * 360 * Math.sign(this.speed);
        spinner.render(deg, this.speed);
    },
    _resolveGameEnd: function () {
        if (this.speed === 0) {
            this.end();
        }
    },
    _updateSound: function () {
        audio.setRate(this.speed);
    }
};