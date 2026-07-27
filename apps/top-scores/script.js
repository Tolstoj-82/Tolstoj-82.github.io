// ==========================================================
    // CONFIGURATION
    // ==========================================================

    const SPREADSHEET_ID =
      '1PJZ50b5Y6RqHNW1PH5BFn-wvc7IPxu3m0JastDksMtQ';

    // Kept from your current file.
    const SHEETS = [
      { tab: 'LVL 9', title: 'Level 9 Highscore' },
      { tab: 'LVL A-J', title: 'Highscore Level A-J' },
      { tab: 'LVL 9 ♥', title: 'Level 9♥ Highscore' },
      { tab: 'LVL K', title: 'Level K Highscore' },
      { tab: 'LVL L', title: 'Level L Highscore' },
      { tab: 'LVL M', title: 'Level M Highscore' },
      { tab: 'LINES', title: 'Most Lines reached' },
      { tab: 'LVL 10 TR', title: 'Transition into Level 10 Highscore' },
      { tab: 'LVL 20 TR', title: 'Transition into Level 20 Highscore' },
      { tab: 'CAP 300', title: '300 Lines Cap Highscore' },
      { tab: 'EARL MAX', title: 'Earliest Maxout (Lines)' },
      { tab: 'Awaytris', title: 'Awaytris Highscore (Traintris, Planetris, Cartris...)' },
      { tab: 'B 19-5', title: 'B-Type 9♥-5' },
      { tab: 'B 20-4', title: 'B-Type K-4' },
      { tab: 'B 20-5', title: 'B-Type K-5' },
      { tab: 'SR 30 L', title: 'Speedrun 30 lines' },
      { tab: 'SR 40 L', title: 'Speedrun 40 lines' },
      { tab: 'SR 100 L', title: 'Speedrun 100 lines' },
      { tab: 'SR 100 L LVL 0', title: 'Speedrun 100 lines from a Level 0 start' },
      { tab: 'Gamescom24', title: 'Gamescom 2024 Highscore' },
    ];

    const GROUPS = [
      {
        id: 'highscores',
        title: 'Highscores',
        sheets: [
          'LVL 9', 'LVL A-J', 'LVL 9 ♥', 'LVL K', 'LVL L', 'LVL M',
          'CAP 300', 'Awaytris', 'Gamescom24'
        ]
      },
      {
        id: 'lines',
        title: 'Lines',
        sheets: [
          'LINES', 'EARL MAX', 'SR 30 L', 'SR 40 L', 'SR 100 L',
          'SR 100 L LVL 0'
        ]
      },
      {
        id: 'transitions',
        title: 'Transitions',
        sheets: ['LVL 10 TR', 'LVL 20 TR']
      },
      {
        id: 'b-type',
        title: 'B-Type',
        sheets: ['B 19-5', 'B 20-4', 'B 20-5']
      }
    ];

    const HEADERS = {
      name: ['name', 'player', 'participant', 'contestant'],
      score: ['score', 'points', 'point', 'total', 'value'],
      lines: ['lines', 'line'],
      platform: ['platform', 'system', 'console'],
      style: ['style', 'playstyle', 'play style', 'technique'],
      proof: ['proof'],
      date: ['date', 'submitted', 'submission date'],
      notes: ['notes', 'note', 'comment', 'comments'],
      proofLink: ['proof link', 'link', 'proof url', 'url']
    };

    const MEDALS = ['🥇', '🥈', '🥉'];

    // Keep every distinct source spelling once, before canonicalizing aliases.
    const RAW_PLAYERS = new Map();
    let lastChartTrigger = null;
    const PLAYER_DIRECTORY = new Map();
    let PLAYER_COUNTRIES = {};

    const PLAYER_ALIASES = {
      'Zircon': [
        'Zircon D'
      ],

      'Blue Scuti': [
        'Blue_Scuti',
        'BlueScuti'
      ],

      'Creepercraftyt': [
        'Creepercraft'
      ],

      'Duży K': [
        'Duzy K'
      ],

      'IceBlade73': [
        'IceBlade'
      ],

      'M-J': [
        'm minus j'
      ],

      'MarkTris': [
        'MarkTrisFromHungary'
      ],

      'minertyler': [
        'Minertyler100'
      ],

      'Mr.Faq': [
        'Mr FAQ'
      ]
    };

    // Categories where the leaderboard metric comes from the Lines column.
    const LINES_METRIC_SHEETS = new Set([
      'lines',
      'earl max'
    ]);

    // Legacy timing: hexadecimal frame field + 61 fps.
    // SR 30 L uses this format for every entry.
    const LEGACY_HEX_TIME_SHEETS = new Set([
      'sr 30 l'
    ]);

    function getPlayerAliases(name) {
      const canonical = canonicalPlayerName(name);
      return PLAYER_ALIASES[canonical] || [];
    }

    function formatPlayerWithAliases(name) {
      const aliases = getPlayerAliases(name);

      if (!aliases.length) {
        return escapeHtml(name);
      }

      return `
        ${escapeHtml(name)}
        <span class="player-aliases">
          (aka. ${aliases.map(escapeHtml).join(', ')})
        </span>
      `;
    }

    function canonicalPlayerName(name) {
      const raw = String(name || '').trim();
      const input = normalize(raw);

      for (const [canonical, aliases] of Object.entries(PLAYER_ALIASES)) {
        if (normalize(canonical) === input) {
          return canonical;
        }

        if (aliases.some(alias => normalize(alias) === input)) {
          return canonical;
        }
      }

      return raw;
    }

    async function loadPlayerDirectory() {
      let data;

      try {
        if (location.protocol === 'file:') {
          data = window.PLAYER_DATA;
        } else {
          const response = await fetch(
            '../../assets/data/players.json?v=20260727-2'
          );
          if (!response.ok) {
            throw new Error(`Player data returned ${response.status}`);
          }
          data = await response.json();
        }
      } catch (error) {
        data = window.PLAYER_DATA;
      }

      if (!data) return;
      const players = Array.isArray(data) ? data : data.players || [];
      PLAYER_COUNTRIES = data.countries || {};

      players.forEach(player => {
        const names = [
          player.name,
          ...(player.aliases || [])
        ];
        const parenthetical = String(player.name || '').match(
          /^(.+?)\s*\((.+)\)$/
        );
        if (parenthetical) {
          names.push(parenthetical[1], parenthetical[2]);
        }
        names.forEach(name => {
          const key = normalize(name);
          if (!key) return;
          PLAYER_DIRECTORY.set(key, player);
          const compactKey = key.replace(/[^a-z0-9]+/g, '');
          if (compactKey && !PLAYER_DIRECTORY.has(compactKey)) {
            PLAYER_DIRECTORY.set(compactKey, player);
          }
        });
      });
    }

    function mappedPlayer(name) {
      return (
        PLAYER_DIRECTORY.get(normalize(name)) ||
        PLAYER_DIRECTORY.get(normalize(canonicalPlayerName(name))) ||
        PLAYER_DIRECTORY.get(
          normalize(name).replace(/[^a-z0-9]+/g, '')
        )
      );
    }

    function formatPlayerFlag(name) {
      const player = mappedPlayer(name);
      const country = player?.country || 'unknown';
      const countryName = PLAYER_COUNTRIES[country] || 'Unknown';
      return `
        <img
          class="ranking-player-flag"
          src="../../assets/images/flags/${escapeAttribute(country)}.svg"
          alt="${escapeAttribute(`Flag of ${countryName}`)}"
          title="${escapeAttribute(countryName)}"
          loading="lazy"
        >
      `;
    }

    // SR categories use Score, but Score represents elapsed time.
    // Therefore lower values rank better.
    function isTimeCategory(sheetName) {
      return /^sr\b/i.test(sheetName.trim());
    }

    function isBTypeCategory(sheetName) {
      return /^b\s/i.test(String(sheetName || '').trim());
    }

    // ==========================================================
    // LOAD
    // ==========================================================

    async function loadLeaderboards() {
      const root = document.getElementById('leaderboards');
      const playerDirectoryPromise = loadPlayerDirectory();

      const results = await Promise.all(
        SHEETS.map(async sheet => {
          try {
            return await loadSheet(sheet.tab, sheet.title);
          } catch (error) {
            console.error(`Failed to load "${sheet.tab}"`, error);
            return {
              category: sheet.title,
              sheetName: sheet.tab,
              rows: [],
              error: true
            };
          }
        })
      );
      await playerDirectoryPromise;

      document.getElementById('rankingsLoading')?.setAttribute('hidden', '');
      document.getElementById('medal-standings')?.removeAttribute('hidden');
      document.getElementById('leaderboards')?.removeAttribute('hidden');
      renderMedalStandings(results);
      render(results);

      const uniquePlayers = getUniquePlayers();
      window.uniquePlayers = uniquePlayers;

      const copyButton = document.getElementById('copyPlayersButton');
      const copyFeedback = document.getElementById('copyPlayersFeedback');

      if (copyButton) {
        copyButton.disabled = uniquePlayers.length === 0;
      }

      if (copyFeedback) {
        copyFeedback.textContent =
          `${uniquePlayers.length} unique source name${uniquePlayers.length === 1 ? '' : 's'}`;
      }
}

    function loadSheet(sheetName, displayTitle) {
      /*
        JSONP avoids the CORS problem from fetch().
      */
      return new Promise((resolve, reject) => {
        const callbackName =
          '__sheetCallback_' +
          Date.now() + '_' +
          Math.random().toString(36).slice(2);

        const script = document.createElement('script');

        const cleanup = () => {
          delete window[callbackName];
          script.remove();
        };

        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error(`Timed out loading "${sheetName}"`));
        }, 15000);

        window[callbackName] = data => {
          clearTimeout(timeout);

          try {
            if (!data || data.status === 'error') {
              throw new Error(
                data?.errors?.map(error => error.message).join(', ') ||
                'Google Sheets query failed'
              );
            }

            const columns = data.table.cols.map((column, index) => ({
              index,
              label: normalize(column.label || column.id || '')
            }));

            const col = {};
            for (const [key, aliases] of Object.entries(HEADERS)) {
              col[key] = findColumn(columns, aliases);
            }

            if (col.name === -1) {
              throw new Error('Could not identify Name column');
            }

            const useLines = LINES_METRIC_SHEETS.has(normalize(sheetName));
            const isBType = isBTypeCategory(sheetName);
            const metricColumn = useLines ? col.lines : col.score;

            if (
              metricColumn === -1 &&
              !(isBType && col.lines !== -1)
            ) {
              throw new Error(
                `Could not identify ${useLines ? 'Lines' : 'Score'} column`
              );
            }

            const rows = data.table.rows
              .map(row => {
                const cells = row.c || [];

                const scoreCell = col.score !== -1
                  ? cells[col.score]
                  : null;

                const linesCell = col.lines !== -1
                  ? cells[col.lines]
                  : null;

                const metricCell = useLines
                  ? linesCell
                  : scoreCell;

                const metricDisplay = getCellText(metricCell);
                const date = getCellText(cells[col.date]);

                const timing = isTimeCategory(sheetName)
                  ? parseRunTime(metricDisplay, sheetName, date)
                  : null;

                const rawPlayerName = getCellText(cells[col.name]);

                if (rawPlayerName) {
                  const rawKey = normalize(rawPlayerName);

                  if (rawKey && !RAW_PLAYERS.has(rawKey)) {
                    RAW_PLAYERS.set(rawKey, rawPlayerName);
                  }
                }

                const playerName = canonicalPlayerName(rawPlayerName);

                return {
                  name: playerName,
                  metricValue: timing
                    ? timing.totalFrames
                    : (
                        isBType &&
                        !Number.isFinite(getCellNumber(scoreCell)) &&
                        Number.isFinite(getCellNumber(linesCell))
                      )
                        ? getCellNumber(linesCell)
                        : getCellNumber(metricCell),
                  metricDisplay,
                  timing,
                  scoreValue: getCellNumber(scoreCell),
                  scoreDisplay: getCellText(scoreCell),
                  linesValue: getCellNumber(linesCell),
                  linesDisplay: getCellText(linesCell),
                  bTypeUsesLines:
                    isBType &&
                    !Number.isFinite(getCellNumber(scoreCell)) &&
                    Number.isFinite(getCellNumber(linesCell)),
                  platform: getCellText(cells[col.platform]),
                  style: getCellText(cells[col.style]),
                  proof: getCellText(cells[col.proof]),
                  date,
                  notes: getCellText(cells[col.notes]),
                  proofLink:
                    getCellLink(cells[col.proofLink]) ||
                    getCellLink(cells[col.proof])
                };
              })
              .filter(item =>
                item.name &&
                Number.isFinite(item.metricValue)
              );

            // Speedrun sheets: fastest/lower time first.
            // Everything else: highest metric first.
            rows.sort((a, b) => {
              // B-Type:
              // 1) entries with Score first, highest Score first
              // 2) entries without Score but with Lines afterwards,
              //    highest Lines first
              if (isBTypeCategory(sheetName)) {
                if (a.bTypeUsesLines !== b.bTypeUsesLines) {
                  return a.bTypeUsesLines ? 1 : -1;
                }

                if (a.bTypeUsesLines && b.bTypeUsesLines) {
                  return (
                    b.linesValue - a.linesValue ||
                    a.name.localeCompare(b.name)
                  );
                }

                return (
                  b.scoreValue - a.scoreValue ||
                  a.name.localeCompare(b.name)
                );
              }

              // Speedruns: smallest time/frame count first.
              // EARL MAX: fewer lines = earlier maxout = better.
              // Everything else: highest metric first.
              const ascending =
                isTimeCategory(sheetName) ||
                normalize(sheetName) === 'earl max';

              const delta = ascending
                ? a.metricValue - b.metricValue
                : b.metricValue - a.metricValue;

              return delta || a.name.localeCompare(b.name);
            });

            cleanup();

            resolve({
              category: displayTitle || sheetName,
              sheetName,
              metricName: useLines ? 'Lines' : (isTimeCategory(sheetName) ? 'Frames' : 'Score'),
              rows
            });

          } catch (error) {
            cleanup();
            reject(error);
          }
        };

        script.onerror = () => {
          clearTimeout(timeout);
          cleanup();
          reject(new Error(`Could not load "${sheetName}"`));
        };

        const params = new URLSearchParams({
          tqx: `out:json;responseHandler:${callbackName}`,
          sheet: sheetName
        });

        script.src =
          `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
          `/gviz/tq?${params.toString()}`;

        document.head.appendChild(script);
      });
    }

    // ==========================================================
    // RENDER
    // ==========================================================

    function renderMedalStandings(categories) {
      const root = document.getElementById('medal-standings');
      const people = new Map();

      categories
        .filter(category => !category.error)
        .forEach(category => {
          const seenInCategory = new Set();

          category.rows.slice(0, 3).forEach((row, index) => {
            const key = normalize(row.name);
            if (!key) return;

            if (!people.has(key)) {
              people.set(key, {
                name: row.name,

                gold: 0,
                silver: 0,
                bronze: 0,

                duplicateGold: 0,
                duplicateSilver: 0,
                duplicateBronze: 0,

                goldBoards: [],
                silverBoards: [],
                bronzeBoards: [],

                goldMetrics: [],
                silverMetrics: [],
                bronzeMetrics: [],

                duplicateGoldBoards: [],
                duplicateSilverBoards: [],
                duplicateBronzeBoards: [],

                duplicateGoldMetrics: [],
                duplicateSilverMetrics: [],
                duplicateBronzeMetrics: []
              });
            }

            const person = people.get(key);
            const isDuplicate = seenInCategory.has(key);
            const boardTitle = category.category;

            if (!isDuplicate) {
              seenInCategory.add(key);

              if (index === 0) {
                person.gold++;
                person.goldBoards.push(boardTitle);
                person.goldMetrics.push(formatMedalMetric(row, category));
              }

              if (index === 1) {
                person.silver++;
                person.silverBoards.push(boardTitle);
                person.silverMetrics.push(formatMedalMetric(row, category));
              }

              if (index === 2) {
                person.bronze++;
                person.bronzeBoards.push(boardTitle);
                person.bronzeMetrics.push(formatMedalMetric(row, category));
              }
            } else {
              if (index === 0) {
                person.duplicateGold++;
                person.duplicateGoldBoards.push(boardTitle);
                person.duplicateGoldMetrics.push(formatMedalMetric(row, category));
              }

              if (index === 1) {
                person.duplicateSilver++;
                person.duplicateSilverBoards.push(boardTitle);
                person.duplicateSilverMetrics.push(formatMedalMetric(row, category));
              }

              if (index === 2) {
                person.duplicateBronze++;
                person.duplicateBronzeBoards.push(boardTitle);
                person.duplicateBronzeMetrics.push(formatMedalMetric(row, category));
              }
            }
          });
        });

      const standings = [...people.values()]
        .sort((a, b) =>
          b.gold - a.gold ||
          b.silver - a.silver ||
          b.bronze - a.bronze ||
          a.name.localeCompare(b.name)
        );

      let previousMedals = null;
      let previousRank = 0;

      standings.forEach((person, index) => {
        const medalKey =
          `${person.gold}|${person.silver}|${person.bronze}`;

        if (medalKey === previousMedals) {
          person.rank = previousRank;
        } else {
          person.rank = index + 1;
          previousRank = person.rank;
          previousMedals = medalKey;
        }
      });

      if (!standings.length) {
        root.innerHTML = '';
        return;
      }

      root.innerHTML = `
        <article class="standings-card">
          <h2 class="standings-title">Medal Standings</h2>

          <div class="table-scroll">
            <table class="standings-table">
              <thead>
                <tr>
                  <th class="rank-col">#</th>
                  <th>Player</th>
                  <th aria-label="Gold medals"><span class="medal-heading-icon" title="Gold medals">🥇</span></th>
                  <th aria-label="Silver medals"><span class="medal-heading-icon" title="Silver medals">🥈</span></th>
                  <th aria-label="Bronze medals"><span class="medal-heading-icon" title="Bronze medals">🥉</span></th>
                </tr>
              </thead>
              <tbody>
                ${standings.map((person, index) => `
                  <tr data-medal-rank="${index + 1}" ${index >= 5 ? 'hidden' : ''}>
                    <td class="rank-col">${person.rank}</td>
                    <td class="name">
                      <span class="ranking-player-label">
                        ${formatPlayerFlag(person.name)}
                        <span>${formatPlayerWithAliases(person.name)}</span>
                      </span>
                    </td>

                    <td>
                      ${formatMedalCountWithTooltip(
                        person.gold,
                        person.duplicateGold,
                        person.goldBoards,
                        person.duplicateGoldBoards,
                        person.goldMetrics,
                        person.duplicateGoldMetrics,
                        'Gold'
                      )}
                    </td>

                    <td>
                      ${formatMedalCountWithTooltip(
                        person.silver,
                        person.duplicateSilver,
                        person.silverBoards,
                        person.duplicateSilverBoards,
                        person.silverMetrics,
                        person.duplicateSilverMetrics,
                        'Silver'
                      )}
                    </td>

                    <td>
                      ${formatMedalCountWithTooltip(
                        person.bronze,
                        person.duplicateBronze,
                        person.bronzeBoards,
                        person.duplicateBronzeBoards,
                        person.bronzeMetrics,
                        person.duplicateBronzeMetrics,
                        'Bronze'
                      )}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${standings.length > 5 ? `
            <button
              id="medalShowMore"
              class="show-all"
              type="button"
              aria-expanded="false"
            >Show more</button>
          ` : ''}
        </article>
      `;

      const medalButton = document.getElementById('medalShowMore');

      if (medalButton) {
        medalButton.addEventListener('click', () => {
          const expanded =
            medalButton.getAttribute('aria-expanded') === 'true';

          root.querySelectorAll('tr[data-medal-rank]').forEach(row => {
            if (Number(row.dataset.medalRank) > 5) {
              row.hidden = expanded;
            }
          });

          medalButton.setAttribute(
            'aria-expanded',
            String(!expanded)
          );

          medalButton.textContent =
            expanded ? 'Show more' : 'Show less';
        });
      }

      setupMedalTooltips();
    }

    function formatMedalCountWithTooltip(
      actual,
      duplicates,
      boards,
      duplicateBoards,
      metrics,
      duplicateMetrics,
      medalLabel
    ) {
      const actualItems = boards.map((board, index) => ({
        board,
        metric: metrics[index] || ''
      }));

      const duplicateItems = duplicateBoards.map((board, index) => ({
        board,
        metric: duplicateMetrics[index] || ''
      }));

      const medalClass = `medal-count--${medalLabel.toLowerCase()}`;
      const actualPart = `
          <span
            class="medal-count-tip ${medalClass}"
            data-tooltip-title="${escapeAttribute(`${medalLabel} medal${actual === 1 ? '' : 's'}`)}"
            data-tooltip-items="${escapeAttribute(JSON.stringify(actualItems))}"
          >${actual}</span>
        `;

      const duplicatePart = duplicates > 0
        ? `
          <span
            class="duplicate-medals medal-count-tip ${medalClass}"
            data-tooltip-title="Duplicate entries in the same board"
            data-tooltip-items="${escapeAttribute(JSON.stringify(duplicateItems))}"
          >(${duplicates})</span>
        `
        : '';

      return `
        <span class="medal-count-wrap">
          ${actualPart}
          ${duplicatePart}
        </span>
      `;
    }

    function formatMedalMetric(row, category) {
      const sheetName = normalize(
        category.sheetName || category.category
      );

      if (row.timing) {
        // 30L / 40L: show frames and the associated time.
        if (
          sheetName === 'sr 30 l' ||
          sheetName === 'sr 40 l'
        ) {
          const frameCount =
            `${formatInteger(row.timing.totalFrames)} frames`;

          if (row.timing.is2023) {
            return (
              `${frameCount} ` +
              `(Time ${row.timing.originalTime}, ` +
              `Corrected ${row.timing.correctedTime})`
            );
          }

          return (
            `${frameCount} ` +
            `(Time ${row.timing.originalTime})`
          );
        }

        // 100-line speedruns stay as their normal time value.
        if (row.timing.displayMode === 'time-only') {
          return row.timing.originalTime;
        }

        return `${formatInteger(row.timing.totalFrames)} frames`;
      }

      if (category.metricName === 'Lines') {
        return new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0
        }).format(row.metricValue);
      }

      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2
      }).format(row.metricValue);
    }

    function setupMedalTooltips() {
      const tooltip = document.getElementById('medalTooltip');
      if (!tooltip) return;

      document.querySelectorAll('.medal-count-tip').forEach(target => {
        target.addEventListener('mouseenter', event => {
          showMedalTooltip(event, target, tooltip);
        });

        target.addEventListener('mousemove', event => {
          if (!tooltip.hidden) {
            positionMedalTooltipAtMouse(event, tooltip);
          }
        });

        target.addEventListener('mouseleave', () => {
          tooltip.hidden = true;
          tooltip.innerHTML = '';
        });
      });
    }

    function showMedalTooltip(event, target, tooltip) {
      let items = [];

      try {
        items = JSON.parse(target.dataset.tooltipItems || '[]');
      } catch (error) {
        console.error('Could not parse medal tooltip items:', error);
      }

      const title = target.dataset.tooltipTitle || '';

      tooltip.innerHTML = `
        <div class="medal-tooltip-title">
          ${escapeHtml(title)}
        </div>
        ${items.length
          ? `<ul>${items.map(item => `
              <li>
                ${escapeHtml(item.board)}
                ${item.metric ? `: <strong>${escapeHtml(item.metric)}</strong>` : ''}
              </li>
            `).join('')}</ul>`
          : '<div>No categories found.</div>'
        }
      `;

      tooltip.hidden = false;
      positionMedalTooltipAtMouse(event, tooltip);
    }

    function positionMedalTooltipAtMouse(event, tooltip) {
      const gap = 14;

      let left = event.clientX + gap;
      let top = event.clientY + gap;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;

      const rect = tooltip.getBoundingClientRect();

      if (left + rect.width > window.innerWidth - 8) {
        left = event.clientX - rect.width - gap;
      }

      if (top + rect.height > window.innerHeight - 8) {
        top = event.clientY - rect.height - gap;
      }

      left = Math.max(8, left);
      top = Math.max(8, top);

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }

    function render(categories) {
      const root = document.getElementById('leaderboards');
      const renderCategory = (category, categoryIndex, isFirst) => {
        if (category.error) {
          return `
            <article class="card leaderboard-category">
              <div class="card-head">
                <h3 class="category">${escapeHtml(category.category)}</h3>
              </div>
              <div class="status">Could not load this category.</div>
            </article>
          `;
        }

        if (!category.rows.length) {
          return `
            <article class="card leaderboard-category">
              <div class="card-head">
                <h3 class="category">${escapeHtml(category.category)}</h3>
              </div>
              <div class="status">No leaderboard rows found.</div>
            </article>
          `;
        }

        return `
          <article
            class="card leaderboard-category"
            id="category-${categoryIndex}"
            data-category="${categoryIndex}"
          >
            <div class="card-head">
              <button
                class="accordion-toggle"
                type="button"
                aria-expanded="true"
                aria-controls="panel-${categoryIndex}"
              >
                <span class="accordion-title-wrap">
                  <span class="category">${escapeHtml(category.category)}</span>
                  <span class="metric-note">
                    Ranked by ${escapeHtml(category.metricName)}
                  </span>
                </span>
                <span class="accordion-chevron" aria-hidden="true">−</span>
              </button>
            </div>

            <div
              id="panel-${categoryIndex}"
              class="accordion-panel"
            >
              <div class="leaderboard-search-controls">
                <input
                  class="leaderboard-search"
                  type="search"
                  placeholder="Search this ranking by player…"
                  aria-label="Search ${escapeAttribute(category.category)} by player"
                >
                <button
                  class="chart-button"
                  type="button"
                  data-category="${categoryIndex}"
                >View bar chart</button>
                <span class="leaderboard-result-count" aria-live="polite"></span>
                <hr aria-hidden="true">
              </div>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Medal</th>
                      <th>Player</th>
                      <th>${escapeHtml(category.metricName)}</th>
                      <th>Playstyle</th>
                      <th>Platform</th>
                      <th>Date</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${category.rows.map((row, index) =>
                      renderRow(row, index, category)
                    ).join('')}
                  </tbody>
                </table>
              </div>

              ${category.rows.length > 3 ? `
                <button
                  class="show-all"
                  type="button"
                  data-category="${categoryIndex}"
                  aria-expanded="false"
                >Show all</button>
              ` : ''}
            </div>
          </article>
        `;
      };

      root.innerHTML = GROUPS.map((group, groupIndex) => {
        const groupedCategories = categories
          .map((category, categoryIndex) => ({ category, categoryIndex }))
          .filter(({ category }) => group.sheets.includes(category.sheetName));
        const isOpen = true;

        return `
          <section class="leaderboard-group" id="${group.id}">
            <h2 class="leaderboard-group-heading">
              <button
                class="leaderboard-group-toggle"
                type="button"
                aria-expanded="${isOpen}"
                aria-controls="${group.id}-panel"
              >
                <span>${escapeHtml(group.title)}</span>
                <span class="leaderboard-group-icon" aria-hidden="true">${isOpen ? '−' : '+'}</span>
              </button>
            </h2>
            <div
              class="leaderboard-group-panel"
              id="${group.id}-panel"
              ${isOpen ? '' : 'hidden'}
            >
              <div class="leaderboard-categories">
                ${groupedCategories.map(({ category, categoryIndex }, index) =>
                  renderCategory(category, categoryIndex, true)
                ).join('')}
              </div>
            </div>
          </section>
        `;
      }).join('');
      renderRankingsToc(categories);

      // Hide everything after the top 3 initially.
      document.querySelectorAll('tbody tr[data-rank]').forEach(row => {
        if (Number(row.dataset.rank) > 3) row.hidden = true;
      });

      document.querySelectorAll('.accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
          const panelId = button.getAttribute('aria-controls');
          const panel = document.getElementById(panelId);
          const expanded = button.getAttribute('aria-expanded') === 'true';

          button.setAttribute('aria-expanded', String(!expanded));
          panel.hidden = expanded;

          const symbol = button.querySelector('.accordion-chevron');
          if (symbol) {
            symbol.textContent = expanded ? '+' : '−';
          }
        });
      });

      document.querySelectorAll('.leaderboard-group-toggle').forEach(button => {
        button.addEventListener('click', () => {
          const panel = document.getElementById(
            button.getAttribute('aria-controls')
          );
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', String(!expanded));
          panel.hidden = expanded;
          button.querySelector('.leaderboard-group-icon').textContent =
            expanded ? '+' : '−';
        });
      });

      document.querySelectorAll('.leaderboard-search').forEach(search => {
        search.addEventListener('input', () => {
          const card = search.closest('.leaderboard-category');
          const query = normalize(search.value);
          let matches = 0;

          card.querySelectorAll('tbody tr[data-rank]').forEach(row => {
            const isMatch =
              !query || normalize(row.dataset.player).includes(query);
            const showAllButton = card.querySelector('.show-all');
            const showAll =
              showAllButton?.getAttribute('aria-expanded') === 'true';
            row.hidden = query
              ? !isMatch
              : Number(row.dataset.rank) > 3 && !showAll;
            if (query && isMatch) matches += 1;
          });

          const showAllButton = card.querySelector('.show-all');
          if (showAllButton) showAllButton.hidden = Boolean(query);
          card.querySelector('.leaderboard-result-count').textContent = query
            ? `${matches} result${matches === 1 ? '' : 's'}`
            : '';
        });
      });

      document.querySelectorAll('.chart-button').forEach(button => {
        button.addEventListener('click', () => {
          openRankingChart(
            categories[Number(button.dataset.category)],
            button
          );
        });
      });

      document.querySelectorAll('.show-all').forEach(button => {
        button.addEventListener('click', () => {
          const card = button.closest('.card');
          if (!card) return;

          const expanded = button.getAttribute('aria-expanded') === 'true';

          card.querySelectorAll('tbody tr[data-rank]').forEach(row => {
            if (Number(row.dataset.rank) > 3) {
              row.hidden = expanded ? true : false;
            }
          });

          button.setAttribute('aria-expanded', String(!expanded));
          button.textContent = expanded ? 'Show all' : 'Show top 3';
        });
      });

      setupNotePopovers();
    }

    function renderRankingsToc(categories) {
      const toc = document.getElementById('rankings-toc');
      if (!toc) return;

      toc.innerHTML = GROUPS.map((group, groupIndex) => {
        const groupCategories = categories
          .map((category, categoryIndex) => ({ category, categoryIndex }))
          .filter(({ category }) => group.sheets.includes(category.sheetName));

        return `
          <li class="article-toc-item article-toc-item--h2">
            <a class="article-toc-link" href="#${group.id}">
              ${groupIndex + 1}. ${escapeHtml(group.title)}
            </a>
          </li>
          ${groupCategories.map(({ category, categoryIndex }, innerIndex) => `
            <li class="article-toc-item article-toc-item--h3">
              <a class="article-toc-link" href="#category-${categoryIndex}">
                ${groupIndex + 1}.${innerIndex + 1}
                ${escapeHtml(category.category)}
              </a>
            </li>
          `).join('')}
        `;
      }).join('');

      const tocEntries = Array.from(
        toc.querySelectorAll('.article-toc-link[href^="#"]')
      ).map(link => ({
        link,
        target: document.getElementById(link.hash.slice(1))
      })).filter(entry => entry.target);

      function setCurrentTocEntry(currentLink) {
        const currentIndex = tocEntries.findIndex(
          ({ link }) => link === currentLink
        );
        if (currentIndex < 0) return;

        tocEntries.forEach(({ link }, index) => {
          const isCurrent = index === currentIndex;
          link.classList.toggle('is-passed', index < currentIndex);
          link.classList.toggle('is-current', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'location');
            if (document.getElementById('site-menu')?.classList.contains('active')) {
              link.scrollIntoView({ block: 'nearest' });
            }
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }

      function updateCurrentTocEntry() {
        const visibleEntries = tocEntries.filter(
          ({ target }) => target.getClientRects().length > 0
        );
        if (!visibleEntries.length) return;

        let current = visibleEntries[0];
        visibleEntries.forEach(entry => {
          if (entry.target.getBoundingClientRect().top <= 110) {
            current = entry;
          }
        });
        setCurrentTocEntry(current.link);
      }

      toc.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
          const target = document.getElementById(link.hash.slice(1));
          if (!target) return;
          event.preventDefault();

          const group = target.classList.contains('leaderboard-group')
            ? target
            : target.closest('.leaderboard-group');
          const groupButton = group?.querySelector(
            ':scope > .leaderboard-group-heading .leaderboard-group-toggle'
          );
          const groupPanel = groupButton
            ? document.getElementById(groupButton.getAttribute('aria-controls'))
            : null;
          if (groupButton && groupPanel) {
            groupButton.setAttribute('aria-expanded', 'true');
            groupButton.querySelector('.leaderboard-group-icon').textContent =
              '−';
            groupPanel.hidden = false;
          }

          if (target.classList.contains('leaderboard-category')) {
            const categoryButton = target.querySelector('.accordion-toggle');
            const categoryPanel = categoryButton
              ? document.getElementById(
                  categoryButton.getAttribute('aria-controls')
                )
              : null;
            if (categoryButton && categoryPanel) {
              categoryButton.setAttribute('aria-expanded', 'true');
              categoryButton.querySelector('.accordion-chevron').textContent =
                '−';
              categoryPanel.hidden = false;
            }
          }

          history.pushState(null, '', link.hash);
          setCurrentTocEntry(link);
          if (window.matchMedia('(max-width: 999px)').matches) {
            document.getElementById('close-icon')?.click();
          }
          requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      });

      if (window.__rankingsTocScrollHandler) {
        window.removeEventListener(
          'scroll',
          window.__rankingsTocScrollHandler
        );
      }
      window.__rankingsTocScrollHandler = () => {
        if (window.__rankingsTocScrollFrame) return;
        window.__rankingsTocScrollFrame = requestAnimationFrame(() => {
          window.__rankingsTocScrollFrame = null;
          updateCurrentTocEntry();
        });
      };
      window.addEventListener(
        'scroll',
        window.__rankingsTocScrollHandler,
        { passive: true }
      );
      updateCurrentTocEntry();
    }

    function renderRow(row, index, category) {
      const rank = index + 1;
      const medal = MEDALS[index] || '';

      const styleTag = getPlaystyleTag(row.style);
      const platformTag = getPlatformTag(row.platform);

      const metric = row.bTypeUsesLines
        ? '<span class="empty">—</span>'
        : formatMetric(
            row.metricValue,
            row.metricDisplay,
            category.sheetName || category.category,
            row.timing
          );

      const secondaryMetric = formatSecondaryMetric(row, category);

      const link = safeUrl(row.proofLink);
      const rowInformation = row.notes || 'No additional notes.';

      return `
        <tr data-rank="${rank}" data-player="${escapeAttribute(row.name)}">
          <td class="medal">${medal || rank}</td>
          <td class="name">
            <span class="name-wrap">
              ${formatPlayerFlag(row.name)}
              <span>${escapeHtml(row.name)}</span>
              <button
                class="info-tip"
                type="button"
                aria-label="Show notes for ${escapeHtml(row.name)}"
                data-note="${escapeAttribute(rowInformation)}"
              >i</button>
            </span>
          </td>
          <td class="metric">
            <span class="mobile-metric-label">Score</span>
            <span class="metric-primary">${metric}</span>
            ${secondaryMetric
              ? `<span class="metric-secondary">${secondaryMetric}</span>`
              : ''}
          </td>

          <td class="icon-cell">
            ${styleTag
              ? `<span class="tag ${styleTag.className}">
                   ${escapeHtml(styleTag.label)}
                 </span>`
              : `<span class="empty">—</span>`}
          </td>

          <td class="icon-cell">
            ${platformTag
              ? `<span class="tag ${platformTag.className}">
                   ${escapeHtml(platformTag.label)}
                 </span>`
              : `<span class="empty">—</span>`}
          </td>

          <td class="date">${escapeHtml(formatAmericanDate(row.date))}</td>

          <td class="proof-cell">
            ${link
              ? `<a class="proof-link"
                    href="${escapeHtml(link)}"
                    target="_blank"
                    rel="noopener noreferrer">Proof ↗</a>`
              : `<span class="empty">—</span>`}
          </td>
        </tr>
      `;
    }

    function openRankingChart(category, trigger) {
      const modal = document.getElementById('chartModal');
      const title = document.getElementById('chartModalTitle');
      const subtitle = document.getElementById('chartModalSubtitle');
      const plot = document.getElementById('chartPlot');
      if (!modal || !title || !subtitle || !plot || !category) return;

      const rows = category.rows;
      const finiteValues = rows
        .map(row => row.metricValue)
        .filter(Number.isFinite);
      const maximum = Math.max(...finiteValues, 1);
      const positiveValues = finiteValues.filter(value => value > 0);
      const minimum = positiveValues.length
        ? Math.min(...positiveValues)
        : 1;
      const ascending = isTimeCategory(category.sheetName || '');

      lastChartTrigger = trigger;
      title.textContent = category.category;
      subtitle.textContent =
        `Top ${rows.length} · ranked by ${category.metricName}`;
      plot.innerHTML = rows.map((row, index) => {
        const value = row.metricValue;
        let width = 100 - index * (65 / Math.max(rows.length - 1, 1));

        if (Number.isFinite(value) && value > 0) {
          width = ascending
            ? (minimum / value) * 100
            : (value / maximum) * 100;
        }

        width = Math.max(8, Math.min(100, width));
        const metric = row.bTypeUsesLines
          ? `${row.linesDisplay || formatInteger(row.linesValue)} Lines`
          : row.metricDisplay || formatInteger(row.metricValue);

        return `
          <div class="ranking-chart-row ranking-chart-row--${Math.min(index + 1, 4)}">
            <span class="ranking-chart-rank">${index + 1}</span>
            <span class="ranking-chart-name">
              ${formatPlayerFlag(row.name)}
              <span>${escapeHtml(row.name)}</span>
            </span>
            <span class="ranking-chart-track">
              <span class="ranking-chart-bar" style="width:${width.toFixed(2)}%"></span>
            </span>
            <span class="ranking-chart-value">${escapeHtml(metric || '—')}</span>
          </div>
        `;
      }).join('');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      modal.querySelector('.close')?.focus();
    }

    function closeRankingChart() {
      const modal = document.getElementById('chartModal');
      if (!modal || modal.style.display === 'none') return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.getElementById('chartPlot').replaceChildren();
      lastChartTrigger?.focus();
    }

    function setupNotePopovers() {
      const popover = document.getElementById('notePopover');
      if (!popover) return;

      let activeButton = null;
      let hideTimer = null;

      document.querySelectorAll('.info-tip').forEach(button => {
        const show = () => {
          clearTimeout(hideTimer);

          activeButton = button;
          popover.innerHTML = linkifyNote(button.dataset.note || '');
          popover.hidden = false;

          positionNotePopover(button, popover);
        };

        const scheduleHide = () => {
          clearTimeout(hideTimer);

          hideTimer = setTimeout(() => {
            popover.hidden = true;
            popover.innerHTML = '';
            activeButton = null;
          }, 180);
        };

        button.addEventListener('mouseenter', show);
        button.addEventListener('mouseleave', scheduleHide);
        button.addEventListener('focus', show);
        button.addEventListener('blur', scheduleHide);
      });

      popover.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
      });

      popover.addEventListener('mouseleave', () => {
        clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {
          popover.hidden = true;
          popover.innerHTML = '';
          activeButton = null;
        }, 180);
      });

      window.addEventListener('resize', () => {
        if (activeButton && !popover.hidden) {
          positionNotePopover(activeButton, popover);
        }
      });

      window.addEventListener('scroll', () => {
        if (activeButton && !popover.hidden) {
          positionNotePopover(activeButton, popover);
        }
      }, true);
    }

    function positionNotePopover(button, popover) {
      const rect = button.getBoundingClientRect();
      const gap = 8;

      // First measure after making it visible.
      const popRect = popover.getBoundingClientRect();

      let left = rect.left + rect.width / 2 - popRect.width / 2;
      let top = rect.top - popRect.height - gap;

      left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));

      // If there isn't enough room above, place below.
      if (top < 8) {
        top = rect.bottom + gap;
      }

      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    }

    function linkifyNote(note) {
      const escaped = escapeHtml(note);

      return escaped.replace(
        /(https?:\/\/[^\s<]+)/gi,
        url => {
          const safe = safeUrl(
            url.replace(/[),.;!?]+$/, '')
          );

          if (!safe) return url;

          const trailing = url.slice(safe.length);

          return (
            `<a href="${escapeHtml(safe)}"` +
            ` target="_blank" rel="noopener noreferrer">` +
            `${escapeHtml(safe)}</a>${escapeHtml(trailing)}`
          );
        }
      ).replace(/\n/g, '<br>');
    }

    // ==========================================================
    // METRICS
    // ==========================================================

    function formatMetric(value, displayValue, sheetName, timing) {
      if (isTimeCategory(sheetName) && timing) {
        // 100-line categories stay as time displays.
        if (timing.displayMode === 'time-only') {
          return `
            <div class="time-stack">
              <span class="frame-count">
                ${escapeHtml(timing.originalTime)}
              </span>
            </div>
          `;
        }

        return `
          <div class="time-stack">
            <span class="frame-count">
              ${formatInteger(timing.totalFrames)} frames
            </span>
            <span class="time-detail">
              (
              Time ${escapeHtml(timing.originalTime)}
              ${timing.is2023 ? `
                ·
                <span class="corrected-time">
                  Corrected ${escapeHtml(timing.correctedTime)}
                </span>
              ` : ''}
              )
            </span>
          </div>
        `;
      }

      return escapeHtml(
        new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2
        }).format(value)
      );
    }

    function parseRunTime(value, sheetName, dateText) {
      const raw = String(value ?? '').trim();
      if (!raw) return null;

      const sheet = normalize(sheetName);

      /*
        Normalize the source into MM:SS.frames.

        Important Google-Sheet cases:
          119       -> 1:19.00
          126       -> 1:26.00
          135       -> 1:35.00
          1:19      -> 1:19.00
          1:19.0A   -> 1:19.0A

        A bare integer in these speedrun sheets is therefore interpreted
        as M:SS, NOT as a frame count.
      */
      const parsed = parseDisplayedRunTime(raw);
      if (!parsed) return null;

      const {
        minutes,
        seconds,
        frameText,
        normalizedTime
      } = parsed;

      const is30Lines = sheet === 'sr 30 l';
      const is40Lines = sheet === 'sr 40 l';
      const is100Lines =
        sheet === 'sr 100 l' ||
        sheet === 'sr 100 l lvl 0';

      /*
        30 lines:
          always 2023 timing
          hexadecimal frame field
          61 fps

        40 lines:
          mixed
          2023 rows use hex + 61 fps
          later rows use decimal + 60 fps

        100 lines:
          leave displayed as time
          use decimal/60fps for numeric ranking
      */
      let is2023 = false;

      if (is30Lines) {
        is2023 = true;
      } else if (is40Lines) {
        const year = getYearFromDate(dateText);

        // Date is the primary signal. A-F remains a safe fallback for rows
        // whose date is unavailable.
        is2023 =
          year === 2023 ||
          (year === null && /[A-F]/i.test(frameText));
      }

      if (is100Lines) {
        const decimalFrames = parseInt(frameText || '0', 10);

        if (!Number.isFinite(decimalFrames)) return null;

        const totalFrames =
          decimalFrames +
          60 * (seconds + 60 * minutes);

        return {
          totalFrames,
          is2023: false,
          originalTime: normalizedTime,
          correctedTime: normalizedTime,
          displayMode: 'time-only'
        };
      }

      const frames = parseInt(
        frameText || '0',
        is2023 ? 16 : 10
      );

      if (!Number.isFinite(frames)) return null;

      // Mirrors the spreadsheet formula exactly.
      const totalFrames = is2023
        ? frames + 61 * (seconds + 60 * minutes)
        : frames + 60 * (seconds + 60 * minutes);

      return {
        totalFrames,
        is2023,
        originalTime: normalizedTime,
        correctedTime: framesTo60FpsTime(totalFrames),
        displayMode: 'frames'
      };
    }

    function parseDisplayedRunTime(rawValue) {
      let raw = String(rawValue || '').trim();
      if (!raw) return null;

      let minutes;
      let seconds;
      let frameText = '00';

      // Normal form: M:SS or M:SS.frames
      let match = raw.match(
        /^(\d+):(\d{1,2})(?:\.([0-9A-Fa-f]+))?$/
      );

      if (match) {
        minutes = Number(match[1]);
        seconds = Number(match[2]);
        frameText = (match[3] || '00').toUpperCase();
      } else {
        /*
          Bare digits are interpreted as M:SS:
            119 -> 1:19
            59  -> 0:59
            1005 -> 10:05
        */
        const digits = raw.replace(/\s+/g, '');

        if (!/^\d+$/.test(digits)) {
          return null;
        }

        if (digits.length <= 2) {
          minutes = 0;
          seconds = Number(digits);
        } else {
          minutes = Number(digits.slice(0, -2));
          seconds = Number(digits.slice(-2));
        }
      }

      if (
        !Number.isFinite(minutes) ||
        !Number.isFinite(seconds) ||
        seconds < 0 ||
        seconds > 59
      ) {
        return null;
      }

      return {
        minutes,
        seconds,
        frameText,
        normalizedTime:
          `${minutes}:${String(seconds).padStart(2, '0')}.` +
          `${frameText.padStart(2, '0')}`
      };
    }

    function getYearFromDate(value) {
      const text = String(value || '').trim();
      if (!text) return null;

      const explicitYear = text.match(/\b(20\d{2})\b/);
      if (explicitYear) {
        return Number(explicitYear[1]);
      }

      const parsed = new Date(text);
      return Number.isNaN(parsed.getTime())
        ? null
        : parsed.getFullYear();
    }

    function formatAmericanDate(value) {
      const text = String(value || '').trim();
      if (!text) return '—';

      let year;
      let month;
      let day;
      let match = text.match(
        /^Date\(\s*(\d{4})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})/
      );

      if (match) {
        year = Number(match[1]);
        month = Number(match[2]) + 1;
        day = Number(match[3]);
      } else if ((match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
      } else if ((match = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/))) {
        day = Number(match[1]);
        month = Number(match[2]);
        year = Number(match[3]);
      } else if ((match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/))) {
        const first = Number(match[1]);
        const second = Number(match[2]);
        year = Number(match[3]);
        if (first > 12) {
          day = first;
          month = second;
        } else {
          month = first;
          day = second;
        }
      } else {
        const parsed = new Date(text);
        if (Number.isNaN(parsed.getTime())) return text;
        year = parsed.getFullYear();
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
      }

      if (year < 100) year += year >= 70 ? 1900 : 2000;
      if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) return text;

      return (
        `${String(month).padStart(2, '0')}/` +
        `${String(day).padStart(2, '0')}/` +
        `${String(year).padStart(4, '0')}`
      );
    }

    function framesTo60FpsTime(totalFrames) {
      const totalSeconds = Math.floor(totalFrames / 60);
      const frames = totalFrames % 60;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return (
        `${minutes}:` +
        `${String(seconds).padStart(2, '0')}.` +
        `${String(frames).padStart(2, '0')}`
      );
    }

    function formatInteger(value) {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
      }).format(value);
    }

    function formatSecondaryMetric(row, category) {
      const sheetName = normalize(category.sheetName || category.category);

      if (sheetName === 'earl max') {
        return '';
      }

      if (isBTypeCategory(category.sheetName || category.category)) {
        if (Number.isFinite(row.linesValue)) {
          return `Lines: ${new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
          }).format(row.linesValue)}`;
        }
      }

      // The category name already states the speedrun distance.
      if (isTimeCategory(category.sheetName || category.category)) {
        return '';
      }

      // Lines-based categories show Score as secondary when available.
      if (
        category.metricName === 'Lines' &&
        Number.isFinite(row.scoreValue)
      ) {
        return `Score: ${new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2
        }).format(row.scoreValue)}`;
      }

      // Score-based categories show Lines as secondary when available.
      if (
        category.metricName === 'Score' &&
        Number.isFinite(row.linesValue)
      ) {
        return `Lines: ${new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0
        }).format(row.linesValue)}`;
      }

      return '';
    }

    // ==========================================================
    // PLAYSTYLE / PLATFORM LABELS
    // ==========================================================

    function getPlaystyleTag(styleText) {
      const text = normalize(styleText);
      if (!text) return null;

      if (text.includes('roll')) {
        return {
          label: 'Rolling',
          className: 'tag-roll'
        };
      }

      if (
        text === 'thor' ||
        text.includes('thor grip')
      ) {
        return {
          label: 'Thor Grip',
          className: 'tag-thor'
        };
      }

      if (
        text.includes('hypertap') ||
        text.includes('hyper tap') ||
        text.includes('tap')
      ) {
        return {
          label: 'Tap',
          className: 'tag-tap'
        };
      }

      if (text.includes('das')) {
        return {
          label: 'DAS',
          className: 'tag-das'
        };
      }

      return {
        label: styleText,
        className: 'tag-style-other'
      };
    }

    // ==========================================================
    // PLATFORM LABELS
    // ==========================================================

    function getPlatformTag(platformText) {
      const text = normalize(platformText);
      if (!text) return null;

      if (text.includes('emulator')) {
        return { label: 'Emulator', className: 'tag-emulator' };
      }

      if (text.includes('switch')) {
        return { label: 'Switch', className: 'tag-switch' };
      }

      if (text.includes('snes')) {
        return { label: 'SNES', className: 'tag-snes' };
      }

      if (
        text.includes('super gb') ||
        text.includes('super game boy') ||
        text.includes('sgb')
      ) {
        return { label: 'Super Game Boy', className: 'tag-sgb' };
      }

      if (
        text.includes('advance') ||
        text.includes('gba') ||
        text.includes('gbasp')
      ) {
        return { label: 'GBA', className: 'tag-gba' };
      }

      if (
        text.includes('color') ||
        text.includes('colour') ||
        text === 'gbc'
      ) {
        return { label: 'Game Boy Color', className: 'tag-gbc' };
      }

      if (text.includes('light')) {
        return { label: 'Game Boy Light', className: 'tag-gbl' };
      }

      if (text.includes('pocket')) {
        return { label: 'Game Boy Pocket', className: 'tag-gbp' };
      }

      if (
        text.includes('gameboy') ||
        text.includes('game boy') ||
        text.includes('original gb') ||
        text.includes('orignal gb') ||
        text.includes('brick')
      ) {
        return { label: 'Game Boy', className: 'tag-gb' };
      }

      return {
        label: platformText,
        className: 'tag-platform-other'
      };
    }


    // ==========================================================
    // CELL HELPERS
    // ==========================================================

    function findColumn(columns, aliases) {
      return columns.findIndex(column =>
        aliases.includes(column.label)
      );
    }

    function getCellText(cell) {
      if (!cell) return '';

      if (cell.f !== undefined && cell.f !== null) {
        return String(cell.f).trim();
      }

      if (cell.v !== undefined && cell.v !== null) {
        return String(cell.v).trim();
      }

      return '';
    }

    function getCellNumber(cell) {
      if (!cell) return NaN;

      if (typeof cell.v === 'number') {
        return cell.v;
      }

      return parseLooseNumber(getCellText(cell));
    }

    function getCellLink(cell) {
      if (!cell) return '';

      const candidates = [cell.f, cell.v]
        .filter(v => v !== undefined && v !== null)
        .map(String);

      for (const value of candidates) {
        const match = value.match(/https?:\/\/[^\s)"']+/i);
        if (match) return match[0];
      }

      return '';
    }

    function parseLooseNumber(value) {
      const cleaned = String(value)
        .trim()
        .replace(/\s/g, '')
        .replace(/'/g, '')
        .replace(/,/g, '.')
        .replace(/[^\d.+-]/g, '');

      if (!cleaned) return NaN;

      const number = Number(cleaned);
      return Number.isFinite(number) ? number : NaN;
    }

    function safeUrl(value) {
      if (!value) return '';

      try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol)
          ? url.href
          : '';
      } catch {
        return '';
      }
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function xmlEscape(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
    }

    function escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function escapeAttribute(value) {
      return escapeHtml(value)
        .replaceAll('`', '&#096;')
        .replaceAll('\n', '&#10;')
        .replaceAll('\r', '');
    }


    function getUniquePlayers() {
      return [...RAW_PLAYERS.values()]
        .map(rawName => {
          const canonical = canonicalPlayerName(rawName);
          const isAlias =
            normalize(rawName) !== normalize(canonical);

          return {
            rawName,
            canonical,
            isAlias,
            display: isAlias
              ? `${rawName} → ${canonical}`
              : rawName
          };
        })
        .sort((a, b) =>
          a.rawName.localeCompare(
            b.rawName,
            undefined,
            { sensitivity: 'base' }
          )
        );
    }
    async function copyUniquePlayersToClipboard() {
      const players = window.uniquePlayers || [];
      const feedback = document.getElementById('copyPlayersFeedback');

      if (!players.length) {
        if (feedback) {
          feedback.textContent = 'No players loaded.';
        }
        return;
      }

      const textToCopy = players
        .map(player => player.display)
        .join('\n');

      try {
        await navigator.clipboard.writeText(textToCopy);

        if (feedback) {
          feedback.textContent =
            `Copied ${players.length} unique source names.`;
        }
      } catch (error) {
        console.error('Clipboard copy failed:', error);

        /*
          Fallback for file:// pages or browsers that block Clipboard API.
        */
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand('copy');

        textarea.remove();

        if (feedback) {
          feedback.textContent = copied
            ? `Copied ${players.length} unique source names.`
            : 'Copy failed.';
        }
      }
    }

    document
      .getElementById('copyPlayersButton')
      ?.addEventListener('click', copyUniquePlayersToClipboard);

    document
      .querySelector('#chartModal .close')
      ?.addEventListener('click', closeRankingChart);

    document.getElementById('chartModal')?.addEventListener('click', event => {
      if (event.target.id === 'chartModal') closeRankingChart();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeRankingChart();
    });

    loadLeaderboards();
