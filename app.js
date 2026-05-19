

let globalScoreMe = 0;
let globalScoreOpp = 0;
let currentTargetCount = 7;
let oppInitialDraws = 0;
let roundCount = 1;
let lastWinner = null;

class DominoGame {
    constructor() {
        this.allDominos = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                this.allDominos.push([i, j]);
            }
        }
        this.resetMatch();
    }

    resetMatch() {
        this.playerCount = this.playerCount || 2;
        this.myHand = [];
        this.oppHands = {};
        this.bazaarCount = 0;
        
        this.playedDominos = [];
        this.tableEnds = [null, null];
        
        this.turn = 'me';
        this.isGameOver = false;
        this.winner = null; 
        this.myScore = 0;
        this.oppScore = 0;
        this.oppMissing = new Set();
        this.missingSets = {
            1: new Set(),
            2: new Set(),
            3: new Set(),
            4: new Set()
        };
        this.digitLocksPrompted = new Set();
        
        this.history = [];
    }

    saveState() {
        this.history.push({
            myHand: JSON.parse(JSON.stringify(this.myHand)),
            oppHands: JSON.parse(JSON.stringify(this.oppHands)),
            bazaarCount: this.bazaarCount,
            playedDominos: JSON.parse(JSON.stringify(this.playedDominos)),
            tableEnds: JSON.parse(JSON.stringify(this.tableEnds)),
            turn: this.turn,
            isGameOver: this.isGameOver,
            winner: this.winner,
            myScore: this.myScore,
            oppScore: this.oppScore,
            oppMissing: new Set(this.oppMissing),
            missingSets: {
                1: new Set(this.missingSets[1]),
                2: new Set(this.missingSets[2]),
                3: new Set(this.missingSets[3]),
                4: new Set(this.missingSets[4])
            },
            digitLocksPrompted: new Set(this.digitLocksPrompted)
        });
    }

    undo() {
        if (this.history.length === 0) return false;
        const state = this.history.pop();
        this.myHand = state.myHand;
        this.oppHands = state.oppHands;
        this.bazaarCount = state.bazaarCount;
        this.playedDominos = state.playedDominos;
        this.tableEnds = state.tableEnds;
        this.turn = state.turn;
        this.isGameOver = state.isGameOver;
        this.winner = state.winner;
        this.myScore = state.myScore;
        this.oppScore = state.oppScore;
        this.oppMissing = state.oppMissing;
        this.missingSets = {
            1: new Set(state.missingSets[1]),
            2: new Set(state.missingSets[2]),
            3: new Set(state.missingSets[3]),
            4: new Set(state.missingSets[4])
        };
        this.digitLocksPrompted = new Set(state.digitLocksPrompted);
        return true;
    }

    initGame(playerCount, firstTurn) {
        this.playerCount = playerCount;
        this.turn = firstTurn;
        
        this.oppHands = {};
        if (playerCount === 4) {
            this.oppHands['P2'] = 7;
            this.oppHands['P3'] = 7;
            this.oppHands['P4'] = 7;
            this.bazaarCount = 0;
        } else {
            this.oppHands['P2'] = 7 + oppInitialDraws;
            this.bazaarCount = 28 - this.myHand.length - this.oppHands['P2'];
            if (this.bazaarCount < 0) this.bazaarCount = 0;
        }
    }

    isHand(tile) {
        return this.myHand.some(t => t[0] === tile[0] && t[1] === tile[1]);
    }
    
    isPlayed(tile) {
        return this.playedDominos.some(p => p.tile[0] === tile[0] && p.tile[1] === tile[1]);
    }

    toggleMyHand(tile) {
        const idx = this.myHand.findIndex(t => t[0] === tile[0] && t[1] === tile[1]);
        if (idx > -1) {
            this.myHand.splice(idx, 1);
        } else {
            if (this.myHand.length >= currentTargetCount) return false;
            this.myHand.push(tile);
        }
        return true;
    }

    playTile(tile, end) {
        const idx = this.myHand.findIndex(t => t[0] === tile[0] && t[1] === tile[1]);
        if (idx > -1) this.myHand.splice(idx, 1);

        if (end === 'first') {
            this.playedDominos.push({ tile, end: 'first', player: this.turn });
            this.tableEnds = [tile[0], tile[1]];
        } else if (end === 'left') {
            this.playedDominos.unshift({ tile, end: 'left', player: this.turn });
            this.tableEnds[0] = (tile[0] === this.tableEnds[0]) ? tile[1] : tile[0];
        } else if (end === 'right') {
            this.playedDominos.push({ tile, end: 'right', player: this.turn });
            this.tableEnds[1] = (tile[0] === this.tableEnds[1]) ? tile[1] : tile[0];
        }

        
        if (this.playerCount === 4) {
            if (this.turn === 'me') this.turn = 'p2';
            else if (this.turn === 'p2') this.turn = 'p3';
            else if (this.turn === 'p3') this.turn = 'p4';
            else if (this.turn === 'p4') this.turn = 'me';
        } else {
            this.turn = (this.turn === 'me') ? 'opp' : 'me';
        }
        this.checkGameOver();
    }

    playerPass() {
        if (this.playedDominos.length > 0) {
            let activeNum = null;
            if (this.turn === 'me') activeNum = 1;
            else if (this.turn === 'p2') activeNum = 2;
            else if (this.turn === 'p3') activeNum = 3;
            else if (this.turn === 'p4') activeNum = 4;
            
            if (activeNum !== null) {
                this.missingSets[activeNum].add(this.tableEnds[0]);
                this.missingSets[activeNum].add(this.tableEnds[1]);
            }
        }

        
        if (this.playerCount === 4) {
            if (this.turn === 'me') this.turn = 'p2';
            else if (this.turn === 'p2') this.turn = 'p3';
            else if (this.turn === 'p3') this.turn = 'p4';
            else if (this.turn === 'p4') this.turn = 'me';
        } else {
            this.turn = (this.turn === 'me') ? 'opp' : 'me';
        }
        
        this.checkGameOver();
    }

    checkMissingDigitLock() {
        if (this.playerCount !== 4) return null;
        
        for (let d = 0; d <= 6; d++) {
            
            if (this.missingSets[1].has(d) && this.missingSets[3].has(d)) {
                return { team: 'us', digit: d };
            }
            
            if (this.missingSets[2].has(d) && this.missingSets[4].has(d)) {
                return { team: 'them', digit: d };
            }
        }
        return null;
    }

    oppDrawFromBazaar(drawCount, finalTilePlayed) {
        if (this.playedDominos.length > 0 && (drawCount > 0 || !finalTilePlayed)) {
            this.oppMissing.add(this.tableEnds[0]);
            this.oppMissing.add(this.tableEnds[1]);
        }

        let actualDrawn = Math.min(drawCount, this.bazaarCount);
        this.bazaarCount -= actualDrawn;
        this.oppHands['P2'] += actualDrawn;

        if (finalTilePlayed) {
            this.oppHands['P2'] -= 1;
        } else {
            this.turn = (this.turn === 'me') ? 'opp' : 'me';
        }
        this.checkGameOver();
    }

    getPlayableEnds(tile) {
        const ends = [];
        if (this.playedDominos.length === 0) return ['first'];
        if (tile[0] === this.tableEnds[0] || tile[1] === this.tableEnds[0]) ends.push('left');
        if (tile[0] === this.tableEnds[1] || tile[1] === this.tableEnds[1]) ends.push('right');
        return ends;
    }

    getOrientedPlayedDominos() {
        const N = this.playedDominos.length;
        if (N === 0) return [];
        
        const oriented = [];
        for (let i = 0; i < N; i++) {
            const tile = this.playedDominos[i].tile;
            let leftNum = tile[0];
            let rightNum = tile[1];
            
            if (i < N - 1) {
                const nextTile = this.playedDominos[i + 1].tile;
                if (tile[0] === nextTile[0] || tile[0] === nextTile[1]) {
                    leftNum = tile[1];
                    rightNum = tile[0];
                } else {
                    leftNum = tile[0];
                    rightNum = tile[1];
                }
            } else if (i > 0) {
                const prev = oriented[i - 1];
                if (tile[0] === prev.right) {
                    leftNum = tile[0];
                    rightNum = tile[1];
                } else {
                    leftNum = tile[1];
                    rightNum = tile[0];
                }
            }
            
            oriented.push({ tile, left: leftNum, right: rightNum, isDouble: leftNum === rightNum });
        }
        return oriented;
    }

    getEngineRecommendation() {
        if (this.myHand.length === 0) return null;
        if (this.playedDominos.length === 0) {
            let bestTile = this.myHand[0];
            let bestScore = -9999;

            
            let suitCount = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
            for (let t of this.myHand) {
                suitCount[t[0]]++;
                if (t[0] !== t[1]) suitCount[t[1]]++;
            }

            for (let t of this.myHand) {
                
                if (t[0] === 1 && t[1] === 1 && roundCount === 1) {
                    return { tile: t, end: 'first' };
                }

                let score = (t[0] + t[1]) * 3; 
                if (t[0] === t[1]) {
                    score += 150; 
                }
                
                
                let maxSuitStrength = Math.max(suitCount[t[0]], suitCount[t[1]]);
                score += maxSuitStrength * 20;

                if (score > bestScore) {
                    bestScore = score;
                    bestTile = t;
                }
            }
            return { tile: bestTile, end: 'first' };
        }

        const lEnd = this.tableEnds[0];
        const rEnd = this.tableEnds[1];
        let bestMove = null;
        let maxScore = -99999;

        for (let tile of this.myHand) {
            if (tile[0] === lEnd || tile[1] === lEnd) {
                const score = this.evaluatePlay(tile, 'left', lEnd);
                if (score > maxScore) {
                    maxScore = score;
                    bestMove = { tile, end: 'left' };
                }
            }
            if (tile[0] === rEnd || tile[1] === rEnd) {
                const score = this.evaluatePlay(tile, 'right', rEnd);
                if (score > maxScore) {
                    maxScore = score;
                    bestMove = { tile, end: 'right' };
                }
            }
        }
        return bestMove;
    }

    evaluatePlay(tile, end, matchingEnd) {
        let score = 0;
        
        let newEnd = (tile[0] === matchingEnd) ? tile[1] : tile[0];
        let otherEnd = (end === 'left') ? this.tableEnds[1] : this.tableEnds[0];

        let tilePoints = tile[0] + tile[1];
        
        if (this.playerCount === 4) {
            
            
            
            
            let minOppTiles = Math.min(this.oppHands['P2'] || 7, this.oppHands['P4'] || 7);
            let pointWeight = (minOppTiles <= 2) ? 25 : 8;
            score += tilePoints * pointWeight;

            if (tile[0] === tile[1]) {
                
                score += 300 + tilePoints * 10;
            }

            
            
            let teammateMissingNew = this.missingSets[3].has(newEnd);
            let teammateMissingOther = this.missingSets[3].has(otherEnd);

            if (teammateMissingNew && teammateMissingOther) {
                
                score -= 30000;
            } else if (teammateMissingNew) {
                
                score -= 15000;
            }

            
            let p3PlayedCount = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
            this.playedDominos.forEach(p => {
                if (p.player === 'p3') {
                    p3PlayedCount[p.tile[0]]++;
                    p3PlayedCount[p.tile[1]]++;
                }
            });
            if (p3PlayedCount[newEnd] > 0 && !teammateMissingNew) {
                score += p3PlayedCount[newEnd] * 400; 
            }

            
            
            let p2Missing = this.missingSets[2].has(newEnd);
            let p4Missing = this.missingSets[4].has(newEnd);

            if (p2Missing && p4Missing) {
                
                score += 5000;
            } else if (p2Missing) {
                
                score += 2500;
            } else if (p4Missing) {
                
                score += 1500;
            }

            
            if (this.missingSets[2].has(otherEnd)) score += 500;
            if (this.missingSets[4].has(otherEnd)) score += 500;

        } else {
            
            let oppTilesLeft = this.oppHands['P2'] || 7;
            let pointWeight = (oppTilesLeft <= 2) ? 20 : 8;
            score += tilePoints * pointWeight; 

            if (tile[0] === tile[1]) {
                score += 300 + tilePoints * 8; 
            }

            if (this.oppMissing.has(newEnd) && this.oppMissing.has(otherEnd)) {
                score += 4000;
            } else if (this.oppMissing.has(newEnd)) {
                score += 2000; 
            }
            if (this.oppMissing.has(otherEnd)) {
                score += 500; 
            }
        }

        
        
        
        let myFutureMatches = 0;
        let suitCount = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
        for (let t of this.myHand) {
            if (t[0] === tile[0] && t[1] === tile[1]) continue; 
            suitCount[t[0]]++;
            if (t[0] !== t[1]) suitCount[t[1]]++;
            
            if (t[0] === newEnd || t[1] === newEnd) myFutureMatches++;
            if (t[0] === otherEnd || t[1] === otherEnd) myFutureMatches++;
        }

        
        if (myFutureMatches === 0 && this.myHand.length > 1) {
            score -= 25000; 
        } else {
            score += myFutureMatches * 50;
        }

        
        let hasDoubleForNewEnd = this.myHand.some(t => t[0] === newEnd && t[1] === newEnd && t[0] !== tile[0]);
        if (hasDoubleForNewEnd) {
            score += 400; 
        }

        
        score += (suitCount[newEnd] * 80);

        
        if (newEnd === otherEnd) {
            let playedOrInHand = 0;
            for (let i = 0; i <= 6; i++) {
                let checkTile = [Math.min(newEnd, i), Math.max(newEnd, i)];
                if (this.isPlayed(checkTile) || this.isHand(checkTile)) {
                    playedOrInHand++;
                }
            }

            if (playedOrInHand === 7) {
                
                let myHandPoints = 0;
                for (let t of this.myHand) {
                    if (!(t[0] === tile[0] && t[1] === tile[1])) {
                        myHandPoints += t[0] + t[1];
                    }
                }

                if (this.playerCount === 4) {
                    
                    let teammateEstimatedPoints = (this.oppHands['P3'] || 7) * 5.5;
                    let ourTeamTotal = myHandPoints + teammateEstimatedPoints;

                    let opp2Estimated = (this.oppHands['P2'] || 7) * 5.5;
                    let opp4Estimated = (this.oppHands['P4'] || 7) * 5.5;
                    let oppTeamTotal = opp2Estimated + opp4Estimated;

                    if (ourTeamTotal < oppTeamTotal) {
                        score += 10000; 
                    } else {
                        score -= 20000; 
                    }
                } else {
                    let oppTilesLeft = this.oppHands['P2'] || 7;
                    let oppEstimatedPoints = oppTilesLeft * 5.5;
                    if (myHandPoints < oppEstimatedPoints) {
                        score += 8000;
                    } else {
                        score -= 15000;
                    }
                }
            }
        }
        
        return score;
    }

    checkGameOver() {
        if (this.isGameOver) return;

        if (this.playedDominos.length > 0) {
            if (this.myHand.length === 0) {
                this.isGameOver = true;
                this.winner = 'me';
                return;
            }
            if (this.playerCount === 4) {
                if (this.oppHands['P3'] === 0) {
                    this.isGameOver = true;
                    this.winner = 'p3';
                    return;
                }
                if (this.oppHands['P2'] === 0) {
                    this.isGameOver = true;
                    this.winner = 'p2';
                    return;
                }
                if (this.oppHands['P4'] === 0) {
                    this.isGameOver = true;
                    this.winner = 'p4';
                    return;
                }
            } else {
                if (this.oppHands['P2'] === 0) {
                    this.isGameOver = true;
                    this.winner = 'opp';
                    return;
                }
            }
        }

        
        const available = this.allDominos.filter(t => !this.isPlayed(t));
        const anyPlayable = available.some(t => this.getPlayableEnds(t).length > 0);
        
        if (!anyPlayable && this.playedDominos.length > 0) {
            this.isGameOver = true;
            this.winner = 'draw';
        }
    }
}

