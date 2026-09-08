class Helper {
  static TWO_PLAYER_LEADERBOARD_PREFIX = "gbOcrHelper.twoPlayerLeaderboard.";

  // Gets todays date as yyyy-mm-dd
  static getTodayDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  static getTodayLeaderboardKey() {
    return Helper.getLeaderBoardKey(Helper.getTodayDateKey());
  }

  static getLeaderboardStorageKey(dateKey) {
    return Helper.getLeaderBoardKey(dateKey)
  }

  static getLeaderBoardKey(dateKey) {
    return `${Helper.TWO_PLAYER_LEADERBOARD_PREFIX}${dateKey}`;
  }
}
