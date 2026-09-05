/**
 * Jasmine tests for updatePlayerRun.
 *
 * SETUP ASSUMPTION
 * ----------------
 * updatePlayerRun and every function/value it calls out to
 * (hasPendingModuleNameEntry, getPlayerMetricNumber, selectedScoreMetricName,
 * isTrackedScoreReadAllowed, updateDemoTracking, isScoreStopScreen,
 * getScoreStopScreenHoldMs, preserveActiveScoreRun, finalizePlayerScore,
 * selectedScoreStopScreenNames, isTrackedScreen, isNewGameStartSignal,
 * resetPlayerRun, finishPendingModuleNameEntry, assignRandomPlayerRunName,
 * confirmNewGameResetSignal, updateSessionScore) are bare identifiers in the
 * source, i.e. globals. This spec assumes the source file is loaded as-is
 * (e.g. via a <script> tag in your Karma config, or any setup that attaches
 * these names to `window`) so that `updatePlayerRun` itself is never
 * redefined or copied here — only its collaborators are spied on directly on
 * `window`.
 */

describe('updatePlayerRun', () => {
  let player;

  function createPlayer(overrides = {}) {
    return {
      activeScreen: 'game',
      scoreStopScreenSince: null,
      runActive: false,
      currentScore: null,
      runRestartBlocked: false,
      finalizedScore: null,
      assignedRunName: null,
      currentGameScore: null,
      lastScore: null,
      newGameResetCandidate: null,
      demoKnown: false,
      ...overrides,
    };
  }

  beforeEach(() => {
    player = createPlayer();

    // Plain values read directly off window.
    window.selectedScoreMetricName = 'Score';
    window.selectedScoreStopScreenNames = [];

    // Spy on every outward call, with sensible defaults; individual tests
    // override as needed.
    spyOn(window, 'hasPendingModuleNameEntry').and.returnValue(false);
    spyOn(window, 'getPlayerMetricNumber').and.returnValue(null);
    spyOn(window, 'isTrackedScoreReadAllowed').and.returnValue(false);
    spyOn(window, 'updateDemoTracking');
    spyOn(window, 'isScoreStopScreen').and.returnValue(false);
    spyOn(window, 'getScoreStopScreenHoldMs').and.returnValue(5000);
    spyOn(window, 'preserveActiveScoreRun');
    spyOn(window, 'finalizePlayerScore');
    spyOn(window, 'isTrackedScreen').and.returnValue(true);
    spyOn(window, 'isNewGameStartSignal').and.returnValue(false);
    spyOn(window, 'resetPlayerRun');
    spyOn(window, 'finishPendingModuleNameEntry');
    spyOn(window, 'assignRandomPlayerRunName');
    spyOn(window, 'confirmNewGameResetSignal').and.returnValue(true);
    spyOn(window, 'updateSessionScore');

  });

  it('always calls updateDemoTracking exactly once, regardless of path', () => {
    updatePlayerRun(player, 'menu');
    expect(window.updateDemoTracking).toHaveBeenCalledOnceWith(player, 'menu');
  });

  describe('active screen is a score-stop screen', () => {
    beforeEach(() => {
      window.isScoreStopScreen.and.callFake((screen) => screen === player.activeScreen);
    });

    it('starts the stop timer and preserves the run when arriving from a non-stop screen', () => {
      player.scoreStopScreenSince = null;
      const before = Date.now();

      updatePlayerRun(player, 'previous-non-stop');

      expect(player.scoreStopScreenSince).not.toBeNull();
      expect(player.scoreStopScreenSince).toBeGreaterThanOrEqual(before);
      expect(window.preserveActiveScoreRun).toHaveBeenCalledOnceWith(player);
      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
    });

    it('starts the stop timer when scoreStopScreenSince is null even if previous screen was also a stop screen', () => {
      player.scoreStopScreenSince = null;
      window.isScoreStopScreen.and.returnValue(true); // previous screen also "stop"

      updatePlayerRun(player, 'previous-stop');

      expect(player.scoreStopScreenSince).not.toBeNull();
      expect(window.preserveActiveScoreRun).toHaveBeenCalledOnceWith(player);
    });

    it('preserves the run and returns while still within the hold window', () => {
      player.scoreStopScreenSince = Date.now() - 100;
      window.isScoreStopScreen.and.returnValue(true); // previous also stop screen
      window.getScoreStopScreenHoldMs.and.returnValue(5000);

      updatePlayerRun(player, 'previous-stop');

      expect(window.preserveActiveScoreRun).toHaveBeenCalledOnceWith(player);
      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
      expect(player.runActive).toBe(false); // unchanged default
    });

    it('finalizes an active run once the hold window has elapsed', () => {
      player.scoreStopScreenSince = Date.now() - 10000;
      player.runActive = true;
      player.currentScore = 150;
      window.isScoreStopScreen.and.returnValue(true);
      window.getScoreStopScreenHoldMs.and.returnValue(5000);

      updatePlayerRun(player, 'previous-stop');

      expect(window.finalizePlayerScore).toHaveBeenCalledOnceWith(player);
      expect(player.runActive).toBe(false);
      expect(player.runRestartBlocked).toBe(true);
    });

    it('does not finalize when the hold window has elapsed but no run was active', () => {
      player.scoreStopScreenSince = Date.now() - 10000;
      player.runActive = false;
      player.currentScore = null;
      window.isScoreStopScreen.and.returnValue(true);
      window.getScoreStopScreenHoldMs.and.returnValue(5000);

      updatePlayerRun(player, 'previous-stop');

      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
      expect(player.runActive).toBe(false);
      expect(player.runRestartBlocked).toBe(true);
    });
  });

  describe('untracked screen with no readable score', () => {
    it('preserves the run and returns when stop screens are configured', () => {
      window.selectedScoreStopScreenNames = ['GameOver'];
      window.isTrackedScreen.and.returnValue(false);

      updatePlayerRun(player, 'menu');

      expect(window.preserveActiveScoreRun).toHaveBeenCalledOnceWith(player);
      expect(player.scoreStopScreenSince).toBeNull();
    });

    it('blocks restart when waiting on a pending module name entry', () => {
      window.selectedScoreStopScreenNames = []; // skip the stop-screen-list branch
      window.hasPendingModuleNameEntry.and.returnValue(true);
      window.isTrackedScreen.and.returnValue(false);

      updatePlayerRun(player, 'menu');

      expect(player.runActive).toBe(false);
      expect(player.runRestartBlocked).toBe(true);
      expect(window.preserveActiveScoreRun).not.toHaveBeenCalled();
    });

    it('finalizes an active run and unblocks restart when nothing else applies', () => {
      window.selectedScoreStopScreenNames = [];
      window.hasPendingModuleNameEntry.and.returnValue(false);
      window.isTrackedScreen.and.returnValue(false);
      player.runActive = true;
      player.currentScore = 42;

      updatePlayerRun(player, 'menu');

      expect(window.finalizePlayerScore).toHaveBeenCalledOnceWith(player);
      expect(player.runActive).toBe(false);
      expect(player.runRestartBlocked).toBe(false);
    });

    it('does not finalize when no run was active in that same case', () => {
      window.selectedScoreStopScreenNames = [];
      window.hasPendingModuleNameEntry.and.returnValue(false);
      window.isTrackedScreen.and.returnValue(false);
      player.runActive = false;

      updatePlayerRun(player, 'menu');

      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
      expect(player.runActive).toBe(false);
      expect(player.runRestartBlocked).toBe(false);
    });
  });

  describe('while restart is blocked', () => {
    beforeEach(() => {
      player.runRestartBlocked = true;
    })

    it('returns without changes when stop screens are configured, and screen is neither tracking a value nor a is it a stop screen', () => {
      window.selectedScoreStopScreenNames = ['GameOver'];
      window.isTrackedScreen.and.returnValue(false);
      window.isScoreStopScreen.and.returnValue(false);
      window.isTrackedScoreReadAllowed.and.returnValue(true);
      window.getPlayerMetricNumber.and.returnValue(10) // canReadTrackedScore = true, so earlier branches are skipped

      updatePlayerRun(player, 'menu');

      expect(player.runRestartBlocked).toBe(true); // untouched
      expect(window.updateSessionScore).not.toHaveBeenCalled();
    });

    it('returns without changes when no new-game start signal is present', () => {
      window.isTrackedScreen.and.returnValue(true); // bypasses the earlier untracked-screen branches
      window.isNewGameStartSignal.and.returnValue(false);
      window.getPlayerMetricNumber.and.returnValue(10);
      player.runRestartBlocked = true;

      updatePlayerRun(player, 'menu');

      expect(player.runRestartBlocked).toBe(true);
      expect(window.updateSessionScore).not.toHaveBeenCalled();
    });

    it('unblocks restart when a new-game start signal is detected, then continues processing', () => {
      window.isTrackedScreen.and.returnValue(true);
      window.isNewGameStartSignal.and.returnValue(true);
      window.getPlayerMetricNumber.and.returnValue(10);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(0);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(0);
      player.runRestartBlocked = true;
      player.finalizedScore = 999; // combined with the signal, should trigger resetPlayerRun

      updatePlayerRun(player, 'menu');

      expect(window.resetPlayerRun).toHaveBeenCalledWith(player); // TODO: gets called twice because we ignore what resetPlayerRun does...
      expect(window.updateSessionScore).toHaveBeenCalled(); // fell through to the normal update path
    });
  });

  it('returns early once score is null, without touching session state', () => {
    window.isTrackedScreen.and.returnValue(true);
    player.runRestartBlocked = false;
    player.finalizedScore = null;

    updatePlayerRun(player, 'menu');

    expect(window.updateSessionScore).not.toHaveBeenCalled();
    expect(window.resetPlayerRun).not.toHaveBeenCalled();
  });

  describe('successful score update path', () => {
    beforeEach(() => {
      window.isTrackedScreen.and.returnValue(true);
    });

    it('resets and (re)activates the run when it was inactive with a previously finalized score', () => {
      window.getPlayerMetricNumber.and.returnValue(10);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(10);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(1);
      player.runActive = false;
      player.finalizedScore = 500;
      player.lastScore = null;

      updatePlayerRun(player, player.activeScreen);

      expect(window.resetPlayerRun).toHaveBeenCalledOnceWith(player);
      expect(player.runActive).toBe(true);
    });

    it('activates the run on a screen change even if it was already active', () => {
      window.getPlayerMetricNumber.and.returnValue(100);
      player.runActive = true;
      player.finalizedScore = null;

      updatePlayerRun(player, 'a-different-screen');

      expect(player.runActive).toBe(true);
    });

    it('finishes a pending module name entry and clears runRestartBlocked', () => {
      window.hasPendingModuleNameEntry.and.returnValue(true);
      window.isTrackedScoreReadAllowed.and.returnValue(true);
      window.getPlayerMetricNumber.and.returnValue(100);

      updatePlayerRun(player, player.activeScreen);

      expect(window.finishPendingModuleNameEntry).toHaveBeenCalledOnceWith(player);
      expect(player.runRestartBlocked).toBe(false);
    });

    it('assigns a run name when the player does not yet have one', () => {
      window.getPlayerMetricNumber.and.returnValue(100);
      player.assignedRunName = null;

      updatePlayerRun(player, player.activeScreen);

      expect(window.assignRandomPlayerRunName).toHaveBeenCalledOnceWith(player);
    });

    it('does not reassign a run name when the player already has one', () => {
      window.getPlayerMetricNumber.and.returnValue(100);
      player.assignedRunName = 'Existing Name';

      updatePlayerRun(player, player.activeScreen);

      expect(window.assignRandomPlayerRunName).not.toHaveBeenCalled();
    });

    it('updates currentGameScore when a game score is available', () => {
      window.getPlayerMetricNumber.and.returnValue(100);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(77);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(null);

      updatePlayerRun(player, player.activeScreen);

      expect(player.currentGameScore).toBe(77);
    });

    it('leaves currentGameScore untouched when no game score is available', () => {
      window.getPlayerMetricNumber.and.returnValue(10);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(null);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(null);

      player.currentGameScore = 55;

      updatePlayerRun(player, player.activeScreen);

      expect(player.currentGameScore).toBe(55);
    });

    it('preserves the run and returns when the score drops as part of an unconfirmed new-game signal', () => {
      window.getPlayerMetricNumber.and.returnValue(5);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(0);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(0);
      player.lastScore = 50;
      window.isNewGameStartSignal.and.returnValue(true);
      window.confirmNewGameResetSignal.and.returnValue(false);

      updatePlayerRun(player, player.activeScreen);

      expect(window.preserveActiveScoreRun).toHaveBeenCalledOnceWith(player);
      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
      expect(player.currentScore).toBeNull(); // never reached the assignment
      expect(window.updateSessionScore).not.toHaveBeenCalled();
    });

    it('finalizes, resets, and blocks restart when the score drop is a confirmed new-game signal', () => {
      window.getPlayerMetricNumber.and.returnValue(5);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(0);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(0);

      player.lastScore = 50;
      window.isNewGameStartSignal.and.returnValue(true);
      window.confirmNewGameResetSignal.and.returnValue(true);

      updatePlayerRun(player, player.activeScreen);

      expect(window.finalizePlayerScore).toHaveBeenCalledOnceWith(player);
      expect(window.resetPlayerRun).toHaveBeenCalledOnceWith(player);
      expect(player.runRestartBlocked).toBe(true);
      expect(window.updateSessionScore).not.toHaveBeenCalled();
    });

    it('falls through to a normal update when the score drops but is not a new-game signal', () => {
      window.getPlayerMetricNumber.and.returnValue(5);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(1);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(1);

      player.lastScore = 50;
      window.isNewGameStartSignal.and.returnValue(false);

      updatePlayerRun(player, player.activeScreen);

      expect(window.finalizePlayerScore).not.toHaveBeenCalled();
      expect(window.resetPlayerRun).not.toHaveBeenCalled();
      expect(player.currentScore).toBe(5);
      expect(player.lastScore).toBe(5);
      expect(window.updateSessionScore).toHaveBeenCalled();
    });

    it('performs the full happy-path update: session score, run state, and finalizedScore reset', () => {
      window.getPlayerMetricNumber.and.returnValue(200);
      window.getPlayerMetricNumber.withArgs(player, "Score").and.returnValue(20);
      window.getPlayerMetricNumber.withArgs(player, "Lines").and.returnValue(null);

      player.demoKnown = true;
      player.currentGameScore = 20;
      player.finalizedScore = 999; // should be cleared
      player.newGameResetCandidate = 'stale-candidate';

      updatePlayerRun(player, player.activeScreen);

      expect(player.newGameResetCandidate).toBeNull();
      expect(player.currentScore).toBe(200);
      expect(player.lastScore).toBe(200);
      expect(player.runRestartBlocked).toBe(false);
      expect(player.finalizedScore).toBeNull();
      expect(window.updateSessionScore).toHaveBeenCalledOnceWith(player, 200, {
        demo: true,
        gameScore: 20,
      });
    });
  });
});
