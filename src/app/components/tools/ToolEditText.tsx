'use client';
import { useState, useMemo } from 'react';

type TextStyle = {
    id: string;
    name: string;
    transform: (text: string) => string;
};

export default function ToolEditText() {
    const [inputText, setInputText] = useState('abc');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Character mapping for transformations
    const charMaps: Record<string, Record<string, string>> = {
        oldEnglish: {
            'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
            'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
            'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
            'y': '𝔶', 'z': '𝔷',
            'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ',
            'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓',
            'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛',
            'Y': '𝔜', 'Z': 'ℨ'
        },
        medieval: {
            'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍',
            'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕',
            'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝',
            'y': '𝖞', 'z': '𝖟',
            'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳',
            'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻',
            'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃',
            'Y': '𝖄', 'Z': '𝖅'
        },
        cursive: {
            'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
            'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
            'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
            'y': '𝔂', 'z': '𝔃',
            'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗',
            'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟',
            'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧',
            'Y': '𝓨', 'Z': '𝓩'
        },
        scriptify: {
            'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽',
            'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅',
            'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
            'y': '𝓎', 'z': '𝓏',
            'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ',
            'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫',
            'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
            'Y': '𝒴', 'Z': '𝒵'
        },
        doubleStruck: {
            'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
            'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡',
            'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩',
            'y': '𝕪', 'z': '𝕫',
            'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ',
            'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ',
            'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏',
            'Y': '𝕐', 'Z': 'ℤ'
        },
        wide: {
            'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ',
            'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ',
            'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ',
            'y': 'ｙ', 'z': 'ｚ',
            'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ',
            'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ',
            'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ',
            'Y': 'Ｙ', 'Z': 'Ｚ'
        },
        tiny: {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ',
            'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
            'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
            'y': 'ʏ', 'z': 'ᴢ',
            'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ',
            'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ',
            'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x',
            'Y': 'ʏ', 'Z': 'ᴢ'
        },
        bold: {
            'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
            'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩',
            'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
            'y': '𝐲', 'z': '𝐳',
            'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
            'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏',
            'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
            'Y': '𝐘', 'Z': '𝐙'
        },
        boldSans: {
            'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
            'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
            'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
            'y': '𝘆', 'z': '𝘇',
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
            'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
            'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
            'Y': '𝗬', 'Z': '𝗭'
        },
        italic: {
            'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
            'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
            'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
            'y': '𝘺', 'z': '𝘻',
            'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏',
            'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗',
            'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
            'Y': '𝘠', 'Z': '𝘡'
        },
        boldItalic: {
            'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝',
            'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥',
            'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭',
            'y': '𝙮', 'z': '𝙯',
            'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃',
            'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋',
            'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓',
            'Y': '𝙔', 'Z': '𝙕'
        },
        monospace: {
            'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
            'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
            'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
            'y': '𝚢', 'z': '𝚣',
            'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷',
            'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿',
            'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇',
            'Y': '𝚈', 'Z': '𝚉'
        },
        bubbles: {
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ',
            'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ',
            'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ',
            'y': 'ⓨ', 'z': 'ⓩ',
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ',
            'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ',
            'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ',
            'Y': 'Ⓨ', 'Z': 'Ⓩ'
        },
        subscript: {
            'a': 'ₐ', 'b': 'ᵦ', 'c': 'c', 'd': 'd', 'e': 'ₑ', 'f': 'f', 'g': 'g', 'h': 'ₕ',
            'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ',
            'q': 'q', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'w': 'w', 'x': 'ₓ',
            'y': 'y', 'z': 'z',
            'A': 'ₐ', 'B': 'ᵦ', 'C': 'c', 'D': 'd', 'E': 'ₑ', 'F': 'f', 'G': 'g', 'H': 'ₕ',
            'I': 'ᵢ', 'J': 'ⱼ', 'K': 'ₖ', 'L': 'ₗ', 'M': 'ₘ', 'N': 'ₙ', 'O': 'ₒ', 'P': 'ₚ',
            'Q': 'q', 'R': 'ᵣ', 'S': 'ₛ', 'T': 'ₜ', 'U': 'ᵤ', 'V': 'ᵥ', 'W': 'w', 'X': 'ₓ',
            'Y': 'y', 'Z': 'z'
        },
        superscript: {
            'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
            'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
            'q': 'ᵠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ',
            'y': 'ʸ', 'z': 'ᶻ',
            'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ',
            'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ',
            'Q': 'ᵠ', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ',
            'Y': 'ʸ', 'Z': 'ᶻ'
        }
    };

    const transformText = (text: string, map: Record<string, string> | undefined): string => {
        if (!map || !text) return text || '';
        return text.split('').map(char => map[char] || char).join('');
    };

    const textStyles: TextStyle[] = useMemo(() => {
        // Helper function to safely get character at index with fallback
        const safeChar = (str: string, index: number, fallback: string = ''): string => {
            return str && str.length > index ? str[index] : fallback;
        };

        return [
        {
            id: 'oldEnglish',
            name: 'Old English',
            transform: (text) => transformText(text, charMaps.oldEnglish)
        },
        {
            id: 'medieval',
            name: 'Medieval',
            transform: (text) => transformText(text, charMaps.medieval)
        },
        {
            id: 'crazy',
            name: 'Crazy',
            transform: (text) => {
                const emojis = ['🐟', '🐜', '🐺', '💝', '💦', '💖'];
                const crazyMap: Record<string, string> = {
                    'a': '𝓪', 'b': 'ⓑ', 'c': '匚',
                    'A': '𝓐', 'B': 'Ⓑ', 'C': '匚'
                };
                const transformed = transformText(text, crazyMap);
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                return `${randomEmoji} ${transformed} ${emojis[Math.floor(Math.random() * emojis.length)]}`;
            }
        },
        {
            id: 'cursive',
            name: 'Cursive',
            transform: (text) => transformText(text, charMaps.cursive)
        },
        {
            id: 'scriptify',
            name: 'Scriptify',
            transform: (text) => transformText(text, charMaps.scriptify)
        },
        {
            id: 'doubleStruck',
            name: 'Double Struck',
            transform: (text) => transformText(text, charMaps.doubleStruck)
        },
        {
            id: 'wide',
            name: 'Wide Text',
            transform: (text) => transformText(text, charMaps.wide)
        },
        {
            id: 'cute',
            name: 'Cute Text',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `🍓 🎀 ${script} 🎀 🍓`;
            }
        },
        {
            id: 'tiny',
            name: 'Tiny Text',
            transform: (text) => transformText(text, charMaps.tiny)
        },
        {
            id: 'flip',
            name: 'Flip Text',
            transform: (text) => {
                const flipMap: Record<string, string> = {
                    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
                    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
                    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
                    'y': 'ʎ', 'z': 'z',
                    'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H',
                    'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
                    'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
                    'Y': '⅄', 'Z': 'Z'
                };
                return transformText(text, flipMap).split('').reverse().join('');
            }
        },
        {
            id: 'roundedSquares',
            name: 'Rounded Squares',
            transform: (text) => text.split('').map(char => `${char}⃣`).join('   ')
        },
        {
            id: 'squares1',
            name: 'Squares 1',
            transform: (text) => text.split('').map(char => `${char}⃞`).join('  ')
        },
        {
            id: 'squares2',
            name: 'Squares 2',
            transform: (text) => {
                const squaresMap: Record<string, string> = {
                    'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷',
                    'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿',
                    'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇',
                    'y': '🅈', 'z': '🅉',
                    'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷',
                    'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿',
                    'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇',
                    'Y': '🅈', 'Z': '🅉'
                };
                return transformText(text, squaresMap);
            }
        },
        {
            id: 'mirror',
            name: 'Mirror',
            transform: (text) => {
                const mirrorMap: Record<string, string> = {
                    'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
                    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
                    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
                    'y': 'ʎ', 'z': 'z'
                };
                return transformText(text.toLowerCase(), mirrorMap).split('').reverse().join('');
            }
        },
        {
            id: 'creepify',
            name: 'Creepify',
            transform: (text) => {
                const combining = ['̷', '̓', '͠', '̋', '̟', '̻', '̨', '̭', '̵', '̑', '̢', '̲', '̝', '̧', '̸', '̚', '̉', '̟', '̙', '͉', '͈', '̘', '̤', '̫', '̨', '̱'];
                return text.split('').map(char => {
                    const random = combining[Math.floor(Math.random() * combining.length)];
                    return char + random;
                }).join('');
            }
        },
        {
            id: 'invertedSquares',
            name: 'Inverted Squares',
            transform: (text) => {
                const invertedMap: Record<string, string> = {
                    'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
                    'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
                    'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
                    'y': '🆈', 'z': '🆉',
                    'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷',
                    'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿',
                    'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇',
                    'Y': '🆈', 'Z': '🆉'
                };
                return transformText(text, invertedMap);
            }
        },
        {
            id: 'subscript',
            name: 'Subscript',
            transform: (text) => transformText(text, charMaps.subscript)
        },
        {
            id: 'superscript',
            name: 'Superscript',
            transform: (text) => transformText(text, charMaps.superscript)
        },
        {
            id: 'bubbles',
            name: 'Bubbles',
            transform: (text) => transformText(text, charMaps.bubbles)
        },
        {
            id: 'squiggle',
            name: 'Squiggle',
            transform: (text) => {
                const squiggleMap: Record<string, string> = {
                    'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ',
                    'i': 'เ', 'j': 'ן', 'k': 'к', 'l': 'l', 'm': '๓', 'n': 'ภ', 'o': '๏', 'p': 'ק',
                    'q': 'ợ', 'r': 'г', 's': 'ร', 't': 't', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א',
                    'y': 'ץ', 'z': 'z'
                };
                return transformText(text.toLowerCase(), squiggleMap);
            }
        },
        {
            id: 'squiggle2',
            name: 'Squiggle 2',
            transform: (text) => {
                const squiggle2Map: Record<string, string> = {
                    'a': 'α', 'b': 'Ⴆ', 'c': 'ƈ', 'd': 'ԃ', 'e': 'ҽ', 'f': 'ϝ', 'g': 'ɠ', 'h': 'ԋ',
                    'i': 'ι', 'j': 'ʝ', 'k': 'ƙ', 'l': 'ʅ', 'm': 'ɱ', 'n': 'ɳ', 'o': 'σ', 'p': 'ρ',
                    'q': 'զ', 'r': 'ɾ', 's': 'ʂ', 't': 'ƚ', 'u': 'υ', 'v': 'ʋ', 'w': 'ɯ', 'x': 'x',
                    'y': 'ყ', 'z': 'ȥ'
                };
                return transformText(text.toLowerCase(), squiggle2Map);
            }
        },
        {
            id: 'squiggle3',
            name: 'Squiggle 3',
            transform: (text) => {
                const squiggle3Map: Record<string, string> = {
                    'a': 'ǟ', 'b': 'ɮ', 'c': 'ƈ', 'd': 'ɖ', 'e': 'ɛ', 'f': 'ʄ', 'g': 'ɢ', 'h': 'ɦ',
                    'i': 'ɨ', 'j': 'ʝ', 'k': 'ƙ', 'l': 'ʟ', 'm': 'ʍ', 'n': 'ռ', 'o': 'օ', 'p': 'ք',
                    'q': 'զ', 'r': 'ʀ', 's': 'ֆ', 't': 'ȶ', 'u': 'ʊ', 'v': 'ʋ', 'w': 'ա', 'x': 'x',
                    'y': 'ʏ', 'z': 'ʐ'
                };
                return transformText(text.toLowerCase(), squiggle3Map);
            }
        },
        {
            id: 'squiggle4',
            name: 'Squiggle 4',
            transform: (text) => {
                const squiggle4Map: Record<string, string> = {
                    'a': 'Ꮧ', 'b': 'Ᏸ', 'c': 'ፈ', 'd': 'Ꮄ', 'e': 'Ꮛ', 'f': 'Ꭶ', 'g': 'Ꮆ', 'h': 'Ꮒ',
                    'i': 'Ꭵ', 'j': 'Ꮰ', 'k': 'Ꮶ', 'l': 'Ꮭ', 'm': 'Ꮇ', 'n': 'Ꮑ', 'o': 'Ꭷ', 'p': 'Ꭾ',
                    'q': 'Ꭴ', 'r': 'Ꮢ', 's': 'Ꮥ', 't': 'Ꮦ', 'u': 'Ꮼ', 'v': 'Ꮙ', 'w': 'Ꮗ', 'x': 'ጀ',
                    'y': 'Ꭹ', 'z': 'ፚ'
                };
                return transformText(text.toLowerCase(), squiggle4Map);
            }
        },
        {
            id: 'squiggle5',
            name: 'Squiggle 5',
            transform: (text) => {
                const squiggle5Map: Record<string, string> = {
                    'a': 'ą', 'b': 'ც', 'c': 'ƈ', 'd': 'ɖ', 'e': 'ɛ', 'f': 'ʄ', 'g': 'ɠ', 'h': 'ɧ',
                    'i': 'ı', 'j': 'ʝ', 'k': 'ƙ', 'l': 'Ɩ', 'm': 'ɱ', 'n': 'ŋ', 'o': 'ơ', 'p': '℘',
                    'q': 'զ', 'r': 'ཞ', 's': 'ʂ', 't': 'ɬ', 'u': 'ų', 'v': '۷', 'w': 'ῳ', 'x': 'ҳ',
                    'y': 'ყ', 'z': 'ƶ'
                };
                return transformText(text.toLowerCase(), squiggle5Map);
            }
        },
        {
            id: 'squiggle6',
            name: 'Squiggle 6',
            transform: (text) => {
                const squiggle6Map: Record<string, string> = {
                    'a': 'ค', 'b': '๖', 'c': '¢', 'd': '໓', 'e': 'ē', 'f': 'f', 'g': 'ງ', 'h': 'h',
                    'i': 'i', 'j': 'ว', 'k': 'k', 'l': 'l', 'm': '๓', 'n': 'ຖ', 'o': '໐', 'p': 'p',
                    'q': '๑', 'r': 'r', 's': 'Ş', 't': 't', 'u': 'น', 'v': 'ง', 'w': 'ຟ', 'x': 'x',
                    'y': 'ฯ', 'z': 'ຊ'
                };
                return transformText(text.toLowerCase(), squiggle6Map);
            }
        },
        {
            id: 'bold',
            name: 'Bold',
            transform: (text) => transformText(text, charMaps.bold)
        },
        {
            id: 'boldSans',
            name: 'Bold Sans',
            transform: (text) => transformText(text, charMaps.boldSans)
        },
        {
            id: 'italic',
            name: 'Italic',
            transform: (text) => transformText(text, charMaps.italic)
        },
        {
            id: 'boldItalic',
            name: 'Bold Italic',
            transform: (text) => transformText(text, charMaps.boldItalic)
        },
        {
            id: 'monospace',
            name: 'Monospace',
            transform: (text) => transformText(text, charMaps.monospace)
        },
        {
            id: 'upperAngles',
            name: 'Upper Angles',
            transform: (text) => {
                const anglesMap: Record<string, string> = {
                    'a': 'Λ', 'b': 'B', 'c': 'ᄃ', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H',
                    'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P',
                    'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X',
                    'y': 'Y', 'z': 'Z'
                };
                return transformText(text.toLowerCase(), anglesMap);
            }
        },
        {
            id: 'greek',
            name: 'Greek',
            transform: (text) => {
                const greekMap: Record<string, string> = {
                    'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н',
                    'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ',
                    'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ',
                    'y': 'у', 'z': 'z'
                };
                return transformText(text.toLowerCase(), greekMap);
            }
        },
        {
            id: 'symbols',
            name: 'Symbols',
            transform: (text) => {
                const symbolsMap: Record<string, string> = {
                    'a': 'å', 'b': 'ß', 'c': '¢', 'd': 'đ', 'e': 'ë', 'f': 'ƒ', 'g': 'g', 'h': 'ħ',
                    'i': 'ï', 'j': 'ĵ', 'k': 'ķ', 'l': 'ł', 'm': 'm', 'n': 'ñ', 'o': 'ø', 'p': 'þ',
                    'q': 'q', 'r': 'ř', 's': 'ş', 't': 'ŧ', 'u': 'ü', 'v': 'v', 'w': 'ŵ', 'x': '×',
                    'y': 'ÿ', 'z': 'ž'
                };
                return transformText(text.toLowerCase(), symbolsMap);
            }
        },
        {
            id: 'currency',
            name: 'Currency',
            transform: (text) => {
                const currencyMap: Record<string, string> = {
                    'a': '₳', 'b': '฿', 'c': '₵', 'd': '₫', 'e': '€', 'f': '₣', 'g': '₲', 'h': '₴',
                    'i': '₮', 'j': '₱', 'k': '₭', 'l': '₺', 'm': '₼', 'n': '₦', 'o': '₨', 'p': '₽',
                    'q': '₨', 'r': '₹', 's': '₪', 't': '₸', 'u': '₩', 'v': '₽', 'w': '₩', 'x': '₽',
                    'y': '¥', 'z': '₽',
                    'A': '₳', 'B': '฿', 'C': '₵', 'D': '₫', 'E': '€', 'F': '₣', 'G': '₲', 'H': '₴',
                    'I': '₮', 'J': '₱', 'K': '₭', 'L': '₺', 'M': '₼', 'N': '₦', 'O': '₨', 'P': '₽',
                    'Q': '₨', 'R': '₹', 'S': '₪', 'T': '₸', 'U': '₩', 'V': '₽', 'W': '₩', 'X': '₽',
                    'Y': '¥', 'Z': '₽'
                };
                return transformText(text, currencyMap);
            }
        },
        {
            id: 'asianStyle',
            name: 'Asian Style',
            transform: (text) => {
                const asianMap: Record<string, string> = {
                    'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄',
                    'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': 'ㄥ', 'm': '爪', 'n': '几', 'o': 'ㄖ', 'p': '卩',
                    'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
                    'y': 'ㄚ', 'z': '乙'
                };
                return transformText(text.toLowerCase(), asianMap);
            }
        },
        {
            id: 'asianStyle2',
            name: 'Asian Style 2',
            transform: (text) => {
                const asian2Map: Record<string, string> = {
                    'a': 'ﾑ', 'b': '乃', 'c': 'ᄃ', 'd': 'り', 'e': '乇', 'f': 'ｷ', 'g': 'ム', 'h': 'ん',
                    'i': 'ﾉ', 'j': 'ﾌ', 'k': 'ズ', 'l': 'ﾚ', 'm': 'ﾶ', 'n': '刀', 'o': 'の', 'p': 'ｱ',
                    'q': 'ゐ', 'r': '尺', 's': '丂', 't': 'ｲ', 'u': 'ひ', 'v': '√', 'w': 'W', 'x': 'ﾒ',
                    'y': 'ﾘ', 'z': '乙'
                };
                return transformText(text.toLowerCase(), asian2Map);
            }
        },
        {
            id: 'thickBlockFramed',
            name: 'Thick Block Framed',
            transform: (text) => text.split('').map(char => `【${char}】`).join('')
        },
        {
            id: 'diametricAngleFrame',
            name: 'Diametric Angle Frame',
            transform: (text) => text.split('').map(char => `『${char}』`).join('')
        },
        {
            id: 'wavyJoiner',
            name: 'Wavy Joiner',
            transform: (text) => text.split('').map(char => `≋${char}≋`).join('')
        },
        {
            id: 'dottyJoiner',
            name: 'Dotty Joiner',
            transform: (text) => text.split('').map(char => `░${char}░`).join('')
        },
        {
            id: 'kirbyHug',
            name: 'Kirby Hug',
            transform: (text) => `(っ◔◡◔)っ ♥ ${text} ♥`
        },
        {
            id: 'vaporwave',
            name: 'Vaporwave',
            transform: (text) => {
                const wide = transformText(text, charMaps.wide);
                return `${wide}　河彙ー ${wide}　（河彙ー） 【﻿${wide}】`;
            }
        },
        {
            id: 'littleSparkles',
            name: 'Little Sparkles',
            transform: (text) => `˜"*°•.˜"*°• ${text} •°*"˜.•°*"˜`
        },
        {
            id: 'weirdBox',
            name: 'Weird Box',
            transform: (text) => text.split('').map(char => `[̲̅${char}]`).join('')
        },
        {
            id: 'firework',
            name: 'Firework',
            transform: (text) => text.split('').map(char => `${char}҉`).join('')
        },
        {
            id: 'bentText',
            name: 'Bent Text',
            transform: (text) => {
                const bentMap: Record<string, string> = {
                    'a': 'ą', 'b': 'ҍ', 'c': 'ç', 'd': 'ժ', 'e': 'ҽ', 'f': 'ƒ', 'g': 'ց', 'h': 'հ',
                    'i': 'ì', 'j': 'ʝ', 'k': 'ҟ', 'l': 'Ӏ', 'm': 'ʍ', 'n': 'ղ', 'o': 'օ', 'p': 'ք',
                    'q': 'զ', 'r': 'ɾ', 's': 'ʂ', 't': 'է', 'u': 'մ', 'v': 'ѵ', 'w': 'ա', 'x': '×',
                    'y': 'վ', 'z': 'Հ'
                };
                return transformText(text.toLowerCase(), bentMap);
            }
        },
        {
            id: 'neon',
            name: 'Neon',
            transform: (text) => {
                const neonMap: Record<string, string> = {
                    'a': 'ᗩ', 'b': 'ᗷ', 'c': 'ᑕ', 'd': 'ᗪ', 'e': 'E', 'f': 'ᖴ', 'g': 'G', 'h': 'ᕼ',
                    'i': 'I', 'j': 'ᒍ', 'k': 'K', 'l': 'ᒪ', 'm': 'ᗰ', 'n': 'ᑎ', 'o': 'O', 'p': 'ᑭ',
                    'q': 'ᑫ', 'r': 'ᖇ', 's': 'ᔕ', 't': 'T', 'u': 'ᑌ', 'v': 'ᐯ', 'w': 'ᗯ', 'x': '᙭',
                    'y': 'ᖻ', 'z': 'ᘔ'
                };
                return transformText(text.toUpperCase(), neonMap);
            }
        },
        {
            id: 'futureAlien',
            name: 'Future Alien',
            transform: (text) => {
                const alienMap: Record<string, string> = {
                    'a': 'ᗩ', 'b': 'ᗷ', 'c': 'ᑢ', 'd': 'ᗪ', 'e': 'E', 'f': 'ᖴ', 'g': 'G', 'h': 'ᕼ',
                    'i': 'I', 'j': 'ᒍ', 'k': 'K', 'l': 'ᒪ', 'm': 'ᗰ', 'n': 'ᑎ', 'o': 'O', 'p': 'ᑭ',
                    'q': 'ᑫ', 'r': 'ᖇ', 's': 'ᔕ', 't': 'T', 'u': 'ᑌ', 'v': 'ᐯ', 'w': 'ᗯ', 'x': '᙭',
                    'y': 'ᖻ', 'z': 'ᘔ'
                };
                return transformText(text.toUpperCase(), alienMap);
            }
        },
        {
            id: 'strikeThrough',
            name: 'Strike Through',
            transform: (text) => text.split('').map(char => `${char}̶`).join('')
        },
        {
            id: 'tildeStrikeThrough',
            name: 'Tilde Strike Through',
            transform: (text) => text.split('').map(char => `${char}̴`).join('')
        },
        {
            id: 'slashThrough',
            name: 'Slash Through',
            transform: (text) => text.split('').map(char => `${char}̷`).join('')
        },
        {
            id: 'underline',
            name: 'Underline',
            transform: (text) => text.split('').map(char => `${char}̲`).join('')
        },
        {
            id: 'doubleUnderline',
            name: 'Double Underline',
            transform: (text) => text.split('').map(char => `${char}̳`).join('')
        },
        {
            id: 'stinky',
            name: 'Stinky',
            transform: (text) => text.split('').map(char => `${char}̾`).join('')
        },
        {
            id: 'heartsBetween',
            name: 'Hearts Between',
            transform: (text) => text.split('').map(char => `${char}♥`).join('')
        },
        {
            id: 'arrowBelow',
            name: 'Arrow Below',
            transform: (text) => text.split('').map(char => `${char}͎`).join('')
        },
        {
            id: 'crossAboveBelow',
            name: 'Cross Above Below',
            transform: (text) => text.split('').map(char => `${char}͓̽`).join('')
        },
        {
            id: 'wingdings',
            name: 'Wingdings',
            transform: (text) => {
                const wingdingsMap: Record<string, string> = {
                    'a': '♋︎', 'b': '♌︎', 'c': '♍︎', 'd': '♎︎', 'e': '♏︎', 'f': '♐︎', 'g': '♑︎', 'h': '♒︎',
                    'i': '♓︎', 'j': '♔︎', 'k': '♕︎', 'l': '♖︎', 'm': '♗︎', 'n': '♘︎', 'o': '♙︎', 'p': '♚︎',
                    'q': '♛︎', 'r': '♜︎', 's': '♝︎', 't': '♞︎', 'u': '♟︎', 'v': '♠︎', 'w': '♡︎', 'x': '♢︎',
                    'y': '♣︎', 'z': '♤︎'
                };
                return transformText(text.toLowerCase(), wingdingsMap);
            }
        },
        {
            id: 'cute2',
            name: 'Cute Text 2',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `🐠 ⋆ 🐯 🎀 ${script} 🎀 🐯 ⋆ 🐠`;
            }
        },
        {
            id: 'cute3',
            name: 'Cute Text 3',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `🐣 🎀 ${script} 🎀 🐣`;
            }
        },
        {
            id: 'cute4',
            name: 'Cute Text 4',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `🍒 🎀 ${script} 🎀 🍒`;
            }
        },
        {
            id: 'cute5',
            name: 'Cute Text 5',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `¸,ø¤º°\`°º¤ø,¸ 🎀 ${script} 🎀 ¸,ø¤º°\`°º¤ø,¸`;
            }
        },
        {
            id: 'cute6',
            name: 'Cute Text 6',
            transform: (text) => {
                const script = transformText(text, charMaps.scriptify);
                return `🍦 🎀 ${script} 🎀 🍦`;
            }
        },
        {
            id: 'random1',
            name: 'Random 1',
            transform: (text) => {
                const double = transformText(text, charMaps.doubleStruck);
                const bubbles = transformText(text, charMaps.bubbles);
                return `🐲😡 ${safeChar(double, 0)}${safeChar(bubbles, 1)}${safeChar(bubbles, 2)} 👺♥`;
            }
        },
        {
            id: 'random2',
            name: 'Random 2',
            transform: (text) => {
                const cursive = transformText(text, charMaps.cursive);
                const asianMap: Record<string, string> = {
                    'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄',
                    'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': 'ㄥ', 'm': '爪', 'n': '几', 'o': 'ㄖ', 'p': '卩',
                    'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
                    'y': 'ㄚ', 'z': '乙'
                };
                const asian = transformText(text, asianMap);
                const script = transformText(text, charMaps.scriptify);
                return `♠😝 ${safeChar(cursive, 0)}${safeChar(asian, 1)}${safeChar(script, 2)} 💣🐺`;
            }
        },
        {
            id: 'random3',
            name: 'Random 3',
            transform: (text) => {
                const wide = transformText(text, charMaps.wide);
                const bubbles = transformText(text, charMaps.bubbles);
                return `-漫~*'¨¯¨'*·舞~ ${safeChar(wide, 0)}${safeChar(bubbles, 1)}${safeChar(text, 2)} ~舞*'¨¯¨'*·~漫-`;
            }
        },
        {
            id: 'random4',
            name: 'Random 4',
            transform: (text) => {
                const oldEnglish = transformText(text, charMaps.oldEnglish);
                const cursive = transformText(text, charMaps.cursive);
                return `•´¯\`•. ${safeChar(oldEnglish, 0)}${safeChar(cursive, 1)}${safeChar(cursive, 2)} .•´¯\`•`;
            }
        },
        {
            id: 'random5',
            name: 'Random 5',
            transform: (text) => {
                const superscript = transformText(text, charMaps.superscript);
                const neonMap: Record<string, string> = {
                    'a': 'ᗩ', 'b': 'ᗷ', 'c': 'ᑕ', 'd': 'ᗪ', 'e': 'E', 'f': 'ᖴ', 'g': 'G', 'h': 'ᕼ',
                    'i': 'I', 'j': 'ᒍ', 'k': 'K', 'l': 'ᒪ', 'm': 'ᗰ', 'n': 'ᑎ', 'o': 'O', 'p': 'ᑭ',
                    'q': 'ᑫ', 'r': 'ᖇ', 's': 'ᔕ', 't': 'T', 'u': 'ᑌ', 'v': 'ᐯ', 'w': 'ᗯ', 'x': '᙭',
                    'y': 'ᖻ', 'z': 'ᘔ'
                };
                const neon = transformText(text.toUpperCase(), neonMap);
                return `💥♛ ${safeChar(superscript, 0)}${safeChar(neon, 1)}${safeChar(text, 2)} ♤🐠`;
            }
        },
        {
            id: 'random6',
            name: 'Random 6',
            transform: (text) => {
                const asianMap: Record<string, string> = {
                    'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄',
                    'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': 'ㄥ', 'm': '爪', 'n': '几', 'o': 'ㄖ', 'p': '卩',
                    'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
                    'y': 'ㄚ', 'z': '乙'
                };
                const asian = transformText(text.toLowerCase(), asianMap);
                const bubbles = transformText(text, charMaps.bubbles);
                return `💝🐸 ${safeChar(asian, 0)}${safeChar(text, 1)}${safeChar(bubbles, 2)} 🐚♞`;
            }
        },
        {
            id: 'random7',
            name: 'Random 7',
            transform: (text) => {
                const wide = transformText(text, charMaps.wide);
                const oldEnglish = transformText(text, charMaps.oldEnglish);
                const custom = transformText(text, { 'c': '℃' });
                return `🐣♨ ${safeChar(wide, 0)}${safeChar(oldEnglish, 1)}${safeChar(custom, 2)} 🐸🎉`;
            }
        },
        {
            id: 'random8',
            name: 'Random 8',
            transform: (text) => {
                const bubbles = transformText(text, charMaps.bubbles);
                const double = transformText(text, charMaps.doubleStruck);
                return `💣⛵ ${safeChar(bubbles, 0)}${safeChar(bubbles, 1)}${safeChar(double, 2)} 😳🐲`;
            }
        },
        {
            id: 'random9',
            name: 'Random 9',
            transform: (text) => {
                const cursive = transformText(text, charMaps.cursive);
                const bold = transformText(text, charMaps.bold);
                const custom = transformText(text, { 'C': 'ℂ' });
                return `.•°¤*(¯\`★´¯)*¤° ${safeChar(cursive, 0)}${safeChar(bold, 1)}${safeChar(custom, 2)} °¤*(¯´★\`¯)*¤°•.`;
            }
        }
        ];
    }, []);

    const handleCopy = async (styleId: string, transformedText: string) => {
        try {
            await navigator.clipboard.writeText(transformedText);
            setCopiedId(styleId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Textarea */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    Nhập văn bản
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="abc"
                    className="w-full h-32 p-4 border border-[var(--border)] rounded-lg bg-white text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>

            {/* Style List */}
            <div className="space-y-0 border border-[var(--border)] rounded-lg bg-white divide-y divide-[var(--border)]">
                {textStyles.map((style) => {
                    const transformedText = style.transform(inputText);
                    const isCopied = copiedId === style.id;

                    return (
                        <div key={style.id} className="flex items-center justify-between p-4 hover:bg-[var(--muted)] transition-colors">
                            <div className="flex-1 flex items-center gap-4">
                                <span className="text-sm font-medium text-[var(--foreground)] min-w-[140px]">
                                    {style.name}
                                </span>
                                <span className="text-sm text-[var(--foreground)] flex-1" suppressHydrationWarning>
                                    {transformedText}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopy(style.id, transformedText)}
                                className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

