import {saveJson, allPath, loadJsonFallbackSync } from './helper.js'

const fallback = {
  "tm": "https://files.cloudkuimages.guru/images/e3c1b6270771.png",
  "stm": "https://files.cloudkuimages.guru/images/e3c1b6270771.png",
  "dn": "Veronica",
  "sdn": "Verionica",
  "st": "President's Of Kado's Entertainment",
  "sst": "Fly in Web",
  "an": "Kado",
  "b1f": " ❄️ ⌞  *",
  "b1b": "*  ⌝",
  "b2f": "   ᯓ   ",
  "b2b": "",
  "b3f": "*📄 ",
  "b3b": "*"
}
const json = loadJsonFallbackSync(allPath.botInfo, fallback)

const botInfo = {
    tm: json.tm,
    stm: json.stm,
    dn: json.dn,
    sdn: json.sdn,
    st: json.st,
    sst: json.sst,
    an: json.an,
    b1f: json.b1f,
    b1b: json.b1b,
    b2f: json.b2f,
    b2b: json.b2b,
    b3f: json.b3f,
    b3b: json.b3b,
}

export { botInfo }

export function updateThumbnailMenu(url) {
    botInfo.tm = url
    saveJson(botInfo, allPath.botInfo)
}

export function updateSmallThumbnailMenu(url) {
    botInfo.stm = url
    saveJson(botInfo, allPath.botInfo)
}

export function updateDisplayName(name) {
    botInfo.dn = name
    saveJson(botInfo, allPath.botInfo)
}

export function updateSecondaryText(text) {
    botInfo.st = text
    saveJson(botInfo, allPath.botInfo)
}
export function updateSmallDisplayName(name) {
    botInfo.sdn = name
    saveJson(botInfo, allPath.botInfo)
}

export function updateSmallSecondaryText(text) {
    botInfo.sst = text
    saveJson(botInfo, allPath.botInfo)
}


export function updateBulletin1(front, back) {
    botInfo.b1f = front
    botInfo.b1b = back
    saveJson(botInfo, allPath.botInfo)
}

export function updateBulletin2(front, back) {
    botInfo.b2f = front
    botInfo.b2b = back
    saveJson(botInfo, allPath.botInfo)
}

export function updateBulletin3(front, back) {
    botInfo.b3f = front
    botInfo.b3b = back
    saveJson(botInfo, allPath.botInfo)
}
export function updateAuthorName(name) {
    botInfo.an = name
    saveJson(botInfo, allPath.botInfo)
}
