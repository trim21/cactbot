'use strict';

// In your cactbot/user/raidboss.js file, add the line:
//   Options.cactbote8sUptimeKnockbackStrat = true;
// .. if you want cactbot to callout Mirror Mirror 4's double knockback
// Callout happens during/after boss turns and requires <1.4s reaction time
// to avoid both Green and Read Mirror knockbacks.
// Example: https://clips.twitch.tv/CreativeDreamyAsparagusKlappa
// Group splits into two groups behind boss after the jump.
// Tanks adjust to where the Red and Green Mirror are located.
// One tank must be inbetween the party, the other closest to Greem Mirror.
// Once Green Mirror goes off, the tanks adjust for Red Mirror.

// TODO: figure out *anything* with mirrors and mirror colors
// TODO: yell at you to take the last tower for Light Rampant if needed
// TODO: yell at you to take the last tower for Icelit Dragonsong if needed
// TODO: House of light clock position callout
// TODO: Light Rampant early callouts (who has prox marker, who gets aoes)
// TODO: reflected scythe kick callout (stand by mirror)
// TODO: reflected axe kick callout (get under)
// TODO: callouts for initial Hallowed Wings mirrors?
// TODO: callouts for the stack group mirrors?
// TODO: icelit dragonsong callouts?

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(共鸣之章4\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(4\)$/,
  },
  zoneId: ZoneId.EdensVerseRefulgenceSavage,
  timelineFile: 'e8s.txt',
  timelineTriggers: [
    {
      id: 'E8S Shining Armor',
      regex: /(?<!Reflected )Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Reflected Armor',
      regex: /Reflected Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'E8S Frost Armor',
      // Not the reflected one, as we want the "move" call there
      // which will happen naturally from `Reflected Drachen Armor`.
      regex: /^Frost Armor$/,
      beforeSeconds: 2,
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'E8S Rush',
      regex: /Rush \d/,
      beforeSeconds: 5,
      infoText: function(data) {
        data.rushCount = data.rushCount || 0;
        data.rushCount++;
        return {
          en: 'Tether ' + data.rushCount,
          de: 'Verbindung ' + data.rushCount,
          fr: 'Lien ' + data.rushCount,
          cn: '和' + data.rushCount + '连线',
          ko: '선: ' + data.rushCount,
        };
      },
    },
  ],
  triggers: [
    {
      id: 'E8S Absolute Zero',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4DCC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4DCC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4DCC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4DCC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Biting Frost First Mirror',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      condition: function(data) {
        // Have not seen any frost yet.
        return !data.firstFrost;
      },
      // This cast is 5 seconds, so don't muddy the back/front call.
      // But also don't wait too long to give directions?
      delaySeconds: 2,
      infoText: {
        // Sorry, there are no mirror colors in the logs (YET),
        // and so this is the best that can be done.
        en: 'Go Back, Red Mirror Side',
        de: 'Nach Hinten gehen, Seite des roten Spiegels',
        fr: 'Allez derrière, côté miroir rouge',
        cn: '去后面，红镜子侧',
        ko: '빨간 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Driving Frost First Mirror',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      condition: function(data) {
        return !data.firstFrost;
      },
      // See comments on Biting Frost First Mirror above.
      delaySeconds: 2,
      infoText: {
        en: 'Go Front, Green Mirror Side',
        de: 'Nach Vorne gehen, Seite des grünen Spiegels',
        fr: 'Allez devant, côté miroir vert',
        cn: '去前面，绿镜子侧',
        ko: '초록 거울 방향 구석으로 이동',
      },
    },
    {
      id: 'E8S Reflected Frost 1',
      netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DB[78]', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Eisspiegel', id: '4DB[78]', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'miroir de glace', id: '4DB[78]', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '氷面鏡', id: '4DB[78]', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '冰面镜', id: '4DB[78]', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Swap Sides',
        de: 'Seiten wechseln',
        fr: 'Changez de côté',
        cn: '换边',
        ko: '반대로 이동',
      },
    },
    {
      id: 'E8S Biting Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D66', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D66', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D66', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D66', capture: false }),
      response: Responses.getBehind(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'biting';
      },
    },
    {
      id: 'E8S Driving Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D67', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D67', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D67', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D67', capture: false }),
      response: Responses.goFrontOrSides(),
      run: function(data) {
        data.firstFrost = data.firstFrost || 'driving';
      },
    },
    {
      id: 'E8S Forgetful Tank Second Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6[67]', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6[67]', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6[67]', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6[67]', capture: false }),
      condition: (data) => data.role == 'tank',
      delaySeconds: 43,
      suppressSeconds: 80,
      infoText: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            cn: '下次攻击前侧面',
            ko: '다음: Biting/スラッシュ',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          cn: '下次攻击后面',
          ko: '다음: Driving/スラスト',
        };
      },
      tts: function(data) {
        if (data.firstFrost == 'driving') {
          return {
            en: 'Biting Frost Next',
            de: 'Frosthieb als nächstes',
            fr: 'Taillade de givre bientôt',
            cn: '下次攻击前侧面',
            ko: '다음: 바이팅 스라슈',
          };
        }
        return {
          en: 'Driving Frost Next',
          de: 'Froststoß als nächstes',
          fr: 'Percée de givre bientôt',
          cn: '下次攻击后面',
          ko: '다음: 드라이빙 스라스토',
        };
      },
    },
    {
      id: 'E8S Diamond Frost',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Icicle Impact',
      netRegex: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Shiva', id: '4DA0' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'シヴァ', id: '4DA0' }),
      netRegexCn: NetRegexes.abilityFull({ source: '希瓦', id: '4DA0' }),
      netRegexKo: NetRegexes.abilityFull({ source: '시바', id: '4DA0' }),
      suppressSeconds: 20,
      infoText: function(data, matches) {
        let x = parseFloat(matches.x);
        if (x >= 99 && x <= 101) {
          return {
            en: 'North / South',
            de: 'Norden / Süden',
            fr: 'Nord / Sud',
            cn: '南北站位',
            ko: '남 / 북',
          };
        }
        return {
          en: 'East / West',
          de: 'Osten / Westen',
          fr: 'Est / Ouest',
          cn: '东西站位',
          ko: '동 / 서',
        };
      },
    },
    {
      id: 'E8S Diamond Frost Cleanse',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4D6C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4D6C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4D6C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4D6C', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse',
        de: 'Reinigen',
        fr: 'Guérison',
        cn: '驱散',
        ko: '에스나',
      },
    },
    {
      id: 'E8S Double Slap',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D65' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D65' }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D65' }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D65' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E8S Axe Kick',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6D', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6D', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Scythe Kick',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6E', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8S Light Rampant',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D73', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D73', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D73', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D73', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Refulgent Chain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8CD' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: {
        en: 'Chain on YOU',
        de: 'Kette auf DIR',
        fr: 'Chaîne sur VOUS',
        cn: '连线点名',
        ko: '사슬 대상자',
      },
    },
    {
      id: 'E8S Holy Light',
      netRegex: NetRegexes.tether({ id: '0002' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Orb on YOU',
        de: 'Orb auf DIR',
        fr: 'Orbe sur VOUS',
        cn: '拉球点名',
        ko: '구슬 대상자',
      },
    },
    {
      id: 'E8S Banish III',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D80', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D80', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D80', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D80', capture: false }),
      response: Responses.stack('info'),
    },
    {
      id: 'E8S Banish III Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D81', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D81', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D81', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D81', capture: false }),
      response: Responses.spread('alert'),
    },
    {
      id: 'E8S Akh Morn',
      netRegex: NetRegexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'] }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'] }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'] }),
      netRegexJa: NetRegexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'] }),
      netRegexCn: NetRegexes.startsUsing({ source: ['希瓦', '圣龙'], id: ['4D98', '4D79'] }),
      preRun: function(data, matches) {
        data.akhMornTargets = data.akhMornTargets || [];
        data.akhMornTargets.push(matches.target);
      },
      response: function(data, matches) {
        if (data.me == matches.target) {
          let onYou = {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          };
          // It'd be nice to have this be an alert, but it mixes with a lot of
          // other alerts (akh rhai "move" and worm's lament numbers).
          if (data.role == 'tank')
            return { infoText: onYou };
          return { alarmText: onYou };
        }
        if (data.akhMornTargets.length != 2)
          return;
        if (data.akhMornTargets.includes(data.me))
          return;
        return {
          infoText: {
            en: 'Akh Morn: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            de: 'Akh Morn: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            fr: 'Akh Morn : ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            ko: '아크몬 : ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
            cn: '死亡轮回: ' + data.akhMornTargets.map((x) => data.ShortName(x)).join(', '),
          },
        };
      },
    },
    {
      id: 'E8S Akh Morn Cleanup',
      netRegex: NetRegexes.startsUsing({ source: ['Shiva', 'Great Wyrm'], id: ['4D98', '4D79'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Shiva', 'Körper des heiligen Drachen'], id: ['4D98', '4D79'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Shiva', 'Dragon divin'], id: ['4D98', '4D79'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['シヴァ', '聖竜'], id: ['4D98', '4D79'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['希瓦', '圣龙'], id: ['4D98', '4D79'], capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.akhMornTargets;
      },
    },
    {
      id: 'E8S Morn Afah',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7B' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7B' }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7B' }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7B' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Morn Afah on YOU',
            de: 'Morn Afah auf DIR',
            fr: 'Morn Afah sur VOUS',
            cn: '无尽顿悟点名',
            ko: '몬아파 대상자',
          };
        }
        if (data.role == 'tank' || data.role == 'healer' || data.CanAddle()) {
          return {
            en: 'Morn Afah on ' + data.ShortName(matches.target),
            de: 'Morn Afah auf ' + data.ShortName(matches.target),
            fr: 'Morn Afah sur ' + data.ShortName(matches.target),
            cn: '无尽顿悟点 ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 몬 아파',
          };
        }
      },
    },
    {
      id: 'E8S Hallowed Wings Left',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D75', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D75', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D75', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D75', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'E8S Hallowed Wings Right',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D76', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D76', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D76', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D76', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'E8S Hallowed Wings Knockback',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D77', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D77', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D77', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D77', capture: false }),
      condition: function(data) {
        return data.options.cactbote8sUptimeKnockbackStrat;
      },
      // This gives a warning within 1.4 seconds, so you can hit arm's length.
      delaySeconds: 8.6,
      durationSeconds: 1.4,
      response: Responses.knockback(),
    },
    {
      id: 'E8S Wyrm\'s Lament',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8S Wyrm\'s Lament Counter',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7C', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7C', capture: false }),
      run: function(data) {
        data.wyrmsLament = data.wyrmsLament || 0;
        data.wyrmsLament++;
      },
    },
    {
      id: 'E8S Wyrmclaw',
      netRegex: NetRegexes.gainsEffect({ effectId: '8D2' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmclawNumber = {
            '14': 1,
            '22': 2,
            '30': 3,
            '38': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmclawNumber = {
            '22': 1,
            '38': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Red #' + data.wyrmclawNumber,
          de: 'Rot #' + data.wyrmclawNumber,
          fr: 'Rouge #' + data.wyrmclawNumber,
          cn: '红色 #' + data.wyrmclawNumber,
          ko: '빨강 ' + data.wyrmclawNumber + '번',
        };
      },
    },
    {
      id: 'E8S Wyrmfang',
      netRegex: NetRegexes.gainsEffect({ effectId: '8D3' }),
      condition: Conditions.targetIsYou(),
      preRun: function(data, matches) {
        if (data.wyrmsLament == 1) {
          data.wyrmfangNumber = {
            '20': 1,
            '28': 2,
            '36': 3,
            '44': 4,
          }[Math.ceil(matches.duration)];
        } else {
          data.wyrmfangNumber = {
            '28': 1,
            '44': 2,
          }[Math.ceil(matches.duration)];
        }
      },
      durationSeconds: function(data, matches) {
        return matches.duration;
      },
      alertText: function(data) {
        return {
          en: 'Blue #' + data.wyrmfangNumber,
          de: 'Blau #' + data.wyrmfangNumber,
          fr: 'Bleu #' + data.wyrmfangNumber,
          cn: '蓝色 #' + data.wyrmfangNumber,
          ko: '파랑 ' + data.wyrmfangNumber + '번',
        };
      },
    },
    {
      id: 'E8S Drachen Armor',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4DD2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4DD2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4DD2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4DD2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Reflected Drachen Armor',
      netRegex: NetRegexes.ability({ source: 'Frozen Mirror', id: '4DC2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Eisspiegel', id: '4DC2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Miroir De Glace', id: '4DC2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '氷面鏡', id: '4DC2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '冰面镜', id: '4DC2', capture: false }),
      response: Responses.move('alert'),
    },
    {
      id: 'E8S Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D82', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D82', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D82', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D82', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'E8S Holy Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D83', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D83', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D83', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D83', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'E8S Twin Stillness',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D68', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D68', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D68', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D68', capture: false }),
      response: Responses.getBackThenFront('alert'),
    },
    {
      id: 'E8S Twin Silence',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D69', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D69', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D69', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D69', capture: false }),
      response: Responses.getFrontThenBack('alert'),
    },
    {
      id: 'E8S Spiteful Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D6F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D6F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D6F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D6F', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8S Embittered Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D70', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D70', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D70', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D70', capture: false }),
      response: Responses.getInThenOut(),
    },
    {
      id: 'E8S Icelit Dragonsong Cleanse',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '4D7D', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '4D7D', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '4D7D', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '4D7D', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse DPS Only',
        de: 'Nur DPS reinigen',
        fr: 'Guérison => DPS seulement',
        cn: '驱散DPS',
        ko: '딜러만 에스나',
      },
    },
    {
      id: 'E8S Banish',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7E', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Stack in Tower',
        de: 'Auf Tank im Turm sammeln',
        fr: 'Package tanks dans les tours',
        cn: '坦克塔内分摊',
        ko: '탱커 쉐어',
      },
    },
    {
      id: 'E8S Banish Divided',
      netRegex: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Shiva', id: '4D7F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'シヴァ', id: '4D7F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '希瓦', id: '4D7F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '시바', id: '4D7F', capture: false }),
      condition: (data) => data.role == 'tank',
      alertText: {
        en: 'Tank Spread in Tower',
        de: 'Tank im Turm verteilen',
        fr: 'Dispersion tanks dans les tours',
        cn: '坦克塔内分散',
        ko: '탱커 산개',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Frozen Mirror': 'Eisspiegel',
        'great wyrm': 'Körper des heiligen Drachen',
        'Luminous Aether': 'Lichtäther',
        'Mothercrystal': 'Urkristall',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        'Absolute Zero': 'Absoluter Nullpunkt',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Axe/Scythe Kick': 'Axttritt/Abwehrtritt',
        'Banish(?! )': 'Verbannen',
        'Banish III': 'Verbannga',
        'Biting/Driving Frost': 'Frostshieb/Froststoß',
        'Bright Hunger': 'Erosionslicht',
        'Diamond Frost': 'Diamantstaub',
        'Double Slap': 'Doppelschlag',
        'Drachen Armor': 'Drachenrüstung',
        'Draconic Strike': 'Drakonischer Schlag',
        'Driving/Biting Frost': 'Froststoß/Frostshieb',
        'Embittered/Spiteful Dance': 'Strenger/Kalter Tanz',
        'Frigid Eruption': 'Eiseruption',
        'Frigid Needle': 'Eisnadel',
        'Frigid Stone': 'Eisstein',
        'Frigid Water': 'Eisfrost',
        'Frost Armor(?! )': 'Frostrüstung',
        'Hallowed Wings': 'Heilige Schwingen',
        'Heart Asunder': 'Herzensbrecher',
        'Heavenly Strike': 'Elysischer Schlag',
        'Holy': 'Sanctus',
        'Icelit Dragonsong': 'Lied von Eis und Licht',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Inescapable Illumination': 'Expositionslicht',
        'Light Rampant': 'Überflutendes Licht',
        'Mirror, Mirror': 'Spiegelland',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Spiegelung Rüstung (B)',
        'Reflected Armor \\(G\\)': 'Spiegelung Rüstung (G)',
        'Reflected Armor \\(R\\)': 'Spiegelung Rüstung (R)',
        'Reflected Drachen': 'Spiegelung Drachen',
        'Reflected Frost \\(G\\)': 'Spiegelung Frost (G)',
        'Reflected Frost \\(R\\)': 'Spiegelung Frost (R)',
        'Reflected Frost Armor': 'Spiegelung: Frostrüstung',
        'Reflected Kick \\(G\\)': 'Spiegelung Tritt (G)',
        'Reflected Shining Armor': 'Spiegelung: Funkelnde Rüstung',
        'Reflected Wings \\(B\\)': 'Spiegelung Schwingen (B)',
        'Reflected Wings \\(G\\)': 'Spiegelung Schwingen (G)',
        'Reflected Wings \\(R\\)': 'Spiegelung Schwingen (R)',
        'Rush': 'Sturm',
        'Scythe/Axe Kick': 'Abwehrtritt/Axttritt',
        'Shattered World': 'Zersplitterte Welt',
        'Shining Armor': 'Funkelnde Rüstung',
        'Skyfall': 'Vernichtung der Welt',
        'Spiteful/Embittered Dance': 'Kalter/Strenger Tanz',
        'The Path Of Light': 'Pfad des Lichts',
        'The House Of Light': 'Tsunami des Lichts',
        'Twin Silence/Stillness': 'Zwillingsschwerter der Ruhe/Stille',
        'Twin Stillness/Silence': 'Zwillingsschwerter der Stille/Ruhe',
        'Wyrm\'s Lament': 'Brüllen des heiligen Drachen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'frozen mirror': 'Miroir de glace',
        'great wyrm': 'Dragon divin',
        'luminous Aether': 'Éther de lumière',
        'Mothercrystal': 'Cristal-mère',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        '\\?': ' ?',
        'Absolute Zero': 'Zéro absolu',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Axe/Scythe Kick': 'Jambe pourfendeuse/faucheuse',
        'Banish(?! )': 'Bannissement',
        'Banish III': 'Méga Bannissement',
        'Biting/Driving Frost': 'Taillade/Percée de givre',
        'Bright Hunger': 'Lumière dévorante',
        'Double Slap': 'Gifle redoublée',
        'Drachen Armor': 'Armure des dragons',
        'Draconic Strike': 'Frappe draconique',
        'Driving/Biting Frost': 'Percée/taillade de givre',
        'Embittered/Spiteful Dance': 'Danse de la sévérité/froideur',
        'Frigid Eruption': 'Éruption de glace',
        'Frigid Needle': 'Dards de glace',
        'Frigid Stone': 'Rocher de glace',
        'Frigid Water': 'Cataracte gelée',
        'Frost Armor(?! )': 'Armure de givre',
        'Hallowed Wings': 'Aile sacrée',
        'Heart Asunder': 'Cœur déchiré',
        'Icelit Dragonsong': 'Chant de Glace et de Lumière',
        'Icicle Impact': 'Impact de stalactite',
        'Inescapable Illumination': 'Lumière révélatrice',
        'Heavenly Strike': 'Frappe céleste',
        'Holy': 'Miracle',
        'Light Rampant': 'Débordement de Lumière',
        'Mirror, Mirror': 'Monde des miroirs',
        'Morn Afah': 'Morn Afah',
        'Reflected Armor \\(B\\)': 'Armure réverbérée (B)',
        'Reflected Armor \\(G\\)': 'Armure réverbérée (V)',
        'Reflected Armor \\(R\\)': 'Armure réverbérée (R)',
        'Reflected Drachen': 'Dragon réverbéré',
        'Reflected Frost \\(G\\)': 'Givre réverbéré (V)',
        'Reflected Frost \\(R\\)': 'Givre réverbéré (R)',
        'Reflected Frost Armor': 'Réverbération : Armure de givre',
        'Reflected Kick \\(G\\)': 'Jambe réverbérée (V)',
        'Reflected Shining Armor': 'Réverbération : Armure scintillante',
        'Reflected Wings \\(B\\)': 'Aile réverbérée (B)',
        'Reflected Wings \\(G\\)': 'Aile réverbérée (V)',
        'Reflected Wings \\(R\\)': 'Aile réverbérée (R)',
        'Rush': 'Jaillissement',
        'Scythe/Axe Kick': 'Jambe faucheuse/pourfendeuse',
        'Shattered World': 'Monde fracassé',
        'Shining Armor': 'Armure scintillante',
        'Skyfall': 'Anéantissement',
        'Spiteful/Embittered Dance': 'Danse de la froideur/sévérité',
        'The Path Of Light': 'Voie de lumière',
        'The House Of Light': 'Raz-de-lumière',
        'Twin Silence/Stillness': 'Entaille de la tranquilité/quiétude',
        'Twin Stillness/Silence': 'Entaille de la quiétude/tranquilité',
        'Wyrm\'s Lament': 'Rugissement du Dragon divin',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'frozen mirror': '氷面鏡',
        'great wyrm': '聖竜',
        'luminous Aether': 'ライト・エーテル',
        'Mothercrystal': 'マザークリスタル',
        'Shiva': 'シヴァ',
      },
      'replaceText': {
        'Absolute Zero': '絶対零度',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Axe/Scythe Kick': 'アクスキック/サイスキック',
        'Banish(?! )': 'バニシュ',
        'Banish III': 'バニシュガ',
        'Biting/Driving Frost': 'フロストスラッシュ/フロストスラスト',
        'Bright Hunger': '浸食光',
        'Double Slap': 'ダブルスラップ',
        'Drachen Armor': 'ドラゴンアーマー',
        'Draconic Strike': 'ドラコニックストライク',
        'Driving/Biting Frost': 'フロストスラスト/フロストスラッシュ',
        'Embittered/Spiteful Dance': '峻厳の舞踏技 / 冷厳の舞踏技',
        'Frigid Eruption': 'アイスエラプション',
        'Frigid Needle': 'アイスニードル',
        'Frigid Stone': 'アイスストーン',
        'Frigid Water': 'アイスフロスト',
        'Frost Armor(?! )': 'フロストアーマー',
        'Hallowed Wings': 'ホーリーウィング',
        'Heart Asunder': 'ハートアサンダー',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Holy': 'ホーリー',
        'Icelit Dragonsong': '氷と光の竜詩',
        'Icicle Impact': 'アイシクルインパクト',
        'Inescapable Illumination': '曝露光',
        'Light Rampant': '光の暴走',
        'Mirror, Mirror': '鏡の国',
        'Morn Afah': 'モーン・アファー',
        'Reflected Armor \\(B\\)': '反射アーマー（青）',
        'Reflected Armor \\(G\\)': '反射アーマー（緑）',
        'Reflected Armor \\(R\\)': '反射アーマー（赤）',
        'Reflected Drachen': '反射ドラゴンアーマー',
        'Reflected Frost \\(G\\)': '反射フロスト（緑）',
        'Reflected Frost \\(R\\)': '反射フロスト（赤）',
        'Reflected Frost Armor': 'ミラーリング・フロストアーマー',
        'Reflected Kick \\(G\\)': '反射キック',
        'Reflected Shining Armor': 'ミラーリング・ブライトアーマー',
        'Reflected Wings \\(B\\)': '反射ホーリーウィング（青)',
        'Reflected Wings \\(G\\)': '反射ホーリーウィング（緑）',
        'Reflected Wings \\(R\\)': '反射ホーリーウィング（赤）',
        'Rush': 'ラッシュ',
        'Scythe/Axe Kick': 'サイスキック/アクスキック',
        'Shattered World': 'シャッタード・ワールド',
        'Shining Armor': 'ブライトアーマー',
        'Skyfall': '世界消滅',
        'Spiteful/Embittered Dance': '冷厳の舞踏技 / 峻厳の舞踏技',
        'the Path of Light': '光の波動',
        'the House of Light': '光の津波',
        'Twin Silence/Stillness': '閑寂の双剣技／静寂の双剣技',
        'Twin Stillness/Silence': '静寂の双剣技／閑寂の双剣技',
        'Wyrm\'s Lament': '聖竜の咆哮',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Shiva': '希瓦',
        'Frozen Mirror': '冰面镜',
        'Mothercrystal': '母水晶',
        'Luminous Aether': '光以太',
        'great wyrm': '圣龙',
      },
      'replaceText': {
        'Absolute Zero': '绝对零度',
        'Mirror, Mirror': '镜中奇遇',
        'Biting/Driving Frost': '冰霜斩/刺',
        'Reflected Frost \\(G\\)': '连锁反斩(绿)',
        'Reflected Frost \\(R\\)': '连锁反斩(红)',
        'Diamond Frost': '钻石星尘',
        'Frigid Stone': '冰石',
        'Icicle Impact': '冰柱冲击',
        'Heavenly Strike': '天降一击',
        'Frigid Needle': '冰针',
        'Frigid Water': '冰霜',
        'Frigid Eruption': '极冰喷发',
        'Driving/Biting Frost': '冰霜刺/斩',
        'Double Slap': '双剑斩',
        'Shining Armor': '闪光护甲',
        'Axe/Scythe Kick': '阔斧/镰形回旋踢',
        'Light Rampant': '光之失控',
        'Bright Hunger': '侵蚀光',
        'The Path Of Light': '光之波动',
        'Scythe/Axe Kick': '镰形/阔斧回旋踢',
        'Reflected Kick \\(G\\)': '连锁反踢(绿)',
        'Banish III': '强放逐',
        'Shattered World': '世界分断',
        'Heart Asunder': '心碎',
        'Rush': '蓄势冲撞',
        'Skyfall': '世界消亡',
        'Akh Morn': '死亡轮回',
        'Morn Afah': '无尽顿悟',
        'Hallowed Wings': '神圣之翼',
        'Reflected Wings \\(B\\)': '连锁反翼(蓝)',
        'Reflected Wings \\(G\\)': '连锁反翼(绿)',
        'Reflected Wings \\(R\\)': '连锁反翼(红)',
        'Wyrm\'s Lament': '圣龙咆哮',
        '(?<! )Frost Armor': '冰霜护甲',
        'Twin Silence/Stillness': '闲寂/静寂的双剑技',
        'Twin Stillness/Silence': '静寂/闲寂的双剑技',
        'Drachen Armor': '圣龙护甲',
        'Akh Rhai': '天光轮回',
        'Reflected Armor \\(B\\)': '连锁反甲(蓝)',
        'Reflected Armor \\(G\\)': '连锁反甲(绿)',
        'Reflected Armor \\(R\\)': '连锁反甲(红)',
        'Holy': '神圣',
        'Embittered/Spiteful Dance': '严峻/冷峻之舞',
        'Spiteful/Embittered Dance': '冷峻/严峻之舞',
        'Reflected Drachen': '连锁反射：圣龙护甲',
        'Icelit Dragonsong': '冰与光的龙诗',
        'Draconic Strike': '圣龙一击',
        'Banish(?! )': '放逐',
        'Inescapable Illumination': '曝露光',
        'The House Of Light': '光之海啸',
        'Reflected Frost Armor \\(G\\)': '连锁反冰甲(绿)',
      },
    },
  ],
}];
