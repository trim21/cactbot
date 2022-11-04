import { logDefinitionsVersions } from '../resources/netlog_defs';

import { NetFields, NetFieldsReverse } from './net_fields_gen';

export { NetFields, NetFieldsReverse };

export type LogDefinitionTypes =
  | 'GameLog'
  | 'ChangeZone'
  | 'ChangedPlayer'
  | 'AddedCombatant'
  | 'RemovedCombatant'
  | 'PartyList'
  | 'PlayerStats'
  | 'StartsUsing'
  | 'Ability'
  | 'NetworkAOEAbility'
  | 'NetworkCancelAbility'
  | 'NetworkDoT'
  | 'WasDefeated'
  | 'GainsEffect'
  | 'HeadMarker'
  | 'NetworkRaidMarker'
  | 'NetworkTargetMarker'
  | 'LosesEffect'
  | 'NetworkGauge'
  | 'NetworkWorld'
  | 'ActorControl'
  | 'NameToggle'
  | 'Tether'
  | 'LimitBreak'
  | 'NetworkEffectResult'
  | 'StatusEffect'
  | 'NetworkUpdateHP'
  | 'Map'
  | 'SystemLogMessage'
  | 'StatusList3'
  | 'ParserInfo'
  | 'ProcessInfo'
  | 'Debug'
  | 'PacketDump'
  | 'Version'
  | 'Error'
  | 'None'
  | 'LineRegistration'
  | 'MapEffect'
  | 'FateDirector'
  | 'CEDirector';

export type NetAnyFields = NetFields[keyof NetFields];

export type ParseHelperField<
  Type extends LogDefinitionTypes,
  Fields extends NetFieldsReverse[Type],
  Field extends keyof Fields,
> = {
  field: Fields[Field] extends string ? Fields[Field] : never;
  value?: string;
  optional?: boolean;
};

export type ParseHelperFields<T extends LogDefinitionTypes> = {
  [field in keyof NetFieldsReverse[T]]: ParseHelperField<T, NetFieldsReverse[T], field>;
};

export type LogDefinitionVersions = keyof typeof logDefinitionsVersions;