const game = new DominoGame();


document.addEventListener('DOMContentLoaded', () => {
    
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const btnReset = document.getElementById('btn-reset');
    const btnUndo = document.getElementById('btn-undo');
    
    const setupPool = document.getElementById('setup-pool-grid');
    const setupHandCount = document.getElementById('setup-hand-count');
    const setupStartBtns = document.getElementById('setup-start-btns');
    
    
    const qosa1Modal = document.getElementById('qosa-1-modal');
    
    
    const digitLockModal = document.getElementById('digit-lock-modal');
    const digitLockDesc = document.getElementById('digit-lock-desc');
    const btnDigitLockRestart = document.getElementById('btn-digit-lock-restart');
    const btnDigitLockContinue = document.getElementById('btn-digit-lock-continue');

    btnDigitLockContinue.onclick = () => {
        digitLockModal.classList.remove('active');
    };

    btnDigitLockRestart.onclick = () => {
        restartCurrentRound();
    };

    function showDigitLockModal(lock) {
        const teamName = lock.team === 'us' ? "Bizim komandada (Siz + P3)" : "Rəqib komandada (P2 + P4)";
        digitLockDesc.textContent = `${teamName} [${lock.digit}] rəqəmli heç bir daş yoxdur!`;
        digitLockModal.classList.add('active');
    }
    
    
    const turnBanner = document.getElementById('turn-banner');
    const turnText = document.getElementById('turn-text');
    const oppsInfo = document.getElementById('opponents-info');
    const tableTrack = document.getElementById('table-track');
    const indLeft = document.getElementById('indicator-left-end');
    const indRight = document.getElementById('indicator-right-end');
    const gameHand = document.getElementById('game-hand-container');
    const oppProbContainer = document.getElementById('opp-prob-container');

    function renderSetupPool() {
        setupPool.innerHTML = '';
        game.allDominos.forEach(t => {
            const el = document.createElement('div');
            el.className = 'pool-wrapper ' + (game.isHand(t) ? 'selected' : '');
            el.innerHTML = createDominoVisualHtml(t);
            el.addEventListener('click', () => {
                if(game.toggleMyHand(t)) {
                    setupHandCount.textContent = game.myHand.length;
                    renderSetupPool();
                    checkSetupReady();
                }
            });
            setupPool.appendChild(el);
        });
    }

    
    document.getElementById('btn-mode-2p').addEventListener('click', () => {
        document.getElementById('home-screen').classList.remove('active-screen');
        document.getElementById('setup-screen').classList.add('active-screen');
        document.getElementById('main-header').style.display = 'flex';
    });

    function checkSetupReady() {
        if (game.myHand.length === currentTargetCount) {
            setupStartBtns.style.display = 'block';
        } else {
            setupStartBtns.style.display = 'none';
        }
    }

    
    document.getElementById('btn-mode-2p').addEventListener('click', () => {
        document.getElementById('setup-player-count').value = '2';
        document.getElementById('home-screen').classList.remove('active-screen');
        document.getElementById('setup-screen').classList.add('active-screen');
        document.getElementById('main-header').style.display = 'flex';
    });

    document.getElementById('btn-mode-4p').addEventListener('click', () => {
        document.getElementById('setup-player-count').value = '4';
        document.getElementById('home-screen').classList.remove('active-screen');
        document.getElementById('setup-screen').classList.add('active-screen');
        document.getElementById('main-header').style.display = 'flex';
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
        const pCount = parseInt(document.getElementById('setup-player-count').value) || 2;
        game.playerCount = pCount;
        
        if (roundCount === 1) {
            if (game.isHand([1,1])) {
                startGame('me');
            } else {
                showQosa1Modal();
            }
        } else {
            startGame(lastWinner);
        }
    });

    function showQosa1Modal() {
        qosa1Modal.innerHTML = '';
        if (game.playerCount === 4) {
            qosa1Modal.innerHTML = `
                <div class="modal-card">
                    <h3 style="color:var(--accent-color)">Qoşa 1 Yoxlanışı</h3>
                    <p style="margin-bottom:15px;">Sizin əlinizdə 1-1 yoxdur. Qoşa 1 hansı oyunçudadır?</p>
                    <div class="modal-actions" style="flex-direction: column; gap: 10px;">
                        <button id="btn-qosa-p2" class="btn btn-primary" style="width:100%;">Sağ Rəqib (P2)</button>
                        <button id="btn-qosa-p3" class="btn btn-success" style="width:100%;">Yoldaşım (P3)</button>
                        <button id="btn-qosa-p4" class="btn btn-primary" style="width:100%;">Sol Rəqib (P4)</button>
                    </div>
                </div>
            `;
            qosa1Modal.classList.add('active');
            
            document.getElementById('btn-qosa-p2').onclick = () => {
                qosa1Modal.classList.remove('active');
                startGame('p2');
            };
            document.getElementById('btn-qosa-p3').onclick = () => {
                qosa1Modal.classList.remove('active');
                startGame('p3');
            };
            document.getElementById('btn-qosa-p4').onclick = () => {
                qosa1Modal.classList.remove('active');
                startGame('p4');
            };
        } else {
            qosa1Modal.innerHTML = `
                <div class="modal-card">
                    <h3 style="color:var(--accent-color)">Qoşa 1 Yoxlanışı</h3>
                    <p style="margin-bottom:10px;">Sizin əlinizdə 1-1 yoxdur.</p>
                    <p><strong>Rəqibdə Qoşa 1 varmı?</strong></p>
                    <div class="modal-actions" style="flex-direction: column; gap: 10px; margin-top:15px;">
                        <button id="btn-opp-has-11" class="btn btn-primary" style="width:100%;">Bəli, rəqibdədir (Rəqib başlayır)</button>
                        <button id="btn-nobody-has-11" class="btn btn-danger" style="width:100%;">Xeyr, heç kimdə yoxdur (2 daş çəkin)</button>
                    </div>
                </div>
            `;
            qosa1Modal.classList.add('active');
            
            document.getElementById('btn-opp-has-11').onclick = () => {
                qosa1Modal.classList.remove('active');
                startGame('opp');
            };
            document.getElementById('btn-nobody-has-11').onclick = () => {
                qosa1Modal.classList.remove('active');
                alert("Heç kimdə 1-1 (Qoşa 1) yoxdur!\nHər iki tərəfə 2 daş verilir. Zəhmət olmasa bazardan əlavə 2 daş seçin.");
                currentTargetCount += 2;
                oppInitialDraws += 2;
                document.getElementById('setup-target-count').textContent = currentTargetCount;
                document.getElementById('setup-target-count-display').textContent = currentTargetCount;
                checkSetupReady(); 
            };
        }
    }

    function startNewRound(isFullReset = false) {
        if (!isFullReset) roundCount++;
        game.resetMatch();
        currentTargetCount = 7;
        oppInitialDraws = 0;
        document.getElementById('setup-target-count').textContent = currentTargetCount;
        document.getElementById('setup-target-count-display').textContent = currentTargetCount;
        setupHandCount.textContent = '0';
        setupStartBtns.style.display = 'none';
        
        setupScreen.classList.add('active-screen');
        gameScreen.classList.remove('active-screen');
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('digit-lock-modal').classList.remove('active');
        btnReset.style.display = 'none';
        btnUndo.style.display = 'none';
        renderSetupPool();

        if (roundCount > 1) {
            document.getElementById('btn-start-game').textContent = `Oyuna Başla (İlk Gediş: ${lastWinner === 'me' ? 'Mənim' : 'Rəqibin'})`;
        } else {
            document.getElementById('btn-start-game').textContent = "Qoşa 1 Yoxla / Oyuna Başla";
        }
    }

    function restartCurrentRound() {
        game.resetMatch();
        currentTargetCount = 7;
        oppInitialDraws = 0;
        document.getElementById('setup-target-count').textContent = currentTargetCount;
        document.getElementById('setup-target-count-display').textContent = currentTargetCount;
        setupHandCount.textContent = '0';
        setupStartBtns.style.display = 'none';
        
        setupScreen.classList.add('active-screen');
        gameScreen.classList.remove('active-screen');
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('digit-lock-modal').classList.remove('active');
        btnReset.style.display = 'none';
        btnUndo.style.display = 'none';
        renderSetupPool();

        document.getElementById('btn-start-game').textContent = "Qoşa 1 Yoxla / Oyuna Başla";
    }

    btnReset.addEventListener('click', () => {
        globalScoreMe = 0;
        globalScoreOpp = 0;
        roundCount = 1;
        lastWinner = null;
        document.getElementById('global-score-me').textContent = '0';
        document.getElementById('global-score-opp').textContent = '0';
        startNewRound(true);
    });

    document.getElementById('btn-return-menu').addEventListener('click', () => {
        globalScoreMe = 0;
        globalScoreOpp = 0;
        roundCount = 1;
        lastWinner = null;
        document.getElementById('global-score-me').textContent = '0';
        document.getElementById('global-score-opp').textContent = '0';
        
        game.resetMatch();
        currentTargetCount = 7;
        oppInitialDraws = 0;
        document.getElementById('setup-target-count').textContent = currentTargetCount;
        document.getElementById('setup-target-count-display').textContent = currentTargetCount;
        setupHandCount.textContent = '0';
        setupStartBtns.style.display = 'none';

        document.getElementById('home-screen').classList.add('active-screen');
        setupScreen.classList.remove('active-screen');
        gameScreen.classList.remove('active-screen');
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('digit-lock-modal').classList.remove('active');
        document.getElementById('main-header').style.display = 'none';
        btnReset.style.display = 'none';
        btnUndo.style.display = 'none';
    });

    document.getElementById('btn-next-round').addEventListener('click', () => {
        startNewRound(false);
    });

    document.getElementById('btn-play-again').addEventListener('click', () => {
        btnReset.click();
    });

    function startGame(firstTurn) {
        const pCount = parseInt(document.getElementById('setup-player-count').value) || 2;
        game.initGame(pCount, firstTurn);
        setupScreen.classList.remove('active-screen');
        gameScreen.classList.add('active-screen');
        btnReset.style.display = 'block';
        btnUndo.style.display = 'block';
        updateGameUI();
    }

    btnUndo.addEventListener('click', () => {
        if (game.undo()) {
            document.getElementById('game-over-modal').classList.remove('active');
            updateGameUI();
        }
    });

    
    function updateGameUI() {
        btnUndo.disabled = game.history.length === 0;

        if (game.isGameOver) {
            showGameOver();
            return;
        }

        
        const globalScoresContainer = document.querySelector('.global-scores');
        if (globalScoresContainer) {
            if (game.playerCount === 4) {
                globalScoresContainer.innerHTML = `Biz: <span id="global-score-me" class="text-success" style="margin-right: 5px;">${globalScoreMe}</span> | Onlar: <span id="global-score-opp" class="text-danger" style="margin-left: 5px;">${globalScoreOpp}</span>`;
            } else {
                globalScoresContainer.innerHTML = `Mən: <span id="global-score-me" class="text-success" style="margin-right: 5px;">${globalScoreMe}</span> | Rəqib: <span id="global-score-opp" class="text-danger" style="margin-left: 5px;">${globalScoreOpp}</span>`;
            }
        }

        
        if (game.turn === 'me') {
            turnBanner.classList.remove('opp-turn');
            turnText.textContent = "Mənim Növbəm";
            document.getElementById('my-turn-actions').style.display = 'block';
            document.getElementById('opp-turn-actions').style.display = 'none';
            document.getElementById('opp-play-selector').style.display = 'none';
            
            
            const myPassBtn = document.getElementById('btn-my-pass');
            if (myPassBtn) {
                if (game.playerCount === 4) {
                    myPassBtn.textContent = "Məndə Daş Yoxdur (Pas)";
                } else {
                    myPassBtn.textContent = "Bazara Get / Pas";
                }
            }
        } else {
            turnBanner.classList.add('opp-turn');
            
            let turnName = "Rəqibin Növbəsi";
            if (game.playerCount === 4) {
                if (game.turn === 'p2') turnName = "Sağ Rəqibin (P2) Növbəsi";
                else if (game.turn === 'p3') turnName = "Yoldaşımın (P3) Növbəsi";
                else if (game.turn === 'p4') turnName = "Sol Rəqibin (P4) Növbəsi";
            }
            turnText.textContent = turnName;
            
            const oppSectionTitle = document.querySelector('#opp-turn-actions .section-title');
            const oppPassedBtn = document.getElementById('btn-opp-passed');
            if (game.playerCount === 4) {
                if (game.turn === 'p2') oppSectionTitle.textContent = "Sağ Rəqib (P2) Gedişi";
                else if (game.turn === 'p3') oppSectionTitle.textContent = "Yoldaşım (P3) Gedişi";
                else if (game.turn === 'p4') oppSectionTitle.textContent = "Sol Rəqib (P4) Gedişi";
                
                if (oppPassedBtn) oppPassedBtn.textContent = "Pas Keçdi";
            } else {
                oppSectionTitle.textContent = "Rəqibin Gedişi";
                if (oppPassedBtn) oppPassedBtn.textContent = "Bazara Getdi / Pas";
            }
            
            document.getElementById('my-turn-actions').style.display = 'none';
            document.getElementById('opp-turn-actions').style.display = 'block';
            document.getElementById('opp-play-selector').style.display = 'none';
        }

        
        if (game.playerCount === 4) {
            oppsInfo.innerHTML = `
                <span>Sağ Rəqib (P2): <b class="${game.oppHands['P2']<=2 ? 'text-danger': ''}">${game.oppHands['P2']} daş</b></span>
                <span>Yoldaşım (P3): <b class="${game.oppHands['P3']<=2 ? 'text-danger': ''}">${game.oppHands['P3']} daş</b></span>
                <span>Sol Rəqib (P4): <b class="${game.oppHands['P4']<=2 ? 'text-danger': ''}">${game.oppHands['P4']} daş</b></span>
            `;
        } else {
            oppsInfo.innerHTML = '';
            for(let p in game.oppHands) {
                oppsInfo.innerHTML += `<span>Rəqib (${p}): <b class="${game.oppHands[p]<=2 ? 'text-danger': ''}">${game.oppHands[p]} daş</b></span>`;
            }
            oppsInfo.innerHTML += `<span>Bazar: <b>${game.bazaarCount}</b></span>`;
        }

        renderTable();
        renderMyHand();
        renderOppProbable();

        
        const lock = game.checkMissingDigitLock();
        if (lock && !game.digitLocksPrompted.has(lock.digit)) {
            game.digitLocksPrompted.add(lock.digit);
            showDigitLockModal(lock);
        }
    }

    function renderOppProbable() {
        if(!oppProbContainer) return;
        oppProbContainer.innerHTML = '';
        const available = game.allDominos.filter(t => !game.isHand(t) && !game.isPlayed(t));
        const probable = available.filter(t => !game.oppMissing.has(t[0]) && !game.oppMissing.has(t[1]));
        document.getElementById('opp-prob-count').textContent = probable.length;
        
        probable.forEach(t => {
            const el = document.createElement('div');
            el.className = 'hand-tile-wrapper';
            el.style.display = 'inline-block';
            el.style.marginRight = '8px';
            el.innerHTML = createDominoVisualHtml(t);
            oppProbContainer.appendChild(el);
        });
    }

    function showGameOver() {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const desc = document.getElementById('game-over-desc');
        const inputSection = document.getElementById('game-over-input-section');
        const resultSection = document.getElementById('game-over-result-section');
        const actions = document.getElementById('game-over-actions');
        
        inputSection.style.display = 'none';
        resultSection.style.display = 'none';
        actions.style.display = 'none';
        
        game.myScore = game.myHand.reduce((sum, t) => sum + t[0] + t[1], 0);

        if (game.playerCount === 4) {
            
            if (game.winner === 'me' || game.winner === 'p3') {
                lastWinner = game.winner;
                title.textContent = "TƏBRİKLƏR!";
                title.style.color = "var(--success-color)";
                desc.textContent = `Sizin komandanız (${game.winner === 'me' ? 'Siz' : 'Yoldaşınız'}) Qazandı! Rəqib komandanın (P2 + P4) qalan xallarının cəmini daxil edin.`;
                
                inputSection.innerHTML = `
                    <label>Rəqib komandanın (P2 + P4) qalan xal cəmi:</label>
                    <input type="number" id="input-opp-points" class="select-input" style="width: 100%; margin-top: 5px; font-size: 1.2rem;" min="0">
                    <button id="btn-confirm-score" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Xalı Təsdiqlə</button>
                `;
                inputSection.style.display = 'block';
                
                document.getElementById('btn-confirm-score').onclick = () => {
                    const points = parseInt(document.getElementById('input-opp-points').value) || 0;
                    game.oppScore = points;
                    game.myScore = 0; 
                    globalScoreMe += points;
                    finishGameOver();
                };
            } else if (game.winner === 'p2' || game.winner === 'p4') {
                lastWinner = game.winner;
                title.textContent = "TƏƏSSÜF...";
                title.style.color = "var(--danger-color)";
                desc.textContent = `Rəqib komanda (${game.winner === 'p2' ? 'Sağ' : 'Sol'} rəqib) Qazandı! Sizin qalan xalınız: ${game.myScore}. Yoldaşınızın (P3) qalan xalını daxil edin.`;
                
                inputSection.innerHTML = `
                    <label>Yoldaşınızın (P3) qalan xal cəmi:</label>
                    <input type="number" id="input-teammate-points" class="select-input" style="width: 100%; margin-top: 5px; font-size: 1.2rem;" min="0">
                    <button id="btn-confirm-score" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Xalı Təsdiqlə</button>
                `;
                inputSection.style.display = 'block';
                
                document.getElementById('btn-confirm-score').onclick = () => {
                    const matePoints = parseInt(document.getElementById('input-teammate-points').value) || 0;
                    let totalPenalty = game.myScore + matePoints;
                    game.oppScore = totalPenalty;
                    game.myScore = totalPenalty; 
                    globalScoreOpp += totalPenalty;
                    finishGameOver();
                };
            } else {
                
                title.textContent = "QIFIL (BLOCKED)";
                title.style.color = "var(--warning-color)";
                desc.textContent = `Oyun kilitləndi. Sizin qalan xalınız: ${game.myScore}. Səslərə və ya hesaba görə uduzan komandanı seçin:`;
                
                inputSection.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
                        <button id="btn-block-us-lost" class="btn btn-danger" style="width:100%; font-size:1rem; padding:10px;">Biz Uduzduq (Bizim xal çoxdur)</button>
                        <button id="btn-block-them-lost" class="btn btn-success" style="width:100%; font-size:1rem; padding:10px;">Onlar Uduzdu (Onların xalı çoxdur)</button>
                        
                        <div id="block-points-container" style="display:none; margin-top:10px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                            <label id="block-points-label">Uduzan komandanın qalan xal cəmi:</label>
                            <input type="number" id="input-block-points" class="select-input" style="width: 100%; margin-top: 5px; font-size: 1.2rem;" min="0">
                            <button id="btn-confirm-block-score" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Xalı Təsdiqlə</button>
                        </div>
                    </div>
                `;
                inputSection.style.display = 'block';
                
                let selectedLosingTeam = '';
                
                document.getElementById('btn-block-us-lost').onclick = () => {
                    selectedLosingTeam = 'us';
                    document.getElementById('block-points-label').textContent = "Bizim (P1 + P3) qalan xal cəmi:";
                    document.getElementById('block-points-container').style.display = 'block';
                    document.getElementById('btn-block-us-lost').style.border = '2px solid white';
                    document.getElementById('btn-block-them-lost').style.border = 'none';
                };
                
                document.getElementById('btn-block-them-lost').onclick = () => {
                    selectedLosingTeam = 'them';
                    document.getElementById('block-points-label').textContent = "Onların (P2 + P4) qalan xal cəmi:";
                    document.getElementById('block-points-container').style.display = 'block';
                    document.getElementById('btn-block-them-lost').style.border = '2px solid white';
                    document.getElementById('btn-block-us-lost').style.border = 'none';
                };
                
                document.getElementById('btn-confirm-block-score').onclick = () => {
                    const points = parseInt(document.getElementById('input-block-points').value) || 0;
                    if (selectedLosingTeam === 'us') {
                        game.myScore = points;
                        game.oppScore = 0;
                        globalScoreOpp += points;
                        lastWinner = 'p2'; 
                        desc.textContent = "Bizim xal çox olduğu üçün komandamız uduzdu.";
                    } else {
                        game.oppScore = points;
                        game.myScore = 0;
                        globalScoreMe += points;
                        lastWinner = 'me'; 
                        desc.textContent = "Rəqibin xalı çox olduğu üçün bizim komanda qazandı!";
                    }
                    finishGameOver();
                };
            }
        } else {
            
            if (game.winner === 'me') {
                lastWinner = 'me';
                title.textContent = "TƏBRİKLƏR!";
                title.style.color = "var(--success-color)";
                desc.textContent = "Daşlarınız bitdi və Siz Qazandınız! Rəqibin xalını öyrənib aşağıya yazın.";
                
                inputSection.innerHTML = `
                    <label>Rəqibin əlində qalan daşların xal cəmi:</label>
                    <input type="number" id="input-opp-points" class="select-input" style="width: 100%; margin-top: 5px; font-size: 1.2rem;" min="0">
                    <button id="btn-confirm-score" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Xalı Təsdiqlə</button>
                `;
                inputSection.style.display = 'block';
                
                document.getElementById('btn-confirm-score').onclick = () => {
                    const points = parseInt(document.getElementById('input-opp-points').value) || 0;
                    game.oppScore = points;
                    globalScoreMe += points;
                    finishGameOver();
                };
            } else if (game.winner === 'opp') {
                lastWinner = 'opp';
                title.textContent = "TƏƏSSÜF...";
                title.style.color = "var(--danger-color)";
                desc.textContent = `Rəqib Qazandı! Sizin cərimə xalınız (${game.myScore}) rəqibə yazılır.`;
                game.oppScore = 0; 
                globalScoreOpp += game.myScore;
                finishGameOver();
            } else {
                title.textContent = "QIFIL (BLOCKED)";
                title.style.color = "var(--warning-color)";
                desc.textContent = `Oyun kilitləndi. Sizin cərimə xalınız: ${game.myScore}. Rəqibin cərimə xalını daxil edin:`;
                
                inputSection.innerHTML = `
                    <label>Rəqibin əlində qalan daşların xal cəmi:</label>
                    <input type="number" id="input-opp-points" class="select-input" style="width: 100%; margin-top: 5px; font-size: 1.2rem;" min="0">
                    <button id="btn-confirm-score" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Xalı Təsdiqlə</button>
                `;
                inputSection.style.display = 'block';
                
                document.getElementById('btn-confirm-score').onclick = () => {
                    const points = parseInt(document.getElementById('input-opp-points').value) || 0;
                    game.oppScore = points;
                    
                    if (game.myScore < points) {
                        desc.textContent = "Sizin xalınız daha az olduğu üçün qazandınız!";
                        globalScoreMe += points;
                        lastWinner = 'me';
                    } else if (points < game.myScore) {
                        desc.textContent = "Rəqibin xalı az olduğu üçün o qazandı!";
                        globalScoreOpp += game.myScore;
                        lastWinner = 'opp';
                    } else {
                        desc.textContent = "Xallar bərabərdir! Heç kim xal qazanmır.";
                        lastWinner = 'me';
                    }
                    finishGameOver();
                };
            }
        }
        modal.classList.add('active');
    }

    function finishGameOver() {
        document.getElementById('game-over-input-section').style.display = 'none';
        
        document.getElementById('go-my-score').textContent = game.myScore;
        document.getElementById('go-opp-score').textContent = game.oppScore;
        
        document.getElementById('go-global-me').textContent = globalScoreMe;
        document.getElementById('go-global-opp').textContent = globalScoreOpp;
        
        document.getElementById('global-score-me').textContent = globalScoreMe;
        document.getElementById('global-score-opp').textContent = globalScoreOpp;
        
        document.getElementById('game-over-result-section').style.display = 'block';
        document.getElementById('game-over-actions').style.display = 'flex';
        
        if (globalScoreMe >= 101 || globalScoreOpp >= 101) {
            document.getElementById('btn-next-round').style.display = 'none';
            document.getElementById('game-over-title').textContent = (globalScoreMe >= 101) ? "SİZ 101-Ə ÇATDINIZ! QALİB!" : "RƏQİB 101-Ə ÇATDI! MƏĞLUB OLDUNUZ.";
        } else {
            document.getElementById('btn-next-round').style.display = 'block';
        }
    }

    function renderTable() {
        tableTrack.innerHTML = '';
        if (game.playedDominos.length === 0) {
            tableTrack.innerHTML = '<div class="empty-track-msg">Masa boşdur.</div>';
            indLeft.querySelector('.end-val').textContent = '-';
            indRight.querySelector('.end-val').textContent = '-';
            return;
        }

        const oriented = game.getOrientedPlayedDominos();
        const N = oriented.length;
        
        
        const centerIdx = game.playedDominos.findIndex(p => p.end === 'first');
        if (centerIdx === -1) return;

        
        const positions = new Array(N);

        
        const boardWidth = tableTrack.clientWidth || 300;
        const centerX = boardWidth / 2;
        const centerY = 50; 
        const gap = 3; 
        const padding = 12; 
        const leftBoundary = padding;
        const rightBoundary = boardWidth - padding;

        
        const centerTile = oriented[centerIdx];
        let centerWidth = 0;
        let centerHeight = 0;
        let isCenterHorizontal = false;

        if (centerTile.isDouble) {
            
            centerWidth = 20;
            centerHeight = 40;
            isCenterHorizontal = false;
        } else {
            
            centerWidth = 40;
            centerHeight = 20;
            isCenterHorizontal = true;
        }

        positions[centerIdx] = {
            left: centerX - centerWidth / 2,
            top: centerY - centerHeight / 2,
            width: centerWidth,
            height: centerHeight,
            horizontal: isCenterHorizontal
        };

        
        let rightDirection = 'right'; 
        for (let i = centerIdx + 1; i < N; i++) {
            const p = oriented[i];
            const prev = positions[i - 1];

            let width = 0;
            let height = 0;
            let horizontal = false;
            let left = 0;
            let top = 0;

            if (rightDirection === 'right') {
                if (p.isDouble) {
                    width = 20;
                    height = 40;
                    horizontal = false;
                } else {
                    width = 40;
                    height = 20;
                    horizontal = true;
                }

                left = prev.left + prev.width + gap;
                top = prev.top + prev.height / 2 - height / 2;

                
                if (left + width > rightBoundary) {
                    rightDirection = 'down';
                }
            }

            if (rightDirection === 'down') {
                if (p.isDouble) {
                    
                    width = 40;
                    height = 20;
                    horizontal = true;
                } else {
                    width = 20;
                    height = 40;
                    horizontal = false;
                }

                
                left = prev.left + prev.width / 2 - width / 2;
                top = prev.top + prev.height + gap;
            }

            positions[i] = { left, top, width, height, horizontal };
        }

        
        let leftDirection = 'left'; 
        for (let i = centerIdx - 1; i >= 0; i--) {
            const p = oriented[i];
            const next = positions[i + 1]; 

            let width = 0;
            let height = 0;
            let horizontal = false;
            let left = 0;
            let top = 0;

            if (leftDirection === 'left') {
                if (p.isDouble) {
                    width = 20;
                    height = 40;
                    horizontal = false;
                } else {
                    width = 40;
                    height = 20;
                    horizontal = true;
                }

                left = next.left - width - gap;
                top = next.top + next.height / 2 - height / 2;

                
                if (left < leftBoundary) {
                    leftDirection = 'down';
                }
            }

            if (leftDirection === 'down') {
                if (p.isDouble) {
                    width = 40;
                    height = 20;
                    horizontal = true;
                } else {
                    width = 20;
                    height = 40;
                    horizontal = false;
                }

                
                left = next.left + next.width / 2 - width / 2;
                top = next.top + next.height + gap;
            }

            positions[i] = { left, top, width, height, horizontal };
        }

        
        let maxY = 0;
        oriented.forEach((p, i) => {
            const pos = positions[i];
            
            
            let visualTiles;
            if (i < centerIdx && !pos.horizontal) {
                
                visualTiles = p.isDouble ? [p.left, p.left] : [p.right, p.left];
            } else {
                
                visualTiles = p.isDouble ? [p.left, p.left] : [p.left, p.right];
            }
            
            const el = document.createElement('div');
            el.className = 'played-tile-wrapper';
            el.style.left = `${pos.left}px`;
            el.style.top = `${pos.top}px`;
            el.style.width = `${pos.width}px`;
            el.style.height = `${pos.height}px`;

            el.innerHTML = createDominoVisualHtml(visualTiles, pos.horizontal);
            tableTrack.appendChild(el);

            if (pos.top + pos.height > maxY) {
                maxY = pos.top + pos.height;
            }
        });

        
        tableTrack.style.height = `${maxY + 50}px`;

        
        setTimeout(() => {
            const container = document.querySelector('.table-track-container');
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);

        
        indLeft.querySelector('.end-val').textContent = game.tableEnds[0] ?? '-';
        indRight.querySelector('.end-val').textContent = game.tableEnds[1] ?? '-';
    }


    function renderMyHand() {
        gameHand.innerHTML = '';
        if (game.myHand.length === 0) return;

        const bestMove = game.getEngineRecommendation();
        
        game.myHand.forEach(t => {
            const isBest = bestMove && bestMove.tile[0] === t[0] && bestMove.tile[1] === t[1];
            const el = document.createElement('div');
            el.className = `hand-tile-wrapper ${isBest ? 'recommended' : ''}`;
            
            let recBadge = '';
            if (isBest) {
                let text = "İLK GEDİŞ";
                if (bestMove.end === 'left') text = "SOLA QOY";
                else if (bestMove.end === 'right') text = "SAĞA QOY";
                recBadge = `<span class="recommendation-badge">${text}</span>`;
            }
            
            el.innerHTML = `${recBadge}${createDominoVisualHtml(t)}`;
            el.addEventListener('click', () => handleMyPlay(t));
            gameHand.appendChild(el);
        });
    }

    let pendingTile = null;
    function handleMyPlay(tile) {
        const ends = game.getPlayableEnds(tile);
        if (ends.length === 0) {
            alert("Bu daş masaya uyğun deyil!");
            return;
        }
        if (ends.length === 1 || ends[0] === 'first') {
            game.saveState();
            game.playTile(tile, ends[0]);
            updateGameUI();
        } else {
            pendingTile = tile;
            document.getElementById('modal-tile-desc').textContent = `Gediş: [${tile[0]}-${tile[1]}]`;
            document.getElementById('play-modal').classList.add('active');
        }
    }

    document.getElementById('modal-play-left').onclick = () => { game.saveState(); game.playTile(pendingTile, 'left'); document.getElementById('play-modal').classList.remove('active'); updateGameUI(); };
    document.getElementById('modal-play-right').onclick = () => { game.saveState(); game.playTile(pendingTile, 'right'); document.getElementById('play-modal').classList.remove('active'); updateGameUI(); };
    document.getElementById('modal-cancel').onclick = () => document.getElementById('play-modal').classList.remove('active');

    
    document.getElementById('btn-opp-played').onclick = () => {
        document.getElementById('opp-play-selector').style.display = 'block';
        renderOppPool();
    };
    
    function renderOppPool() {
        const oppPoolGrid = document.getElementById('opp-pool-grid');
        oppPoolGrid.innerHTML = '';
        const available = game.allDominos.filter(t => !game.isHand(t) && !game.isPlayed(t));
        
        available.forEach(t => {
            const isPlayable = game.getPlayableEnds(t).length > 0;
            const el = document.createElement('div');
            el.className = 'pool-wrapper';
            if(!isPlayable) el.style.opacity = '0.3';
            
            el.innerHTML = createDominoVisualHtml(t);
            el.onclick = () => {
                if(!isPlayable) {
                    if(!confirm("Sistemə görə bu daş masaya uyğun deyil. Yenə də oynanıldığını təsdiqləyirsiniz?")) return;
                }
                handleOppPlayTile(t);
            };
            oppPoolGrid.appendChild(el);
        });
    }

    function handleOppPlayTile(tile) {
        const ends = game.getPlayableEnds(tile);
        if(ends.length <= 1 || ends[0] === 'first') {
            game.saveState();
            if (game.playerCount === 4) {
                if (game.turn === 'p2') game.oppHands['P2'] -= 1;
                else if (game.turn === 'p3') game.oppHands['P3'] -= 1;
                else if (game.turn === 'p4') game.oppHands['P4'] -= 1;
            } else {
                game.oppHands['P2'] -= 1; 
            }
            game.playTile(tile, ends.length ? ends[0] : 'first'); 
            updateGameUI();
        } else {
            pendingTile = tile;
            document.getElementById('opp-modal-tile-desc').textContent = `[${tile[0]}-${tile[1]}]`;
            document.getElementById('opp-play-dir-modal').classList.add('active');
        }
    }

    document.getElementById('opp-modal-play-left').onclick = () => { 
        game.saveState(); 
        if (game.playerCount === 4) {
            if (game.turn === 'p2') game.oppHands['P2'] -= 1;
            else if (game.turn === 'p3') game.oppHands['P3'] -= 1;
            else if (game.turn === 'p4') game.oppHands['P4'] -= 1;
        } else {
            game.oppHands['P2'] -= 1; 
        }
        game.playTile(pendingTile, 'left'); 
        document.getElementById('opp-play-dir-modal').classList.remove('active'); 
        updateGameUI(); 
    };

    document.getElementById('opp-modal-play-right').onclick = () => { 
        game.saveState(); 
        if (game.playerCount === 4) {
            if (game.turn === 'p2') game.oppHands['P2'] -= 1;
            else if (game.turn === 'p3') game.oppHands['P3'] -= 1;
            else if (game.turn === 'p4') game.oppHands['P4'] -= 1;
        } else {
            game.oppHands['P2'] -= 1; 
        }
        game.playTile(pendingTile, 'right'); 
        document.getElementById('opp-play-dir-modal').classList.remove('active'); 
        updateGameUI(); 
    };

    document.getElementById('opp-modal-cancel').onclick = () => document.getElementById('opp-play-dir-modal').classList.remove('active');

    
    document.getElementById('btn-my-pass').onclick = () => {
        if (game.playerCount === 4) {
            game.saveState();
            game.playerPass();
            updateGameUI();
            return;
        }
        if(game.bazaarCount <= 0) {
            game.saveState();
            game.turn = 'opp';
            updateGameUI();
            return;
        }
        document.getElementById('my-bazaar-left').textContent = game.bazaarCount;
        renderMyBazaarPool();
        document.getElementById('my-bazaar-modal').classList.add('active');
    };

    function renderMyBazaarPool() {
        const myBazPool = document.getElementById('my-bazaar-pool');
        myBazPool.innerHTML = '';
        const available = game.allDominos.filter(t => !game.isHand(t) && !game.isPlayed(t));
        available.forEach(t => {
            const el = document.createElement('div');
            el.className = 'pool-wrapper';
            el.innerHTML = createDominoVisualHtml(t);
            el.onclick = () => {
                if(game.bazaarCount > 0) {
                    game.saveState();
                    game.bazaarCount--;
                    game.myHand.push(t);
                    
                    const ends = game.getPlayableEnds(t);
                    if(ends.length > 0) {
                        alert("Uyğun daş tapıldı! Pəncərəni bağlayıb həmin daşı masaya qoya bilərsiniz.");
                    }
                    
                    document.getElementById('my-bazaar-left').textContent = game.bazaarCount;
                    renderMyBazaarPool(); 
                    updateGameUI(); 
                }
            };
            myBazPool.appendChild(el);
        });
    }

    document.getElementById('btn-my-baz-pass').onclick = () => { game.saveState(); game.turn = 'opp'; document.getElementById('my-bazaar-modal').classList.remove('active'); updateGameUI(); };
    document.getElementById('btn-my-baz-close').onclick = () => document.getElementById('my-bazaar-modal').classList.remove('active');

    
    let currentBazDraws = 1;
    let selectedBazTile = null;
    
    document.getElementById('btn-opp-passed').onclick = () => {
        if (game.playerCount === 4) {
            game.saveState();
            game.playerPass();
            updateGameUI();
            return;
        }
        currentBazDraws = 1;
        selectedBazTile = null;
        document.getElementById('bazaar-draw-count').textContent = currentBazDraws;
        document.getElementById('bazaar-selected-tile-visual').innerHTML = '';
        
        if (game.bazaarCount === 0) {
            currentBazDraws = 0;
            document.getElementById('bazaar-draw-count').textContent = '0';
            document.getElementById('btn-baz-minus').disabled = true;
            document.getElementById('btn-baz-plus').disabled = true;
        } else {
            document.getElementById('btn-baz-minus').disabled = false;
            document.getElementById('btn-baz-plus').disabled = false;
        }
        document.getElementById('bazaar-modal').classList.add('active');
    };

    document.getElementById('btn-baz-plus').onclick = () => { if(currentBazDraws < game.bazaarCount) document.getElementById('bazaar-draw-count').textContent = ++currentBazDraws; };
    document.getElementById('btn-baz-minus').onclick = () => { if(currentBazDraws > 0) document.getElementById('bazaar-draw-count').textContent = --currentBazDraws; };

    document.getElementById('btn-baz-select-tile').onclick = () => {
        document.getElementById('baz-tile-selector-modal').classList.add('active');
        const bazPoolGrid = document.getElementById('baz-pool-grid');
        bazPoolGrid.innerHTML = '';
        const available = game.allDominos.filter(t => !game.isHand(t) && !game.isPlayed(t));
        
        available.forEach(t => {
            const isPlayable = game.getPlayableEnds(t).length > 0;
            const el = document.createElement('div');
            el.className = 'pool-wrapper';
            if(!isPlayable) el.style.opacity = '0.3';
            
            el.innerHTML = createDominoVisualHtml(t);
            el.onclick = () => {
                if(!isPlayable) if(!confirm("Sistemə görə bu daş masaya uyğun deyil. Yenə də seçmək istəyirsiniz?")) return;
                selectedBazTile = t;
                document.getElementById('bazaar-selected-tile-visual').innerHTML = createDominoVisualHtml(t);
                document.getElementById('baz-tile-selector-modal').classList.remove('active');
            };
            bazPoolGrid.appendChild(el);
        });
    };

    document.getElementById('btn-baz-tile-cancel').onclick = () => document.getElementById('baz-tile-selector-modal').classList.remove('active');

    document.getElementById('btn-baz-no-play').onclick = () => {
        game.saveState();
        game.oppDrawFromBazaar(currentBazDraws, false);
        document.getElementById('bazaar-modal').classList.remove('active');
        updateGameUI();
    };

    document.getElementById('btn-baz-confirm').onclick = () => {
        if (!selectedBazTile) {
            alert("Lütfən oynanılan daşı seçin və ya 'Daş tapılmadı' düyməsini vurun.");
            return;
        }
        game.saveState();
        game.oppDrawFromBazaar(currentBazDraws, true);
        const ends = game.getPlayableEnds(selectedBazTile);
        if(ends.length <= 1 || ends[0] === 'first') {
            game.playTile(selectedBazTile, ends.length ? ends[0] : 'first');
            document.getElementById('bazaar-modal').classList.remove('active');
            updateGameUI();
        } else {
            pendingTile = selectedBazTile;
            document.getElementById('opp-modal-tile-desc').textContent = `[${selectedBazTile[0]}-${selectedBazTile[1]}]`;
            document.getElementById('bazaar-modal').classList.remove('active');
            document.getElementById('opp-play-dir-modal').classList.add('active');
        }
    };

    document.getElementById('btn-baz-cancel').onclick = () => document.getElementById('bazaar-modal').classList.remove('active');

    function createDominoVisualHtml(tile, horizontal = false) {
        const hClass = horizontal ? 'horizontal' : '';
        return `
            <div class="domino-tile ${hClass}">
                <div class="domino-half">${createDots(tile[0])}</div>
                <div class="domino-divider-${horizontal ? 'v' : 'h'}"></div>
                <div class="domino-half">${createDots(tile[1])}</div>
            </div>
        `;
    }

    function createDots(num) {
        let dots = Array(9).fill('');
        if(num === 1) dots[4] = '<div class="dot"></div>';
        if(num === 2) { dots[0] = '<div class="dot"></div>'; dots[8] = '<div class="dot"></div>'; }
        if(num === 3) { dots[0] = '<div class="dot"></div>'; dots[4] = '<div class="dot"></div>'; dots[8] = '<div class="dot"></div>'; }
        if(num === 4) { dots[0] = '<div class="dot"></div>'; dots[2] = '<div class="dot"></div>'; dots[6] = '<div class="dot"></div>'; dots[8] = '<div class="dot"></div>'; }
        if(num === 5) { dots[0] = '<div class="dot"></div>'; dots[2] = '<div class="dot"></div>'; dots[4] = '<div class="dot"></div>'; dots[6] = '<div class="dot"></div>'; dots[8] = '<div class="dot"></div>'; }
        if(num === 6) { dots[0] = '<div class="dot"></div>'; dots[2] = '<div class="dot"></div>'; dots[3] = '<div class="dot"></div>'; dots[5] = '<div class="dot"></div>'; dots[6] = '<div class="dot"></div>'; dots[8] = '<div class="dot"></div>'; }
        return dots.map(d => `<div>${d}</div>`).join('');
    }

    renderSetupPool();
});
