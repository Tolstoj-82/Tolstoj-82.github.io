describe ('Helper', () => {
  // We do not test if the day is correct otherwise we would just rewrite
  // the function itself
  it('returns correct format', () => {
    const result = Helper.getTodayDateKey()
    const re = /\d\d\d\d-\d\d-\d\d/
    expect(re.test(result)).toBeTrue(result)
  })

  it('returns leaderboard key', () => {
    const result = Helper.getLeaderboardStorageKey("2026-09-03")
    const re = /(.*)\d\d\d\d-\d\d-\d\d/
    expect(re.test(result)).toBeTrue(result)
  })

  // TODO: This should be fixed to a sensible result like raising an error
  it('returns leaderboard key with undefined at the end', () => {
    const result = Helper.getLeaderboardStorageKey()
    const re = /(.*)undefined/
    expect(re.test(result)).toBeTrue(result)
  })

  it('returns todays leaderboard key', () => {
    const result = Helper.getTodayLeaderboardKey()
    const re = /(.*)\d\d\d\d-\d\d-\d\d/
    expect(re.test(result)).toBeTrue(result)
  })
});

const TILE = 8
describe ('Normalizer', () => {
  describe("Normalizer.normalizeScanPixels", () => {
    const MAX_INDEX = TILE * TILE; // exclusive upper bound

    describe("non-array input", () => {
      it("returns an empty array when input is null", () => {
        expect(Normalizer.normalizeScanPixels(null)).toEqual([]);
      });

      it("returns an empty array when input is undefined", () => {
        expect(Normalizer.normalizeScanPixels(undefined)).toEqual([]);
      });

      it("returns an empty array when input is a string", () => {
        expect(Normalizer.normalizeScanPixels("1,2,3")).toEqual([]);
      });

      it("returns an empty array when input is a number", () => {
        expect(Normalizer.normalizeScanPixels(5)).toEqual([]);
      });

      it("returns an empty array when input is an object", () => {
        expect(Normalizer.normalizeScanPixels({ 0: 1, 1: 2 })).toEqual([]);
      });
    });

    describe("empty array input", () => {
      it("returns an empty array when given an empty array", () => {
        expect(Normalizer.normalizeScanPixels([])).toEqual([]);
      });
    });

    describe("valid integer filtering", () => {
      it("keeps values within range [0, TILE*TILE)", () => {
        expect(Normalizer.normalizeScanPixels([0, 1, MAX_INDEX - 1])).toEqual(
          [0, 1, MAX_INDEX - 1]
        );
      });

      it("excludes negative values", () => {
        expect(Normalizer.normalizeScanPixels([-1, 0, 5])).toEqual([0, 5]);
      });

      it("excludes values equal to TILE*TILE (out of bounds, exclusive)", () => {
        expect(Normalizer.normalizeScanPixels([MAX_INDEX, 3])).toEqual([3]);
      });

      it("excludes values greater than TILE*TILE", () => {
        expect(Normalizer.normalizeScanPixels([MAX_INDEX + 100, 2])).toEqual([2]);
      });

      it("excludes non-integer (float) values", () => {
        expect(Normalizer.normalizeScanPixels([1.5, 2.9, 3])).toEqual([3]);
      });

      it("excludes NaN values (e.g. from non-numeric strings)", () => {
        expect(Normalizer.normalizeScanPixels(["foo", 2, "bar"])).toEqual([2]);
      });
    });

    describe("type coercion via Number()", () => {
      it("coerces numeric strings to numbers", () => {
        expect(Normalizer.normalizeScanPixels(["1", "2", "3"])).toEqual([1, 2, 3]);
      });

      it("coerces booleans to numbers (true -> 1, false -> 0)", () => {
        expect(Normalizer.normalizeScanPixels([true, false])).toEqual([0, 1]);
      });

      it("coerces null within the array to 0", () => {
        expect(Normalizer.normalizeScanPixels([null, 5])).toEqual([0, 5]);
      });

      it("treats undefined within the array as NaN and excludes it", () => {
        expect(Normalizer.normalizeScanPixels([undefined, 5])).toEqual([5]);
      });
    });

    describe("deduplication", () => {
      it("removes duplicate values", () => {
        expect(Normalizer.normalizeScanPixels([1, 1, 2, 2, 3])).toEqual([1, 2, 3]);
      });

      it("deduplicates values that are equal after coercion (number vs string)", () => {
        expect(Normalizer.normalizeScanPixels([1, "1", 2])).toEqual([1, 2]);
      });
    });

    describe("sorting", () => {
      it("returns results sorted in ascending numeric order", () => {
        expect(Normalizer.normalizeScanPixels([5, 1, 4, 2, 3])).toEqual([1, 2, 3, 4, 5]);
      });

      it("sorts numerically, not lexicographically (e.g. 2 before 10)", () => {
        expect(Normalizer.normalizeScanPixels([10, 2, 1])).toEqual([1, 2, 10]);
      });
    });

    describe("combined behavior", () => {
      it("dedupes, filters out-of-range/invalid values, and sorts together", () => {
        const input = [10, -5, "10", 3.5, "3", MAX_INDEX, 0, "abc", 7, 7];
        // valid distinct integers in range: 10, 3, 0, 7
        expect(Normalizer.normalizeScanPixels(input)).toEqual([0, 3, 7, 10]);
      });
    });
  });

  describe("#normalizeScoreStopScreens", () => {
    const screens = {
      screens: [
        { name: "intro" },
        { name: "level1" },
        { name: "level2" },
        { name: "gameOver" },
      ],
    };

    describe("array input", () => {
      it("normalizes each item in the array", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          ["intro", "level1", "level2"],
          screens
        );
        expect(result).toEqual(["intro", "level1", "level2"]);
      });

      it("filters out items that don't match a valid screen name", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          ["intro", "nonexistent", "level1"],
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });

      it("removes duplicate screen names", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          ["intro", "level1", "intro", "level1"],
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });

      it("returns an empty array when all items are invalid", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          ["foo", "bar"],
          screens
        );
        expect(result).toEqual([]);
      });

      it("returns an empty array when given an empty array", () => {
        const result = Normalizer.normalizeScoreStopScreens([], screens);
        expect(result).toEqual([]);
      });

      it("filters out empty/falsy items within the array", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          ["intro", "", null, undefined, "level1"],
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });
    });

    describe("comma-separated string input", () => {
      it("splits a comma-separated string into normalized screen names", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          "intro,level1,level2",
          screens
        );
        expect(result).toEqual(["intro", "level1", "level2"]);
      });

      it("trims whitespace around each comma-separated item", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          " intro , level1 ,level2 ",
          screens
        );
        expect(result).toEqual(["intro", "level1", "level2"]);
      });

      it("removes duplicates from a comma-separated string", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          "intro,level1,intro",
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });

      it("filters out invalid screen names from a comma-separated string", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          "intro,nonexistent,level1",
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });

      it("handles a single screen name string with no commas", () => {
        const result = Normalizer.normalizeScoreStopScreens("intro", screens);
        expect(result).toEqual(["intro"]);
      });

      it("returns an empty array for an empty string", () => {
        const result = Normalizer.normalizeScoreStopScreens("", screens);
        expect(result).toEqual([]);
      });

      it("collapses consecutive commas / empty segments into nothing", () => {
        const result = Normalizer.normalizeScoreStopScreens(
          "intro,,level1,",
          screens
        );
        expect(result).toEqual(["intro", "level1"]);
      });
    });

    describe("non-string, non-array input", () => {
      it("returns an empty array when value is null", () => {
        const result = Normalizer.normalizeScoreStopScreens(null, screens);
        expect(result).toEqual([]);
      });

      it("returns an empty array when value is undefined", () => {
        const result = Normalizer.normalizeScoreStopScreens(undefined, screens);
        expect(result).toEqual([]);
      });

      it("returns an empty array when value is 0", () => {
        const result = Normalizer.normalizeScoreStopScreens(0, screens);
        expect(result).toEqual([]);
      });

      it("coerces a number matching a screen name to a string result", () => {
        const gameData = { screens: [{ name: "123" }] };
        const result = Normalizer.normalizeScoreStopScreens(123, gameData);
        expect(result).toEqual(["123"]);
      });
    });

    describe("malformed gameData", () => {
      it("returns an empty array when gameData.screens is missing", () => {
        const result = Normalizer.normalizeScoreStopScreens("intro,level1", {});
        expect(result).toEqual([]);
      });

      it("returns an empty array when gameData is null", () => {
        const result = Normalizer.normalizeScoreStopScreens("intro,level1", null);
        expect(result).toEqual([]);
      });
    });

    describe("delegation to normalizeScoreStopScreen", () => {
      it("calls Normalizer.normalizeScoreStopScreen once per item", () => {
        spyOn(Normalizer, "normalizeScoreStopScreen").and.callThrough();

        Normalizer.normalizeScoreStopScreens(["intro", "level1"], screens);

        expect(Normalizer.normalizeScoreStopScreen).toHaveBeenCalledTimes(2);
        expect(Normalizer.normalizeScoreStopScreen).toHaveBeenCalledWith("intro", screens);
        expect(Normalizer.normalizeScoreStopScreen).toHaveBeenCalledWith("level1", screens);
      });

      it("uses the per-item result from normalizeScoreStopScreen for filtering/dedup", () => {
        spyOn(Normalizer, "normalizeScoreStopScreen").and.callFake((item) =>
          item === "dup" ? "normalized" : ""
        );

        const result = Normalizer.normalizeScoreStopScreens(
          ["dup", "dup", "other"],
          screens
        );

        expect(result).toEqual(["normalized"]);
      });
    });
  });

  describe("#normalizeScoreStopScreen", () => {

    const screens = {
      screens: [
        { name: "intro" },
        { name: "level1" },
        { name: "gameOver" },
      ],
    };

    describe("falsy / empty value handling", () => {
      it("returns '' (empty string) when value is undefined", () => {
        expect(Normalizer.normalizeScoreStopScreen(undefined, screens)).toBe("");
      });

      it("returns '' (empty string) when value is null", () => {
        expect(Normalizer.normalizeScoreStopScreen(null, screens)).toBe("");
      });

      it("returns '' (empty string) when value is an empty string", () => {
        expect(Normalizer.normalizeScoreStopScreen("", screens)).toBe("");
      });

      it("returns '' (empty string) when value is 0", () => {
        expect(Normalizer.normalizeScoreStopScreen(0, screens)).toBe("");
      });

      it("returns '' (empty string) when value is false", () => {
        expect(Normalizer.normalizeScoreStopScreen(false, screens)).toBe("");
      });
    });

    describe("matching against screens.screens", () => {
      it("returns the value when it matches an existing screen name", () => {
        expect(Normalizer.normalizeScoreStopScreen("level1", screens)).toBe("level1");
      });

      it("returns '' (empty string) when the value does not match any screen name", () => {
        expect(Normalizer.normalizeScoreStopScreen("nonexistent", screens)).toBe("");
      });

      it("is case-sensitive when matching screen names", () => {
        expect(Normalizer.normalizeScoreStopScreen("Level1", screens)).toBe("");
      });
    });

    describe("non-string value coercion", () => {
      it("coerces numeric values to string before comparing", () => {
        const screens = { screens: [{ name: "123" }] };
        expect(Normalizer.normalizeScoreStopScreen(123, screens)).toBe("123");
      });

      it("returns '' for a numeric value with no matching screen name", () => {
        expect(Normalizer.normalizeScoreStopScreen(123, screens)).toBe("");
      });
    });

    describe("malformed screens", () => {
      it("returns '' when screens is null", () => {
        expect(Normalizer.normalizeScoreStopScreen("level1", null)).toBe("");
      });

      it("returns '' when screens has no screens property", () => {
        expect(Normalizer.normalizeScoreStopScreen("level1", {})).toBe("");
      });

      it("returns '' when screens.screens is an empty array", () => {
        expect(Normalizer.normalizeScoreStopScreen("level1", { screens: [] })).toBe("");
      });

      it("returns '' when screens.screens is not an array (e.g. null)", () => {
        expect(Normalizer.normalizeScoreStopScreen("level1", { screens: null })).toBe("");
      });
    });
  });

  describe("#normalizeScoreDemoStartValue", () => {
    // TODO: I feel like it would be better to move the parsing outside
    // of not_used outside of this function
    describe("with parseScoreDemoSequence mocked", () => {
      const not_used = "not used" // As we mock the value anyway we don't need it to be sensical
      beforeEach(() => {
        spyOn(Normalizer, "parseScoreDemoSequence");
      });

      it("returns empty string when sequence is empty", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([]);
        expect(Normalizer.normalizeScoreDemoStartValue(5, not_used)).toBe("");
      });

      it("returns the value as string when it exists in the sequence", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue(2, not_used)).toBe("2");
      });

      it("returns the first sequence item when value is not in the sequence", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue(99, not_used)).toBe("1");
      });

      it("returns the first sequence item when value is a string", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue("foo", not_used)).toBe("1");
      });

      it("returns the first sequence item when value is Infinity", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue(Infinity, not_used)).toBe("1");
      });

      it("returns the first sequence item when value is undefined", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue(undefined, not_used)).toBe("1");
      });

      it("matches value 0 correctly when 0 is in the sequence", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([0, 1, 2]);
        expect(Normalizer.normalizeScoreDemoStartValue(0, not_used)).toBe("0");
      });

      it("coerces numeric strings before matching", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([1, 2, 3]);
        expect(Normalizer.normalizeScoreDemoStartValue("2", not_used)).toBe("2");
      });

      it("falls back to first item when sequence has one element and value differs", () => {
        Normalizer.parseScoreDemoSequence.and.returnValue([5]);
        expect(Normalizer.normalizeScoreDemoStartValue(1, not_used)).toBe("5");
      });

    });

    describe("integration with real parseScoreDemoSequence", () => {

      it("returns matching value from a real sequence string", () => {
        expect(Normalizer.normalizeScoreDemoStartValue(2, "1,2,3")).toBe("2");
      });

      it("falls back to first item for a value not in a real sequence string", () => {
        expect(Normalizer.normalizeScoreDemoStartValue(10, "1,2,3")).toBe("1");
      });

      it("returns empty string for an empty sequence input", () => {
        expect(Normalizer.normalizeScoreDemoStartValue(1, "")).toBe("");
      });

    });

  });

  describe("#Normalizer.normalizeScoreDemoSequenceInput", () => {
    // We do not check the string route. It is fully covered by #parseScoreDemoSequence

    it("converts an array of numbers to a joined string", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([1, 2, 3])).toBe("1, 2, 3");
    });

    it("converts an array of numeric strings to a joined string", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput(["1", "2", "3"])).toBe("1, 2, 3");
    });

    it("trims and converts strings with whitespace", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([" 1 ", " 2 "])).toBe("1, 2");
    });

    it("filters out non-numeric entries", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([1, "foo", 2])).toBe("1, 2");
    });

    it("filters out NaN and Infinity", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([1, NaN, Infinity, 2])).toBe("1, 2");
    });

    it("filters out null and undefined entries", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([1, null, undefined, 2])).toBe("1, 2");
    });

    it("handles decimals and negatives", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([-1, 2.5, 3])).toBe("-1, 2.5, 3");
    });

    it("returns an empty string for an empty array", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([])).toBe("");
    });

    it("returns an empty string when all entries are invalid", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput(["foo", null, undefined])).toBe("");
    });

    it("treats empty string entries as 0", () => {
      // Number("") === 0, so empty strings are NOT filtered out
      expect(Normalizer.normalizeScoreDemoSequenceInput(["", 1])).toBe("0, 1");
    });

    it("treats boolean entries as numbers", () => {
      // Number(true) === 1, Number(false) === 0
      expect(Normalizer.normalizeScoreDemoSequenceInput([true, false])).toBe("1, 0");
    });

    it("handles a single-item array", () => {
      expect(Normalizer.normalizeScoreDemoSequenceInput([42])).toBe("42");
    });

  });

  describe("#parseScoreDemoSequence", () => {
    it("parses a simple comma-separated string", () => {
      expect(Normalizer.parseScoreDemoSequence("1,2,3")).toEqual([1, 2, 3]);
    });

    it("strips surrounding square brackets", () => {
      expect(Normalizer.parseScoreDemoSequence("[1,2,3]")).toEqual([1, 2, 3]);
    });

    it("trims whitespace around numbers", () => {
      expect(Normalizer.parseScoreDemoSequence(" 1 , 2 , 3 ")).toEqual([1, 2, 3]);
    });

    it("ignores empty entries from consecutive commas", () => {
      expect(Normalizer.parseScoreDemoSequence("1,,2")).toEqual([1, 2]);
    });

    it("ignores empty entries from trailing/leading commas", () => {
      expect(Normalizer.parseScoreDemoSequence(",1,2,")).toEqual([1, 2]);
    });

    it("filters out non-numeric entries", () => {
      expect(Normalizer.parseScoreDemoSequence("1,foo,2")).toEqual([1, 2]);
    });

    it("filters out NaN and Infinity", () => {
      expect(Normalizer.parseScoreDemoSequence("1,NaN,Infinity,2")).toEqual([1, 2]);
    });

    it("parses negative and decimal numbers", () => {
      expect(Normalizer.parseScoreDemoSequence("-1,2.5,3")).toEqual([-1, 2.5, 3]);
    });

    it("returns an empty array for an empty string", () => {
      expect(Normalizer.parseScoreDemoSequence("")).toEqual([]);
    });

    it("returns an empty array for null", () => {
      expect(Normalizer.parseScoreDemoSequence(null)).toEqual([]);
    });

    it("returns an empty array for undefined", () => {
      expect(Normalizer.parseScoreDemoSequence(undefined)).toEqual([]);
    });

    it("returns an empty array for only brackets", () => {
      expect(Normalizer.parseScoreDemoSequence("[]")).toEqual([]);
    });

    it("handles a single number", () => {
      expect(Normalizer.parseScoreDemoSequence("42")).toEqual([42]);
    });
  });
  // We do not test if the day is correct otherwise we would just rewrite
  // the function itself
  describe('#normalizeAllTimeCarouselInterval', () => {
    it('returns 1 when 0 is passed', () => {
      const result = Normalizer.normalizeAllTimeCarouselInterval(0)
      expect(result).toBe(1)
    })

    it('returns 3600 when 3700 is passed', () => {
      const result = Normalizer.normalizeAllTimeCarouselInterval(3700)
      expect(result).toBe(3600)
    })

    it('returns 30 when 30 is passed', () => {
      const result = Normalizer.normalizeAllTimeCarouselInterval(30)
      expect(result).toBe(30)
    })

    it('returns default value when a is passed', () => {
      const result = Normalizer.normalizeAllTimeCarouselInterval('a')
      expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS)
    })

    it('returns default value when Infinite is passed', () => {
      const result = Normalizer.normalizeAllTimeCarouselInterval(Number.POSITIVE_INFINITY)
      expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS)
    })
  })

  describe('#normalizeAllTimeCarouselDuration', () => {
    describe('returns -1 when a is passed and second param is -1', () => {
      it('CHECK: Fix code!', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration('a', -1)
        expect(result).toBe(-1)
      })
    })

    describe('using default second param (which is set to 6)', () => {
      it('returns 1 when 0 is passed', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration(0)
        expect(result).toBe(1)
      })

      it('returns 6 when 700 is passed', () => {
        // Max value of 600 should have no effect
        const result = Normalizer.normalizeAllTimeCarouselDuration(700)
        expect(result).toBe(6)
      })

      it('returns 6 when 30 is passed', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration(30)
        expect(result).toBe(6)
      })

      it('returns 5 when 5 is passed', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration(5)
        expect(result).toBe(5)
      })

      it('returns default value when a is passed', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration('a')
        expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
      })

      it('returns default value when Infinite is passed', () => {
        const result = Normalizer.normalizeAllTimeCarouselDuration(Number.POSITIVE_INFINITY)
        expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
      })

      describe('change second param to 10', () => {
        it('returns 1 when 0 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(0, 10)
          expect(result).toBe(1)
        })

        it('returns 10 when 700 is passed', () => {
          // Max value of 600 should have no effect
          const result = Normalizer.normalizeAllTimeCarouselDuration(700, 10)
          expect(result).toBe(10)
        })

        it('returns 10 when 30 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(30, 10)
          expect(result).toBe(10)
        })

        it('returns 9 when 9 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(9, 10)
          expect(result).toBe(9)
        })

        it('returns default value when a is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration('a', 10)
          expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
        })

        it('returns default value when Infinite is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(Number.POSITIVE_INFINITY, 10)
          expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
        })
      })

      describe('change second param to 700', () => {
        it('returns 1 when 0 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(0, 700)
          expect(result).toBe(1)
        })

        it('returns 600 when 700 is passed', () => {
          // Max value of 600 should be in effect
          const result = Normalizer.normalizeAllTimeCarouselDuration(700, 700)
          expect(result).toBe(600)
        })

        it('returns 30 when 30 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(30, 700)
          expect(result).toBe(30)
        })

        it('returns 9 when 9 is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(9, 700)
          expect(result).toBe(9)
        })

        it('returns default value when a is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration('a', 700)
          expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
        })

        it('returns default value when Infinite is passed', () => {
          const result = Normalizer.normalizeAllTimeCarouselDuration(Number.POSITIVE_INFINITY, 700)
          expect(result).toBe(Normalizer.DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS)
        })
      })
    })
  })
});
