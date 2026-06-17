
export const KEYBIND_PRESETS = {
  WASD:  [{name: "forward", keys: ["ArrowUp", "w", "W"]},
{name: "backward", keys: ["ArrowDown", "s", "S"]},
{name: "left", keys: ["ArrowLeft", "a", "A"]},
{name: "right", keys: ["ArrowRight", "d", "D"]},
{name: "jump", keys: ["Space"]},
{name: "takeSnapshot", keys: ["p","P"]},

] ,
  AZERTY:[{name: "forward", keys: ["ArrowUp", "Z", "z"]},
    {name: "backward", keys: ["ArrowDown", "s", "S"]},
    {name: "left", keys: ["ArrowLeft", "q", "Q"]},
    {name: "right", keys: ["ArrowRight", "d", "D"]},
    {name: "jump", keys: ["Space"]},
    {name: "takeSnapshot", keys: ["p","P"]},

  ],
}

export type KeybindPresetType = keyof typeof KEYBIND_PRESETS
