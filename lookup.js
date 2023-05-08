// HEADER INFO
// this was more or less directly derived from here: https://gbdev.io/pandocs/The_Cartridge_Header.html

const cgbFlag = {
    "00":"The game was made for the DMG",
    "80":"The game supports CGB enhancements, but is backwards compatible with monochrome Game Boys",
    "C0":"The game works on CGB only"
}

const newLicenseeCode = {
    "00": "None",
    "01": "Nintendo R&D1",
    "08": "Capcom",
    "13": "Electronic Arts",
    "18": "Hudson Soft",
    "19": "b-ai",
    "20": "kss",
    "22": "pow",
    "24": "PCM Complete",
    "25": "san-x",
    "28": "Kemco Japan",
    "29": "seta",
    "30": "Viacom",
    "31": "Nintendo",
    "32": "Bandai",
    "33": "Ocean/Acclaim",
    "34": "Konami",
    "35": "Hector",
    "37": "Taito",
    "38": "Hudson",
    "39": "Banpresto",
    "41": "Ubi Soft",
    "42": "Atlus",
    "44": "Malibu",
    "46": "angel",
    "47": "Bullet-Proof",
    "49": "irem",
    "50": "Absolute",
    "51": "Acclaim",
    "52": "Activision",
    "53": "American sammy",
    "54": "Konami",
    "55": "Hi tech entertainment",
    "56": "LJN",
    "57": "Matchbox",
    "58": "Mattel",
    "59": "Milton Bradley",
    "60": "Titus",
    "61": "Virgin",
    "64": "LucasArts",
    "67": "Ocean",
    "69": "Electronic Arts",
    "70": "Infogrames",
    "71": "Interplay",
    "72": "Broderbund",
    "73": "sculptured",
    "75": "sci",
    "78": "THQ",
    "79": "Accolade",
    "80": "misawa",
    "83": "lozc",
    "86": "Tokuma Shoten Intermedia",
    "87": "Tsukuda Original",
    "91": "Chunsoft",
    "92": "Video system",
    "93": "Ocean/Acclaim",
    "95": "Varie",
    "96": "Yonezawa/s’pal",
    "97": "Kaneko",
    "99": "Pack in soft",
    "A4": "Konami (Yu-Gi-Oh!)"
  };
  
  const cartridgeType = {
    "00": "ROM ONLY",
    "01": "MBC1",
    "02": "MBC1+RAM",
    "03": "MBC1+RAM+BATTERY",
    "05": "MBC2",
    "06": "MBC2+BATTERY",
    "08": "ROM+RAM 1",
    "09": "ROM+RAM+BATTERY 1",
    "0B": "MMM01",
    "0C": "MMM01+RAM",
    "0D": "MMM01+RAM+BATTERY",
    "0F": "MBC3+TIMER+BATTERY",
    "10": "MBC3+TIMER+RAM+BATTERY 2",
    "11": "MBC3",
    "12": "MBC3+RAM 2",
    "13": "MBC3+RAM+BATTERY 2",
    "19": "MBC5",
    "1A": "MBC5+RAM",
    "1B": "MBC5+RAM+BATTERY",
    "1C": "MBC5+RUMBLE",
    "1D": "MBC5+RUMBLE+RAM",
    "1E": "MBC5+RUMBLE+RAM+BATTERY",
    "20": "MBC6",
    "22": "MBC7+SENSOR+RUMBLE+RAM+BATTERY",
    "FC": "POCKET CAMERA",
    "FD": "BANDAI TAMA5",
    "FE": "HuC3",
    "FF": "HuC1+RAM+BATTERY"
  };

  const romSize = {
    "00": "32 KB",
    "01": "64 KB",
    "02": "128 KB",
    "03": "256 KB",
    "04": "512 KB",
    "05": "1 MB",
    "06": "2 MB",
    "07": "4 MB",
    "08": "8 MB",
    "52": "1.1 MB",
    "53": "1.2 MB",
    "54": "1.5 MB",
  };

  const ramSize = {
    "00": "No RAM",
    "01": "Unused",
    "02": "8 KB",
    "03": "32 KB",
    "04": "128 KB",
    "05": "64 KB",
  };

  const destinationCode = {
    "00": "Japan (and possibly overseas)",
    "01": "Overseas only",
  };

  const oldLicenseeCode = {
    "00": "None",
    "01": "Nintendo",
    "08": "Capcom",
    "09": "Hot-B",
    "0A": "Jaleco",
    "0B": "Coconuts Japan",
    "0C": "Elite Systems",
    "13": "EA (Electronic Arts)",
    "18": "Hudsonsoft",
    "19": "ITC Entertainment",
    "1A": "Yanoman",
    "1D": "Japan Clary",
    "1F": "Virgin Interactive",
    "24": "PCM Complete",
    "25": "San-X",
    "28": "Kotobuki Systems",
    "29": "Seta",
    "30": "Infogrames",
    "31": "Nintendo",
    "32": "Bandai",
    "34": "Konami",
    "35": "HectorSoft",
    "38": "Capcom",
    "39": "Banpresto",
    "3C": ".Entertainment i",
    "3E": "Gremlin",
    "41": "Ubisoft",
    "42": "Atlus",
    "44": "Malibu",
    "46": "Angel",
    "47": "Spectrum Holoby",
    "49": "Irem",
    "4A": "Virgin Interactive",
    "4D": "Malibu",
    "4F": "U.S. Gold",
    "50": "Absolute",
    "51": "Acclaim",
    "52": "Activision",
    "53": "American Sammy",
    "54": "GameTek",
    "55": "Park Place",
    "56": "LJN",
    "57": "Matchbox",
    "59": "Milton Bradley",
    "5A": "Mindscape",
    "5B": "Romstar",
    "5C": "Naxat Soft",
    "5D": "Tradewest",
    "60": "Titus",
    "61": "Virgin Interactive",
    "67": "Ocean Interactive",
    "69": "EA (Electronic Arts)",
    "6E": "Elite Systems",
    "6F": "Electro Brain",
    "70": "Infogrames",
    "71": "Interplay",
    "72": "Broderbund",
    "73": "Sculptered Soft",
    "75": "The Sales Curve",
    "78": "t.hq",
    "79": "Accolade",
    "7A": "Triffix Entertainment",
    "7C": "Microprose",
    "7F": "Kemco",
    "80": "Misawa Entertainment",
    "83": "Lozc",
    "86": "Tokuma Shoten Intermedia",
    "8B": "Bullet-Proof Software",
    "8C": "Vic Tokai",
    "8E": "Ape",
    "8F": "I’Max",
    "91": "Chunsoft Co.",
    "92": "Video System",
    "93": "Tsubaraya Productions Co.",
    "95": "Varie Corporation",
    "96": "Yonezawa/S’Pal",
    "97": "Kaneko",
    "99": "Arc",
    "9A": "Nihon Bussan",
    "9B": "Tecmo",
    "9C": "Imagineer",
    "9D": "Banpresto",
    "9F": "Nova",
    "A1": "Hori Electric",
    "A2": "Bandai",
    "A4": "Konami",
    "A6": "Kawada",
    "A7": "Takara",
    "A9": "Technos Japan",
    "AA": "Broderbund",
    "AC": "Toei Animation",
    "AD": "Toho",
    "AF": "Namco",
    "B0": "Acclaim",
    "B1": "ASCII or Nexoft",
    "B2": "Bandai",
    "B4": "Square Enix",
    "B6": "HAL Laboratory",
    "B7": "SNK",
    "B9": "Pony Canyon",
    "BA": "Culture Brain",
    "BB": "Sunsoft",
    "BD": "Sony Imagesoft",
    "BF": "Sammy",
    "C0": "Taito",
    "C2": "Kemco",
    "C3": "Squaresoft",
    "C4": "Tokuma Shoten Intermedia",
    "C5": "Data East",
    "C6": "Tonkinhouse",
    "C8": "Koei",
    "C9": "UFL",
    "CA": "Ultra",
    "CB": "Vap",
    "CC": "Use Corporation",
    "CD": "Meldac",
    "CE": ".Pony Canyon or",
    "CF": "Angel",
    "D0": "Taito",
    "D1": "Sofel",
    "D2": "Quest",
    "D3": "Sigma Enterprises",
    "D4": "ASK Kodansha Co.",
    "D6": "Naxat Soft",
    "D7": "Copya System",
    "D9": "Banpresto",
    "DA": "Tomy",
    "DB": "LJN",
    "DD": "NCS",
    "DE": "Human",
    "DF": "Altron",
    "E0": "Jaleco",
    "E1": "Towa Chiki",
    "E2": "Yutaka",
    "E3": "Varie",
    "E5": "Epcoh",
    "E7": "Athena",
    "E8": "Asmik ACE Entertainment",
    "E9": "Natsume",
    "EA": "King Records",
    "EB": "Atlus",
    "EC": "Epic/Sony Records",
    "EE": "IGS",
    "F0": "A Wave",
    "F3": "Extreme Entertainment",
    "FF": "LJN",
  };
   
  function obtainHeaderData() {
    // (1) Game Title
    let gameTitle = "";
    let i = 308;
    let thisHex = "";

    while (true) {
        const thisAddress = i.toString(16).padStart(4, "0");
        const element = document.getElementById(thisAddress);

        if (!element) {
            break; // Exit the loop if the element does not exist
        }

        thisHex = element.textContent;
        if (i === 323 || thisHex === "00") {
            break; // Exit the loop if the end condition is met
        }

        const thisAsciiValue = String.fromCharCode(parseInt(thisHex, 16));
        gameTitle += thisAsciiValue;
        i++;
    }

    // (2) Header Data
    const thisCgbFlag = cgbFlag[document.getElementById("0143").textContent] || "Unknown";
    const thisCartridgeType = cartridgeType[document.getElementById("0147").textContent] || "Unknown";
    const thisRomSize = romSize[document.getElementById("0148").textContent] || "Unknown";
    const thisRamSize = ramSize[document.getElementById("0149").textContent] || "Unknown";
    const thisDestinationCode = destinationCode[document.getElementById("014A").textContent] || "Unknown";
    
    let licenseeCode = "";
    const licensee = document.getElementById("014B").textContent;
    if (licensee !== "33") {
        licenseeCode = oldLicenseeCode[licensee] || "Unknown";
    } else {
        const licenseeCode1 = newLicenseeCode[document.getElementById("0144").textContent] || "Unknown";
        const licenseeCode2 = newLicenseeCode[document.getElementById("0145").textContent] || "Unknown";
        licenseeCode = licenseeCode1.replace("Unknown", "") + licenseeCode2.replace("Unknown", "");
    }

    // Populate the second column of the existing table with header data
    document.getElementById("gameTitle").textContent = gameTitle;
    document.getElementById("thisCgbFlag").textContent = thisCgbFlag;
    document.getElementById("thisCartridgeType").textContent = thisCartridgeType;
    document.getElementById("thisRomSize").textContent = thisRomSize;
    document.getElementById("thisRamSize").textContent = thisRamSize;
    document.getElementById("thisDestinationCode").textContent = thisDestinationCode;
    document.getElementById("licenseeCode").textContent = licenseeCode;
}